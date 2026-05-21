import asyncio
import sys
import re
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent / "scripts"))
from dedeman_scraper import DedemanScraper

# ALL construction-relevant categories found in the mega menu
# These are the ACTUAL URLs found on the site (not guessed)
CONSTRUCTION_CATEGORIES = [
    # Already scraped (for reference)
    # "https://www.dedeman.ro/ro/materiale-de-constructii/c/21",
    # "https://www.dedeman.ro/ro/instalatii-sanitare/c/8035",
    # "https://www.dedeman.ro/ro/gresie-si-faianta/c/1068",
    # "https://www.dedeman.ro/ro/parchet-mocheta-si-covoare/c/7729",
    # "https://www.dedeman.ro/ro/usi-si-ferestre/c/7759",
    # "https://www.dedeman.ro/ro/vopsele-si-tencuieli/c/7912",
    # "https://www.dedeman.ro/ro/baie/c/1528",
    
    # NEW - Wood & derivatives
    "https://www.dedeman.ro/ro/lemn/c/45",
    "https://www.dedeman.ro/ro/cherestea/c/162",
    "https://www.dedeman.ro/ro/placi-osb/c/163",
    "https://www.dedeman.ro/ro/placaj/c/164",
    "https://www.dedeman.ro/ro/pal/c/165",
    "https://www.dedeman.ro/ro/mdf/c/166",
    
    # Drywall / Rigips
    "https://www.dedeman.ro/ro/gips-carton/c/157",
    "https://www.dedeman.ro/ro/placi-gips-carton/c/1074",
    "https://www.dedeman.ro/ro/profile-metalice/c/158",
    "https://www.dedeman.ro/ro/profile-metalice-pentru-gips-carton/c/1075",
    
    # Roofing
    "https://www.dedeman.ro/ro/acoperis/c/24",
    "https://www.dedeman.ro/ro/tigla-metalica/c/135",
    "https://www.dedeman.ro/ro/tabla-cutata-si-tabla-plana/c/136",
    "https://www.dedeman.ro/ro/foi-si-panouri-policarbonat/c/3236",
    
    # Thermal insulation
    "https://www.dedeman.ro/ro/termoizolatii/c/23",
    "https://www.dedeman.ro/ro/polistiren/c/134",
    "https://www.dedeman.ro/ro/vata-minerala/c/1344",
    "https://www.dedeman.ro/ro/folii-si-bariere/c/3348",
    
    # Masonry
    "https://www.dedeman.ro/ro/zidarie-si-plansee/c/148",
    "https://www.dedeman.ro/ro/bca/c/3233",
    "https://www.dedeman.ro/ro/caramida/c/3232",
    
    # Electrical
    "https://www.dedeman.ro/ro/electrice/c/25",
    "https://www.dedeman.ro/ro/cabluri-electrice-si-conductori/c/175",
    "https://www.dedeman.ro/ro/aparataj-electric/c/144",
    "https://www.dedeman.ro/ro/corpuri-de-iluminat/c/26",
    "https://www.dedeman.ro/ro/tablouri-electrice/c/1278",
    "https://www.dedeman.ro/ro/panouri-solare/c/3396",
    "https://www.dedeman.ro/ro/panouri-fotovoltaice/c/3411",
    
    # Heating / HVAC
    "https://www.dedeman.ro/ro/incalzire/c/27",
    "https://www.dedeman.ro/ro/calorifere-si-convectoare/c/3406",
    "https://www.dedeman.ro/ro/centrale-termice/c/55",
    "https://www.dedeman.ro/ro/ventilatie-climatizare/c/54",
    "https://www.dedeman.ro/ro/aer-conditionat/c/53",
    
    # Plumbing / pipes
    "https://www.dedeman.ro/ro/tevi-si-fitinguri/c/126",
    "https://www.dedeman.ro/ro/robineti-si-vane/c/128",
    
    # Tools
    "https://www.dedeman.ro/ro/scule-electrice/c/30",
    "https://www.dedeman.ro/ro/scule-de-mana/c/29",
    "https://www.dedeman.ro/ro/utilaje/c/43",
    "https://www.dedeman.ro/ro/utilaje-pentru-constructii/c/46",
    
    # Hardware / Feronerie
    "https://www.dedeman.ro/ro/feronerie/c/28",
    
    # Doors standalone
    "https://www.dedeman.ro/ro/usi/c/22",
    "https://www.dedeman.ro/ro/usi-interior/c/159",
    "https://www.dedeman.ro/ro/usi-garaj/c/146",
    
    # Paint subcategories
    "https://www.dedeman.ro/ro/vopsele-lavabile/c/956",
    "https://www.dedeman.ro/ro/vopsele-pentru-lemn-si-metal/c/957",
    "https://www.dedeman.ro/ro/grunduri-si-amorsa/c/955",
    "https://www.dedeman.ro/ro/tencuieli-decorative/c/958",
    
    # Adhesives standalone
    "https://www.dedeman.ro/ro/adezivi-chituri-si-silicon/c/409",
]

async def main():
    scraper = DedemanScraper(headless=True)
    await scraper.start()
    
    try:
        context = await scraper._browser.new_context(**scraper._new_context_kwargs())
        page = await context.new_page()
        await scraper._block_media(page)
        
        valid = []
        total_est = 0
        
        print(f"Checking {len(CONSTRUCTION_CATEGORIES)} candidate category URLs...\n")
        
        for cat_url in CONSTRUCTION_CATEGORIES:
            try:
                await page.goto(cat_url, wait_until="domcontentloaded", timeout=15000)
                await asyncio.sleep(1)
                
                title = await page.title()
                is_404 = "404" in title
                
                if is_404:
                    name = cat_url.split('/ro/')[-1].split('/c/')[0]
                    print(f"  [404] {name:45}")
                    continue
                
                body = await page.text_content("body") or ""
                count_match = re.search(r'(\d[\d.]*)\s+(?:produse|produs|rezultat)', body, re.IGNORECASE)
                prod_count = count_match.group(1).replace('.', '') if count_match else "0"
                
                page_links = await page.eval_on_selector_all("a[href*='page=']", "els => els.map(e => e.href)")
                page_nums = [int(re.search(r'page=(\d+)', p).group(1)) for p in page_links if re.search(r'page=(\d+)', p)]
                max_page = max(page_nums) if page_nums else 1
                
                name = cat_url.split('/ro/')[-1].split('/c/')[0]
                count_int = int(prod_count) if prod_count.isdigit() else 0
                
                print(f"  [ OK] {name:45} | products: {prod_count:>6} | pages: {max_page:>3}")
                
                if count_int > 0:
                    valid.append((cat_url, name, count_int, max_page))
                    total_est += count_int
                    
            except Exception as e:
                name = cat_url.split('/ro/')[-1].split('/c/')[0]
                print(f"  [ERR] {name:45} | {str(e)[:50]}")
        
        print(f"\n{'='*70}")
        print(f"  VALID CATEGORIES: {len(valid)} | TOTAL ESTIMATED PRODUCTS: {total_est}")
        print(f"{'='*70}\n")
        
        print("Python list for sync_dedeman_supabase.py:\n")
        print("DEFAULT_CATEGORIES = [")
        for url, name, count, pages in sorted(valid, key=lambda x: -x[2]):
            print(f'    # {name} - {count} produse, {pages} pagini')
            print(f'    "{url}",')
        print("]")
        
        await page.close()
        await context.close()
    finally:
        await scraper.stop()

if __name__ == "__main__":
    asyncio.run(main())
