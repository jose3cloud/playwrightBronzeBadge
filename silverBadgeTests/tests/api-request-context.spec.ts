import { test, expect } from '../fixtures/silverBadgeFixtures';
import { createUserViaAPI } from '../api/userApi';
import { createContactPayload, uniqueEmail } from '../utils/helpers';
import { validateSignUpResponse, validateContact } from '../validators/responseValidators';
import { defaultPassword } from '../utils/constants';
import {
  createApiSignUpUserParams,
  createApiContactUserParams,
  createApiContactParams,
  createApiChainUserParams,
  createApiChainContactParams,
  API_SIGNUP_TEST_USER,
} from '../data/testUserData';
import type { Contact } from '../utils/types';

test('API: Use request context to sign up user + validate schema/status/key fields', async ({ request }) => {
  const email = uniqueEmail('sb_signup');
  const apiSignUpUserParams = createApiSignUpUserParams(email);
  const body = await createUserViaAPI(request, apiSignUpUserParams);

  validateSignUpResponse(body, {
    firstName: API_SIGNUP_TEST_USER.firstName,
    lastName: API_SIGNUP_TEST_USER.lastName,
    email,
  });
});

test('API: Create contact via API + validate schema/status/key fields', async ({ request }) => {
  const email = uniqueEmail('sb_user');
  const apiContactUserParams = createApiContactUserParams(email);
  const signUpBody = await createUserViaAPI(request, apiContactUserParams);

  // Contact API enforces max length 20 for lastName
  const contactLastName = `Created${Math.floor(Math.random() * 10000)}`;
  const contactEmail = uniqueEmail('sb_contact');
  const apiContactParams = createApiContactParams(contactLastName, contactEmail);
  const contactPayload = createContactPayload(apiContactParams);

  const createRes = await request.post('/contacts', {
    headers: { Authorization: `Bearer ${signUpBody.token}` },
    data: contactPayload,
  });

  expect(createRes.status(), await createRes.text()).toBe(201);
  const created = (await createRes.json()) as Contact;

  validateContact(created, {
    firstName: contactPayload.firstName,
    lastName: contactPayload.lastName,
    email: contactPayload.email,
    owner: signUpBody.user._id,
  });
});

test('API → UI: Create contact via API, then verify it appears in UI', async ({
  request,
  loginPage,
  contactListPage,
  page,
}) => {
  // 1) Create user via API
  const email = uniqueEmail('sb_chain_user');
  const apiChainUserParams = createApiChainUserParams(email);
  const signUpBody = await createUserViaAPI(request, apiChainUserParams);

  // 2) Create contact via API
  const contactFirstName = 'ApiChain';
  // Contact API enforces max length 20 for lastName
  const contactLastName = `Contact${Math.floor(Math.random() * 10000)}`;
  const contactEmail = uniqueEmail('sb_chain_contact');
  const apiChainContactParams = createApiChainContactParams(contactFirstName, contactLastName, contactEmail);
  const contactPayload = createContactPayload(apiChainContactParams);

  const createRes = await request.post('/contacts', {
    headers: { Authorization: `Bearer ${signUpBody.token}` },
    data: contactPayload,
  });
  expect(createRes.status(), await createRes.text()).toBe(201);

  // 3) Verify in UI
  await loginPage.goto();
  await loginPage.login(email, defaultPassword);

  await expect(page).toHaveURL(/contactList/i);
  await expect(contactListPage.addContactButton).toBeVisible();
  await expect(contactListPage.contactList).toBeVisible();

  await expect(contactListPage.contactByName(contactFirstName, contactLastName)).toBeVisible();
});

