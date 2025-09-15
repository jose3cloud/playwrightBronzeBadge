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

// Contact Form Test Data
export const CONTACT_FORM_DATA = {
  // Incomplete data for validation error testing
  incomplete: {
    firstName: 'John',
    lastName: 'Doe',
    company: 'TestCo',
    email: 'john@test.com',
    jobTitle: '',
    phoneNumber: '',
    comments: '',
  },
};
