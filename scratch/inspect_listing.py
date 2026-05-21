import asyncio
import sys
import json
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
        
        # Extract structured data from product cards
        products = await page.eval_on_selector_all(
            ".product-item",
            """els => els.map(el => {
                const link = el.querySelector('a.product-item-photo, a.product-item-link');
                const href = link ? link.href : '';
                const nameEl = el.querySelector('.product-item-link, .product-item-name a, .product name');
                const name = nameEl ? nameEl.innerText.trim() : '';
                const priceEl = el.querySelector("[data-price-type='finalPrice'] .price, .price-box .price");
                const price = priceEl ? priceEl.innerText.trim() : '';
                const imgEl = el.querySelector('img.product-image-photo');
                const img = imgEl ? (imgEl.src || imgEl.dataset.src) : '';
                const ratingEl = el.querySelector('.rating-result');
                const rating = ratingEl ? ratingEl.getAttribute('title') || ratingEl.style.width : '';
                const idMatch = href.match(/\\/p\\/(\\d+)/);
                const sku = idMatch ? idMatch[1] : '';
                return { sku, name, price, href, img, rating };
            })"""
        )
        
        print(f"Extracted {len(products)} products from listing page:\n")
        for p in products[:10]:
            print(f"  SKU: {p['sku']:>8} | Price: {p['price']:>12} | Rating: {p['rating']:>10} | Name: {p['name'][:60]}")
        
        # Check how many have valid data
        valid = [p for p in products if p['sku'] and p['price']]
        print(f"\n{len(valid)}/{len(products)} have both SKU and price on listing page!")
        
        await page.close()
        await context.close()
    finally:
        await scraper.stop()

if __name__ == "__main__":
    asyncio.run(main())
