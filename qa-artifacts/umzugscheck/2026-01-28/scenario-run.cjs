const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const baseURL = 'https://umzugscheck.ch';
const runDate = '2026-01-28';
const outDir = path.join(__dirname, '..', 'qa-artifacts', 'umzugscheck', runDate, 'scenarios');
fs.mkdirSync(outDir, { recursive: true });

const scenarios = [
  {
    id: 's1-umzug-zug',
    name: 'Szenario 1: Umzug Kanton Zug',
    start: '/',
    data: {
      firstName: 'Automation',
      lastName: 'Test-Agent',
      email: 'test-agent+umzug@gmail.com',
      phone: '079 000 00 00',
      note: 'Dies ist ein automatisierter Test. Bitte ignorieren.',
      from_postal: '8000',
      to_postal: '6300',
      from_city: 'Zuerich',
      to_city: 'Zug',
      rooms: '3.5',
      date: nextMonthDateISO(15),
      dateDots: nextMonthDateDots(15),
    },
  },
  {
    id: 's2-reinigung-bern',
    name: 'Szenario 2: Nur Reinigung',
    start: '/',
    data: {
      firstName: 'Automation',
      lastName: 'Test-Agent',
      email: 'test-agent+reinigung@gmail.com',
      phone: '079 000 00 00',
      note: 'Dies ist ein automatisierter Test. Bitte ignorieren.',
      from_postal: '3000',
      to_postal: '3000',
      from_city: 'Bern',
      to_city: 'Bern',
      rooms: '2.5',
      date: nextMonthDateISO(18),
      dateDots: nextMonthDateDots(18),
    },
    cleaningOnly: true,
  },
  {
    id: 's3-umzug-lagerung',
    name: 'Szenario 3: Umzug + Lagerung',
    start: '/',
    data: {
      firstName: 'Automation',
      lastName: 'Test-Agent',
      email: 'test-agent+kombi@gmail.com',
      phone: '079 000 00 00',
      note: 'Dies ist ein automatisierter Test. Bitte ignorieren.',
      from_postal: '4000',
      to_postal: '5000',
      from_city: 'Basel',
      to_city: 'Aarau',
      rooms: '3.0',
      date: nextMonthDateISO(20),
      dateDots: nextMonthDateDots(20),
    },
    addOns: true,
  },
];

(async () => {
  const browser = await chromium.launch({ headless: true });
  const results = [];

  for (const scenario of scenarios) {
    const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
    const page = await context.newPage();
    page.setDefaultTimeout(10000);
    page.setDefaultNavigationTimeout(20000);

    const steps = [];
    const consoleErrors = [];
    const visitedUrls = [];
    const screenshots = [];
    let blocker = null;
    let success = false;
    const startTime = Date.now();

    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    page.on('framenavigated', (frame) => {
      if (frame === page.mainFrame()) visitedUrls.push(frame.url());
    });

    const takeShot = async (label) => {
      const file = path.join(outDir, `${scenario.id}_${label}.png`);
      await page.screenshot({ path: file, fullPage: false }).catch(() => {});
      screenshots.push(file);
    };

    try {
      await page.goto(`${baseURL}${scenario.start}`, { waitUntil: 'domcontentloaded' });
      await acceptCookies(page);
      await takeShot('00-start');
      steps.push('Startseite geladen');

      if (scenario.cleaningOnly) {
        const navOk = await goToCleaning(page);
        steps.push(navOk ? 'Navigation zu Reinigung geklickt' : 'Direkt zu /reinigung navigiert');
        await takeShot('01-cleaning');
      }

      for (let i = 0; i < 6; i += 1) {
        await acceptCookies(page);
        await fillVisibleFields(page, scenario.data, steps);
        if (scenario.cleaningOnly) {
          await selectCleaningOnly(page, steps);
        }
        if (scenario.addOns) {
          await selectAddons(page, steps);
        }

        if (i === 0) {
          await invalidInputCheck(page, steps);
        }

        const cta = await findPrimaryCTA(page);
        if (!cta) {
          blocker = 'Kein Primary CTA gefunden';
          await takeShot(`step-${i + 1}-no-cta`);
          break;
        }

        await takeShot(`step-${i + 1}`);
        const ctaText = await cta.textContent().catch(() => 'CTA');
        steps.push(`CTA geklickt: ${ctaText && ctaText.trim() ? ctaText.trim() : 'CTA'}`);
        await cta.click().catch(() => {});
        await waitForSoftNav(page);

        if (await isGoalPage(page)) {
          success = true;
          await takeShot('goal');
          steps.push('Zielseite erkannt');
          break;
        }

        if (await isErrorPage(page)) {
          blocker = 'Fehlerseite erkannt';
          await takeShot('error');
          break;
        }
      }

      if (!success && !blocker) {
        blocker = 'Zielseite nicht erreicht';
      }

      await page.goBack().catch(() => {});
      await waitShort();
      await takeShot('back');
      steps.push('Zurueck-Button getestet');

      await page.reload().catch(() => {});
      await waitShort();
      await takeShot('refresh');
      steps.push('Refresh getestet');
    } catch (err) {
      blocker = `Exception: ${String(err)}`;
      await takeShot('exception');
    } finally {
      const durationSec = Math.round((Date.now() - startTime) / 1000);
      results.push({
        scenario: scenario.name,
        status: success ? 'ERFOLG' : 'FEHLGESCHLAGEN',
        durationSec,
        blocker,
        steps,
        consoleErrors,
        visitedUrls: unique(visitedUrls),
        screenshots,
      });
      await context.close().catch(() => {});
    }
  }

  const outPath = path.join(outDir, 'scenario-results.json');
  fs.writeFileSync(outPath, JSON.stringify({ baseURL, runDate, results }, null, 2));
  await browser.close();
})();

