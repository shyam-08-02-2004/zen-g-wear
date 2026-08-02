const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('PAGE ERROR:', msg.text());
    }
  });

  page.on('pageerror', error => {
    console.log('UNCAUGHT EXCEPTION:', error.message);
  });

  page.on('requestfailed', request => {
    console.log('REQUEST FAILED:', request.url(), request.failure().errorText);
  });

  await page.goto('https://zen-g-wear.vercel.app', { waitUntil: 'networkidle2' });
  
  // Wait a bit to ensure React mounts and crashes if there's a problem
  await new Promise(r => setTimeout(r, 2000));
  
  console.log('Done checking home page.');
  
  await browser.close();
})();
