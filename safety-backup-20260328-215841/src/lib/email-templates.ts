/**
 * Email Templates Library
 * HTML templates for all automated email sequences
 * These are static templates - no external API required
 */

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  category: 'lead' | 'provider' | 'system' | 'marketing';
  htmlContent: string;
  textContent: string;
  variables: string[];
}

// ============ BRAND STYLES ============

const BRAND_STYLES = `
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; margin: 0; padding: 0; background: #f5f5f5; }
    .container { max-width: 600px; margin: 0 auto; background: white; }
    .header { background: #0050A8; padding: 32px; text-align: center; }
    .header img { height: 40px; }
    .header h1 { color: white; margin: 16px 0 0; font-size: 24px; font-weight: 600; }
    .content { padding: 32px; line-height: 1.6; color: #333; }
    .content h2 { color: #0050A8; margin-top: 0; }
    .btn { display: inline-block; background: #0050A8; color: white !important; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 16px 0; }
    .btn:hover { background: #003d80; }
    .highlight-box { background: #EBF4FF; border-left: 4px solid #0050A8; padding: 16px; margin: 24px 0; border-radius: 0 8px 8px 0; }
    .footer { background: #f8f9fa; padding: 24px 32px; text-align: center; font-size: 12px; color: #666; }
    .footer a { color: #0050A8; }
    .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin: 24px 0; }
    .stat-box { background: #f8f9fa; padding: 16px; border-radius: 8px; text-align: center; }
    .stat-value { font-size: 28px; font-weight: 700; color: #0050A8; }
    .stat-label { font-size: 12px; color: #666; margin-top: 4px; }
    .trust-badges { display: flex; justify-content: center; gap: 24px; margin: 24px 0; }
    .trust-badge { display: flex; align-items: center; gap: 8px; font-size: 14px; color: #059669; }
    ul { padding-left: 20px; }
    li { margin: 8px 0; }
  </style>
`;

const EMAIL_HEADER = `
  <div class="header">
    <h1>🏠 Umzugscheck.ch</h1>
  </div>
`;

const EMAIL_FOOTER = `
  <div class="footer">
    <p>© 2025 Umzugscheck.ch - Die #1 Umzugsplattform der Schweiz</p>
    <p>
      <a href="{{unsubscribe_url}}">Abmelden</a> | 
      <a href="https://umzugscheck.ch/datenschutz">Datenschutz</a> | 
      <a href="https://umzugscheck.ch/impressum">Impressum</a>
    </p>
    <p style="margin-top: 16px; font-size: 11px;">
      Umzugscheck AG, Bahnhofstrasse 10, 8001 Zürich
    </p>
  </div>
`;

// ============ LEAD EMAILS ============

export const LEAD_WELCOME: EmailTemplate = {
  id: 'lead-welcome',
  name: 'Lead Willkommen',
  subject: '🎉 Ihre Umzugsofferten sind unterwegs!',
  category: 'lead',
  variables: ['customer_name', 'from_city', 'to_city', 'move_date', 'estimated_price_min', 'estimated_price_max', 'offers_count'],
  htmlContent: `
<!DOCTYPE html>
<html>
<head>${BRAND_STYLES}</head>
<body>
  <div class="container">
    ${EMAIL_HEADER}
    <div class="content">
      <h2>Hallo {{customer_name}}! 👋</h2>
      
      <p>Vielen Dank für Ihre Anfrage auf Umzugscheck.ch! Wir haben Ihren Umzug von <strong>{{from_city}}</strong> nach <strong>{{to_city}}</strong> erfasst.</p>
      
      <div class="highlight-box">
        <strong>📅 Ihr Umzugsdatum:</strong> {{move_date}}<br>
        <strong>💰 Geschätzte Kosten:</strong> CHF {{estimated_price_min}} - {{estimated_price_max}}
      </div>
      
      <p><strong>Was passiert jetzt?</strong></p>
      <ul>
        <li>✅ {{offers_count}} verifizierte Umzugsfirmen wurden benachrichtigt</li>
        <li>📧 Sie erhalten in Kürze die ersten Offerten per E-Mail</li>
        <li>🔒 Ihre Daten sind sicher und werden nur an ausgewählte Partner weitergegeben</li>
      </ul>
      
      <div class="trust-badges">
        <span class="trust-badge">✓ 100% kostenlos</span>
        <span class="trust-badge">✓ Unverbindlich</span>
        <span class="trust-badge">✓ Geprüfte Firmen</span>
      </div>
      
      <a href="https://umzugscheck.ch/meine-anfragen" class="btn">Meine Anfragen ansehen →</a>
      
      <p style="margin-top: 32px;">Bei Fragen sind wir gerne für Sie da!</p>
      <p>Ihr Umzugscheck-Team</p>
    </div>
    ${EMAIL_FOOTER}
  </div>
</body>
</html>
  `,
  textContent: `
Hallo {{customer_name}}!

Vielen Dank für Ihre Anfrage auf Umzugscheck.ch!

Ihr Umzug: {{from_city}} → {{to_city}}
Datum: {{move_date}}
Geschätzte Kosten: CHF {{estimated_price_min}} - {{estimated_price_max}}

{{offers_count}} Umzugsfirmen wurden benachrichtigt. Sie erhalten in Kürze die ersten Offerten.

Ihr Umzugscheck-Team
  `
};

