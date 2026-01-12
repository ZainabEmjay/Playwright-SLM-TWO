import { expect, Page } from '@playwright/test';

export class CustomerPage {
  constructor(private page: Page) {}

  async navigateToAddCustomerForm() {
    const newButton = this.page.locator('.btn-icon-text', { hasText: 'New' });
    await expect(newButton).toBeVisible({ timeout: 10000 });
    await newButton.click();
    await this.page.waitForURL(/\/customer\/create/, { timeout: 10000 });
  }

  private async fillByLabel(label: string, value: string) {
    const input = this.page.getByLabel(label);
    await expect(input).toBeVisible({ timeout: 10000 });
    await input.fill(value);
  }

  async fillCustomerForm(data: {
    mobile: string;
    surname: string;
    otherNames: string;
    nic: string;
    phone: string;
    email: string;
    address: string;
    province: string;
    district: string;
    city: string;
    divisional: string;
    language:string;
    Other_Names:string;
  }) {
    // Fill standard inputs
    await this.fillByLabel('Mobile', data.mobile);
    await this.fillByLabel('Surname', data.surname);
    await this.fillByLabel('Other Names', data.otherNames);

    await this.fillByLabel('NIC', data.nic);
    await this.fillByLabel('Other Phone', data.phone);
    await this.fillByLabel('Email', data.email);
    await this.fillByLabel('Address', data.address);
    await this.fillByLabel('Divisional Secretariat', data.divisional);
    //await this.fillByLabel('Language Preference',data.language);

    // Helper: wait for specific dropdown option label to appear
    const waitForOptionByLabel = async (selector: string, expectedLabel: string) => {
      await this.page.waitForFunction(
        ([sel, lbl]) => {
          const el = document.querySelector(sel) as HTMLSelectElement | null;
          return el !== null && Array.from(el.options).some(o => o.label.trim() === lbl.trim());
        },
        [selector, expectedLabel],
        { timeout: 20000 }
      );
    };

    // ---- Province ----
    const provinceSelector = 'select[name="loc_state"], select#loc_state';
    await this.page.waitForSelector(provinceSelector, { timeout: 15000 });
    await waitForOptionByLabel(provinceSelector, data.province);
    await this.page.selectOption(provinceSelector, { label: data.province });

    // ---- District ----
    const districtSelector = 'select[name="loc_area"], select#loc_area';
    await this.page.waitForSelector(districtSelector, { timeout: 15000 });
    await this.page.waitForTimeout(1000); // allow AJAX to populate
    await waitForOptionByLabel(districtSelector, data.district);
    await this.page.selectOption(districtSelector, { label: data.district });

    // ---- City ----
    const citySelector = 'select[name="loc_city"], select#loc_city, select[name="City"], select#City';
    await this.page.waitForSelector(citySelector, { timeout: 15000 });
    await this.page.waitForTimeout(1000); // allow AJAX to populate
    await waitForOptionByLabel(citySelector, data.city);
    await this.page.selectOption(citySelector, { label: data.city });

    //--------language---
    const languageSelector = 'select[name="language"], select#language, select[name="lang"], select#lang';
    await this.page.waitForSelector(languageSelector, { timeout: 15000 });
    await this.page.waitForTimeout(1000); // allow options to load
    await waitForOptionByLabel(languageSelector, data.language);
    await this.page.selectOption(languageSelector, { label: data.language, // "English" | "தமிழ்" | "සිංහල"
    });


    // ---- Submit ----
    const submitButton = this.page.getByRole('button', { name: 'Submit Form' });
    await this.page.getByRole('button', { name: 'Submit Form' }).click();

  // Add debug screenshot to see why form didn't redirect
  await this.page.screenshot({ path: 'submit-debug.png', fullPage: true });
  await Promise.race([
    this.page.waitForURL(/\/customer\/view/, { timeout: 15000 }),
    this.page.locator('.form-error, .alert-danger').first().waitFor({ timeout: 15000 })
  ]);



  }

