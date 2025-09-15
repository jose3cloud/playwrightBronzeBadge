import { FrameLocator, Locator, Page } from '@playwright/test';
// import { IframeHelpers } from '../helpers/iframeHelpers';

export type FormField =
  | 'First Name'
  | 'Last Name'
  | 'Company'
  | 'Email'
  | 'Job Title'
  | 'Phone number'
  | 'Comments';

export class LetsTalkFormSection {
  readonly page: Page;
  private readonly iFrameSelectors = [
    'iframe#hs-form-iframe-1',
    'iframe#hs-form-iframe-0',
  ];
  private _iframe?: FrameLocator;

  constructor(page: Page) {
    this.page = page;
  }

  async getIframe(): Promise<FrameLocator> {
    if (!this._iframe) {
      for (const selector of this.iFrameSelectors) {
        try {
          // Wait for iframe to be attached and loaded
          await this.page.waitForSelector(selector, { state: 'attached' });
          const iframe = this.page.frameLocator(selector);

          // Wait for iframe content to load
          await iframe
            .locator('input[name="firstname"]')
            .waitFor({ state: 'visible', timeout: 1000 });
          return (this._iframe = iframe);
        } catch {
          continue;
        }
      }
    }
    if (!this._iframe) {
      throw new Error('Could not find a valid iframe for the form.');
    }
    return this._iframe;
  }

  async getField(fieldLabel: FormField): Promise<Locator> {
    const iframe = await this.getIframe();
    return iframe.getByLabel(fieldLabel);
  }

  async getSubmitButton(): Promise<Locator> {
    const iframe = await this.getIframe();
    return iframe.getByRole('button', { name: 'Submit' });
  }

  async getFieldError(fieldLabel: FormField): Promise<Locator> {
    const iframe = await this.getIframe();

    return iframe
      .getByLabel(fieldLabel)
      .locator('xpath=ancestor::*[contains(@class,"field")]')
      .getByRole('alert');
  }

  async getFormErrors(): Promise<Locator> {
    const iframe = await this.getIframe();
    return iframe.getByRole('alert');
  }

  async fillField(fieldLabel: FormField, value: string) {
    const el = await this.getField(fieldLabel);
    await el.fill(value);
  }

  async submit() {
    const btn = await this.getSubmitButton();
    await btn.click();
  }
}
