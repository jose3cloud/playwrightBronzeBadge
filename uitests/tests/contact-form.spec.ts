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
    expect(await letsTalkPage.getErrorCount()).toBeGreaterThan(0);

    const [jobTitleError, phoneNumberError, commentsError] = await Promise.all([
      letsTalkPage.getFieldError('Job Title'),
      letsTalkPage.getFieldError('Phone number'),
      letsTalkPage.getFieldError('Comments'),
    ]);

    const hasExpectedMessage = [
      jobTitleError,
      phoneNumberError,
      commentsError,
    ].some(error => error?.includes('Please complete this required field'));
    expect(hasExpectedMessage).toBe(true);
  });
});