  //navigate to updatecustomer form
 async navigateToUpdateCustomerForm(customerId: string) {
  await this.page.goto(`https://ezr-uat.ezrpwerhub.com/customer/update?id=${customerId}`);
  
}

async updateCustomerForm(data: {
  mobile?: string;
  surname?: string;
  otherNames?: string;
  nic?: string;
  phone?: string;
  email?: string;
  address?: string;
  province?: string;
  district?: string;
  city?: string;
  divisional?: string;
  language?: string;
}) {
  // Fill only provided fields
  if (data.mobile) await this.fillByLabel('Mobile', data.mobile);
  if (data.surname) await this.fillByLabel('Surname', data.surname);
  if (data.otherNames) await this.fillByLabel('Other Names', data.otherNames);
  if (data.nic) await this.fillByLabel('NIC', data.nic);
  if (data.phone) await this.fillByLabel('Other Phone', data.phone);
  if (data.email) await this.fillByLabel('Email', data.email);
  if (data.address) await this.fillByLabel('Address', data.address);
  if (data.divisional) await this.fillByLabel('Divisional Secretariat', data.divisional);

  // Select dropdowns
  const selectIfProvided = async (selector: string, value?: string) => {
    if (!value) return;
    await this.page.waitForSelector(selector, { timeout: 15000 });
    await this.page.selectOption(selector, { label: value });
  };

  await selectIfProvided('select[name="loc_state"], select#loc_state', data.province);
  await selectIfProvided('select[name="loc_area"], select#loc_area', data.district);
  await selectIfProvided(
    'select[name="loc_city"], select#loc_city, select[name="City"], select#City',
    data.city
  );
  await selectIfProvided('select[name="language"], select#language, select[name="lang"], select#lang', data.language);

  // Click Update button
  const updateButton = this.page.locator('button:has-text("SUBMIT FORM")');
  await expect(updateButton).toBeVisible({ timeout: 10000 });
  await updateButton.click();

  // Wait for success or error
  await Promise.race([
    this.page.waitForURL(/\/customer\/view/, { timeout: 15000 }),
    this.page.locator('.form-error, .alert-danger').first().waitFor({ timeout: 15000 })
  ]);
  }


  //navigate to the view customer form
  async navigateToViewCustomer(customerId: string) {
    await this.page.goto(`https://ezr-uat.ezrpwerhub.com/customer/view?id=${customerId}`);
    await this.page.waitForSelector('body'); // ensures page has loaded
  }

  async getCustomerDetails() {
    const mobile = await this.page.locator('label:has-text("Mobile:") + p').textContent();
    const NIC = await this.page.locator('label:has-text("NIC:") + p').textContent();
    
    return {
      mobile: mobile?.trim() || '',
      NIC : NIC?.trim() || '',
      
    };
  }

  // topup process
  async topup() {
    try {
      const topupbtn = this.page.getByRole('button', { name: /Top up/i });

      await Promise.all([
        this.page.waitForLoadState('networkidle'),
        topupbtn.click()
      ]);

      // wait for modal
      await this.page.locator('#refundModalLabel').waitFor();
      const modalTitle = await this.page.locator('#refundModalLabel').textContent();
      console.log('Modal title:', modalTitle?.trim());

      // fill amount
      const topUpInput = this.page.locator('#top_up_amount');
      await topUpInput.fill('500');

      // select reason
      await this.page.locator('select[id="reason_forTopUp"]').selectOption('Bank Transfer');

      // submit top-up
      await this.page.getByText('Submit').click();

      // wait for success alert (adjust selector if different)
      const successAlert = this.page.locator('#w0-success-0');

      if (await successAlert.isVisible({ timeout: 5000 }).catch(() => false)) {
        const successMessage = (await successAlert.innerText()).trim();
        console.log('Top-up Success:', successMessage);
      } else {
        console.log('Top-up Failed: Success message not displayed');
      }

    } catch (error) {
      console.log('Top-up encountered an error:');
    }
  }

  //get vehicle table data
  async getFullVehicleTableData() {
    const table = this.page
      .getByRole('heading', { name: /Vehicles/i })
      .locator('..')
      .locator('..')
      .getByRole('table');

    let allData: string[][] = [];

    while (true) {
      // get all rows on current page
      const rows = await table.getByRole('row').all();

      for (let i = 1; i < rows.length; i++) {  // skip header
        const cells = await rows[i].getByRole('cell').all();
        const values = await Promise.all(
          cells.map(async c => (await c.textContent())?.trim() ?? '')
        );
        allData.push(values);
      }

      // locate Next button
      const nextButtons = await this.page.getByRole('link', { name: 'Next' }).all();

      if (nextButtons.length === 0) break; // no Next button → only 1 page

      const nextButton = nextButtons[0];

      // check if disabled
      const isDisabled = await nextButton.evaluate(node => 
        node.parentElement?.classList.contains('disabled') ?? true
      );

      if (isDisabled) break;

      // click Next page and wait for table to reload
      await Promise.all([
        this.page.waitForLoadState('networkidle'),
        nextButton.click()
      ]);
    }

    console.log('Full Vehicle Table Data:', allData);
    return allData;
  }



  async getPackageBikeTableData (){
    // anchor by table heading text
  const packageBikeTable =  this.page
  .getByRole('heading', { name: /Package Bike Details/i })
  .locator('..')     // header parent
  .locator('..')     // card/container parent
  .getByRole('table');

  const rows = await packageBikeTable.getByRole('row').all();

  for (let i = 2; i < rows.length; i++) {   // skip header row
    // skip any empty message row
    if (await rows[i].getByText('No').count()) continue;

    const cells = await rows[i].getByRole('cell').all();

    const values = await Promise.all(
      cells.map(async c => (await c.textContent())?.trim())
    );

    console.log('Package data:',values);
  }

  }


