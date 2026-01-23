import { APIRequestContext, expect } from '@playwright/test';
import { SignUpResponse, CreateUserParams } from '../utils/types';
import { uniqueEmail } from '../utils/helpers';
import { defaultPassword } from '../utils/constants';

/**
 * Creates a user via API and returns the response body.
 * Validates the response status and basic schema.
 */
export async function createUserViaAPI(
  request: APIRequestContext,
  params: CreateUserParams
): Promise<SignUpResponse> {
  const email = params.email || uniqueEmail('sb_user');
  const password = params.password || defaultPassword;

  const res = await request.post('/users', {
    data: {
      firstName: params.firstName,
      lastName: params.lastName,
      email,
      password,
    },
  });

  expect(res.status(), await res.text()).toBe(201);
  const body = (await res.json()) as SignUpResponse;
  return body;
}
