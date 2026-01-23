import { test as baseTest } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ContactListPage } from '../pages/ContactListPage';

// Define test fixture types for Silver Badge tests
type SilverBadgeTestFixtures = {
  loginPage: LoginPage;
  contactListPage: ContactListPage;
};

// Extend base test with Silver Badge fixtures
export const test = baseTest.extend<SilverBadgeTestFixtures>({
  // Page Object fixtures
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  contactListPage: async ({ page }, use) => {
    await use(new ContactListPage(page));
  },
});

export { expect } from '@playwright/test';
export type { Page } from '@playwright/test';
