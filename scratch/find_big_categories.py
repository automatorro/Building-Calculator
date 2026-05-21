import asyncio
import sys
import re
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent / "scripts"))
from dedeman_scraper import DedemanScraper

VALID_BIG_CATS = [
    "https://www.dedeman.ro/ro/materiale-de-constructii/c/21",
    "https://www.dedeman.ro/ro/instalatii-sanitare/c/8035",
    "https://www.dedeman.ro/ro/gresie-si-faianta/c/1068",
    "https://www.dedeman.ro/ro/parchet-mocheta-si-covoare/c/7729",
    "https://www.dedeman.ro/ro/usi-si-ferestre/c/7759",
    "https://www.dedeman.ro/ro/vopsele-si-tencuieli/c/7912",
    "https://www.dedeman.ro/ro/baie/c/1528",
]

async def main():
    scraper = DedemanScraper(headless=True)
    await scraper.start()
    
    try:
        context = await scraper._browser.new_context(**scraper._new_context_kwargs())
        page = await context.new_page()
        await scraper._block_media(page)
        
        total_products = 0
        total_pages = 0
        
        for url in VALID_BIG_CATS:
            await page.goto(url, wait_until="domcontentloaded", timeout=30000)
            await asyncio.sleep(2)
            await scraper._accept_cookies(page)
            
            # Get product count from page
            body_text = await page.text_content("body")
            
            # Look for "X produse" or "X rezultate" text
            count_match = re.search(r'(\d[\d.]*)\s+(?:produse|produs|rezultat)', body_text or "", re.IGNORECASE)
            prod_count = count_match.group(1).replace('.', '') if count_match else "?"
            
            # Find max page number
            page_links = await page.eval_on_selector_all(
                "a[href*='page=']",
                "els => els.map(e => e.href)"
            )
            page_nums = []
            for pl in page_links:
                m = re.search(r'page=(\d+)', pl)
                if m:
                    page_nums.append(int(m.group(1)))
            max_page = max(page_nums) if page_nums else 1
            
            # Count products on current page
            products_on_page = len(await page.locator("a[href*='/p/']").all())
            
            cat_name = url.split('/ro/')[-1].split('/c/')[0]
            print(f"  {cat_name:40} | products: {prod_count:>6} | pages: {max_page:>3} | on_page1: {products_on_page:>3} | {url}")
            
            try:
                total_products += int(prod_count)
            except:
                pass
            total_pages += max_page
        
        print(f"\n  TOTAL estimated: ~{total_products} products across ~{total_pages} pages")
        
        await page.close()
        await context.close()
    finally:
        await scraper.stop()

if __name__ == "__main__":
    asyncio.run(main())