export const LEAD_REMINDER: EmailTemplate = {
  id: 'lead-reminder',
  name: 'Lead Erinnerung',
  subject: '⏰ Haben Sie sich schon entschieden, {{customer_name}}?',
  category: 'lead',
  variables: ['customer_name', 'offers_received', 'best_offer_price', 'days_until_move'],
  htmlContent: `
<!DOCTYPE html>
<html>
<head>${BRAND_STYLES}</head>
<body>
  <div class="container">
    ${EMAIL_HEADER}
    <div class="content">
      <h2>Hallo {{customer_name}}! 👋</h2>
      
      <p>Sie haben bereits <strong>{{offers_received}} Offerten</strong> für Ihren Umzug erhalten. Die beste Offerte liegt bei <strong>CHF {{best_offer_price}}</strong>.</p>
      
      <div class="highlight-box">
        <strong>⚡ Nur noch {{days_until_move}} Tage bis zu Ihrem Umzug!</strong><br>
        Je früher Sie buchen, desto bessere Konditionen erhalten Sie.
      </div>
      
      <div class="stats-grid">
        <div class="stat-box">
          <div class="stat-value">{{offers_received}}</div>
          <div class="stat-label">Offerten erhalten</div>
        </div>
        <div class="stat-box">
          <div class="stat-value">CHF {{best_offer_price}}</div>
          <div class="stat-label">Beste Offerte</div>
        </div>
        <div class="stat-box">
          <div class="stat-value">{{days_until_move}}</div>
          <div class="stat-label">Tage bis Umzug</div>
        </div>
      </div>
      
      <a href="https://umzugscheck.ch/meine-offerten" class="btn">Offerten vergleichen →</a>
      
      <p style="margin-top: 24px; font-size: 14px; color: #666;">
        💡 <strong>Tipp:</strong> Viele unserer Partner bieten Rabatte für frühzeitige Buchungen!
      </p>
    </div>
    ${EMAIL_FOOTER}
  </div>
</body>
</html>
  `,
  textContent: `
Hallo {{customer_name}}!

Sie haben {{offers_received}} Offerten erhalten. Die beste liegt bei CHF {{best_offer_price}}.

Nur noch {{days_until_move}} Tage bis zu Ihrem Umzug!

Jetzt vergleichen: https://umzugscheck.ch/meine-offerten

Ihr Umzugscheck-Team
  `
};

