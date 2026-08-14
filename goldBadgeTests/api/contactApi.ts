import { APIRequestContext, expect } from '@playwright/test';
import type { Contact } from '@pw-gold/utils/types';

/** HTTP-only: create a contact. No UI, no orchestration. */
export async function createContact(
  request: APIRequestContext,
  token: string,
  data: { firstName: string; lastName: string; email: string }
): Promise<Contact> {
  const res = await request.post('/contacts', {
    headers: { Authorization: `Bearer ${token}` },
    data,
  });
  expect(res.status(), await res.text()).toBe(201);
  return (await res.json()) as Contact;
}
