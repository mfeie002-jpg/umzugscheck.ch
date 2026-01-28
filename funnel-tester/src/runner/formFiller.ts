import { Page } from 'playwright';

const fakeDataByField = (label: string, type: string): string => {
  const normalized = `${label} ${type}`.toLowerCase();
  if (normalized.includes('email')) return 'test.user@example.com';
  if (normalized.includes('phone') || normalized.includes('telefon')) return '+41 44 123 45 67';
  if (normalized.includes('zip') || normalized.includes('plz') || normalized.includes('postal')) return '8001';
  if (normalized.includes('city') || normalized.includes('stadt')) return 'Zurich';
  if (normalized.includes('date') || normalized.includes('datum')) return '2026-02-15';
  if (normalized.includes('name')) return '[TEST] Alex Muster';
  if (normalized.includes('address') || normalized.includes('strasse') || normalized.includes('street')) return 'Teststrasse 1';
  if (normalized.includes('company')) return 'Test AG';
  if (normalized.includes('budget') || normalized.includes('price') || normalized.includes('preis')) return '1500';
  return 'test_data';
};

export const fillVisibleInputs = async (page: Page): Promise<number> => {
  let handles: import('playwright').ElementHandle<Node>[] = [];
  try {
    handles = await page
      .locator('input:not([type="hidden"]), select, textarea')
      .elementHandles();
  } catch {
    return 0;
  }

  let filled = 0;

  for (const handle of handles) {
    try {
      if (!(await handle.isVisible())) continue;
      const type = (await handle.getAttribute('type')) || '';
      const name = (await handle.getAttribute('name')) || '';
      const aria = (await handle.getAttribute('aria-label')) || '';
      const placeholder = (await handle.getAttribute('placeholder')) || '';
      const label = [name, aria, placeholder].filter(Boolean).join(' ');

      if (type === 'checkbox' || type === 'radio') {
        await handle.check({ force: true });
      } else {
        const tag = await handle.evaluate((el) => (el as Element).tagName.toLowerCase());
        if (tag === 'select') {
          await handle.selectOption({ index: 1 }).catch(() => handle.selectOption({ index: 0 }));
        } else {
          await handle.fill(fakeDataByField(label, type));
        }
      }
      filled += 1;
    } catch {
      // ignore read-only or non-interactable fields
    }
  }

  return filled;
};