export const LEAD_ABANDONED: EmailTemplate = {
  id: 'lead-abandoned',
  name: 'Abbruch Erinnerung',
  subject: '🏠 Fast geschafft! Noch 1 Schritt zur Umzugsofferte',
  category: 'lead',
  variables: ['customer_name', 'from_city', 'to_city', 'resume_url'],
  htmlContent: `
<!DOCTYPE html>
<html>
<head>${BRAND_STYLES}</head>
<body>
  <div class="container">
    ${EMAIL_HEADER}
    <div class="content">
      <h2>Hallo {{customer_name}}! 👋</h2>
      
      <p>Sie waren gerade dabei, Offerten für Ihren Umzug von <strong>{{from_city}}</strong> nach <strong>{{to_city}}</strong> anzufordern.</p>
      
      <div class="highlight-box">
        <strong>🎯 Nur noch ein Schritt!</strong><br>
        Ihre Daten wurden gespeichert. Setzen Sie Ihre Anfrage in 30 Sekunden fort.
      </div>
      
      <a href="{{resume_url}}" class="btn">Jetzt fortfahren →</a>
      
      <p><strong>Warum Umzugscheck?</strong></p>
      <ul>
        <li>✅ 100% kostenlos & unverbindlich</li>
        <li>✅ Bis zu 5 Offerten von geprüften Firmen</li>
        <li>✅ Durchschnittlich 30% günstiger als Einzelanfragen</li>
        <li>✅ Über 50'000 zufriedene Kunden</li>
      </ul>
      
      <p style="margin-top: 24px; font-size: 14px; color: #666;">
        Sollten Sie Fragen haben, antworten Sie einfach auf diese E-Mail!
      </p>
    </div>
    ${EMAIL_FOOTER}
  </div>
</body>
</html>
  `,
  textContent: `
Hallo {{customer_name}}!

Sie waren gerade dabei, Offerten für Ihren Umzug anzufordern.

Von: {{from_city}}
Nach: {{to_city}}

Setzen Sie Ihre Anfrage jetzt fort: {{resume_url}}

✓ 100% kostenlos
✓ Bis zu 5 Offerten
✓ Geprüfte Firmen

Ihr Umzugscheck-Team
  `
};

export const LEAD_TIPS: EmailTemplate = {
  id: 'lead-tips',
  name: 'Umzugstipps',
  subject: '📦 5 Tipps für einen stressfreien Umzug',
  category: 'lead',
  variables: ['customer_name', 'days_until_move'],
  htmlContent: `
<!DOCTYPE html>
<html>
<head>${BRAND_STYLES}</head>
<body>
  <div class="container">
    ${EMAIL_HEADER}
    <div class="content">
      <h2>Hallo {{customer_name}}! 👋</h2>
      
      <p>Ihr Umzug rückt näher – nur noch <strong>{{days_until_move}} Tage</strong>! Hier sind unsere besten Tipps:</p>
      
      <div style="margin: 24px 0;">
        <div style="display: flex; gap: 16px; margin-bottom: 16px; padding: 16px; background: #f8f9fa; border-radius: 8px;">
          <span style="font-size: 24px;">1️⃣</span>
          <div>
            <strong>Frühzeitig ausmisten</strong>
            <p style="margin: 4px 0 0; color: #666;">Je weniger Sie zügeln, desto günstiger wird's!</p>
          </div>
        </div>
        
        <div style="display: flex; gap: 16px; margin-bottom: 16px; padding: 16px; background: #f8f9fa; border-radius: 8px;">
          <span style="font-size: 24px;">2️⃣</span>
          <div>
            <strong>Kartons richtig beschriften</strong>
            <p style="margin: 4px 0 0; color: #666;">Raum + Inhalt = schnelles Auspacken</p>
          </div>
        </div>
        
        <div style="display: flex; gap: 16px; margin-bottom: 16px; padding: 16px; background: #f8f9fa; border-radius: 8px;">
          <span style="font-size: 24px;">3️⃣</span>
          <div>
            <strong>Wichtiges separat packen</strong>
            <p style="margin: 4px 0 0; color: #666;">Dokumente, Ladegeräte, Medikamente griffbereit</p>
          </div>
        </div>
        
        <div style="display: flex; gap: 16px; margin-bottom: 16px; padding: 16px; background: #f8f9fa; border-radius: 8px;">
          <span style="font-size: 24px;">4️⃣</span>
          <div>
            <strong>Nachsendeauftrag stellen</strong>
            <p style="margin: 4px 0 0; color: #666;">Bei der Post für 12 Monate einrichten</p>
          </div>
        </div>
        
        <div style="display: flex; gap: 16px; padding: 16px; background: #f8f9fa; border-radius: 8px;">
          <span style="font-size: 24px;">5️⃣</span>
          <div>
            <strong>Endreinigung planen</strong>
            <p style="margin: 4px 0 0; color: #666;">Wohnungsabgabe ohne Stress</p>
          </div>
        </div>
      </div>
      
      <div class="highlight-box">
        💡 <strong>Bonus-Tipp:</strong> Buchen Sie die Endreinigung gleich mit dem Umzug – viele unserer Partner bieten attraktive Kombi-Rabatte!
      </div>
      
      <a href="https://umzugscheck.ch/ratgeber/umzug-checkliste" class="btn">Komplette Checkliste ansehen →</a>
    </div>
    ${EMAIL_FOOTER}
  </div>
</body>
</html>
  `,
  textContent: `
Hallo {{customer_name}}!

Ihr Umzug rückt näher - nur noch {{days_until_move}} Tage!

5 Tipps für einen stressfreien Umzug:

1. Frühzeitig ausmisten
2. Kartons richtig beschriften
3. Wichtiges separat packen
4. Nachsendeauftrag stellen
5. Endreinigung planen

Komplette Checkliste: https://umzugscheck.ch/ratgeber/umzug-checkliste

Ihr Umzugscheck-Team
  `
};

