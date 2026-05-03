const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  
  page.on('console', msg => {
    if (msg.text().includes('[DEBUG-TAB]')) {
      console.log('BROWSER_LOG:', msg.text());
    }
  });

  console.log('Navigating...');
  await page.goto('http://localhost:3000/projects/c952b503-0f7a-435e-a9ce-a9260bd3d809?tab=today', { waitUntil: 'networkidle0' });
  
  console.log('Looking for tab buttons...');
  const buttons = await page.$$('button');
  
  for (const btn of buttons) {
    const text = await page.evaluate(el => el.textContent, btn);
    console.log('BTN:', text);
  }

  await browser.close();
})();
