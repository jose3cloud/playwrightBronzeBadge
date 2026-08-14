import { APIRequestContext } from '@playwright/test';
import { createUser } from '@pw-gold/api/userApi';
import { createContact } from '@pw-gold/api/contactApi';
import { buildUser, buildContact } from '@pw-gold/data/testData';
import type { Contact, CreatedUser } from '@pw-gold/utils/types';

/**
 * Orchestrates API setup for E2E tests (service layer).
 * Pages stay UI-only; API modules stay HTTP-only.
 */
export async function createUserWithContact(request: APIRequestContext): Promise<{
  user: CreatedUser;
  contact: Contact;
}> {
  const userData = buildUser();
  const signUp = await createUser(request, userData);
  const contactData = buildContact();
  const contact = await createContact(request, signUp.token, contactData);

  return {
    user: {
      email: userData.email,
      password: userData.password,
      token: signUp.token,
      userId: signUp.user._id,
    },
    contact,
  };
}