// ============ PROVIDER EMAILS ============

export const PROVIDER_NEW_LEAD: EmailTemplate = {
  id: 'provider-new-lead',
  name: 'Neuer Lead für Provider',
  subject: '🔔 Neuer Lead: {{from_city}} → {{to_city}} ({{move_date}})',
  category: 'provider',
  variables: ['provider_name', 'from_city', 'to_city', 'from_postal', 'to_postal', 'move_date', 'volume', 'services', 'lead_id', 'estimated_value'],
  htmlContent: `
<!DOCTYPE html>
<html>
<head>${BRAND_STYLES}</head>
<body>
  <div class="container">
    ${EMAIL_HEADER}
    <div class="content">
      <h2>Neuer Umzugs-Lead! 🎯</h2>
      
      <p>Hallo {{provider_name}},</p>
      <p>Ein neuer Lead wartet auf Ihre Offerte!</p>
      
      <div class="highlight-box">
        <strong>📍 Route:</strong> {{from_postal}} {{from_city}} → {{to_postal}} {{to_city}}<br>
        <strong>📅 Datum:</strong> {{move_date}}<br>
        <strong>📦 Volumen:</strong> ca. {{volume}} m³<br>
        <strong>🛠️ Services:</strong> {{services}}<br>
        <strong>💰 Geschätzter Wert:</strong> CHF {{estimated_value}}
      </div>
      
      <div class="stats-grid">
        <div class="stat-box">
          <div class="stat-value" style="font-size: 20px;">{{volume}} m³</div>
          <div class="stat-label">Umzugsvolumen</div>
        </div>
        <div class="stat-box">
          <div class="stat-value" style="font-size: 20px; color: #059669;">CHF {{estimated_value}}</div>
          <div class="stat-label">Geschätzter Wert</div>
        </div>
        <div class="stat-box">
          <div class="stat-value" style="font-size: 20px;">⏱️</div>
          <div class="stat-label">Schnelle Antwort = Bonus</div>
        </div>
      </div>
      
      <a href="https://umzugscheck.ch/partner/leads/{{lead_id}}" class="btn">Lead ansehen & Offerte senden →</a>
      
      <p style="margin-top: 24px; font-size: 14px; color: #666;">
        ⚡ <strong>Tipp:</strong> Firmen, die innerhalb von 2 Stunden antworten, haben eine 3x höhere Abschlussquote!
      </p>
    </div>
    ${EMAIL_FOOTER}
  </div>
</body>
</html>
  `,
  textContent: `
Neuer Umzugs-Lead!

Hallo {{provider_name}},

Route: {{from_postal}} {{from_city}} → {{to_postal}} {{to_city}}
Datum: {{move_date}}
Volumen: {{volume}} m³
Services: {{services}}
Geschätzter Wert: CHF {{estimated_value}}

Jetzt ansehen: https://umzugscheck.ch/partner/leads/{{lead_id}}

Tipp: Schnelle Antworten erhöhen die Abschlussquote!

Umzugscheck Partner-Team
  `
};

