import { uniqueEmail } from '@pw-gold/utils/helpers';
import { DEFAULT_PASSWORD } from '@pw-gold/utils/constants';

/** Minimal test-data factory — keep data construction here, not in tests. */
export function buildUser(prefix = 'gold_user') {
  return {
    firstName: 'Gold',
    lastName: 'User',
    email: uniqueEmail(prefix),
    password: DEFAULT_PASSWORD,
  };
}

export function buildContact(ownerPrefix = 'gold_contact') {
  const suffix = Math.floor(Math.random() * 10000);
  return {
    firstName: 'GoldApi',
    lastName: `Contact${suffix}`, // API max lastName length is 20
    email: uniqueEmail(ownerPrefix),
  };
}
