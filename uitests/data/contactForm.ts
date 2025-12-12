import contactFormConfig from './contactForm.json';

// Contact Form Data Interface
export interface ContactFormData {
  firstName: string;
  lastName: string;
  company: string;
  email: string;
  jobTitle: string;
  phoneNumber: string;
  comments: string;
}

// Test Data
export const CONTACT_FORM_DATA = contactFormConfig.testData;
