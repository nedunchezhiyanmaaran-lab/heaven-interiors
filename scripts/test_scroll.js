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

  // Find position of #projects
  const targetY = await page.evaluate(() => {
    const el = document.getElementById('projects');
    if (!el) return 0;
    const rect = el.getBoundingClientRect();
    return rect.top + window.scrollY;
  });
  console.log('Target #projects absolute top:', targetY);

  // Scroll smoothly down past hero and studio intro to reach #projects
  await page.evaluate((top) => {
    window.scrollTo({ top: top, behavior: 'instant' });
  }, targetY);
  await new Promise(r => setTimeout(r, 1200));

  await page.screenshot({ path: path.join(artifactDir, 'portfolio_test_at_start.png') });

  // Now simulate scrolling the mouse wheel down to scrub through the pinned track!
  for (let i = 0; i < 4; i++) {
    await page.mouse.wheel({ deltaY: 600 });
    await new Promise(r => setTimeout(r, 600));
  }

  await page.screenshot({ path: path.join(artifactDir, 'portfolio_test_scrolled_mid.png') });

  for (let i = 0; i < 5; i++) {
    await page.mouse.wheel({ deltaY: 600 });
    await new Promise(r => setTimeout(r, 600));
  }

  await page.screenshot({ path: path.join(artifactDir, 'portfolio_test_scrolled_end.png') });

  await browser.close();
  console.log('Capture finished successfully!');
}

test().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
