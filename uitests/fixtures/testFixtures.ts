import { test as baseTest, Page } from '@playwright/test';
import { FinancialServicesPage } from '../pages/financialServicesPage';
import { HomePage } from '../pages/homePage';
import { LetsTalkPage } from '../pages/LetsTalkPage';

// Define test fixture types
type TestFixtures = {
  homePage: HomePage;
  financialServicesPage: FinancialServicesPage;
  letsTalkPage: LetsTalkPage;
  letsTalkPageFactory: (page: Page) => LetsTalkPage;
};

// Extend base test with all fixtures (page objects + test data)
export const test = baseTest.extend<TestFixtures>({
  // Page Object fixtures
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  financialServicesPage: async ({ page }, use) => {
    await use(new FinancialServicesPage(page));
  },
  letsTalkPage: async ({ page }, use) => {
    await use(new LetsTalkPage(page));
  },
  // eslint-disable-next-line no-empty-pattern
  letsTalkPageFactory: async ({}, use) => {
    await use((page: Page) => new LetsTalkPage(page));
  },
});

export { expect, Page } from '@playwright/test';
