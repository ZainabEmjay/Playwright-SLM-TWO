import { expect, type Locator, type Page } from '@playwright/test';
 
export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly nextButton: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
 
  constructor(page: Page) {
    this.page = page;
 
    this.usernameInput = page.getByLabel('Username');
    this.nextButton = page.getByRole('button', { name: 'Next' });
    this.passwordInput = page.getByPlaceholder('Enter password');
    this.loginButton = page.getByRole('button', { name: 'Login' });
  }
 
  async login(username: string, password: string) {
    await this.page.goto('https://ezr-uat.cloudshed.com/site/login');
 
    // Step 1: Username
    await this.usernameInput.fill(username);
 
    // Step 2: Next
    await this.nextButton.click();
 
    // Step 3: Password (wait until visible)
    await expect(this.passwordInput).toBeVisible();
    await this.passwordInput.fill(password);
 
    // Step 4: Login
    await this.loginButton.click();
  }
}
 