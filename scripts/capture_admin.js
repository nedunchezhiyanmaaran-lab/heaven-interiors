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

  // Authenticate
  await page.goto('http://localhost:3000/admin/login', { waitUntil: 'networkidle2' });
  await page.evaluate(() => {
    localStorage.setItem('heaven_admin_session_v2.0', JSON.stringify({
      id: 'usr-admin-01',
      name: 'Studio Principal',
      email: 'admin@heaveninteriors.com',
      role: 'Studio Principal'
    }));
  });

  // 1. Dashboard
  await page.goto('http://localhost:3000/admin/dashboard', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(artifactDir, 'admin_modern_dashboard.png') });

  // 2. Projects
  await page.goto('http://localhost:3000/admin/projects', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(artifactDir, 'admin_modern_projects.png') });

  // 3. Materials
  await page.goto('http://localhost:3000/admin/materials', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(artifactDir, 'admin_modern_materials.png') });

  // 4. Mobile Dashboard
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.goto('http://localhost:3000/admin/dashboard', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(artifactDir, 'admin_modern_mobile.png') });

  await browser.close();
  console.log('Modern admin screenshots captured successfully!');
}
test().catch(err => {
  console.error('Screenshot error:', err);
  process.exit(1);
});

