const puppeteer = require('puppeteer');
const axios = require('axios');
async function run() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const email = 'testuser' + Date.now() + '@example.com';
  await axios.post('http://localhost:5000/api/users/register', { name: 'Test', email, password: 'password123' });
  await page.goto('http://localhost:5173/login');
  await page.type('input[name="email"]', email);
  await page.type('input[name="password"]', 'password123');
  await page.click('button[type="submit"]');
  await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 5000 }).catch(e => console.log('Timeout'));
  console.log('Final URL after login:', page.url());
  const content = await page.content();
  if (content.includes('Career Cockpit')) console.log('UI: Dashboard');
  else if (content.includes('System Overview') || content.includes('Admin Panel')) console.log('UI: Admin');
  else console.log('UI: Unknown');
  await browser.close();
}
run();
