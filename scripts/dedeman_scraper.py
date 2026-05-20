"""
dedeman_scraper.py
==================
Scraper Playwright pentru dedeman.ro.
Importat de sync_dedeman_supabase.py.

Instalare:
    pip install playwright httpx tqdm python-dotenv
    playwright install chromium
"""

import asyncio
import json
import logging
import re
from collections.abc import AsyncGenerator
from dataclasses import dataclass, field
from typing import Callable, Optional
from urllib.parse import urljoin

from playwright.async_api import async_playwright, Page, BrowserContext

log = logging.getLogger(__name__)

BASE_URL = "https://www.dedeman.ro"

# Pauza intre pagini (secunde) — evita rate limiting
PAGE_DELAY = 2.0
# Pauza intre produse (secunde)
PRODUCT_DELAY = 0.3


@dataclass
class DedemanProduct:
    cod_produs: str
    nume: str
    url: str
    ean: Optional[str] = None
    brand: Optional[str] = None
    categorie: Optional[str] = None
    subcategorie: Optional[str] = None
    pret: Optional[float] = None
    pret_vechi: Optional[float] = None
    discount_procent: Optional[float] = None
    moneda: str = "RON"
    disponibilitate: Optional[str] = None
    unitate_masura: Optional[str] = None
    descriere_scurta: Optional[str] = None
    specificatii: dict = field(default_factory=dict)
    imagini: list = field(default_factory=list)
    rating: Optional[float] = None
    nr_review: int = 0


def _parse_price(text: str) -> Optional[float]:
    if not text:
        return None
    cleaned = re.sub(r"[^\d,.]", "", text).replace(",", ".")
    parts = cleaned.split(".")
    if len(parts) > 2:
        cleaned = "".join(parts[:-1]) + "." + parts[-1]
    try:
        v = float(cleaned)
        return v if v > 0 else None
    except ValueError:
        return None


def _extract_sku_from_url(url: str) -> Optional[str]:
    m = re.search(r"/p/(\d+)", url)
    return m.group(1) if m else None


