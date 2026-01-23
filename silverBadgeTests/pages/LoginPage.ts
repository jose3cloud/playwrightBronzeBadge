import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    // Try multiple selectors for robustness
    this.emailInput = this.page.locator('#email').or(this.page.getByPlaceholder(/email/i));
    this.passwordInput = this.page.locator('#password').or(this.page.getByPlaceholder(/password/i));
    this.submitButton = this.page.locator('#submit').or(this.page.getByRole('button', { name: /submit|login|sign in/i }));
  }

  async goto() {
    const baseURL = process.env.CONTACT_LIST_BASE_URL || 'https://thinking-tester-contact-list.herokuapp.com';
    
    await this.page.goto(baseURL, { waitUntil: 'domcontentloaded' });
    await Promise.all([
      this.emailInput.waitFor({ state: 'visible' }),
      this.passwordInput.waitFor({ state: 'visible' }),
      this.submitButton.waitFor({ state: 'visible' }),
    ]);
  }

  async fillEmail(email: string) {
    await this.emailInput.waitFor({ state: 'visible' });
    await this.emailInput.fill(email);
  }

  async fillPassword(password: string) {
    await this.passwordInput.waitFor({ state: 'visible' });
    await this.passwordInput.fill(password);
  }

  async clickSubmit() {
    await this.submitButton.waitFor({ state: 'visible' });
    await this.submitButton.click();
  }

  async login(email: string, password: string) {
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.clickSubmit();
  }
}
