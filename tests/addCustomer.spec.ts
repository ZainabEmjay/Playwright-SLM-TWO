import { test, expect } from '@playwright/test';
import { CustomerPage } from './PageObjectModel/CustomerPage';

test('Admin adds customer and verifies it appears', async ({ page }) => {
  // Go directly to customer index (already logged in via storageState)
  await page.goto('https://ezr-uat.ezrpwerhub.com/customer/index');

  // Verify Customers page heading is visible
  await expect(page.getByRole('heading', { name: 'Customers', exact: true })).toBeVisible();

  const customerPage = new CustomerPage(page);

  // Navigate to Add Customer form
  await customerPage.navigateToAddCustomerForm();

  // Generate unique test data
  const unique = Date.now().toString().slice(-6);
  const testData = {
    mobile: `+94771${unique}`,
    surname: 'Jiffry',
    otherNames: 'Zainab QA',
    walletCode: unique,
    nic: `${Math.floor(100000000000 + Math.random() * 900000000000)}`,
    phone: `071${unique}`,
    email: `zainab.qa+${unique}@testmail.com`,
    address: 'No 123, Galle Road, Colombo',
    province: 'Western Province',
    district: 'Colombo',
    city: 'Colombo 07',
    divisional: 'Thimbirigasyaya',
    language:'English',

  };

  // Fill and submit the form
  await customerPage.fillCustomerForm(testData);

  // Wait for customer view page
  await expect(page).toHaveURL(/\/customer\/view\?id=/);

  // Go back to customer index
  await page.getByRole('link', { name: 'Back', exact: true }).click();
  await expect(page).toHaveURL(/\/customer\/index/, { timeout: 10000 });

  // Search customer by mobile
  const mobileSearchInput = page.locator('input[name="mobile"]');
  await mobileSearchInput.fill(testData.mobile);

  await Promise.all([
    page.waitForResponse(res =>
      res.url().includes('/customer') && res.status() === 200
    ),
    page.keyboard.press('Enter'),
  ]);

  // Validate table row
  const row = page.locator('table tbody tr').first();
  await expect(row).toContainText(testData.mobile);
  await expect(row).toContainText(testData.surname);
  await expect(row).toContainText(testData.otherNames);
  await expect(row).toContainText(testData.walletCode);
});
