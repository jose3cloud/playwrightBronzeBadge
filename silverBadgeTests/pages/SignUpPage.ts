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
    this.firstNameInput = this.page.locator('#firstName').or(this.page.getByPlaceholder(/first name/i));
    this.lastNameInput = this.page.locator('#lastName').or(this.page.getByPlaceholder(/last name/i));
    this.emailInput = this.page.locator('#email').or(this.page.getByPlaceholder(/^email$/i));
    this.passwordInput = this.page.locator('#password').or(this.page.getByPlaceholder(/password/i));
    this.submitButton = this.page.locator('#submit').or(this.page.getByRole('button', { name: /submit|sign up|register/i }));
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

