import { expect, test } from '@playwright/test';
import { CustomerPage} from './PageObjectModel/CustomerPage';
import { PackageRequest } from './Package/PendingPackageRequest';

test('view customer details', async ({ page }) => {
  const customerPage = new CustomerPage(page);
  const customerId = 'e9dab228-da6d-4de1-b891-fc38baf461cd';

  await customerPage.navigateToViewCustomer(customerId);

  const details = await customerPage.getCustomerDetails();
 // ---- print values in console ----
  console.log('Customer Details:');
  console.log(details);

  // ---- sample match check ----
  console.log(details.mobile?.trim()==='+94765825624');
  console.log(details.NIC?.trim() === '345678');
 

  // Rs value (it's a heading) 
  const rsText = await page.getByRole('heading', { name: /Rs\./ }).textContent();
  const rsNumber = rsText?.replace('Rs.', '').trim();
  console.log(rsNumber);  // 0.00

  // Wallet code
  const walletCodeText = await page.getByText('Wallet Code :').textContent();
  const walletCode = walletCodeText?.split(':')[1].trim(); 
  console.log(walletCode);    

  //process topup
  await customerPage.topup();

  //Get fll vehicle details
  //const tableData = await customerPage.getFullVehicleTableData();

  //Get package bike details
  const packgeData = await customerPage.getPackageBikeTableData();
  // //Get payment method details
  const paymentMethodData = await customerPage.getPaymentMethodTableData();
  // // Get wallet topup details
  const walletTopUpData = await customerPage.getWalletTopupTransactionsData ();
  // // Get pending details
  const pendingTransactionData = await customerPage.getPendingTransactionsData();
  // //Assign package 
  const assignPackage = await customerPage.assignpackage();
  // //Assign vehicle
  const assignvehicle = await customerPage.assignvehicle();

 
});



