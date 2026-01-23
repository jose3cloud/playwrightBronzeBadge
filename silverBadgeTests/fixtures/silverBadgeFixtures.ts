import { test as baseTest } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ContactListPage } from '../pages/ContactListPage';
import { SignUpPage } from '../pages/SignUpPage';
import { AddContactPage } from '../pages/AddContactPage';

// Define test fixture types for Silver Badge tests
type SilverBadgeTestFixtures = {
  loginPage: LoginPage;
  contactListPage: ContactListPage;
  signUpPage: SignUpPage;
  addContactPage: AddContactPage;
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
  signUpPage: async ({ page }, use) => {
    await use(new SignUpPage(page));
  },
  addContactPage: async ({ page }, use) => {
    await use(new AddContactPage(page));
  },
});

export { expect } from '@playwright/test';
export type { Page } from '@playwright/test';
