import { Page, Locator } from '@playwright/test';
import { BASE_URL } from '@pw-gold/utils/constants';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = this.page.getByPlaceholder(/email/i).or(this.page.locator('#email'));
    this.passwordInput = this.page.getByPlaceholder(/password/i).or(this.page.locator('#password'));
    this.submitButton = this.page
      .getByRole('button', { name: /submit|login|sign in/i })
      .or(this.page.locator('#submit'));
  }

  async goto() {
    await this.page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
    await Promise.all([
      this.emailInput.waitFor({ state: 'visible' }),
      this.passwordInput.waitFor({ state: 'visible' }),
      this.submitButton.waitFor({ state: 'visible' }),
    ]);
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }
}
