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

/** HTTP-only: delete the authenticated user (cascades their contacts). */
export async function deleteUser(request: APIRequestContext, token: string): Promise<void> {
  const res = await request.delete('/users/me', {
    headers: { Authorization: `Bearer ${token}` },
  });
  expect(res.status(), await res.text()).toBe(200);
}
