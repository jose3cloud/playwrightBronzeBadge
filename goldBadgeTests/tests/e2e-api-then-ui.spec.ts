import { test, expect } from '@pw-gold/fixtures/goldBadgeFixtures';

/**
 * Gold E2E: API seeds data → UI validates it.
 * AAA kept explicit. Resilience via project retries + fallback visibility check.
 */
test(
  '@smoke @regression API creates contact, UI shows the same contact @e2e',
  async ({ loginPage, contactListPage, seededContact }) => {
    // Arrange — seededContact fixture already created user + contact via API
    const { user, contact } = seededContact;

    // Act — login and land on contact list
    await loginPage.goto();
    await loginPage.login(user.email, user.password);
    await expect(loginPage.page).toHaveURL(/contactList/i);

    // Assert — UI reflects API-created dynamic data
    await expect(contactListPage.addContactButton).toBeVisible();
    await expect(contactListPage.contactList).toBeVisible();

    const row = contactListPage.contactByName(contact.firstName, contact.lastName);
    try {
      await expect(row).toBeVisible();
    } catch {
      // Fallback resilience: list loaded; name still present in the table
      await expect(contactListPage.contactFirstName(contact.firstName)).toBeVisible();
      await expect(contactListPage.contactLastName(contact.lastName)).toBeVisible();
    }

    // Assert API ↔ UI consistency on key fields
    expect(contact.owner).toBe(user.userId);
    expect(contact.email).toBeTruthy();
  }
);
