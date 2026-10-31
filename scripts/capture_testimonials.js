const puppeteer = require('puppeteer-core');
const path = require('path');

async function test() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });

  const artifactDir = path.resolve('C:\\Users\\dell\\.gemini\\antigravity\\brain\\9c2f87ba-ac30-4391-be87-d80a77d20207');

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1200));

  // Scroll to testimonials section
  await page.evaluate(() => {
    const el = document.getElementById('testimonials');
    if (el) {
      el.scrollIntoView({ behavior: 'instant' });
    }
  });

  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(artifactDir, 'website_testimonials_desktop.png') });

  // Mobile viewport
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.evaluate(() => {
    const el = document.getElementById('testimonials');
    if (el) {
      el.scrollIntoView({ behavior: 'instant' });
    }
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(artifactDir, 'website_testimonials_mobile.png') });

  await browser.close();
  console.log('Testimonials screenshots captured successfully!');
}

test().catch(err => {
  console.error('Testimonials capture error:', err);
  process.exit(1);
});

