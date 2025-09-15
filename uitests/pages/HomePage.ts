import { Page, Locator } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly whoWeServeDropdown: Locator;
  readonly financialServicesLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.whoWeServeDropdown = this.page.getByRole('link', {
      name: 'Who We Serve',
    });
    this.financialServicesLink = this.page
      .getByRole('listitem')
      .getByRole('link', { name: 'Financial Services' });
  }

  async goto() {
    await this.page.goto('/');
  }

  async hoverWhoWeServe() {
    await this.whoWeServeDropdown.hover();
  }

  async clickFinancialServices() {
    await this.financialServicesLink.click();
  }
}
