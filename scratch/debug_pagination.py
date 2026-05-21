import asyncio
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent / "scripts"))
from dedeman_scraper import DedemanScraper

async def main():
    scraper = DedemanScraper(headless=True)
    await scraper.start()
    
    try:
        context = await scraper._browser.new_context(**scraper._new_context_kwargs())
        page = await context.new_page()
        await scraper._block_media(page)
        
        url = "https://www.dedeman.ro/ro/materiale-de-constructii/c/21"
        await page.goto(url, wait_until="domcontentloaded", timeout=30000)
        await asyncio.sleep(3)
        await scraper._accept_cookies(page)
        
        # Check pagination elements
        print("=== Pagination elements ===")
        pagination_selectors = [
            "a[aria-label='Next page']",
            ".pagination__next",
            "a.next-page",
            "[class*='pagination'] a[rel='next']",
            ".pages a",
            ".pages-items a",
            "a.action.next",
            "a[class*='next']",
            "ul.pages-items li a",
        ]
        for sel in pagination_selectors:
            count = await page.locator(sel).count()
            if count > 0:
                first_href = await page.locator(sel).first.get_attribute("href")
                first_text = (await page.locator(sel).first.text_content() or "").strip()
                print(f"  [{count:>3}] {sel:50} href={first_href}, text='{first_text}'")
            else:
                print(f"  [  0] {sel}")
        
        # Also dump all <a> tags with page in href
        print("\n=== Links with 'page' in href ===")
        page_links = await page.eval_on_selector_all(
            "a[href*='page=']",
            "els => els.map(e => ({ href: e.href, text: e.innerText.trim(), class: e.className }))"
        )
        for pl in page_links[:10]:
            print(f"  class='{pl['class']}' href='{pl['href']}' text='{pl['text']}'")
        
        await page.close()
        await context.close()
    finally:
        await scraper.stop()

if __name__ == "__main__":
    asyncio.run(main())
