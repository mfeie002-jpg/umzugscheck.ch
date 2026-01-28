import { Page } from 'playwright';

const fakeDataByField = (label: string, type: string): string => {
  const normalized = `${label} ${type}`.toLowerCase();
  if (normalized.includes('email')) return 'test.user@example.com';
  if (normalized.includes('phone') || normalized.includes('telefon')) return '+41 44 123 45 67';
  if (normalized.includes('zip') || normalized.includes('plz') || normalized.includes('postal')) return '8001';
  if (normalized.includes('city') || normalized.includes('stadt')) return 'Z\u00fcrich';
  if (normalized.includes('date') || normalized.includes('datum')) return '2026-02-15';
  if (normalized.includes('name')) return '[TEST] Alex Muster';
  if (normalized.includes('address') || normalized.includes('strasse') || normalized.includes('street')) return 'Teststrasse 1';
  if (normalized.includes('company')) return 'Test AG';
  if (normalized.includes('budget') || normalized.includes('price') || normalized.includes('preis')) return '1500';
  return 'test_data';
};

export const fillVisibleInputs = async (page: Page): Promise<number> => {
  const inputs = page.locator('input:not([type="hidden"]), select, textarea');
  const count = await inputs.count();
  let filled = 0;

  for (let i = 0; i < count; i += 1) {
    const input = inputs.nth(i);
    if (!(await input.isVisible())) continue;
    const type = (await input.getAttribute('type')) || '';
    const name = (await input.getAttribute('name')) || '';
    const aria = (await input.getAttribute('aria-label')) || '';
    const placeholder = (await input.getAttribute('placeholder')) || '';
    const label = [name, aria, placeholder].filter(Boolean).join(' ');

    try {
      if (type === 'checkbox' || type === 'radio') {
        await input.check({ force: true });
      } else if (await input.evaluate((el) => el.tagName.toLowerCase() === 'select')) {
        await input.selectOption({ index: 1 }).catch(() => input.selectOption({ index: 0 }));
      } else {
        await input.fill(fakeDataByField(label, type));
      }
      filled += 1;
    } catch {
      // ignore read-only or non-interactable fields
    }
  }

  return filled;
};
