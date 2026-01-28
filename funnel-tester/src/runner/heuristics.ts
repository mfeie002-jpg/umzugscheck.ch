import { Page, Locator } from 'playwright';

const mainKeywords = [
  'anfrage',
  'offerte',
  'angebot',
  'kostenlos',
  'start',
  'weiter',
  'jetzt',
  'book',
  'get quote',
  'quote',
  'request',
  'submit',
  'send',
  'calculate'
];

const secondaryKeywords = ['learn', 'mehr', 'details', 'preise', 'pricing', 'info', 'more'];
const escapeKeywords = ['zur\\u00fcck', 'back', 'abbrechen', 'cancel', 'later', 'exit'];

const normalize = (text: string): string => text.trim().toLowerCase();

export const classifyCta = (text: string): 'main' | 'secondary' | 'escape' | 'unknown' => {
  const normalized = normalize(text);
  if (escapeKeywords.some((word) => normalized.includes(word))) return 'escape';
  if (mainKeywords.some((word) => normalized.includes(word))) return 'main';
  if (secondaryKeywords.some((word) => normalized.includes(word))) return 'secondary';
  return 'unknown';
};

export const detectTrustSignals = (text: string): string[] => {
  const signals = [
    /4\.\d\s?\/?5/, /5\.0/, /bewertung/i, /reviews?/i, /bewertungen/i, /trusted/i,
    /zertifiziert/i, /google/i, /garantie/i, /versicherung/i, /sicher/i, /ssl/i
  ];
  return signals
    .filter((regex) => regex.test(text))
    .map((regex) => regex.toString());
};

export const getH1Text = async (page: Page): Promise<string> => {
  const h1 = page.locator('h1').first();
  if (await h1.count()) {
    const text = (await h1.textContent()) || '';
    return text.trim();
  }
  return '';
};

export const getCtaCandidates = async (page: Page): Promise<
  Array<{ locator: Locator; text: string; score: number; kind: 'main' | 'secondary' | 'escape' | 'unknown' }>
> => {
  const locator = page.locator(
    'button, [role="button"], input[type="submit"], input[type="button"], a'
  );
  const count = await locator.count();
  const candidates: Array<{ locator: Locator; text: string; score: number; kind: 'main' | 'secondary' | 'escape' | 'unknown' }> = [];

  for (let i = 0; i < count; i += 1) {
    const item = locator.nth(i);
    if (!(await item.isVisible())) continue;
    const textRaw = (await item.textContent()) || (await item.getAttribute('value')) || '';
    const text = textRaw.trim();
    if (!text) continue;
    const box = await item.boundingBox();
    const area = box ? box.width * box.height : 0;
    const kind = classifyCta(text);
    const score = area + (kind === 'main' ? 5000 : kind === 'secondary' ? 2500 : kind === 'escape' ? 500 : 0);
    candidates.push({ locator: item, text, score, kind });
  }

  return candidates.sort((a, b) => b.score - a.score).slice(0, 12);
};

export const detectSuccess = async (page: Page): Promise<boolean> => {
  const url = page.url().toLowerCase();
  if (/(thank|merci|danke|success|confirmation|best\u00e4tigung)/i.test(url)) return true;
  const body = await page.locator('body').innerText();
  return /(thank you|merci|danke|vielen dank|best\u00e4tigung)/i.test(body);
};

export const detectFriction = async (page: Page): Promise<string[]> => {
  const points: string[] = [];
  const invalid = await page.locator('[aria-invalid="true"], .error, .invalid, .error-message').count();
  if (invalid > 0) points.push('Validation errors visible');

  const overflow = await page.evaluate(() => {
    return document.documentElement.scrollWidth > document.documentElement.clientWidth + 5;
  });
  if (overflow) points.push('Horizontal overflow detected');

  const captcha = await page.locator('text=/captcha/i').count();
  if (captcha > 0) points.push('Captcha detected');

  return points;
};

export const dismissOverlays = async (page: Page): Promise<void> => {
  const closeTexts = [
    'Akzeptieren',
    'Alle akzeptieren',
    'Zustimmen',
    'OK',
    'Okay',
    'Einverstanden',
    'Got it',
    'Accept',
    'Agree',
    'Close',
    'Schliessen',
    'Schließen'
  ];

  for (const text of closeTexts) {
    const btn = page.locator(`button:has-text("${text}")`).first();
    if (await btn.isVisible().catch(() => false)) {
      await btn.click({ timeout: 1500 }).catch(() => undefined);
    }
  }

  const closeButtons = page.locator('[aria-label*="close" i], [aria-label*="schlie" i], [data-testid*="close" i]');
  if (await closeButtons.count()) {
    await closeButtons.first().click({ timeout: 1500 }).catch(() => undefined);
  }

  const dialogs = page.locator('[role="dialog"], [role="alertdialog"]');
  if (await dialogs.count()) {
    await page.keyboard.press('Escape').catch(() => undefined);
  }
};

export const tenSecondTest = async (page: Page): Promise<{ title: string; h1: string; trust_signals: string[]; top_ctas: string[] }> => {
  const title = await page.title();
  const h1 = await getH1Text(page);
  const bodyText = await page.locator('body').innerText();
  const trust_signals = detectTrustSignals(bodyText);
  const ctas = await getCtaCandidates(page);
  const top_ctas = ctas.slice(0, 3).map((cta) => cta.text);
  return { title, h1, trust_signals, top_ctas };
};



