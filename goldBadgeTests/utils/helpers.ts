export function uniqueEmail(prefix = 'gold'): string {
  return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 100000)}@example.com`;
}
