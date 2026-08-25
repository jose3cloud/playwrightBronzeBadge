import { APIRequestContext } from '@playwright/test';
import { createUser, deleteUser } from '@pw-gold/api/userApi';
import { createContact } from '@pw-gold/api/contactApi';
import { buildUser, buildContact } from '@pw-gold/data/testData';
import type { Contact, CreatedUser } from '@pw-gold/utils/types';

/**
 * Orchestrates API setup for E2E tests (service layer).
 * Pages stay UI-only; API modules stay HTTP-only.
 * If contact create fails after user create, the user is deleted so shared env stays clean.
 */
export async function createUserWithContact(request: APIRequestContext): Promise<{
  user: CreatedUser;
  contact: Contact;
}> {
  const userData = buildUser();
  const signUp = await createUser(request, userData);

  try {
    const contact = await createContact(request, signUp.token, buildContact());
    return {
      user: {
        email: userData.email,
        password: userData.password,
        token: signUp.token,
        userId: signUp.user._id,
      },
      contact,
    };
  } catch (error) {
    await deleteUser(request, signUp.token);
    throw error;
  }
}
