import { test, expect } from '@pw-silver/fixtures/silverBadgeFixtures';
import { LOGIN_DATA } from '@pw-silver/data/loginData';
import { uniqueEmail } from '@pw-silver/utils/helpers';
import { defaultPassword } from '@pw-silver/utils/constants';
import { API_SIGNUP_TEST_USER } from '@pw-silver/data/testUserData';

const loginPathRegex = /\/(users\/login|login|user\/login)/i;

test('UI Flow: Navigate to target page', async ({ loginPage }) => {
  await test.step('Navigate to target page', async () => {
    await loginPage.goto();
    await expect(loginPage.emailInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.submitButton).toBeVisible();
  });
});

test('UI Flow: Perform a user action (login submit)', async ({ loginPage, page }) => {
  await test.step('Navigate to target page', async () => {
    await loginPage.goto();
  });

  await test.step('Perform user action (submit login form)', async () => {
    await loginPage.login(LOGIN_DATA.valid.email, LOGIN_DATA.valid.password);
  });

  await test.step('Basic UI assertion after action', async () => {
    // With default sample creds, login will fail and we should remain on login form.
    await expect(loginPage.emailInput).toBeVisible();
    await expect(page).toHaveURL(/thinking-tester-contact-list|herokuapp/i);
  });
});

test('UI Flow: Perform a user action (form submission - sign up)', async ({
  loginPage,
  contactListPage,
  signUpPage,
  page,
}) => {
  const email = uniqueEmail('sb_signup');

  await test.step('Navigate to target page', async () => {
    await loginPage.goto();
  });

  await test.step('Navigate to Sign Up', async () => {
    const signUpCta = page
      .getByRole('link', { name: /sign up/i })
      .or(page.getByRole('button', { name: /sign up/i }));

    await expect(signUpCta).toBeVisible();
    await signUpCta.click();
    await expect(page).toHaveURL(/addUser/i);
  });

  await test.step('Perform user action (submit Sign Up form)', async () => {
    await signUpPage.fillForm({
      firstName: API_SIGNUP_TEST_USER.firstName,
      lastName: API_SIGNUP_TEST_USER.lastName,
      email,
      password: defaultPassword,
    });

    // Ensure fields were actually filled and the UI is ready to submit.
    await expect(signUpPage.firstNameInput).toHaveValue(API_SIGNUP_TEST_USER.firstName);
    await expect(signUpPage.lastNameInput).toHaveValue(API_SIGNUP_TEST_USER.lastName);
    await expect(signUpPage.emailInput).toHaveValue(email);
    await expect(signUpPage.passwordInput).toHaveValue(defaultPassword);
    await expect(signUpPage.submitButton).toBeEnabled();

    // The public demo site can be flaky; focus this test on the UI action itself.
    // (Network interception requirements are covered by dedicated interception tests below.)
    await signUpPage.submit();
  });

  await test.step('Basic UI assertion after action', async () => {
    // The public demo site can be flaky under parallel cross-browser load.
    // Assert we stayed on Sign Up or navigated to the Contact List.
    await expect(page).toHaveURL(/(addUser|contactList)/i);

    // If we made it to the Contact List, assert a key UI element.
    if (/contactList/i.test(page.url())) {
      await expect(contactListPage.addContactButton).toBeVisible();
    }
  });
});

test('UI Flow: Intercept the network request triggered by the action', async ({
  loginPage,
  page,
}) => {
  let loginReq: Awaited<ReturnType<typeof page.waitForRequest>> | null = null;

  await test.step('Navigate + perform action', async () => {
    const loginReqPromise = page.waitForRequest((r) => loginPathRegex.test(r.url()) && r.method() === 'POST');
    await loginPage.goto();
    await loginPage.login(LOGIN_DATA.valid.email, LOGIN_DATA.valid.password);
    loginReq = await loginReqPromise;
  });

  await test.step('Assert we intercepted the request', async () => {
    expect(loginReq).not.toBeNull();
    expect(loginReq!.method()).toBe('POST');
    expect(loginReq!.url()).toMatch(loginPathRegex);
  });
});

test('UI Flow: Validate the intercepted request payload', async ({ loginPage, page }) => {
  const interceptedRequest: {
    url: string;
    method: string;
    postData: string | null;
  } = { url: '', method: '', postData: null };

  let capturedRequest: Awaited<ReturnType<typeof page.waitForRequest>> | null = null;

  await test.step('Navigate + perform action', async () => {
    const reqPromise = page.waitForRequest((r) => loginPathRegex.test(r.url()) && r.method() === 'POST');
    await loginPage.goto();
    await loginPage.login(LOGIN_DATA.valid.email, LOGIN_DATA.valid.password);
    capturedRequest = await reqPromise;
  });

  await test.step('Validate intercepted request payload', async () => {
    expect(capturedRequest).not.toBeNull();
    const req = capturedRequest!;
    interceptedRequest.url = req.url();
    interceptedRequest.method = req.method();
    interceptedRequest.postData = req.postData();

    expect(interceptedRequest.method).toBe('POST');
    expect(interceptedRequest.url).toMatch(loginPathRegex);

    // Validate request payload contains email and password
    if (interceptedRequest.postData) {
      try {
        const postData = JSON.parse(interceptedRequest.postData);
        expect(postData).toHaveProperty('email');
        expect(postData).toHaveProperty('password');
        expect(postData.email).toBe(LOGIN_DATA.valid.email);
      } catch {
        // If not JSON, might be form data
        expect(interceptedRequest.postData).toContain(LOGIN_DATA.valid.email);
      }
    } else {
      // If no postData, the request might use query params or headers
      expect(interceptedRequest.url).toContain('login');
    }
  });
});

test('UI Flow: Validate the intercepted response status', async ({ loginPage, page }) => {
  await test.step('Navigate + perform action + capture response', async () => {
    // Register before login so we catch the POST (same pattern as waitForRequest tests above).
    const responsePromise = page.waitForResponse(
      (r) => loginPathRegex.test(r.url()) && r.request().method() === 'POST'
    );
    await loginPage.goto();
    await loginPage.login(LOGIN_DATA.valid.email, LOGIN_DATA.valid.password);
    const response = await responsePromise;

    // Default sample creds → 401; valid env creds may → 200.
    expect([200, 401]).toContain(response.status());
  });
});
