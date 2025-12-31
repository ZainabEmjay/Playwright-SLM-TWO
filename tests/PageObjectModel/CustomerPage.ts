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
}

