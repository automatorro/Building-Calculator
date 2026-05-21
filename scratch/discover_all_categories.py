import asyncio
import sys
import re
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent / "scripts"))
from dedeman_scraper import DedemanScraper

# ALL construction-relevant categories discovered from mega menu (REAL URLs)
NEW_CATEGORIES = [
    # Constructii
    ("https://www.dedeman.ro/ro/termoizolatii/c/58", "Termoizolatii"),
    ("https://www.dedeman.ro/ro/gips-carton/c/55", "Gips carton"),
    ("https://www.dedeman.ro/ro/hidroizolatii/c/57", "Hidroizolatii"),
    ("https://www.dedeman.ro/ro/acoperisuri/c/141", "Acoperisuri"),
    ("https://www.dedeman.ro/ro/tabla/c/49", "Tabla"),
    ("https://www.dedeman.ro/ro/placi-si-profile-policarbonat/c/144", "Placi policarbonat"),
    ("https://www.dedeman.ro/ro/sisteme-de-scurgere/c/142", "Sisteme de scurgere"),
    ("https://www.dedeman.ro/ro/garduri/c/4208", "Garduri"),
    ("https://www.dedeman.ro/ro/produse-din-lemn/c/59", "Produse din lemn"),
    ("https://www.dedeman.ro/ro/lambriuri/c/1463", "Lambriuri"),
    ("https://www.dedeman.ro/ro/materiale-constructii-decorative/c/60", "Materiale decorative"),
    ("https://www.dedeman.ro/ro/scari-aluminiu/-otel/c/319", "Scari aluminiu/otel"),
    ("https://www.dedeman.ro/ro/organe-de-asamblare-si-feronerie/c/45", "Feronerie"),
    ("https://www.dedeman.ro/ro/echipamente-de-protectia-muncii/c/29", "Echipamente protectie"),
    ("https://www.dedeman.ro/ro/pavaje-si-borduri/c/145", "Pavaje si borduri"),
    ("https://www.dedeman.ro/ro/pardoseli-exterioare-si-accesorii/c/5508", "Pardoseli ext."),
    ("https://www.dedeman.ro/ro/scari-interioare/c/25", "Scari interioare"),
    ("https://www.dedeman.ro/ro/tevi-si-profile-metalice/c/48", "Tevi si profile metalice"),
    ("https://www.dedeman.ro/ro/substante-chimice-si-accesorii-pentru-constructii/c/5261", "Substante chimice"),
    
    # Electrice
    ("https://www.dedeman.ro/ro/corpuri-si-surse-de-iluminat/c/63", "Corp. si surse iluminat"),
    ("https://www.dedeman.ro/ro/prize-si-intrerupatoare/c/421", "Prize si intrerupatoare"),
    ("https://www.dedeman.ro/ro/cabluri-electrice-si-conductori/c/417", "Cabluri electrice"),
    ("https://www.dedeman.ro/ro/managementul-cablurilor/c/423", "Management cabluri"),
    ("https://www.dedeman.ro/ro/distributie-electrica-si-comanda/c/419", "Distributie electrica"),
    ("https://www.dedeman.ro/ro/tablouri-electrice/c/420", "Tablouri electrice"),
    ("https://www.dedeman.ro/ro/sisteme-si-panouri-solare/c/3094", "Sisteme si panouri solare"),
    
    # Termice & Instalatii
    ("https://www.dedeman.ro/ro/centrale-termice/c/856", "Centrale termice"),
    ("https://www.dedeman.ro/ro/calorifere/c/350", "Calorifere"),
    ("https://www.dedeman.ro/ro/instalatii-termice/c/52", "Instalatii termice"),
    ("https://www.dedeman.ro/ro/aparate-de-aer-conditionat/c/1386", "Aer conditionat"),
    ("https://www.dedeman.ro/ro/instalatii-hidro/c/53", "Instalatii hidro"),
    ("https://www.dedeman.ro/ro/boilere-si-accesorii/c/874", "Boilere"),
    ("https://www.dedeman.ro/ro/pompe-de-caldura/c/4245", "Pompe de caldura"),
    ("https://www.dedeman.ro/ro/seminee-si-accesorii/c/869", "Seminee"),
    ("https://www.dedeman.ro/ro/sobe-si-accesorii/c/352", "Sobe"),
    
    # Scule
    ("https://www.dedeman.ro/ro/scule-electrice/c/39", "Scule electrice"),
    ("https://www.dedeman.ro/ro/scule-de-mana/c/44", "Scule de mana"),
    ("https://www.dedeman.ro/ro/accesorii-scule-electrice-si-consumabile/c/40", "Accesorii scule"),
    ("https://www.dedeman.ro/ro/compresoare-si-scule-pneumatice/c/284", "Compresoare"),
    ("https://www.dedeman.ro/ro/aparate-de-sudura-si-accesorii/c/42", "Aparate sudura"),
    ("https://www.dedeman.ro/ro/aparate-de-masura-si-control/c/41", "Aparate masura"),
    
    # Amenajari: vopsele
    ("https://www.dedeman.ro/ro/tencuieli-decorative/c/414", "Tencuieli decorative"),
    ("https://www.dedeman.ro/ro/adezivi-siliconi-benzi/c/1461", "Adezivi, siliconi, benzi"),
    ("https://www.dedeman.ro/ro/grunduri-si-amorse/c/415", "Grunduri si amorse"),
    ("https://www.dedeman.ro/ro/spuma-poliuretanica-si-accesorii/c/411", "Spuma poliuretanica"),
    
    # Amenajari: usi/ferestre
    ("https://www.dedeman.ro/ro/ferestre/c/158", "Ferestre"),
    ("https://www.dedeman.ro/ro/accesorii-usi-si-ferestre/c/7804", "Accesorii usi/ferestre"),
    
    # Gresie subcategorii
    ("https://www.dedeman.ro/ro/adezivi-pentru-gresie-si-faianta/c/1069", "Adezivi gresie/faianta"),
    ("https://www.dedeman.ro/ro/chit-de-rosturi-pentru-gresie-si-faianta/c/1070", "Chit rosturi"),
    ("https://www.dedeman.ro/ro/coltare-profile-praguri-si-distantiere/c/440", "Profile/praguri"),
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
        
        print(f"Checking {len(NEW_CATEGORIES)} new category URLs...\n")
        
        for cat_url, label in NEW_CATEGORIES:
            try:
                await page.goto(cat_url, wait_until="domcontentloaded", timeout=15000)
                await asyncio.sleep(1)
                
                title = await page.title()
                is_404 = "404" in title or "nu a fost" in title.lower()
                
                if is_404:
                    print(f"  [404] {label:40}")
                    continue
                
                body = await page.text_content("body") or ""
                count_match = re.search(r'(\d[\d.]*)\s+(?:produse|produs|rezultat)', body, re.IGNORECASE)
                prod_count = count_match.group(1).replace('.', '') if count_match else "0"
                
                page_links = await page.eval_on_selector_all("a[href*='page=']", "els => els.map(e => e.href)")
                page_nums = [int(re.search(r'page=(\d+)', p).group(1)) for p in page_links if re.search(r'page=(\d+)', p)]
                max_page = max(page_nums) if page_nums else 1
                
                count_int = int(prod_count) if prod_count.isdigit() else 0
                
                print(f"  [ OK] {label:40} | products: {count_int:>6} | pages: {max_page:>3}")
                
                if count_int > 0:
                    valid.append((cat_url, label, count_int, max_page))
                    total_est += count_int
                    
            except Exception as e:
                print(f"  [ERR] {label:40} | {str(e)[:50]}")
        
        print(f"\n{'='*70}")
        print(f"  NEW VALID CATEGORIES: {len(valid)}")
        print(f"  TOTAL NEW PRODUCTS: ~{total_est}")
        print(f"{'='*70}\n")
        
        # Print formatted for copy-paste into sync script
        print("# New categories to ADD to DEFAULT_CATEGORIES:")
        for url, label, count, pages in sorted(valid, key=lambda x: -x[2]):
            print(f'    # {label} - {count} produse, {pages} pagini')
            print(f'    "{url}",')
        
        await page.close()
        await context.close()
    finally:
        await scraper.stop()

if __name__ == "__main__":
    asyncio.run(main())
