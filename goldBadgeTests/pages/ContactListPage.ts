import { Page, Locator } from '@playwright/test';

export class ContactListPage {
  readonly page: Page;
  readonly addContactButton: Locator;
  readonly contactList: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addContactButton = this.page
      .getByRole('button', { name: /add contact|new contact/i })
      .or(this.page.locator('#add-contact'));
    this.contactList = this.page.getByRole('table').or(this.page.locator('table'));
  }

  contactByName(firstName: string, lastName: string): Locator {
    const fullNameRegex = new RegExp(`\\b${firstName}\\b[\\s\\S]*\\b${lastName}\\b`, 'i');
    return this.contactList.getByText(fullNameRegex);
  }

  /** Name parts are dynamic per test — locator factories, not fixed constructor fields. */
  contactFirstName(firstName: string): Locator {
    return this.contactList.getByText(firstName);
  }

  contactLastName(lastName: string): Locator {
    return this.contactList.getByText(lastName);
  }
}
