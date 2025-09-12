import { test, expect } from './fixtures/baseTest';
import { LetsTalkPage } from './pages/LetsTalkPage';

test('3Cloud Contact Form Error Validation', async ({ context, homePage, financialServicesPage }) => {
    
    await test.step('Navigate to 3Cloud Solutions homepage', async () => {
        await homePage.goto();
    });

    await test.step('Hover over Who We Serve dropdown menu', async () => {
        await homePage.hoverWhoWeServe();
    });

    await test.step('Click on Financial Services option', async () => {
        await homePage.clickFinancialServices();
    });

    await test.step('Click Let\'s Talk button to open contact form', async () => {
        await expect(financialServicesPage.letsTalkButton).toBeVisible();
        
        const [newPage] = await Promise.all([
            context.waitForEvent('page'),
            financialServicesPage.letsTalkButton.click(),
        ]);
        await newPage.waitForLoadState('load');
        
        // Store the new page for form interaction
        (test as any).newPage = newPage;
    });
    
    await test.step('Fill contact form with incomplete data', async () => {
        const letsTalk = new LetsTalkPage((test as any).newPage);
        await letsTalk.fillForm({ 
            firstName: 'John', 
            lastName: '', 
            company: 'TestCo', 
            email: 'a@a.com' 
        });
        
        // Store the page object for submission and validation
        (test as any).letsTalk = letsTalk;
    });

    await test.step('Submit the contact form', async () => {
        await (test as any).letsTalk.submit();
    });

    await test.step('Verify error messages are displayed correctly', async () => {
        await (test as any).letsTalk.expectErrorMessages([
            'Please complete this required field'
        ]);
    });
});
