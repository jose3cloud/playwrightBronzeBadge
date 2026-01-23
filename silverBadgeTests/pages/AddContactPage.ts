import { Page, Locator } from '@playwright/test';

export class AddContactPage {
  readonly page: Page;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly birthdateInput: Locator;
  readonly emailInput: Locator;
  readonly phoneInput: Locator;
  readonly street1Input: Locator;
  readonly street2Input: Locator;
  readonly cityInput: Locator;
  readonly stateProvinceInput: Locator;
  readonly postalCodeInput: Locator;
  readonly countryInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstNameInput = this.page
      .getByRole('textbox', { name: /\*\s*first name/i })
      .or(this.page.locator('#firstName'));
    this.lastNameInput = this.page
      .getByRole('textbox', { name: /\*\s*last name/i })
      .or(this.page.locator('#lastName'));
    this.birthdateInput = this.page
      .getByRole('textbox', { name: /date of birth/i })
      .or(this.page.locator('#birthdate'));
    this.emailInput = this.page.getByRole('textbox', { name: /^email/i }).or(this.page.locator('#email'));
    this.phoneInput = this.page.getByRole('textbox', { name: /^phone/i }).or(this.page.locator('#phone'));
    this.street1Input = this.page
      .getByRole('textbox', { name: /street address 1/i })
      .or(this.page.locator('#street1'));
    this.street2Input = this.page
      .getByRole('textbox', { name: /street address 2/i })
      .or(this.page.locator('#street2'));
    this.cityInput = this.page.getByRole('textbox', { name: /^city/i }).or(this.page.locator('#city'));
    this.stateProvinceInput = this.page
      .getByRole('textbox', { name: /state or province/i })
      .or(this.page.locator('#stateProvince'));
    this.postalCodeInput = this.page
      .getByRole('textbox', { name: /postal code/i })
      .or(this.page.locator('#postalCode'));
    this.countryInput = this.page.getByRole('textbox', { name: /^country/i }).or(this.page.locator('#country'));
    this.submitButton = this.page.getByRole('button', { name: /^submit$/i }).or(this.page.locator('#submit'));
  }

  async waitForFormReady() {
    await Promise.all([
      this.firstNameInput.waitFor({ state: 'visible' }),
      this.lastNameInput.waitFor({ state: 'visible' }),
      this.submitButton.waitFor({ state: 'visible' }),
    ]);
  }

  async fillForm(params: {
    firstName: string;
    lastName: string;
    birthdate?: string;
    email?: string;
    phone?: string;
    street1?: string;
    street2?: string;
    city?: string;
    stateProvince?: string;
    postalCode?: string;
    country?: string;
  }) {
    await this.firstNameInput.fill(params.firstName);
    await this.lastNameInput.fill(params.lastName);
    if (params.birthdate) await this.birthdateInput.fill(params.birthdate);
    if (params.email) await this.emailInput.fill(params.email);
    if (params.phone) await this.phoneInput.fill(params.phone);
    if (params.street1) await this.street1Input.fill(params.street1);
    if (params.street2 !== undefined) await this.street2Input.fill(params.street2);
    if (params.city) await this.cityInput.fill(params.city);
    if (params.stateProvince) await this.stateProvinceInput.fill(params.stateProvince);
    if (params.postalCode) await this.postalCodeInput.fill(params.postalCode);
    if (params.country) await this.countryInput.fill(params.country);
  }

  async submit() {
    await this.submitButton.click();
  }
}
