import type { CreateUserParams, CreateContactParams } from '../utils/types';

// Test User Data for UI tests
export const ADD_CONTACT_TEST_USER = {
  firstName: 'Add',
  lastName: 'ContactUser',
};

// Test User Data for API tests
export const API_SIGNUP_TEST_USER = {
  firstName: 'Silver',
  lastName: 'Badge',
};

export const API_CONTACT_TEST_USER = {
  firstName: 'Api',
  lastName: 'Owner',
};

export const API_CHAIN_TEST_USER = {
  firstName: 'Chain',
  lastName: 'User',
};

/**
 * Creates user params for the Add Contact test flow
 * @param email - The email address for the user (typically generated with uniqueEmail)
 * @returns Complete CreateUserParams object for creating a test user
 */
export function createAddContactUserParams(email: string): CreateUserParams {
  return {
    firstName: ADD_CONTACT_TEST_USER.firstName,
    lastName: ADD_CONTACT_TEST_USER.lastName,
    email,
  };
}

/**
 * Creates contact form params for the Add Contact UI test flow
 * @param firstName - The first name for the contact
 * @param lastName - The last name for the contact
 * @param email - Optional email address for the contact (typically generated with uniqueEmail)
 * @returns Complete CreateContactParams object for filling the contact form
 */
export function createAddContactFormParams(firstName: string, lastName: string, email?: string): CreateContactParams {
  return {
    firstName,
    lastName,
    birthdate: '1990-01-01',
    email,
    phone: '5555555555',
    street1: '1 Main St',
    street2: '',
    city: 'Austin',
    stateProvince: 'TX',
    postalCode: '73301',
    country: 'USA',
  };
}

/**
 * Creates user params for the API Sign Up test
 * @param email - The email address for the user (typically generated with uniqueEmail)
 * @returns Complete CreateUserParams object for creating a test user
 */
export function createApiSignUpUserParams(email: string): CreateUserParams {
  return {
    firstName: API_SIGNUP_TEST_USER.firstName,
    lastName: API_SIGNUP_TEST_USER.lastName,
    email,
  };
}

/**
 * Creates user params for the API Contact test
 * @param email - The email address for the user (typically generated with uniqueEmail)
 * @returns Complete CreateUserParams object for creating a test user
 */
export function createApiContactUserParams(email: string): CreateUserParams {
  return {
    firstName: API_CONTACT_TEST_USER.firstName,
    lastName: API_CONTACT_TEST_USER.lastName,
    email,
  };
}

/**
 * Creates contact params for the API Contact test
 * @param lastName - The last name for the contact (typically includes random number)
 * @param email - The email address for the contact (typically generated with uniqueEmail)
 * @returns Complete CreateContactParams object for creating a contact via API
 */
export function createApiContactParams(lastName: string, email: string): CreateContactParams {
  return {
    firstName: API_CONTACT_TEST_USER.firstName,
    lastName,
    email,
  };
}

/**
 * Creates user params for the API Chain test (API → UI)
 * @param email - The email address for the user (typically generated with uniqueEmail)
 * @returns Complete CreateUserParams object for creating a test user
 */
export function createApiChainUserParams(email: string): CreateUserParams {
  return {
    firstName: API_CHAIN_TEST_USER.firstName,
    lastName: API_CHAIN_TEST_USER.lastName,
    email,
  };
}

/**
 * Creates contact params for the API Chain test (API → UI)
 * @param firstName - The first name for the contact
 * @param lastName - The last name for the contact (typically includes random number)
 * @param email - The email address for the contact (typically generated with uniqueEmail)
 * @returns Complete CreateContactParams object for creating a contact via API
 */
export function createApiChainContactParams(firstName: string, lastName: string, email: string): CreateContactParams {
  return {
    firstName,
    lastName,
    email,
  };
}
