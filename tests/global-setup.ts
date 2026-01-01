import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Navigate to the app
  const baseURL = config.projects[0].use?.baseURL || 'http://localhost:5000';
  await page.goto(baseURL);

  // Accept disclaimer by setting localStorage
  await page.evaluate(() => {
    localStorage.setItem('hearwell-disclaimer-accepted', 'true');
  });

  // Save storage state for reuse in tests
  await page.context().storageState({ path: 'tests/.auth/user.json' });

  await browser.close();
}

export default globalSetup;
