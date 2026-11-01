const puppeteer = require('puppeteer-core');
const path = require('path');

async function test() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1500));

  console.log('Scrolling down through Hero curtain...');
  // 1. Unveil curtain
  for (let i = 0; i < 5; i++) {
    await page.mouse.wheel({ deltaY: 800 });
    await new Promise(r => setTimeout(r, 200));
  }
  await new Promise(r => setTimeout(r, 500));

  // 2. Scroll through StudioIntro
  console.log('Scrolling through StudioIntro...');
  for (let i = 0; i < 4; i++) {
    await page.mouse.wheel({ deltaY: 800 });
    await new Promise(r => setTimeout(r, 200));
  }
  await new Promise(r => setTimeout(r, 500));

  // Take screenshot when reaching projects
  const pos1 = await page.evaluate(() => ({
    scrollY: window.scrollY,
    projectsRect: document.getElementById('projects')?.getBoundingClientRect()
  }));
  console.log('Position before projects scrub:', pos1);
  await page.screenshot({ path: 'test_projects_view1.png' });

  // 3. Scroll through projects
  console.log('Scrubbing horizontally through projects...');
  for (let i = 0; i < 5; i++) {
    await page.mouse.wheel({ deltaY: 700 });
    await new Promise(r => setTimeout(r, 300));
  }
  await new Promise(r => setTimeout(r, 500));

  const pos2 = await page.evaluate(() => ({
    scrollY: window.scrollY,
    projectsRect: document.getElementById('projects')?.getBoundingClientRect(),
    trackTransform: document.querySelector('#projects .flex.items-center.gap-6')?.style?.transform
  }));
  console.log('Position during projects scrub:', pos2);
  await page.screenshot({ path: 'test_projects_view2.png' });

  await browser.close();
  console.log('Natural scroll test completed.');
}

test().catch(err => {
  console.error(err);
  process.exit(1);
});

