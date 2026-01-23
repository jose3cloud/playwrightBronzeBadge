import { expect } from '@playwright/test';
import { SignUpResponse, Contact } from '../utils/types';

/**
 * Validates a SignUpResponse has the expected schema and key fields.
 */
export function validateSignUpResponse(
  body: SignUpResponse,
  expected: { firstName: string; lastName: string; email: string }
): void {
  // Schema validation
  expect(body).toHaveProperty('user');
  expect(body).toHaveProperty('token');
  expect(typeof body.token).toBe('string');
  expect(body.token.length).toBeGreaterThan(20);

  expect(body.user).toHaveProperty('_id');
  expect(body.user).toHaveProperty('firstName');
  expect(body.user).toHaveProperty('lastName');
  expect(body.user).toHaveProperty('email');

  // Key field validation
  expect(body.user.firstName).toBe(expected.firstName);
  expect(body.user.lastName).toBe(expected.lastName);
  expect(body.user.email).toBe(expected.email);
}

/**
 * Validates a Contact has the expected schema and key fields.
 */
export function validateContact(
  contact: Contact,
  expected: { firstName: string; lastName: string; email: string; owner: string }
): void {
  // Schema validation
  expect(contact).toHaveProperty('_id');
  expect(contact).toHaveProperty('owner');
  expect(contact).toHaveProperty('firstName');
  expect(contact).toHaveProperty('lastName');
  expect(contact).toHaveProperty('email');

  // Key field validation
  expect(contact.firstName).toBe(expected.firstName);
  expect(contact.lastName).toBe(expected.lastName);
  expect(contact.email).toBe(expected.email);
  expect(contact.owner).toBe(expected.owner);
}
