import { APIRequestContext } from '@playwright/test';
import { CreateContactParams, CreateUserParams, SignUpResponse } from '@pw-silver/utils/types';
import { createUserViaAPI } from '@pw-silver/api/userApi';

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
 * Creates a user via API with a unique email and returns both the email and signup response.
 * This is a convenience function that combines uniqueEmail generation, user params creation, and API user creation.
 * @param request - Playwright API request context
 * @param createUserParamsFn - Function that creates user params from an email (e.g., createApiSignUpUserParams)
 * @param emailPrefix - Prefix for the unique email (default: 'sb_user')
 * @returns Object containing the generated email and the signup response
 */
export async function createUserWithUniqueEmail(
  request: APIRequestContext,
  createUserParamsFn: (email: string) => CreateUserParams,
  emailPrefix = 'sb_user'
): Promise<{ email: string; signUpResponse: SignUpResponse }> {
  const email = uniqueEmail(emailPrefix);
  const userParams = createUserParamsFn(email);
  const signUpResponse = await createUserViaAPI(request, userParams);
  return { email, signUpResponse };
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