export const PROVIDER_REMINDER: EmailTemplate = {
  id: 'provider-reminder',
  name: 'Provider Antwort-Erinnerung',
  subject: '⏰ Noch keine Offerte gesendet: {{from_city}} → {{to_city}}',
  category: 'provider',
  variables: ['provider_name', 'from_city', 'to_city', 'hours_since_lead', 'lead_id', 'competing_offers'],
  htmlContent: `
<!DOCTYPE html>
<html>
<head>${BRAND_STYLES}</head>
<body>
  <div class="container">
    ${EMAIL_HEADER}
    <div class="content">
      <h2>⏰ Lead wartet auf Ihre Offerte</h2>
      
      <p>Hallo {{provider_name}},</p>
      
      <p>Vor {{hours_since_lead}} Stunden haben Sie einen Lead für <strong>{{from_city}} → {{to_city}}</strong> erhalten, aber noch keine Offerte gesendet.</p>
      
      <div class="highlight-box" style="background: #FEF2F2; border-color: #DC2626;">
        <strong>⚠️ Bereits {{competing_offers}} andere Offerten eingegangen!</strong><br>
        Je länger Sie warten, desto geringer Ihre Chancen.
      </div>
      
      <a href="https://umzugscheck.ch/partner/leads/{{lead_id}}" class="btn">Jetzt Offerte senden →</a>
      
      <p style="margin-top: 24px; font-size: 14px; color: #666;">
        📊 <strong>Statistik:</strong> Ihre aktuelle Antwortrate liegt unter dem Durchschnitt. Eine höhere Aktivität verbessert Ihr Ranking!
      </p>
    </div>
    ${EMAIL_FOOTER}
  </div>
</body>
</html>
  `,
  textContent: `
Hallo {{provider_name}},

Vor {{hours_since_lead}} Stunden haben Sie einen Lead erhalten:
{{from_city}} → {{to_city}}

Bereits {{competing_offers}} andere Offerten eingegangen!

Jetzt antworten: https://umzugscheck.ch/partner/leads/{{lead_id}}

Umzugscheck Partner-Team
  `
};

// ============ POST-MOVE EMAILS ============

export const POST_MOVE_THANK_YOU: EmailTemplate = {
  id: 'post-move-thank-you',
  name: 'Danke nach Umzug',
  subject: '🎉 Herzlichen Glückwunsch zum neuen Zuhause!',
  category: 'lead',
  variables: ['customer_name', 'new_city', 'provider_name'],
  htmlContent: `
<!DOCTYPE html>
<html>
<head>${BRAND_STYLES}</head>
<body>
  <div class="container">
    ${EMAIL_HEADER}
    <div class="content">
      <h2 style="text-align: center;">🏠 Willkommen in {{new_city}}!</h2>
      
      <p>Liebe/r {{customer_name}},</p>
      
      <p>Wir hoffen, Ihr Umzug mit <strong>{{provider_name}}</strong> ist gut verlaufen!</p>
      
      <div class="highlight-box">
        <strong>🙏 Vielen Dank, dass Sie Umzugscheck vertraut haben.</strong><br>
        Wir wünschen Ihnen viel Freude in Ihrem neuen Zuhause!
      </div>
      
      <p><strong>Was Sie jetzt tun können:</strong></p>
      <ul>
        <li>📝 Bewerten Sie {{provider_name}} (hilft anderen Kunden)</li>
        <li>📮 Richten Sie Ihren Nachsendeauftrag ein</li>
        <li>🔌 Melden Sie Strom, Internet & Gas um</li>
        <li>🏛️ Melden Sie sich bei der Gemeinde an</li>
      </ul>
      
      <a href="https://umzugscheck.ch/bewertung/{{provider_name}}" class="btn">Jetzt bewerten →</a>
      
      <p style="margin-top: 32px; text-align: center; font-size: 14px; color: #666;">
        💝 Kennen Sie jemanden, der bald umzieht?<br>
        <a href="https://umzugscheck.ch/?ref={{customer_id}}">Empfehlen Sie uns weiter und erhalten Sie 50 CHF!</a>
      </p>
    </div>
    ${EMAIL_FOOTER}
  </div>
</body>
</html>
  `,
  textContent: `
Willkommen in {{new_city}}, {{customer_name}}!

Wir hoffen, Ihr Umzug mit {{provider_name}} ist gut verlaufen.

Was Sie jetzt tun können:
- Bewerten Sie {{provider_name}}
- Nachsendeauftrag einrichten
- Strom, Internet & Gas ummelden
- Bei der Gemeinde anmelden

Jetzt bewerten: https://umzugscheck.ch/bewertung

Viel Freude im neuen Zuhause!
Ihr Umzugscheck-Team
  `
};

