import { Page, Locator } from '@playwright/test';

export class SignUpPage {
  readonly page: Page;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstNameInput = this.page.getByPlaceholder(/first name/i).or(this.page.locator('#firstName'));
    this.lastNameInput = this.page.getByPlaceholder(/last name/i).or(this.page.locator('#lastName'));
    this.emailInput = this.page.getByPlaceholder(/^email$/i).or(this.page.locator('#email'));
    this.passwordInput = this.page.getByPlaceholder(/password/i).or(this.page.locator('#password'));
    this.submitButton = this.page.getByRole('button', { name: /submit|sign up|register/i }).or(this.page.locator('#submit'));
  }

  async fillForm(params: { firstName: string; lastName: string; email: string; password: string }) {
    await this.firstNameInput.fill(params.firstName);
    await this.lastNameInput.fill(params.lastName);
    await this.emailInput.fill(params.email);
    await this.passwordInput.fill(params.password);
  }

  async submit() {
    await this.submitButton.click();
  }
}