function unique(arr) {
  return [...new Set(arr)];
}

function nextMonthDateISO(day) {
  const now = new Date();
  const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, day));
  return d.toISOString().slice(0, 10);
}

function nextMonthDateDots(day) {
  const now = new Date();
  const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, day));
  const dd = String(d.getUTCDate()).padStart(2, '0');
  const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
  const yyyy = d.getUTCFullYear();
  return `${dd}.${mm}.${yyyy}`;
}

async function waitShort() {
  return new Promise((r) => setTimeout(r, 500));
}

async function waitForSoftNav(page) {
  await Promise.race([
    page.waitForLoadState('domcontentloaded', { timeout: 8000 }).catch(() => {}),
    new Promise((r) => setTimeout(r, 900)),
  ]);
}

async function acceptCookies(page) {
  const buttons = page.locator('button, a').filter({
    hasText: /akzeptieren|alle akzeptieren|zustimmen|verstanden|accept|agree|ok/i,
  });
  if ((await buttons.count()) > 0) {
    const btn = buttons.first();
    if (await btn.isVisible().catch(() => false)) {
      await btn.click().catch(() => {});
    }
  }
}

async function goToCleaning(page) {
  const link = page.getByRole('link').filter({ hasText: /reinigung|umzugsreinigung|cleaning/i });
  if ((await link.count()) > 0) {
    await link.first().click().catch(() => {});
    await waitForSoftNav(page);
    return true;
  }
  await page.goto('https://umzugscheck.ch/reinigung', { waitUntil: 'domcontentloaded' }).catch(() => {});
  return false;
}

async function selectCleaningOnly(page, steps) {
  const option = page.locator('label, button, div').filter({
    hasText: /nur.*reinigung|reinigung.*ohne|ohne.*umzug|reinigung/i,
  });
  if ((await option.count()) > 0) {
    await option.first().click().catch(() => {});
    steps.push('Option Reinigung (ohne Umzug) ausgewaehlt');
  }
}

async function selectAddons(page, steps) {
  const option = page.locator('label, button, div').filter({
    hasText: /lager|lagerung|einlagerung|moebellift|möbellift|lift/i,
  });
  if ((await option.count()) > 0) {
    await option.first().click().catch(() => {});
    steps.push('Addon (Lagerung/Moebellift) ausgewaehlt');
  }
}

async function findPrimaryCTA(page) {
  const patterns = /offerte|offerten|weiter|fortsetzen|start|anfrage|senden|submit|preis|berechnen|video|upload|jetzt|kostenlos|gratis|angebot/i;
  const buttons = page.getByRole('button').filter({ hasText: patterns });
  if ((await buttons.count()) > 0) {
    const btn = buttons.first();
    if (await btn.isVisible().catch(() => false)) return btn;
  }
  const links = page.getByRole('link').filter({ hasText: patterns });
  if ((await links.count()) > 0) {
    const link = links.first();
    if (await link.isVisible().catch(() => false)) return link;
  }
  return null;
}

