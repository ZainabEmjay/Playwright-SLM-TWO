import { expect, test } from '@playwright/test';
//import { CustomerPage} from './PageObjectModel/CustomerPage';
import { PackageRequest } from './Package/PendingPackageRequest';

test('Accept first package request', async ({ page }) => {
  await page.goto('https://ezr-uat.ezrpwerhub.com/package/package-request-index');
  const pr = new PackageRequest(page);
  await pr.assignPackage();
});


test('Reject first package request', async ({page})=>{
  await page.goto('https://ezr-uat.ezrpwerhub.com/package/package-request-index');
  const pr = new PackageRequest(page);
  await pr.rejectPackage();
});