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
from dataclasses import dataclass, field
from typing import Optional
from urllib.parse import urljoin, urlparse, parse_qs

from playwright.async_api import async_playwright, Page, BrowserContext

log = logging.getLogger(__name__)

BASE_URL = "https://www.dedeman.ro"


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
    """Extrage float din string pret (ex: '125,99 Lei' → 125.99)."""
    if not text:
        return None
    cleaned = re.sub(r"[^\d,.]", "", text).replace(",", ".")
    # pastreaza doar ultimul punct daca sunt mai multe
    parts = cleaned.split(".")
    if len(parts) > 2:
        cleaned = "".join(parts[:-1]) + "." + parts[-1]
    try:
        return float(cleaned)
    except ValueError:
        return None


def _extract_sku_from_url(url: str) -> Optional[str]:
    """Extrage SKU din URL: /ro/nume-produs/p/123456 → '123456'."""
    m = re.search(r"/p/(\d+)", url)
    return m.group(1) if m else None


class DedemanScraper:
    """
    Scraper async pentru dedeman.ro cu Playwright.

    Utilizare:
        scraper = DedemanScraper(headless=True)
        await scraper.start()
        products = await scraper.scrape_category(url, max_pages=20)
        await scraper.stop()
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

    def _new_context(self) -> BrowserContext:
        return self._browser.new_context(
            user_agent=(
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/124.0.0.0 Safari/537.36"
            ),
            viewport={"width": 1280, "height": 900},
            locale="ro-RO",
        )

    # ── Scrape category ──────────────────────────────────────────
    async def scrape_category(
        self,
        category_url: str,
        max_pages: int = 20,
        max_products: int = 1000,
        concurrency: int = 2,
    ) -> list[DedemanProduct]:
        """
        Scrapează toate produsele dintr-o categorie Dedeman.
        Returnează lista de DedemanProduct.
        """
        product_urls: list[str] = []
        page_num = 1

        context = await self._new_context()
        page = await context.new_page()
        await page.route("**/*.{png,jpg,jpeg,gif,webp,svg,woff,woff2,ttf}", lambda r: r.abort())

        try:
            while page_num <= max_pages and len(product_urls) < max_products:
                url = self._paginate(category_url, page_num)
                log.info(f"  Pagina {page_num}: {url}")

                try:
                    await page.goto(url, wait_until="domcontentloaded", timeout=30_000)
                    await page.wait_for_timeout(1500)

                    # Accepta cookies daca apare
                    await self._accept_cookies(page)

                    links = await self._extract_product_links(page)
                    if not links:
                        log.info(f"  → Niciun produs pe pagina {page_num}, stop.")
                        break

                    new = [l for l in links if l not in product_urls]
                    product_urls.extend(new)
                    log.info(f"  → {len(new)} produse noi (total: {len(product_urls)})")

                    if len(product_urls) >= max_products:
                        break

                    # Verifica daca exista pagina urmatoare
                    has_next = await page.locator(
                        "a[aria-label='Next page'], "
                        ".pagination__next:not(.disabled), "
                        "a.next-page"
                    ).count()
                    if not has_next:
                        break

                    page_num += 1

                except Exception as e:
                    log.warning(f"  Eroare pagina {page_num}: {e}")
                    break

        finally:
            await page.close()
            await context.close()

        product_urls = product_urls[:max_products]
        log.info(f"Total URL-uri colectate: {len(product_urls)}")

        # Scrapeaza detalii in paralel
        products = await self._scrape_products_parallel(product_urls, concurrency, category_url)
        return products

    def _paginate(self, base_url: str, page: int) -> str:
        """Adauga parametrul de pagina la URL-ul categoriei."""
        if page == 1:
            return base_url
        sep = "&" if "?" in base_url else "?"
        return f"{base_url}{sep}start={(page-1)*36}"

    async def _accept_cookies(self, page: Page):
        try:
            btn = page.locator(
                "button#onetrust-accept-btn-handler, "
                "button.accept-cookies, "
                "[id*='accept'][id*='cookie']"
            )
            if await btn.count() > 0:
                await btn.first.click(timeout=3000)
                await page.wait_for_timeout(500)
        except Exception:
            pass

    async def _extract_product_links(self, page: Page) -> list[str]:
        """Extrage link-urile produselor de pe pagina de categorie."""
        links = set()

        # Selectori comuni dedeman.ro
        selectors = [
            "a.product-item__name",
            "a.product-name",
            ".product-listing a[href*='/p/']",
            "article.product-item a[href*='/p/']",
            ".products-grid a[href*='/p/']",
            "a[href*='/p/'][class*='product']",
        ]

        for sel in selectors:
            elems = await page.locator(sel).all()
            for el in elems:
                href = await el.get_attribute("href")
                if href and "/p/" in href:
                    full = urljoin(BASE_URL, href)
                    links.add(full)
            if links:
                break

        # Fallback: toate link-urile cu /p/
        if not links:
            all_links = await page.eval_on_selector_all(
                "a[href*='/p/']",
                "els => els.map(e => e.href)"
            )
            for href in all_links:
                if href and re.search(r"/p/\d+", href):
                    links.add(href)

        return list(links)

    # ── Scrape products in parallel ──────────────────────────────
    async def _scrape_products_parallel(
        self,
        urls: list[str],
        concurrency: int,
        category_url: str,
    ) -> list[DedemanProduct]:
        sem = asyncio.Semaphore(concurrency)
        results = []

        async def worker(url: str):
            async with sem:
                try:
                    p = await self._scrape_product(url, category_url)
                    if p:
                        results.append(p)
                except Exception as e:
                    log.warning(f"Skip {url}: {e}")

        await asyncio.gather(*[worker(u) for u in urls])
        return results

    # ── Scrape single product ────────────────────────────────────
    async def _scrape_product(self, url: str, category_url: str) -> Optional[DedemanProduct]:
        context = await self._new_context()
        page = await context.new_page()
        await page.route("**/*.{png,jpg,jpeg,gif,webp,svg,woff,woff2,ttf}", lambda r: r.abort())

        try:
            await page.goto(url, wait_until="domcontentloaded", timeout=30_000)
            await page.wait_for_timeout(800)

            # 1. Incearca JSON-LD (cel mai fiabil)
            product = await self._extract_from_jsonld(page, url, category_url)
            if product:
                return product

            # 2. Fallback: extragere din DOM
            return await self._extract_from_dom(page, url, category_url)

        except Exception as e:
            log.warning(f"Eroare produs {url}: {e}")
            return None
        finally:
            await page.close()
            await context.close()

    async def _extract_from_jsonld(
        self, page: Page, url: str, category_url: str
    ) -> Optional[DedemanProduct]:
        """Extrage date din JSON-LD schema.org/Product."""
        try:
            scripts = await page.eval_on_selector_all(
                'script[type="application/ld+json"]',
                "els => els.map(e => e.textContent)"
            )
            for raw in scripts:
                try:
                    data = json.loads(raw)
                    # Poate fi lista sau obiect
                    items = data if isinstance(data, list) else [data]
                    for item in items:
                        if item.get("@type") in ("Product", "product"):
                            return self._jsonld_to_product(item, url, category_url)
                except json.JSONDecodeError:
                    continue
        except Exception:
            pass
        return None

    def _jsonld_to_product(self, data: dict, url: str, category_url: str) -> DedemanProduct:
        sku = data.get("sku") or _extract_sku_from_url(url) or url.split("/")[-1]

        offers = data.get("offers", {})
        if isinstance(offers, list):
            offers = offers[0] if offers else {}

        pret = _parse_price(str(offers.get("price", "")))
        disponibilitate = None
        avail = offers.get("availability", "")
        if "InStock" in avail:
            disponibilitate = "In stoc"
        elif "OutOfStock" in avail:
            disponibilitate = "Stoc epuizat"

        # Imagini
        imagini = []
        img = data.get("image", [])
        if isinstance(img, str):
            imagini = [img]
        elif isinstance(img, list):
            imagini = img[:5]

        # Rating
        rating = None
        nr_review = 0
        agg = data.get("aggregateRating", {})
        if agg:
            rating = float(agg.get("ratingValue", 0) or 0) or None
            nr_review = int(agg.get("reviewCount", 0) or 0)

        # Categorie din URL
        categorie = self._category_from_url(category_url)

        return DedemanProduct(
            cod_produs=str(sku),
            ean=data.get("gtin13") or data.get("gtin") or data.get("gtin8"),
            nume=data.get("name", ""),
            brand=data.get("brand", {}).get("name") if isinstance(data.get("brand"), dict) else data.get("brand"),
            categorie=categorie,
            pret=pret,
            moneda=offers.get("priceCurrency", "RON"),
            disponibilitate=disponibilitate,
            descriere_scurta=data.get("description", "")[:500] if data.get("description") else None,
            imagini=imagini,
            rating=rating,
            nr_review=nr_review,
            url=url,
            specificatii={},
        )

    async def _extract_from_dom(
        self, page: Page, url: str, category_url: str
    ) -> Optional[DedemanProduct]:
        """Fallback: extrage date direct din DOM."""
        try:
            # Nume produs
            nume = await self._text(page, [
                "h1.product-name", "h1.product-title",
                "h1[itemprop='name']", ".pdp-title h1", "h1"
            ])
            if not nume:
                return None

            # SKU
            sku = _extract_sku_from_url(url)
            if not sku:
                sku = await self._text(page, [
                    "[itemprop='sku']", ".product-sku", ".sku-value",
                    "[data-product-id]"
                ])
                if not sku:
                    sku = url.split("/p/")[-1].split("?")[0]

            # Pret curent
            pret_text = await self._text(page, [
                ".price-box .price", ".product-price .price",
                "[itemprop='price']", ".current-price", ".sales-price",
                ".price--selling", ".pdp-price"
            ])
            pret = _parse_price(pret_text)

            # Pret vechi
            pret_vechi_text = await self._text(page, [
                ".price-box .old-price", ".original-price",
                ".price--strikethrough", ".was-price"
            ])
            pret_vechi = _parse_price(pret_vechi_text)

            # Discount
            discount_procent = None
            if pret and pret_vechi and pret_vechi > pret:
                discount_procent = round((pret_vechi - pret) / pret_vechi * 100, 1)

            # Brand
            brand = await self._text(page, [
                "[itemprop='brand']", ".product-brand", ".brand-name"
            ])

            # Disponibilitate
            disponibilitate = await self._text(page, [
                ".availability", ".stock-status", "[itemprop='availability']",
                ".product-availability", ".delivery-info"
            ])

            # UM
            unitate_masura = await self._text(page, [
                ".price-unit", ".unit-of-measure", ".um"
            ])

            # Imagini (extrage src fara a le descarca)
            imagini = await page.eval_on_selector_all(
                ".product-gallery img, .pdp-gallery img, "
                ".product-image img, [class*='product'][class*='image'] img",
                "els => els.map(e => e.src || e.dataset.src).filter(Boolean)"
            )
            imagini = list(dict.fromkeys(imagini))[:5]  # deduplica

            # Rating
            rating_text = await self._text(page, [
                "[itemprop='ratingValue']", ".rating-value",
                ".product-rating .value"
            ])
            rating = float(rating_text) if rating_text else None

            nr_review_text = await self._text(page, [
                "[itemprop='reviewCount']", ".review-count",
                ".ratings-count"
            ])
            nr_review = int(re.sub(r"\D", "", nr_review_text)) if nr_review_text else 0

            # Specificatii din tabel
            specificatii = {}
            try:
                rows = await page.locator(
                    ".product-attributes tr, .specifications tr, "
                    "table.product-specs tr"
                ).all()
                for row in rows[:30]:
                    cells = await row.locator("td, th").all_text_contents()
                    if len(cells) >= 2:
                        specificatii[cells[0].strip()] = cells[1].strip()
            except Exception:
                pass

            return DedemanProduct(
                cod_produs=str(sku),
                nume=nume.strip(),
                url=url,
                brand=brand,
                categorie=self._category_from_url(category_url),
                pret=pret,
                pret_vechi=pret_vechi,
                discount_procent=discount_procent,
                disponibilitate=disponibilitate,
                unitate_masura=unitate_masura,
                imagini=imagini,
                rating=rating,
                nr_review=nr_review,
                specificatii=specificatii,
            )

        except Exception as e:
            log.warning(f"DOM extract error {url}: {e}")
            return None

    async def _text(self, page: Page, selectors: list[str]) -> Optional[str]:
        """Incearca selectori pe rand, returneaza primul text gasit."""
        for sel in selectors:
            try:
                loc = page.locator(sel).first
                if await loc.count() > 0:
                    t = (await loc.text_content(timeout=2000) or "").strip()
                    if t:
                        return t
            except Exception:
                continue
        return None

    def _category_from_url(self, url: str) -> str:
        """Extrage numele categoriei din URL-ul de categorie."""
        # ex: https://www.dedeman.ro/ro/materiale-de-constructii/c/241
        # → 'Materiale de constructii'
        m = re.search(r"/ro/([^/]+)/c/\d+", url)
        if m:
            return m.group(1).replace("-", " ").title()
        return "General"
