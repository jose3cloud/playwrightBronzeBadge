import { test as baseTest, expect } from '@playwright/test';
import { LoginPage } from '@pw-gold/pages/LoginPage';
import { ContactListPage } from '@pw-gold/pages/ContactListPage';
import { createUserWithContact } from '@pw-gold/services/contactService';
import type { Contact, CreatedUser } from '@pw-gold/utils/types';

type GoldFixtures = {
  loginPage: LoginPage;
  contactListPage: ContactListPage;
  /** Hook-style fixture: API creates user + contact before the test body. */
  seededContact: { user: CreatedUser; contact: Contact };
};

export const test = baseTest.extend<GoldFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  contactListPage: async ({ page }, use) => {
    await use(new ContactListPage(page));
  },

  seededContact: async ({ request }, use) => {
    const seeded = await createUserWithContact(request);
    await use(seeded);
  },
});

export { expect };
