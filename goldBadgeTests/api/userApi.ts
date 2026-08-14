import { APIRequestContext, expect } from '@playwright/test';
import type { SignUpResponse } from '@pw-gold/utils/types';

/** HTTP-only: create a user. No UI, no orchestration. */
export async function createUser(
  request: APIRequestContext,
  data: { firstName: string; lastName: string; email: string; password: string }
): Promise<SignUpResponse> {
  const res = await request.post('/users', { data });
  expect(res.status(), await res.text()).toBe(201);
  return (await res.json()) as SignUpResponse;
}
