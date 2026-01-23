// Login Data Interface
export interface LoginData {
  email: string;
  password: string;
}

// Test Data
export const LOGIN_DATA = {
  valid: {
    email: process.env.CONTACT_LIST_EMAIL || 'test@example.com',
    password: process.env.CONTACT_LIST_PASSWORD || 'testPassword123',
  },
};