export const POST_MOVE_REVIEW: EmailTemplate = {
  id: 'post-move-review',
  name: 'Bewertungsanfrage',
  subject: '⭐ Wie war Ihr Umzug? (Nur 2 Minuten)',
  category: 'lead',
  variables: ['customer_name', 'provider_name', 'move_date', 'review_url'],
  htmlContent: `
<!DOCTYPE html>
<html>
<head>${BRAND_STYLES}</head>
<body>
  <div class="container">
    ${EMAIL_HEADER}
    <div class="content">
      <h2>Ihre Meinung zählt! ⭐</h2>
      
      <p>Hallo {{customer_name}},</p>
      
      <p>Am {{move_date}} war Ihr Umzug mit <strong>{{provider_name}}</strong>. Wir würden uns sehr über Ihr Feedback freuen!</p>
      
      <div class="highlight-box">
        <strong>🎁 Als Dankeschön:</strong> Unter allen Bewertungen verlosen wir monatlich einen <strong>100 CHF Gutschein</strong>!
      </div>
      
      <p style="text-align: center; font-size: 32px; margin: 24px 0;">
        <a href="{{review_url}}?rating=1" style="text-decoration: none;">😞</a>
        <a href="{{review_url}}?rating=2" style="text-decoration: none;">😕</a>
        <a href="{{review_url}}?rating=3" style="text-decoration: none;">😐</a>
        <a href="{{review_url}}?rating=4" style="text-decoration: none;">🙂</a>
        <a href="{{review_url}}?rating=5" style="text-decoration: none;">😍</a>
      </p>
      
      <a href="{{review_url}}" class="btn">Ausführliche Bewertung schreiben →</a>
      
      <p style="margin-top: 24px; font-size: 14px; color: #666;">
        Ihre Bewertung hilft anderen bei der Entscheidung und motiviert gute Firmen!
      </p>
    </div>
    ${EMAIL_FOOTER}
  </div>
</body>
</html>
  `,
  textContent: `
Hallo {{customer_name}},

Am {{move_date}} war Ihr Umzug mit {{provider_name}}.

Wie war es? Ihre Bewertung hilft anderen!

Jetzt bewerten: {{review_url}}

Als Dankeschön: 100 CHF Gutschein-Verlosung!

Ihr Umzugscheck-Team
  `
};

