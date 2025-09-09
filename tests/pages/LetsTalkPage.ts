import { Page, FrameLocator, expect } from '@playwright/test';

export class LetsTalkPage {
    readonly page: Page;
    private iframe: FrameLocator | null = null;

    constructor(page: Page) {
        this.page = page;
    }
    
    private async getContactFormIframe(): Promise<FrameLocator> {
        if (this.iframe) return this.iframe;

        const selectors = ['iframe[id="hs-form-iframe-1"]', 'iframe[id="hs-form-iframe-0"]'];
        
        for (const selector of selectors) {
            try {
                const iframe = this.page.frameLocator(selector);
                await iframe.locator('input[name="firstname"]').waitFor({ state: 'visible', timeout: 5000 });
                return this.iframe = iframe;
            } catch {
                continue;
            }
        }
        
        throw new Error('No contact form iframe found');
    }

    /**
     * Fills the contact form with the provided data
     * @param formData - Object containing form field values
     */
    async fillForm(formData: { 
        firstName: string; 
        lastName: string; 
        company: string; 
        email: string; 
    }) {
        const iframe = await this.getContactFormIframe();
        await iframe.locator('input[name="firstname"]').waitFor({ state: 'visible'});

        const fieldMap = {
            firstName: 'input[name="firstname"]',
            lastName: 'input[name="lastname"]',
            company: 'input[name="company"]',
            email: 'input[name="email"]'
        };

        for (const [key, selector] of Object.entries(fieldMap)) {
            const value = formData[key as keyof typeof formData];
            await iframe.locator(selector).fill(value);
        }
    }

    /**
     * Submits the contact form
     */
    async submit() {
        const iframe = await this.getContactFormIframe();
        await iframe.locator('input[type="submit"]').click();
    }

    /**
     * Validates that error messages are displayed and contain expected text
     * @param expectedMessages - Array of expected error message texts
     */
    async expectErrorMessages(expectedMessages: string[]) {
        const iframe = await this.getContactFormIframe();
        const errorMessages = iframe.locator('.hs-error-msgs');
        
        await errorMessages.first().waitFor({ state: 'visible', timeout: 10000 });
        expect(await errorMessages.count()).toBeGreaterThan(0);

        // Log all error messages for debugging
        const errorCount = await errorMessages.count();
        for (let i = 0; i < errorCount; i++) {
            console.log(`Error ${i + 1}: ${await errorMessages.nth(i).textContent()}`);
        }

        // Check if any error contains expected text
        for (const msg of expectedMessages) {
            if (await errorMessages.filter({ hasText: msg }).count() > 0) {
                return expect(true).toBe(true);
            }
        }
        expect(false).toBe(true);
    }
}
