"""
sync_dedeman_supabase.py
========================
Ruleaza scraper-ul Dedeman si face upsert PROGRESIV in Supabase.
Produsele sunt inserate imediat dupa fiecare pagina de listare —
nu la finalul categoriei. Daca scriptul pica la jumatate,
ce s-a scraped deja e salvat.

Setup (pe server):
    pip install supabase playwright httpx tqdm python-dotenv
    playwright install chromium

.env necesar:
    SUPABASE_URL=https://vwcwsxvmkxmcwjtlikcq.supabase.co
    SUPABASE_SERVICE_KEY=eyJ...   # service_role key din Supabase → Settings → API

Utilizare:
    # Verifica rapid (1 pagina, 5 produse, fara scriere in DB):
    python sync_dedeman_supabase.py --test

    # Verifica o categorie (scriere in DB):
    python sync_dedeman_supabase.py --category "https://www.dedeman.ro/ro/adezivi-si-chituri/c/245" --pages 2

    # Sync complet (toate categoriile, cron job):
    python sync_dedeman_supabase.py

Crontab (3AM zilnic):
    0 3 * * * cd /path/to/app && python scripts/sync_dedeman_supabase.py >> logs/sync.log 2>&1
"""

import asyncio
import json
import logging
import os
import sys
from datetime import datetime
from pathlib import Path

from dotenv import load_dotenv
from supabase import create_client, Client

sys.path.insert(0, str(Path(__file__).parent))
from dedeman_scraper import DedemanScraper, DedemanProduct

load_dotenv()

# ── Configurare ───────────────────────────────────────────────
SUPABASE_URL  = os.environ["SUPABASE_URL"]
SUPABASE_KEY  = os.environ["SUPABASE_SERVICE_KEY"]
BATCH_SIZE    = 25    # upsert per batch (mai mic = inserare mai frecventa)
MAX_PAGES     = 20    # pagini per categorie (sync complet)
MAX_PRODUCTS  = 1000  # produse per categorie

DEFAULT_CATEGORIES = [
    "https://www.dedeman.ro/ro/materiale-de-constructii/c/241",
    "https://www.dedeman.ro/ro/izolatie/c/242",
    "https://www.dedeman.ro/ro/tencuieli-si-gleturi/c/244",
    "https://www.dedeman.ro/ro/adezivi-si-chituri/c/245",
    "https://www.dedeman.ro/ro/pardoseli/c/321",
    "https://www.dedeman.ro/ro/gresie-si-faianta/c/322",
    "https://www.dedeman.ro/ro/instalatii-sanitare/c/401",
    "https://www.dedeman.ro/ro/vopsele-si-lacuri/c/351",
    "https://www.dedeman.ro/ro/instalatii-electrice/c/501",
    "https://www.dedeman.ro/ro/usi-si-ferestre/c/361",
]

Path("logs").mkdir(exist_ok=True)
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[
        logging.FileHandler(f"logs/sync_{datetime.now():%Y%m%d}.log"),
        logging.StreamHandler(),
    ],
)
log = logging.getLogger(__name__)


# ── Supabase ─────────────────────────────────────────────────
def get_supabase() -> Client:
    return create_client(SUPABASE_URL, SUPABASE_KEY)


def to_row(p: DedemanProduct) -> dict:
    return {
        "cod_produs":       p.cod_produs,
        "ean":              p.ean or None,
        "nume":             p.nume,
        "brand":            p.brand or None,
        "categorie":        p.categorie or None,
        "subcategorie":     p.subcategorie or None,
        "pret":             float(p.pret) if p.pret else None,
        "pret_vechi":       float(p.pret_vechi) if p.pret_vechi else None,
        "discount_procent": float(p.discount_procent) if p.discount_procent else None,
        "moneda":           p.moneda or "RON",
        "disponibilitate":  p.disponibilitate or None,
        "unitate_masura":   p.unitate_masura or None,
        "descriere_scurta": p.descriere_scurta or None,
        "specificatii":     p.specificatii or {},
        "imagini":          p.imagini or [],
        "rating":           float(p.rating) if p.rating else None,
        "nr_review":        p.nr_review or 0,
        "url":              p.url or None,
        "sync_at":          datetime.utcnow().isoformat(),
        "activ":            True,
    }


def upsert(sb: Client, products: list[DedemanProduct]) -> tuple[int, int]:
    """Upsert in batches de BATCH_SIZE. Returneaza (ok, erori)."""
    valid = [to_row(p) for p in products if p.cod_produs and p.nume]
    if not valid:
        return 0, 0

    ok = err = 0
    for i in range(0, len(valid), BATCH_SIZE):
        batch = valid[i:i + BATCH_SIZE]
        try:
            sb.table("dedeman_catalog").upsert(batch, on_conflict="cod_produs").execute()
            ok += len(batch)
            log.info(f"    ✓ Upsert {len(batch)} produse (total ok: {ok})")
        except Exception as e:
            log.error(f"    ✗ Batch error: {e}")
            # retry produs cu produs
            for row in batch:
                try:
                    sb.table("dedeman_catalog").upsert(row, on_conflict="cod_produs").execute()
                    ok += 1
                except Exception as e2:
                    log.warning(f"    Skip {row.get('cod_produs')}: {e2}")
                    err += 1
    return ok, err