  async getPaymentMethodTableData() {
    // anchor by table heading text
    const paymentTable = this.page
      .getByRole('heading', { name: /Payment Method Details/i })
      .locator('..')      // header parent
      .locator('..')      // card/container parent
      .getByRole('table');

    // get all rows
    const rows = await paymentTable.getByRole('row').all();

    for (let i = 2; i < rows.length; i++) {  // skip header row
      // skip any empty message row
      if (await rows[i].getByText('No').count()) continue;

      const cells = await rows[i].getByRole('cell').all();

      const values = await Promise.all(
        cells.map(async c => (await c.textContent())?.trim() ?? '')
      );

      console.log('Payment Method data:', values);
    }
  }

  async getWalletTopupTransactionsData() {
    // anchor by table heading text
    const walletTable = this.page
      .getByRole('heading', { name: /Wallet Top-Up Transactions/i })
      .locator('..')      // header parent
      .locator('..')      // card/container parent
      .getByRole('table');

    // get all rows
    const rows = await walletTable.getByRole('row').all();

    for (let i = 2; i < rows.length; i++) {  // skip header row
      // skip empty message row if exists
      if (await rows[i].getByText('No').count()) continue;

      const cells = await rows[i].getByRole('cell').all();

      const values = await Promise.all(
        cells.map(async c => (await c.textContent())?.trim() ?? '')
      );

      console.log('Wallet Top-Up Transaction:', values);
    }
  }

  async getPendingTransactionsData() {
    // anchor by table heading text
    const pendingTable = this.page
      .getByRole('heading', { name: /Pending Transactions/i })
      .locator('..')      // header parent
      .locator('..')      // card/container parent
      .getByRole('table');

    // get all rows
    const rows = await pendingTable.getByRole('row').all();

    for (let i = 1; i < rows.length; i++) {  // skip header row
      // skip empty message row if exists
      if (await rows[i].getByText('No').count()) continue;
      const cells = await rows[i].getByRole('cell').all();
      const values = await Promise.all(cells.map(async c => (await c.textContent())?.trim() ?? ''));
      console.log('Pending Transaction:', values);
    }
  }

  async assignpackage() {
    try {
      // click "Assign Package" button
      await this.page.getByText('Assign Package').click();
      // get first row (skip header)
      const rows = this.page.getByRole('row');
      const rowCount = await rows.count();

      if (rowCount <= 1) { // only header present
        console.log('No package rows found to assign.');
        return;
      }

      const firstRow = rows.nth(1); // first data row
      // click "Select Package"
      const selectBtn = firstRow.getByText('Select Package');
      if (await selectBtn.count() > 0) {
        await selectBtn.click();
      } else {
        console.log('Select Package button not found in first row.');
      }

      // click "Assign Vehicle"
      const assignBtn = firstRow.getByText('Assign Vehicle');
      if (await assignBtn.count() > 0) {
        await assignBtn.click();
      } else {
        console.log('Assign Vehicle button not found in first row.');
      }

      console.log('Assign Package actions completed for first row.');

    } catch (error) {
      console.log('Error during assignpackage:');
    }
  }

  
  async assignvehicle() {
    try {
      // Click "Assign Vehicle" button
      const assignVehicleBtn = this.page.getByText('Assign Vehicle');
      if (await assignVehicleBtn.count() === 0) {
        console.log('Assign Vehicle button not found on page.');
        return;
      }
      await assignVehicleBtn.click();
      // Get first row (skip header)
      const rows = this.page.getByRole('row');
      const rowCount = await rows.count();
      if (rowCount <= 1) {
        console.log('No rows found to assign vehicle.');
        return;
      }

      const firstRow = rows.nth(1);
      // Click "Assign" in first row
      const assignBtn = firstRow.getByText('Assign');
      if (await assignBtn.count() > 0) {
        await assignBtn.click();
      } else {
        console.log('Assign button not found in first row.');
        return;
      }

      // Select battery type
      const batterySelect = this.page.locator('#vehicleowner-battery_type_id');
      if (await batterySelect.count() > 0) {
        await batterySelect.selectOption({ label: 'BLUE' });
      } else {
        console.log('Battery type select not found.');
      }

      // Click "SUBMIT FORM"
      const submitBtn = this.page.getByText('SUBMIT FORM');
      if (await submitBtn.count() > 0) {
        await submitBtn.click();
        console.log('Vehicle assignment submitted successfully.');
      } else {
        console.log('SUBMIT FORM button not found.');
      }

    } catch (error) {
      console.log('Error during assignvehicle:');
    }
  }


}



