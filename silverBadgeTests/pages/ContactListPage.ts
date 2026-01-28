import { Page, Locator } from '@playwright/test';

export class ContactListPage {
  readonly page: Page;
  readonly addContactButton: Locator;
  readonly contactList: Locator;

  constructor(page: Page) {
    this.page = page;
    // Try multiple selectors for robustness
    this.addContactButton = this.page
      .getByRole('button', { name: /add contact|new contact/i })
      .or(this.page.locator('#add-contact'));
    // The demo app renders contacts in a <table> without a stable id.
    this.contactList = this.page.getByRole('table').or(this.page.locator('table'));
  }

  contactByName(firstName: string, lastName: string): Locator {
    // Contact list renders the full name somewhere in the row/card.
    // Use a case-insensitive text match for resilience.
    const fullNameRegex = new RegExp(`\\b${firstName}\\b[\\s\\S]*\\b${lastName}\\b`, 'i');
    return this.page.getByText(fullNameRegex);
  }
}
