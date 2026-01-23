import { CreateContactParams } from './types';

/**
 * General utility functions for Silver Badge tests
 */

/**
 * Generates a unique email address for testing purposes.
 * @param prefix - Optional prefix for the email (default: 'sb')
 * @returns A unique email address string
 */
export function uniqueEmail(prefix = 'sb'): string {
  return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 100000)}@example.com`;
}

/**
 * Creates a contact payload with sensible defaults.
 */
export function createContactPayload(params: CreateContactParams): Record<string, string> {
  return {
    firstName: params.firstName,
    lastName: params.lastName,
    birthdate: params.birthdate || '1990-01-01',
    email: params.email || uniqueEmail('sb_contact'),
    phone: params.phone || '5555555555',
    street1: params.street1 || '1 Main St',
    street2: params.street2 || '',
    city: params.city || 'Austin',
    stateProvince: params.stateProvince || 'TX',
    postalCode: params.postalCode || '73301',
    country: params.country || 'USA',
  };
}
