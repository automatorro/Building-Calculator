"""
sync_dedeman_supabase.py
========================
Ruleaza scraper-ul Dedeman si face upsert in Supabase.
Proiectat sa fie rulat ca cron job (zilnic / saptamanal).

Setup:
    pip install supabase httpx tqdm
    playwright install chromium

Cron (exemplu crontab - la 3:00 AM in fiecare zi):
    0 3 * * * cd /home/ubuntu/santier && python sync_dedeman_supabase.py >> logs/sync.log 2>&1

Variabile de mediu necesare (.env):
    SUPABASE_URL=https://xxxx.supabase.co
    SUPABASE_SERVICE_KEY=eyJ...   # service_role key (nu anon!)
    DEDEMAN_CATEGORIES=url1,url2,url3   # optional, override default
"""

import asyncio
import json
import os
import sys
import logging
from datetime import datetime
from pathlib import Path
from dotenv import load_dotenv
from supabase import create_client, Client

# Import scraper-ul existent
sys.path.insert(0, str(Path(__file__).parent))
from dedeman_scraper import DedemanScraper, DedemanProduct

load_dotenv()

# ── Configurare ───────────────────────────────────────────────
SUPABASE_URL      = os.environ["SUPABASE_URL"]
SUPABASE_KEY      = os.environ["SUPABASE_SERVICE_KEY"]
BATCH_SIZE        = 50   # upsert-uri per batch (evita timeout)
MAX_PAGES_CAT     = 20   # pagini per categorie
MAX_PRODUCTS_CAT  = 1000 # produse per categorie

# Categorii implicite (pot fi override din env)
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

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[
        logging.FileHandler(f"logs/sync_{datetime.now():%Y%m%d}.log"),
        logging.StreamHandler()
    ]
)
log = logging.getLogger(__name__)


# ── Supabase helpers ──────────────────────────────────────────
def get_supabase() -> Client:
    return create_client(SUPABASE_URL, SUPABASE_KEY)


def product_to_supabase_row(p: DedemanProduct) -> dict:
    """Converteste DedemanProduct in dict compatibil cu schema Supabase."""
    return {
        "cod_produs":       p.cod_produs or None,
        "ean":              p.ean or None,
        "nume":             p.nume,
        "brand":            p.brand or None,
        "categorie":        p.categorie or None,
        "subcategorie":     p.subcategorie or None,
        "pret":             float(p.pret) if p.pret else None,
        "pret_vechi":       float(p.pret_vechi) if p.pret_vechi else None,
        "discount_procent": float(p.discount_procent) if p.discount_procent else None,
        "moneda":           p.moneda,
        "disponibilitate":  p.disponibilitate or None,
        "unitate_masura":   p.unitate_masura or None,
        "descriere_scurta": p.descriere_scurta or None,
        "specificatii":     p.specificatii if p.specificatii else {},
        "imagini":          p.imagini if p.imagini else [],
        "rating":           float(p.rating) if p.rating else None,
        "nr_review":        p.nr_review or 0,
        "url":              p.url or None,
        "sync_at":          datetime.utcnow().isoformat(),
        "activ":            True,
    }


def upsert_batch(supabase: Client, rows: list[dict]) -> tuple[int, int]:
    """Face upsert pe un batch de produse. Returneaza (succes, erori)."""
    # Filtreaza randurile fara cod_produs valid
    valid = [r for r in rows if r.get("cod_produs") and r.get("nume")]
    if not valid:
        return 0, len(rows)

    try:
        result = (
            supabase.table("dedeman_catalog")
            .upsert(valid, on_conflict="cod_produs")
            .execute()
        )
        return len(valid), 0
    except Exception as e:
        log.error(f"Eroare upsert batch: {e}")
        # Retry produs cu produs
        ok = 0
        err = 0
        for row in valid:
            try:
                supabase.table("dedeman_catalog").upsert(row, on_conflict="cod_produs").execute()
                ok += 1
            except Exception as e2:
                log.warning(f"Skip {row.get('cod_produs')}: {e2}")
                err += 1
        return ok, err


