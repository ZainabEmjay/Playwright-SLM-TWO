// scripts/auth.setup.ts
import { chromium, expect } from '@playwright/test';
import { LoginPage } from '../PageObjectModel/LoginPage';

async function globalSetup() {
  // Launch browser (headed so you can enter OTP)
  const browser = await chromium.launch({
    headless: false,
  });

  const context = await browser.newContext({
    ignoreHTTPSErrors: true,
  });

  const page = await context.newPage();

  const loginPage = new LoginPage(page);

  // Step 1: Username + Password + Next + Login
  await loginPage.login(
    process.env.EZR_USERNAME || 'Zainabqanew',
    process.env.EZR_PASSWORD || 'Zainabqanew@123'
  );

  // Step 2: MANUAL OTP (Microsoft Authenticator)
  console.log('⏳ Please approve the login in Microsoft Authenticator...');
  console.log('⏳ Waiting until dashboard loads...');

  // Wait until login is successful
  // Wait until user is logged in (OTP approved)
await page.waitForSelector('text=Logout', {
  timeout: 120000,
});

// Save auth state
await context.storageState({ path: 'storage/auth.json' });


  // Step 3: Save authenticated session
  await context.storageState({
    path: 'storage/auth.json',
  });

  console.log('✅ Auth state saved to storage/auth.json');

  await browser.close();
}

export default globalSetup;