export const REFERRAL_INVITE: EmailTemplate = {
  id: 'referral-invite',
  name: 'Empfehlungsprogramm',
  subject: '💰 50 CHF für Sie – Empfehlen Sie Umzugscheck!',
  category: 'marketing',
  variables: ['customer_name', 'referral_code', 'referral_url', 'earned_so_far'],
  htmlContent: `
<!DOCTYPE html>
<html>
<head>${BRAND_STYLES}</head>
<body>
  <div class="container">
    ${EMAIL_HEADER}
    <div class="content">
      <h2>Teilen & verdienen! 💰</h2>
      
      <p>Hallo {{customer_name}},</p>
      
      <p>Sie waren zufrieden mit Umzugscheck? Teilen Sie uns mit Freunden und Familie – und verdienen Sie dabei!</p>
      
      <div class="highlight-box" style="text-align: center;">
        <strong style="font-size: 24px;">50 CHF</strong><br>
        für jede erfolgreiche Empfehlung
      </div>
      
      <div class="stats-grid">
        <div class="stat-box">
          <div class="stat-value">50 CHF</div>
          <div class="stat-label">Pro Empfehlung</div>
        </div>
        <div class="stat-box">
          <div class="stat-value">∞</div>
          <div class="stat-label">Kein Limit</div>
        </div>
        <div class="stat-box">
          <div class="stat-value">{{earned_so_far}}</div>
          <div class="stat-label">Bereits verdient</div>
        </div>
      </div>
      
      <div style="background: #f8f9fa; padding: 16px; border-radius: 8px; text-align: center; margin: 24px 0;">
        <p style="margin: 0 0 8px; color: #666;">Ihr persönlicher Code:</p>
        <p style="margin: 0; font-size: 24px; font-weight: 700; color: #0050A8; letter-spacing: 2px;">{{referral_code}}</p>
      </div>
      
      <a href="{{referral_url}}" class="btn">Link kopieren & teilen →</a>
      
      <p style="margin-top: 24px; font-size: 14px; color: #666;">
        So funktioniert's: Ihr Freund erhält 20 CHF Rabatt, Sie erhalten 50 CHF nach erfolgreichem Umzug.
      </p>
    </div>
    ${EMAIL_FOOTER}
  </div>
</body>
</html>
  `,
  textContent: `
Hallo {{customer_name}},

Verdienen Sie 50 CHF für jede Empfehlung!

Ihr Code: {{referral_code}}
Ihr Link: {{referral_url}}

So funktioniert's:
- Ihr Freund erhält 20 CHF Rabatt
- Sie erhalten 50 CHF nach erfolgreichem Umzug
- Kein Limit!

Bisher verdient: {{earned_so_far}}

Ihr Umzugscheck-Team
  `
};

// ============ SYSTEM EMAILS ============

export const SYSTEM_ALERT: EmailTemplate = {
  id: 'system-alert',
  name: 'System Alert',
  subject: '🚨 [ALERT] {{alert_type}}: {{alert_title}}',
  category: 'system',
  variables: ['alert_type', 'alert_title', 'alert_message', 'affected_service', 'timestamp', 'action_url'],
  htmlContent: `
<!DOCTYPE html>
<html>
<head>${BRAND_STYLES}</head>
<body>
  <div class="container">
    <div class="header" style="background: #DC2626;">
      <h1>🚨 System Alert</h1>
    </div>
    <div class="content">
      <h2 style="color: #DC2626;">{{alert_type}}: {{alert_title}}</h2>
      
      <div class="highlight-box" style="background: #FEF2F2; border-color: #DC2626;">
        <strong>Betroffener Service:</strong> {{affected_service}}<br>
        <strong>Zeitpunkt:</strong> {{timestamp}}<br>
        <strong>Nachricht:</strong> {{alert_message}}
      </div>
      
      <a href="{{action_url}}" class="btn" style="background: #DC2626;">Zum Dashboard →</a>
      
      <p style="margin-top: 24px; font-size: 12px; color: #666;">
        Diese Nachricht wurde automatisch generiert. Antworten Sie nicht auf diese E-Mail.
      </p>
    </div>
    ${EMAIL_FOOTER}
  </div>
</body>
</html>
  `,
  textContent: `
[ALERT] {{alert_type}}: {{alert_title}}

Service: {{affected_service}}
Zeit: {{timestamp}}
Nachricht: {{alert_message}}

Dashboard: {{action_url}}
  `
};

// ============ ALL TEMPLATES EXPORT ============

export const EMAIL_TEMPLATES: EmailTemplate[] = [
  LEAD_WELCOME,
  LEAD_REMINDER,
  LEAD_ABANDONED,
  LEAD_TIPS,
  PROVIDER_NEW_LEAD,
  PROVIDER_REMINDER,
  POST_MOVE_THANK_YOU,
  POST_MOVE_REVIEW,
  REFERRAL_INVITE,
  SYSTEM_ALERT
];

export function getEmailTemplate(id: string): EmailTemplate | undefined {
  return EMAIL_TEMPLATES.find(t => t.id === id);
}

export function renderEmailTemplate(template: EmailTemplate, variables: Record<string, string>): { html: string; text: string; subject: string } {
  let html = template.htmlContent;
  let text = template.textContent;
  let subject = template.subject;
  
  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    html = html.replace(regex, value);
    text = text.replace(regex, value);
    subject = subject.replace(regex, value);
  });
  
  return { html, text, subject };
}
