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
  await new Promise(r => setTimeout(r, 1500));

  // Scroll to projects section
  await page.evaluate(() => {
    const el = document.getElementById('projects');
    if (el) {
      el.scrollIntoView({ behavior: 'instant' });
    }
  });
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(artifactDir, 'portfolio_modern_desktop_intro.png') });

  // Scroll down a bit within the pinned track to see Project 01 & 02
  await page.evaluate(() => {
    window.scrollBy({ top: 900, behavior: 'instant' });
  });
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(artifactDir, 'portfolio_modern_desktop_scrolled.png') });

  // Scroll down more to see Project 02 & 03
  await page.evaluate(() => {
    window.scrollBy({ top: 1100, behavior: 'instant' });
  });
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(artifactDir, 'portfolio_modern_desktop_scrolled2.png') });

  // Mobile viewport
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.evaluate(() => {
    const el = document.getElementById('projects');
    if (el) {
      el.scrollIntoView({ behavior: 'instant' });
    }
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(artifactDir, 'portfolio_modern_mobile.png') });

  await browser.close();
  console.log('Portfolio screenshots captured successfully!');
}

test().catch(err => {
  console.error('Portfolio capture error:', err);
  process.exit(1);
});