async function invalidInputCheck(page, steps) {
  const input = page.locator('input[required], textarea[required], select[required]').first();
  if ((await input.count()) === 0) return;
  if (!(await input.isVisible().catch(() => false))) return;
  try {
    await input.fill('').catch(() => {});
  } catch {
    return;
  }
  const cta = await findPrimaryCTA(page);
  if (!cta) return;
  await cta.click().catch(() => {});
  await waitShort();
  steps.push('Validierung mit leerem Pflichtfeld getestet');
}

async function isGoalPage(page) {
  const url = page.url();
  if (/danke|bestaetigung|ergebnis|success|thank/i.test(url)) return true;
  const bodyText = await page.textContent('body').catch(() => '');
  if (/danke|best[äa]tigt|erfolgreich|anfrage gesendet|offerte angefordert|thank you/i.test(bodyText)) return true;
  return false;
}

async function isErrorPage(page) {
  const bodyText = await page.textContent('body').catch(() => '');
  if (!bodyText || bodyText.trim().length < 5) return true;
  if (/404|page not found|page can\'t be found|nicht gefunden/i.test(bodyText)) return true;
  return false;
}

async function fillVisibleFields(page, data, steps) {
  const inputs = page.locator('input, textarea');
  const count = await inputs.count();
  let filled = false;
  for (let i = 0; i < count; i += 1) {
    const input = inputs.nth(i);
    if (!(await input.isVisible().catch(() => false))) continue;
    const type = (await input.getAttribute('type').catch(() => 'text')) || 'text';
    const name = (await input.getAttribute('name').catch(() => '')) || '';
    const placeholder = (await input.getAttribute('placeholder').catch(() => '')) || '';
    const aria = (await input.getAttribute('aria-label').catch(() => '')) || '';
    const id = (await input.getAttribute('id').catch(() => '')) || '';
    if (type === 'hidden' || type === 'submit') continue;

    let labelText = '';
    if (id) {
      labelText = (await page.locator(`label[for="${id}"]`).first().textContent().catch(() => '')) || '';
    }

    const key = `${name} ${placeholder} ${aria} ${labelText}`.toLowerCase();
    let value = null;

    if (key.includes('vorname') || key.includes('first name')) value = data.firstName;
    else if (key.includes('nachname') || key.includes('last name')) value = data.lastName;
    else if (type === 'email' || key.includes('email')) value = data.email;
    else if (type === 'tel' || key.includes('telefon') || key.includes('phone')) value = data.phone;
    else if (key.includes('plz') || key.includes('postal') || key.includes('zip')) {
      value = key.includes('ziel') || key.includes('to') ? data.to_postal : data.from_postal;
    } else if (key.includes('ort') || key.includes('city') || key.includes('stadt')) {
      value = key.includes('ziel') || key.includes('to') ? data.to_city : data.from_city;
    } else if (key.includes('datum') || key.includes('date')) {
      value = placeholder.includes('.') || key.includes('tt.mm') ? data.dateDots : data.date;
    } else if (key.includes('zimmer') || key.includes('rooms')) value = data.rooms;
    else if (key.includes('notiz') || key.includes('bemerk') || key.includes('nachricht') || key.includes('hinweis')) value = data.note;
    else if (key.includes('name') && !key.includes('firma')) value = `${data.firstName} ${data.lastName}`;

    if (value !== null) {
      await input.fill(String(value)).catch(() => {});
      filled = true;
    }
  }

  const selects = page.locator('select');
  const selCount = await selects.count();
  for (let i = 0; i < selCount; i += 1) {
    const select = selects.nth(i);
    if (!(await select.isVisible().catch(() => false))) continue;
    const options = await select.evaluate((el) => Array.from(el.options).map((o) => o.value));
    const choice = options.find((opt) => opt && opt.trim().length > 0);
    if (choice) {
      await select.selectOption(choice).catch(() => {});
      filled = true;
    }
  }

  if (filled) steps.push('Felder ausgefuellt');
}
