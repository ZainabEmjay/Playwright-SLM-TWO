import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../LoginPage';

type LoginFixture = {
  login: () => Promise<void>;
};

export const test = base.extend<LoginFixture>({
  login: async ({ page }, use) => {
    const loginPage = new LoginPage(page);

    // Perform 2-step login (Username → Next → Password → Login)
    await loginPage.login(
      process.env.EZR_USERNAME || 'Zainabqanew',
      process.env.EZR_PASSWORD || 'Zainabqanew@123'
    );

    // Hand control back to the test AFTER login
    await use(async () => {
      // optional cleanup if needed
    });
  },
});

export { expect };


