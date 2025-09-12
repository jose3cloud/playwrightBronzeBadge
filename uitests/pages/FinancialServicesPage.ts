import { Page, Locator } from '@playwright/test';

export class FinancialServicesPage {
  readonly letsTalkButton: Locator;

  constructor(page: Page) {
    this.letsTalkButton = page.getByRole('link', { name: 'Let’s Talk' }).first();
  }
}
