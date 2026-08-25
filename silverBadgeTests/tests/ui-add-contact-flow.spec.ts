import { test, expect } from '@pw-silver/fixtures/silverBadgeFixtures';
import { uniqueEmail, createUserWithUniqueEmail } from '@pw-silver/utils/helpers';
import { defaultPassword } from '@pw-silver/utils/constants';
import { createAddContactUserParams, createAddContactFormParams } from '@pw-silver/data/testUserData';

test('UI Flow: Add a New Contact (UI form submission)', async ({
  request,
  loginPage,
  contactListPage,
  addContactPage,
  page,
}) => {
  let userEmail: string;
  let firstName: string;
  let lastName: string;

  await test.step('Create user via API', async () => {
    // Create a fresh user via API so UI login is deterministic
    const result = await createUserWithUniqueEmail(request, createAddContactUserParams, 'sb_add_contact_user');
    userEmail = result.email;
  });

  await test.step('Login via UI', async () => {
    await loginPage.goto();
    await loginPage.login(userEmail, defaultPassword);
    await expect(page).toHaveURL(/contactList/i);
    await expect(contactListPage.addContactButton).toBeVisible();
  });

  await test.step('Navigate to Add Contact form', async () => {
    // Start Add Contact flow
    await contactListPage.addContactButton.click();
    await expect(page).toHaveURL(/addContact/i);

    // Best-effort: if the page script is loaded over the network, wait for it;
    // if it's cached, this won't fire and we continue.
    // Uses project-level actionTimeout (configured in playwright.config.ts)
    await page
      .waitForResponse((r) => r.url().includes('addContact.js') && r.status() < 400)
      .catch(() => {});

    // Wait for form to be ready
    await addContactPage.waitForFormReady();
    await expect(addContactPage.submitButton).toBeEnabled();
  });

  await test.step('Fill and submit contact form', async () => {
    firstName = `Ui${Math.floor(Math.random() * 10000)}`;
    lastName = `Contact${Math.floor(Math.random() * 10000)}`; // keep <= 20 chars
    const contactEmail = uniqueEmail('sb_ui_contact');

    // Fill the contact form
    const addContactFormParams = createAddContactFormParams(firstName, lastName, contactEmail);
    await addContactPage.fillForm(addContactFormParams);

    // Required fields must be filled or the app will stay on /addContact
    await expect(addContactPage.firstNameInput).toHaveValue(firstName);
    await expect(addContactPage.lastNameInput).toHaveValue(lastName);

    // Optional: if we catch the create request, assert payload names.
    // Uses project-level actionTimeout (configured in playwright.config.ts)
    const createReqPromise = page
      .waitForRequest((r) => {
        const url = new URL(r.url());
        return (url.pathname === '/contacts' || url.pathname === '/contacts/') && r.method() === 'POST';
      })
      .catch(() => null);

    await addContactPage.submit();

    const createReq = await createReqPromise;
    if (createReq) {
      const postData = createReq.postData() || '';
      expect(postData).toContain(firstName);
      expect(postData).toContain(lastName);
    }

    // Required: land on contact list and show the new contact
    await expect(page).toHaveURL(/contactList/i);
    await expect(contactListPage.contactByName(firstName, lastName)).toBeVisible();
  });
});

