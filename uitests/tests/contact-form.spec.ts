import { CONTACT_FORM_DATA } from '../data/contactForm';
import { test, expect } from '../fixtures/testFixtures';

test('3Cloud Contact Form Error Validation', async ({
  context,
  homePage,
  financialServicesPage,
  letsTalkPageFactory,
}) => {
  await test.step('Navigate to Financial Services page', async () => {
    await homePage.goto();
    await homePage.hoverWhoWeServe();
    await homePage.clickFinancialServices();
    await expect(financialServicesPage.letsTalkButton).toBeVisible();
  });

  const letsTalkPage =
    await test.step('Open and initialize Lets Talk page', async () => {
      const [newPage] = await Promise.all([
        context.waitForEvent('page'),
        financialServicesPage.letsTalkButton.click(),
      ]);
      await newPage.waitForLoadState('load');

      const letsTalkPage = letsTalkPageFactory(newPage);
      return letsTalkPage;
    });

  await test.step('Fill form with incomplete data and submit', async () => {
    await letsTalkPage.fillForm(CONTACT_FORM_DATA.incomplete);
    await letsTalkPage.clickSubmitButton();
  });

  await test.step('Verify error messages are displayed', async () => {
    // Verify that we get validation errors (at least 3 for the originally required fields)
    const actualErrorCount = await letsTalkPage.getErrorCount();
    expect(actualErrorCount).toBeGreaterThanOrEqual(3);

    // Verify field-specific error messages for the required fields
    const requiredFields = ['Job Title', 'Phone number', 'Comments'];
    
    for (const field of requiredFields) {
      await test.step(`Verify ${field} field error`, async () => {
        const fieldError = await letsTalkPage.getFieldError(field as any);
        expect(fieldError).toContain('Please complete this required field');
      });
    }
  });
});
