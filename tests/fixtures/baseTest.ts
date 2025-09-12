import { test as baseTest } from '@playwright/test';
import { FinancialServicesPage } from '../pages/FinancialServicesPage';
import { HomePage } from '../pages/HomePage';
import { LetsTalkPage } from '../pages/LetsTalkPage';

// Define custom fixture types
type MyFixtures = {
  homePage: HomePage;
  financialServicesPage: FinancialServicesPage;
  letsTalkPage: LetsTalkPage;
};

// Extend base test with your custom fixtures
export const test = baseTest.extend<MyFixtures>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  financialServicesPage: async ({ page }, use) => {
    await use(new FinancialServicesPage(page));
  },
  letsTalkPage: async ({ page }, use) => {
    await use(new LetsTalkPage(page));
  },
});

export default test;
export { expect, Page } from '@playwright/test';
