
import { expect, type Locator, type Page } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly getStartedLink: Locator;
  readonly gettingStartedHeader: Locator;
  readonly pomLink: Locator;

  constructor(page: Page) {
    this.page = page;

    this.usernameInput = page.getByLabel('Username');
    this.passwordInput = page.locator('input[type="password"]');
    this.loginButton = page.getByRole('button', { name: 'Login' });

    // ✅ Initialize missing locators
    this.getStartedLink = page.getByRole('link', { name: 'Get started' });
    this.gettingStartedHeader = page.getByRole('heading', { name: 'Getting Started' });
    this.pomLink = page.getByRole('link', { name: 'Page Object Model' });
  }

  async login(userName: string, password: string) {
    await this.page.goto('https://slmobility-uat.auth.ap-southeast-1.amazoncognito.com/login?client_id=1pf32eq34d4am58rgh8eba097u&redirect_uri=https://ezr-uat.ezrpwerhub.com/site/cognito-callback&response_type=code&scope=aws.cognito.signin.user.admin+email+openid+phone+profile&state=ZWIUHHFfbgNd4wT_K_WVTv8xSJaefmON');
    await this.usernameInput.fill(userName);
    await this.passwordInput.fill(password);
  }

  async getStarted() {
    await this.getStartedLink.click();
    await expect(this.gettingStartedHeader).toBeVisible();
  }

  async pageObjectModel() {
    await this.getStarted();
    await this.pomLink.click();
  }
}