def mark_inactive_old_products(supabase: Client, cutoff_hours: int = 72):
    """Marcheaza ca inactive produsele care nu au fost sincronizate recent."""
    try:
        from datetime import timedelta
        cutoff = (datetime.utcnow() - timedelta(hours=cutoff_hours)).isoformat()
        result = (
            supabase.table("dedeman_catalog")
            .update({"activ": False})
            .lt("sync_at", cutoff)
            .execute()
        )
        log.info(f"Produse marcate inactive (> {cutoff_hours}h): {len(result.data or [])}")
    except Exception as e:
        log.warning(f"Nu am putut marca inactive: {e}")


# ── Sync stats ────────────────────────────────────────────────
class SyncStats:
    def __init__(self):
        self.total_scraped = 0
        self.total_upserted = 0
        self.total_errors = 0
        self.categories_done = 0
        self.start_time = datetime.now()

    def report(self):
        elapsed = (datetime.now() - self.start_time).seconds
        log.info(f"""
╔══════════════════════════════════════════╗
║           SYNC DEDEMAN → SUPABASE        ║
╠══════════════════════════════════════════╣
║ Categorii procesate : {self.categories_done:<18} ║
║ Produse scraped     : {self.total_scraped:<18} ║
║ Produse upserted    : {self.total_upserted:<18} ║
║ Erori               : {self.total_errors:<18} ║
║ Durata              : {elapsed:<15}s    ║
╚══════════════════════════════════════════╝
        """)


# ── MAIN ──────────────────────────────────────────────────────
async def run_sync(categories: list[str] = None, dry_run: bool = False):
    stats = SyncStats()
    supabase = get_supabase()

    cats = categories or os.environ.get("DEDEMAN_CATEGORIES", "").split(",")
    cats = [c.strip() for c in cats if c.strip()] or DEFAULT_CATEGORIES

    log.info(f"Sync start: {len(cats)} categorii, dry_run={dry_run}")

    scraper = DedemanScraper(headless=True)
    await scraper.start()

    try:
        for cat_url in cats:
            log.info(f"\n→ Categorie: {cat_url}")
            try:
                products = await scraper.scrape_category(
                    cat_url,
                    max_pages=MAX_PAGES_CAT,
                    max_products=MAX_PRODUCTS_CAT,
                    concurrency=2
                )
                stats.total_scraped += len(products)
                stats.categories_done += 1

                if not dry_run:
                    # Upsert in batches
                    rows = [product_to_supabase_row(p) for p in products]
                    for i in range(0, len(rows), BATCH_SIZE):
                        batch = rows[i:i + BATCH_SIZE]
                        ok, err = upsert_batch(supabase, batch)
                        stats.total_upserted += ok
                        stats.total_errors += err
                        log.info(f"  Batch {i//BATCH_SIZE + 1}: +{ok} upserted, {err} erori")
                else:
                    log.info(f"  DRY RUN: {len(products)} produse (nu s-a scris nimic)")

            except Exception as e:
                log.error(f"Eroare la categoria {cat_url}: {e}")
                continue

        # Marcheaza produse vechi ca inactive (nu mai apar in Dedeman)
        if not dry_run:
            mark_inactive_old_products(supabase, cutoff_hours=48)

    finally:
        await scraper.stop()
        stats.report()

        # Salveaza raport JSON
        Path("logs").mkdir(exist_ok=True)
        report_path = f"logs/sync_report_{datetime.now():%Y%m%d_%H%M}.json"
        with open(report_path, "w") as f:
            json.dump({
                "timestamp": datetime.now().isoformat(),
                "categories": len(cats),
                "scraped": stats.total_scraped,
                "upserted": stats.total_upserted,
                "errors": stats.total_errors,
            }, f, indent=2)
        log.info(f"Raport salvat: {report_path}")


if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true", help="Scrapeaza fara a scrie in DB")
    parser.add_argument("--category", help="Sync o singura categorie")
    args = parser.parse_args()

    Path("logs").mkdir(exist_ok=True)

    asyncio.run(run_sync(
        categories=[args.category] if args.category else None,
        dry_run=args.dry_run
    ))
