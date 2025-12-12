import { Page } from '@playwright/test';
import {
  FormField,
  LetsTalkFormSection,
} from '../sections/letsTalkFormSection';
import { ContactFormData } from '../data/contactForm';

export class LetsTalkPage {
  readonly page: Page;
  readonly letsTalkFormSection: LetsTalkFormSection;

  constructor(page: Page) {
    this.page = page;
    this.letsTalkFormSection = new LetsTalkFormSection(page);
  }

  async fillForm(formData: ContactFormData) {
    await Promise.all([
      formData.firstName &&
        this.letsTalkFormSection.fillField('First Name', formData.firstName),
      formData.lastName &&
        this.letsTalkFormSection.fillField('Last Name', formData.lastName),
      formData.company &&
        this.letsTalkFormSection.fillField('Company', formData.company),
      formData.email &&
        this.letsTalkFormSection.fillField('Email', formData.email),
      formData.jobTitle &&
        this.letsTalkFormSection.fillField('Job Title', formData.jobTitle),
      formData.phoneNumber &&
        this.letsTalkFormSection.fillField(
          'Phone number',
          formData.phoneNumber
        ),
      formData.comments &&
        this.letsTalkFormSection.fillField('Comments', formData.comments),
    ]);
  }

  async getErrorCount(): Promise<number> {
    const errorContainer = await this.letsTalkFormSection.getFormErrors();
    const actualErrors = await errorContainer.allTextContents();

    return actualErrors.length;
  }

  async getFieldError(fieldName: FormField): Promise<string | null> {
    try {
      const fieldError = await this.letsTalkFormSection.getFieldError(fieldName);
      await fieldError.waitFor({ state: 'visible', timeout: 5000 });
      const errorText = await fieldError.textContent();
      return errorText?.trim() || null;
    } catch (error) {
      console.log(`Could not find error for field: ${fieldName}`);
      return null;
    }
  }

  async clickSubmitButton() {
    await this.letsTalkFormSection.submit();
  }
}
