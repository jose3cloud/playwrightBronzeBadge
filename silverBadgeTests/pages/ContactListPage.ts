import { Page, Locator } from '@playwright/test';

export class ContactListPage {
  readonly page: Page;
  readonly addContactButton: Locator;
  readonly contactList: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    // Try multiple selectors for robustness
    this.addContactButton = this.page
      .locator('#add-contact')
      .or(this.page.getByRole('button', { name: /add contact|new contact/i }));
    this.contactList = this.page.locator('#contact-list').or(this.page.locator('[data-testid="contact-list"]'));
    this.logoutButton = this.page.locator('#logout').or(this.page.getByRole('button', { name: /logout|sign out/i }));
  }

  async waitForPageLoad() {
    // Wait for either URL change or visible elements indicating successful login
    await Promise.race([
      this.page.waitForURL(/.*contacts.*/, { timeout: 10000 }),
      this.addContactButton.waitFor({ state: 'visible', timeout: 10000 }),
    ]);
  }

  async isVisible(): Promise<boolean> {
    try {
      await this.addContactButton.waitFor({ state: 'visible', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  contactByName(firstName: string, lastName: string): Locator {
    // Contact list renders the full name somewhere in the row/card.
    // Use a case-insensitive text match for resilience.
    const fullNameRegex = new RegExp(`\\b${firstName}\\b[\\s\\S]*\\b${lastName}\\b`, 'i');
    return this.page.getByText(fullNameRegex);
  }
}
