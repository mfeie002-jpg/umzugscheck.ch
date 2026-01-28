import { Page } from 'playwright';

const fieldMappings: Record<string, string[]> = {
  email: ['email', 'emailaddress', 'contact', 'sender'],
  name: ['name', 'fullname', 'yourname'],
  firstName: ['firstname', 'givenname', 'vorname'],
  lastName: ['lastname', 'surname', 'familyname'],
  phone: ['phone', 'telephone', 'tel', 'mobilenumber', 'handy'],
  address: ['address', 'street', 'streetaddress', 'strasse'],
  city: ['city', 'town', 'ort', 'localité'],
  zip: ['zip', 'postal', 'plz', 'code', 'postalcode'],
  company: ['company', 'companyname', 'firma', 'entreprise'],
};

export async function fillFormFields(page: Page, fakeData: Record<string, string>) {
  const inputs = await page.locator('input, textarea').all();

  for (const input of inputs) {
    const name = (await input.getAttribute('name')) || '';
    const id = (await input.getAttribute('id')) || '';
    const placeholder = (await input.getAttribute('placeholder')) || '';
    const label = await input.evaluate((el) => {
      const label = document.querySelector(`label[for="${el.id}"]`);
      return label?.textContent || '';
    });

    const allText = `${name} ${id} ${placeholder} ${label}`.toLowerCase();

    for (const [dataKey, patterns] of Object.entries(fieldMappings)) {
      if (patterns.some((p) => allText.includes(p))) {
        const value = fakeData[dataKey] || '';
        if (value) {
          await input.fill(value);
          break;
        }
      }
    }
  }
}
