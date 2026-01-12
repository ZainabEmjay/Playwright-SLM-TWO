import { expect, Page } from '@playwright/test';

export class PackageRequest {
constructor(private readonly page: Page) {}
async assignPackage() {
  await this.page.waitForURL('**/package/package-request-index*');
  while (true) {
    // check Accept buttons on current page
    const acceptButtons = this.page.getByRole('button', { name: 'Accept' });
    const count = await acceptButtons.count();
    if (count > 0) {
      // click first Accept button
      await acceptButtons.first().click();
      const modal = this.page.locator('.modal-dialog', { hasText: 'Accept Request' });
      await modal.getByRole('button', { name: 'Submit' }).click();
      const successAlert = this.page.locator('#w0-success-0');// success alert
      const successMessage = (await successAlert.innerText()).trim();
      console.log('Success message:', successMessage);
      return; // stop after success
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
}


async rejectPackage() {
  await this.page.waitForURL('**/package/package-request-index*');
  while (true) {
    // check reject buttons on current page
    const rejectButtons = this.page.getByRole('button', { name: 'Reject' });
    const count = await rejectButtons.count();
    if (count > 0) {
      // click first reject button
      await rejectButtons.first().click();
      const modal = this.page.locator('.modal-dialog', { hasText: 'Reject Package Request' });
      await modal.getByRole('button', { name: 'Submit' }).click();
      const successAlert = this.page.locator('#w0-success-0');
      const successMessage = (await successAlert.innerText()).trim();
      console.log('Success message:', successMessage);
      return;   // stop after success
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
}

}
