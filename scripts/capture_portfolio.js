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

  // Find position of #projects
  const targetY = await page.evaluate(() => {
    const el = document.getElementById('projects');
    if (!el) return 0;
    const rect = el.getBoundingClientRect();
    return rect.top + window.scrollY;
  });
  console.log('Projects top is:', targetY);

  // 1. Scroll to top of projects section (Card 1)
  await page.evaluate((top) => {
    window.scrollTo(0, top + 100);
  }, targetY);
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(artifactDir, 'portfolio_stack_card1.png') });

  // 2. Scroll further down so Card 2 stacks over Card 1 with 3D scale down
  await page.evaluate((top) => {
    window.scrollTo(0, top + 650);
  }, targetY);
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(artifactDir, 'portfolio_stack_card2_stacking.png') });

  // 3. Scroll to Card 3
  await page.evaluate((top) => {
    window.scrollTo(0, top + 1300);
  }, targetY);
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(artifactDir, 'portfolio_stack_card3.png') });

  // 4. Mobile View
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.evaluate((top) => {
    window.scrollTo(0, top + 50);
  }, targetY);
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(artifactDir, 'portfolio_stack_mobile.png') });

  await browser.close();
  console.log('Stacking cards screenshots captured successfully!');
}

test().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
