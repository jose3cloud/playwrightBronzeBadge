import { test, expect } from '../fixtures/silverBadgeFixtures';

type SignUpResponse = {
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  token: string;
};

type Contact = {
  _id: string;
  firstName: string;
  lastName: string;
  birthdate: string;
  email: string;
  phone: string;
  street1: string;
  street2: string;
  city: string;
  stateProvince: string;
  postalCode: string;
  country: string;
  owner: string;
};

function uniqueEmail(prefix = 'sb_api') {
  return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 100000)}@example.com`;
}

const defaultPassword = 'P@ssw0rd123!';

test('API: Use request context to sign up user + validate schema/status/key fields', async ({ request }) => {
  const email = uniqueEmail('sb_signup');

  const res = await request.post('/users', {
    data: {
      firstName: 'Silver',
      lastName: 'Badge',
      email,
      password: defaultPassword,
    },
  });

  expect(res.status(), await res.text()).toBe(201);

  const body = (await res.json()) as SignUpResponse;

  // "Schema" validation (shape + basic type checks)
  expect(body).toHaveProperty('user');
  expect(body).toHaveProperty('token');
  expect(typeof body.token).toBe('string');
  expect(body.token.length).toBeGreaterThan(20);

  expect(body.user).toHaveProperty('_id');
  expect(body.user).toHaveProperty('firstName');
  expect(body.user).toHaveProperty('lastName');
  expect(body.user).toHaveProperty('email');

  // Key field validation
  expect(body.user.firstName).toBe('Silver');
  expect(body.user.lastName).toBe('Badge');
  expect(body.user.email).toBe(email);
});

test('API: Create contact via API + validate schema/status/key fields', async ({ request }) => {
  const email = uniqueEmail('sb_user');
  const signUpRes = await request.post('/users', {
    data: { firstName: 'Api', lastName: 'Owner', email, password: defaultPassword },
  });
  expect(signUpRes.status(), await signUpRes.text()).toBe(201);
  const signUpBody = (await signUpRes.json()) as SignUpResponse;

  const contactPayload = {
    firstName: 'Api',
    // Contact API enforces max length 20 for lastName
    lastName: `Created${Math.floor(Math.random() * 10000)}`,
    birthdate: '1990-01-01',
    email: uniqueEmail('sb_contact'),
    phone: '5555555555',
    street1: '1 Main St',
    street2: '',
    city: 'Austin',
    stateProvince: 'TX',
    postalCode: '73301',
    country: 'USA',
  };

  const createRes = await request.post('/contacts', {
    headers: { Authorization: `Bearer ${signUpBody.token}` },
    data: contactPayload,
  });

  expect(createRes.status(), await createRes.text()).toBe(201);

  const created = (await createRes.json()) as Contact;

  // "Schema" validation
  expect(created).toHaveProperty('_id');
  expect(created).toHaveProperty('owner');
  expect(created).toHaveProperty('firstName');
  expect(created).toHaveProperty('lastName');
  expect(created).toHaveProperty('email');

  // Key field validation
  expect(created.firstName).toBe(contactPayload.firstName);
  expect(created.lastName).toBe(contactPayload.lastName);
  expect(created.email).toBe(contactPayload.email);
  expect(created.owner).toBe(signUpBody.user._id);
});

test('API → UI: Create contact via API, then verify it appears in UI', async ({
  request,
  loginPage,
  contactListPage,
  page,
}) => {
  // 1) Create user via API (direct API call)
  const email = uniqueEmail('sb_chain_user');
  const signUpRes = await request.post('/users', {
    data: { firstName: 'Chain', lastName: 'User', email, password: defaultPassword },
  });
  expect(signUpRes.status(), await signUpRes.text()).toBe(201);
  const signUpBody = (await signUpRes.json()) as SignUpResponse;

  // 2) Create contact via API (direct API call)
  const contactFirstName = 'ApiChain';
  // Contact API enforces max length 20 for lastName
  const contactLastName = `Contact${Math.floor(Math.random() * 10000)}`;

  const createRes = await request.post('/contacts', {
    headers: { Authorization: `Bearer ${signUpBody.token}` },
    data: {
      firstName: contactFirstName,
      lastName: contactLastName,
      birthdate: '1990-01-01',
      email: uniqueEmail('sb_chain_contact'),
      phone: '5555555555',
      street1: '1 Main St',
      street2: '',
      city: 'Austin',
      stateProvince: 'TX',
      postalCode: '73301',
      country: 'USA',
    },
  });
  expect(createRes.status(), await createRes.text()).toBe(201);

  // 3) Verify in UI
  await loginPage.goto();
  await loginPage.login(email, defaultPassword);

  await expect(page).toHaveURL(/contactList/i);
  await expect(contactListPage.addContactButton).toBeVisible();

  await expect(contactListPage.contactByName(contactFirstName, contactLastName)).toBeVisible();
});