class DedemanScraper:
    """
    Scraper async pentru dedeman.ro cu Playwright.

    Mod normal (colecteaza tot):
        products = await scraper.scrape_category(url)

    Mod streaming (yield batch per pagina de listare):
        async for batch in scraper.scrape_category_streaming(url):
            save(batch)
    """

    def __init__(self, headless: bool = True):
        self.headless = headless
        self._playwright = None
        self._browser = None

    async def start(self):
        self._playwright = await async_playwright().start()
        self._browser = await self._playwright.chromium.launch(
            headless=self.headless,
            args=[
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-dev-shm-usage",
                "--disable-gpu",
            ],
        )
        log.info("Browser pornit.")

    async def stop(self):
        if self._browser:
            await self._browser.close()
        if self._playwright:
            await self._playwright.stop()
        log.info("Browser oprit.")

    def _new_context_kwargs(self) -> dict:
        return dict(
            user_agent=(
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/124.0.0.0 Safari/537.36"
            ),
            viewport={"width": 1280, "height": 900},
            locale="ro-RO",
        )

    # ── Public: streaming (recomandat) ──────────────────────────
    async def scrape_category_streaming(
        self,
        category_url: str,
        max_pages: int = 20,
        max_products: int = 1000,
        concurrency: int = 2,
        on_page_done: Optional[Callable[[int, int], None]] = None,
    ) -> AsyncGenerator[list[DedemanProduct], None]:
        """
        Yield cate un batch de produse per pagina de listare.
        Inserarea in Supabase se face imediat dupa fiecare batch.
        """
        total_scraped = 0
        seen_urls: set[str] = set()

        context = await self._browser.new_context(**self._new_context_kwargs())
        nav_page = await context.new_page()
        self._block_media(nav_page)

        try:
            for page_num in range(1, max_pages + 1):
                if total_scraped >= max_products:
                    break

                url = self._paginate(category_url, page_num)
                log.info(f"  Pagina {page_num}: {url}")

                try:
                    await nav_page.goto(url, wait_until="domcontentloaded", timeout=30_000)
                    await asyncio.sleep(PAGE_DELAY)
                    await self._accept_cookies(nav_page)

                    page_urls = await self._extract_product_links(nav_page)
                    new_urls = [u for u in page_urls if u not in seen_urls]

                    if not new_urls:
                        log.info(f"  → Nicio URL nouă pe pagina {page_num}, stop.")
                        break

                    seen_urls.update(new_urls)
                    remaining = max_products - total_scraped
                    batch_urls = new_urls[:remaining]

                    log.info(f"  → {len(batch_urls)} produse de scraped pe pagina {page_num}")

                    # Scrapeaza batch-ul curent
                    batch = await self._scrape_urls_parallel(batch_urls, concurrency, category_url)
                    total_scraped += len(batch)

                    if on_page_done:
                        on_page_done(page_num, len(batch))

                    yield batch

                    # Verifica daca mai exista pagina urmatoare
                    has_next = await nav_page.locator(
                        "a[aria-label='Next page'], "
                        ".pagination__next:not(.disabled), "
                        "a.next-page, [class*='pagination'] a[rel='next']"
                    ).count()
                    if not has_next:
                        log.info(f"  → Ultima pagina ({page_num}), stop.")
                        break

                    await asyncio.sleep(PAGE_DELAY)

                except Exception as e:
                    log.warning(f"  Eroare pagina {page_num}: {e}")
                    break
        finally:
            await nav_page.close()
            await context.close()

    # ── Public: colecteaza tot (compatibil cu API-ul vechi) ─────
    async def scrape_category(
        self,
        category_url: str,
        max_pages: int = 20,
        max_products: int = 1000,
        concurrency: int = 2,
    ) -> list[DedemanProduct]:
        all_products: list[DedemanProduct] = []
        async for batch in self.scrape_category_streaming(
            category_url, max_pages, max_products, concurrency
        ):
            all_products.extend(batch)
        return all_products

    # ── Helpers ──────────────────────────────────────────────────
    def _block_media(self, page: Page):
        async def handler(route):
            await route.abort()
        page.route("**/*.{png,jpg,jpeg,gif,webp,svg,woff,woff2,ttf}", handler)

    def _paginate(self, base_url: str, page: int) -> str:
        if page == 1:
            return base_url
        # Dedeman foloseste ?start=N unde N = (page-1) * produse_per_pagina
        sep = "&" if "?" in base_url else "?"
        return f"{base_url}{sep}start={(page - 1) * 36}"

    async def _accept_cookies(self, page: Page):
        try:
            btn = page.locator(
                "button#onetrust-accept-btn-handler, "
                "button.accept-cookies, "
                "[id*='accept'][id*='cookie']"
            ).first
            if await btn.count() > 0:
                await btn.click(timeout=3_000)
                await asyncio.sleep(0.5)
        except Exception:
            pass

    async def _extract_product_links(self, page: Page) -> list[str]:
        links: set[str] = set()

        selectors = [
            "a.product-item__name",
            "a.product-name",
            ".product-listing a[href*='/p/']",
            "article.product-item a[href*='/p/']",
            ".products-grid a[href*='/p/']",
        ]
        for sel in selectors:
            elems = await page.locator(sel).all()
            for el in elems:
                href = await el.get_attribute("href")
                if href and "/p/" in href:
                    links.add(urljoin(BASE_URL, href))
            if links:
                break

        # Fallback: orice <a> cu /p/\d+
        if not links:
            hrefs = await page.eval_on_selector_all(
                "a[href*='/p/']",
                "els => els.map(e => e.href)"
            )
            for href in hrefs:
                if href and re.search(r"/p/\d+", href):
                    links.add(href)

        return list(links)

    async def _scrape_urls_parallel(
        self,
        urls: list[str],
        concurrency: int,
        category_url: str,
    ) -> list[DedemanProduct]:
        sem = asyncio.Semaphore(concurrency)
        results: list[DedemanProduct] = []

        async def worker(url: str):
            async with sem:
                await asyncio.sleep(PRODUCT_DELAY)
                try:
                    p = await self._scrape_one(url, category_url)
                    if p:
                        results.append(p)
                except Exception as e:
                    log.warning(f"  Skip {url}: {e}")

        await asyncio.gather(*[worker(u) for u in urls])
        return results

    async def _scrape_one(self, url: str, category_url: str) -> Optional[DedemanProduct]:
        context = await self._browser.new_context(**self._new_context_kwargs())
        page = await context.new_page()
        self._block_media(page)
        try:
            await page.goto(url, wait_until="domcontentloaded", timeout=30_000)
            await asyncio.sleep(0.5)

            product = await self._from_jsonld(page, url, category_url)
            if not product:
                product = await self._from_dom(page, url, category_url)

            if product:
                log.debug(f"  OK: {product.cod_produs} — {product.nume[:50]}")
            return product
        finally:
            await page.close()
            await context.close()

    # ── Extragere JSON-LD ────────────────────────────────────────
    async def _from_jsonld(self, page: Page, url: str, cat_url: str) -> Optional[DedemanProduct]:
        try:
            scripts = await page.eval_on_selector_all(
                'script[type="application/ld+json"]',
                "els => els.map(e => e.textContent)"
            )
            for raw in scripts:
                try:
                    data = json.loads(raw)
                    items = data if isinstance(data, list) else [data]
                    for item in items:
                        if item.get("@type") in ("Product", "product"):
                            return self._jsonld_to_product(item, url, cat_url)
                except (json.JSONDecodeError, AttributeError):
                    continue
        except Exception:
            pass
        return None

    def _jsonld_to_product(self, data: dict, url: str, cat_url: str) -> DedemanProduct:
        sku = data.get("sku") or _extract_sku_from_url(url) or url.split("/")[-1]

        offers = data.get("offers", {})
        if isinstance(offers, list):
            offers = offers[0] if offers else {}

        pret = _parse_price(str(offers.get("price", "")))
        pret_vechi = None
        discount_procent = None

        avail = offers.get("availability", "")
        disponibilitate = (
            "In stoc" if "InStock" in avail
            else "Stoc epuizat" if "OutOfStock" in avail
            else None
        )

        img = data.get("image", [])
        imagini = [img] if isinstance(img, str) else (img[:5] if isinstance(img, list) else [])

        agg = data.get("aggregateRating", {}) or {}
        rating = float(agg.get("ratingValue") or 0) or None
        nr_review = int(agg.get("reviewCount") or 0)

        brand = data.get("brand")
        if isinstance(brand, dict):
            brand = brand.get("name")

        return DedemanProduct(
            cod_produs=str(sku),
            ean=data.get("gtin13") or data.get("gtin") or data.get("gtin8"),
            nume=data.get("name", "").strip(),
            brand=brand,
            categorie=self._cat_name(cat_url),
            pret=pret,
            pret_vechi=pret_vechi,
            discount_procent=discount_procent,
            moneda=offers.get("priceCurrency", "RON"),
            disponibilitate=disponibilitate,
            descriere_scurta=(data.get("description") or "")[:500] or None,
            imagini=imagini,
            rating=rating,
            nr_review=nr_review,
            url=url,
            specificatii={},
        )

    # ── Extragere DOM ────────────────────────────────────────────
    async def _from_dom(self, page: Page, url: str, cat_url: str) -> Optional[DedemanProduct]:
        try:
            nume = await self._text(page, [
                "h1.product-name", "h1.product-title",
                "h1[itemprop='name']", ".pdp-title h1", "h1"
            ])
            if not nume:
                return None

            sku = _extract_sku_from_url(url) or url.split("/p/")[-1].split("?")[0]

            pret_text = await self._text(page, [
                ".price-box .price", ".product-price .price",
                "[itemprop='price']", ".current-price", ".sales-price",
                ".price--selling", ".pdp-price", ".product__price"
            ])
            pret = _parse_price(pret_text)

            pret_vechi_text = await self._text(page, [
                ".price-box .old-price", ".original-price",
                ".price--strikethrough", ".was-price", ".crossed-price"
            ])
            pret_vechi = _parse_price(pret_vechi_text)

            discount_procent = None
            if pret and pret_vechi and pret_vechi > pret:
                discount_procent = round((pret_vechi - pret) / pret_vechi * 100, 1)

            brand = await self._text(page, [
                "[itemprop='brand']", ".product-brand", ".brand-name"
            ])
            disponibilitate = await self._text(page, [
                ".availability", ".stock-status", "[itemprop='availability']",
                ".product-availability", ".delivery-info"
            ])
            unitate_masura = await self._text(page, [
                ".price-unit", ".unit-of-measure", ".um", ".price-per-unit"
            ])
            descriere = await self._text(page, [
                ".product-description", "[itemprop='description']",
                ".pdp-description p", ".product-short-description"
            ])

            imagini = await page.eval_on_selector_all(
                ".product-gallery img, .pdp-gallery img, "
                ".product-image img, [class*='gallery'] img",
                "els => [...new Set(els.map(e => e.src || e.dataset.src).filter(Boolean))]"
            )
            imagini = [i for i in imagini if i and not i.startswith("data:")][:5]

            rating_text = await self._text(page, [
                "[itemprop='ratingValue']", ".rating-value", ".product-rating .value"
            ])
            rating = float(rating_text) if rating_text else None

            nr_text = await self._text(page, [
                "[itemprop='reviewCount']", ".review-count", ".ratings-count"
            ])
            nr_review = int(re.sub(r"\D", "", nr_text)) if nr_text else 0

            specificatii: dict = {}
            try:
                rows = await page.locator(
                    ".product-attributes tr, .specifications tr, table.product-specs tr"
                ).all()
                for row in rows[:30]:
                    cells = await row.locator("td, th").all_text_contents()
                    if len(cells) >= 2 and cells[0].strip() and cells[1].strip():
                        specificatii[cells[0].strip()] = cells[1].strip()
            except Exception:
                pass

            return DedemanProduct(
                cod_produs=str(sku),
                nume=nume.strip(),
                url=url,
                brand=brand,
                categorie=self._cat_name(cat_url),
                pret=pret,
                pret_vechi=pret_vechi,
                discount_procent=discount_procent,
                disponibilitate=disponibilitate,
                unitate_masura=unitate_masura,
                descriere_scurta=(descriere or "")[:500] or None,
                imagini=imagini,
                rating=rating,
                nr_review=nr_review,
                specificatii=specificatii,
            )
        except Exception as e:
            log.warning(f"DOM error {url}: {e}")
            return None

    async def _text(self, page: Page, selectors: list[str]) -> Optional[str]:
        for sel in selectors:
            try:
                loc = page.locator(sel).first
                if await loc.count() > 0:
                    t = (await loc.text_content(timeout=2_000) or "").strip()
                    if t:
                        return t
            except Exception:
                continue
        return None

    def _cat_name(self, url: str) -> str:
        m = re.search(r"/ro/([^/]+)/c/\d+", url)
        if m:
            return m.group(1).replace("-", " ").title()
        return "General"
