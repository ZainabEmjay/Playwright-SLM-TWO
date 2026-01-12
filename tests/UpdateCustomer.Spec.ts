import { test, expect } from '@playwright/test';
import { CustomerPage } from './PageObjectModel/CustomerPage';

test('update existing customer', async ({ page }) => {
  const customerPage = new CustomerPage(page);
  const customerId = 'c0d4f4cb-7447-452d-a8f1-c45c6519f629';

  await customerPage.navigateToUpdateCustomerForm(customerId);

  await customerPage.updateCustomerForm({
    surname: 'UpdatedSurname1',
    otherNames: 'UpdatedNames1',
    email: 'updated@example.com',
   // phone: '0771234567',
    //province: 'Western',
    //district: 'Colombo',
    //city: 'Colombo 07',
    //language: 'English',
  });
  
  await expect(page.getByText('Customer updated successfully')).toBeVisible();
});