def mark_inactive(sb: Client, hours: int = 48):
    from datetime import timedelta
    cutoff = (datetime.utcnow() - timedelta(hours=hours)).isoformat()
    try:
        r = sb.table("dedeman_catalog").update({"activ": False}).lt("sync_at", cutoff).execute()
        log.info(f"Marcate inactive (>{hours}h): {len(r.data or [])}")
    except Exception as e:
        log.warning(f"Nu am putut marca inactive: {e}")


# ── Stats ────────────────────────────────────────────────────
class Stats:
    def __init__(self):
        self.scraped = self.upserted = self.errors = self.cats = 0
        self.t0 = datetime.now()

    def log_final(self):
        elapsed = int((datetime.now() - self.t0).total_seconds())
        log.info(f"""
╔══════════════════════════════════════════╗
║        SYNC DEDEMAN → SUPABASE           ║
╠══════════════════════════════════════════╣
║ Categorii   : {self.cats:<26} ║
║ Scraped     : {self.scraped:<26} ║
║ Upserted    : {self.upserted:<26} ║
║ Erori       : {self.errors:<26} ║
║ Durata      : {elapsed:<22}s    ║
╚══════════════════════════════════════════╝""")

    def save_report(self, path: str):
        with open(path, "w") as f:
            json.dump({
                "timestamp": datetime.now().isoformat(),
                "categories": self.cats,
                "scraped": self.scraped,
                "upserted": self.upserted,
                "errors": self.errors,
            }, f, indent=2)


# ── Core ─────────────────────────────────────────────────────
async def sync_category(
    scraper: DedemanScraper,
    sb: Client,
    cat_url: str,
    max_pages: int,
    max_products: int,
    dry_run: bool,
    stats: Stats,
):
    """Scrapeaza o categorie si insereaza progresiv in Supabase."""
    log.info(f"\n→ Categorie: {cat_url}")

    async for batch in scraper.scrape_category_streaming(
        cat_url,
        max_pages=max_pages,
        max_products=max_products,
        concurrency=2,
    ):
        stats.scraped += len(batch)
        log.info(f"  Pagina terminata: {len(batch)} produse noi (total: {stats.scraped})")

        if dry_run:
            # Afiseaza primele 3 produse ca preview
            for p in batch[:3]:
                log.info(
                    f"  [DRY] {p.cod_produs} | {p.nume[:50]} | "
                    f"{p.pret} RON | {p.disponibilitate} | {p.url}"
                )
        else:
            ok, err = upsert(sb, batch)
            stats.upserted += ok
            stats.errors += err

    stats.cats += 1


async def run(
    categories: list[str],
    dry_run: bool,
    max_pages: int,
    max_products: int,
):
    sb = get_supabase()
    stats = Stats()

    scraper = DedemanScraper(headless=True)
    await scraper.start()

    try:
        for cat_url in categories:
            try:
                await sync_category(scraper, sb, cat_url, max_pages, max_products, dry_run, stats)
            except Exception as e:
                log.error(f"Eroare la {cat_url}: {e}")
                continue

        if not dry_run and stats.upserted > 0:
            mark_inactive(sb, hours=48)

    finally:
        await scraper.stop()
        stats.log_final()
        report = f"logs/sync_report_{datetime.now():%Y%m%d_%H%M}.json"
        stats.save_report(report)
        log.info(f"Raport: {report}")


# ── CLI ──────────────────────────────────────────────────────
if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description="Sync catalog Dedeman → Supabase")
    parser.add_argument(
        "--test",
        action="store_true",
        help="Mod test: 1 pagina, 5 produse, DRY RUN. Verifica ca scraper-ul merge.",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Scrapeaza fara a scrie in DB.",
    )
    parser.add_argument(
        "--category",
        help="Sync o singura categorie (URL complet).",
    )
    parser.add_argument(
        "--pages",
        type=int,
        default=MAX_PAGES,
        help=f"Pagini per categorie (default: {MAX_PAGES}).",
    )
    parser.add_argument(
        "--max-products",
        type=int,
        default=MAX_PRODUCTS,
        help=f"Produse max per categorie (default: {MAX_PRODUCTS}).",
    )
    args = parser.parse_args()

    if args.test:
        # Mod test: o singura categorie mica, 1 pagina, 5 produse, dry-run
        log.info("=== MOD TEST: 1 pagina, max 5 produse, fara scriere in DB ===")
        cats = ["https://www.dedeman.ro/ro/adezivi-si-chituri/c/245"]
        asyncio.run(run(cats, dry_run=True, max_pages=1, max_products=5))
    else:
        if args.category:
            cats = [args.category]
        else:
            env_cats = [c.strip() for c in os.environ.get("DEDEMAN_CATEGORIES", "").split(",") if c.strip()]
            cats = env_cats or DEFAULT_CATEGORIES

        asyncio.run(run(
            categories=cats,
            dry_run=args.dry_run,
            max_pages=args.pages,
            max_products=args.max_products,
        ))
