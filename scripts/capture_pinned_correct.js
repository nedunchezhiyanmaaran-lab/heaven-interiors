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

  // Find exact offset of projects
  const pTop = await page.evaluate(() => {
    const el = document.getElementById('projects');
    const rect = el.getBoundingClientRect();
    return rect.top + window.scrollY;
  });
  console.log('Projects top is:', pTop);

  // Position 1: Right at start of projects
  await page.evaluate((top) => {
    window.scrollTo(0, top + 50);
  }, pTop);
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(artifactDir, 'portfolio_pinned_card1.png') });

  // Position 2: Midway through scrub
  await page.evaluate((top) => {
    window.scrollTo(0, top + 1200);
  }, pTop);
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(artifactDir, 'portfolio_pinned_card2.png') });

  // Position 3: Further through scrub
  await page.evaluate((top) => {
    window.scrollTo(0, top + 2200);
  }, pTop);
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(artifactDir, 'portfolio_pinned_card3.png') });

  // Mobile View
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.evaluate(() => {
    const el = document.getElementById('projects');
    el.scrollIntoView();
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(artifactDir, 'portfolio_mobile_view.png') });

  await browser.close();
  console.log('All pinned shots captured.');
}

test().catch(err => {
  console.error(err);
  process.exit(1);
});

