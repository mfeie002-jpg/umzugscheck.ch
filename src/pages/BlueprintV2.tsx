import { memo, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check } from 'lucide-react';
import { Helmet } from 'react-helmet';
import { cn } from '@/lib/utils';

// Copy Button Component
const CopyButton = memo(function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [text]);

  return (
    <button
      onClick={handleCopy}
      className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg border border-[var(--line)] bg-[var(--surface)] hover:bg-[var(--bg)] transition-colors"
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5 text-green-500" />
          <span>Kopiert!</span>
        </>
      ) : (
        <>
          <Copy className="w-3.5 h-3.5" />
          <span>Kopieren</span>
        </>
      )}
    </button>
  );
});

// Phase Card Component
const PhaseCard = memo(function PhaseCard({
  phase,
  title,
  subtitle,
  goal,
  friction,
  solution,
  visual,
  scenario
}: {
  phase: string;
  title: string;
  subtitle: string;
  goal: string;
  friction: string[];
  solution: string[];
  visual: string[];
  scenario: string;
}) {
  return (
    <section className="mt-6 border border-[var(--line)] rounded-[22px] bg-[color-mix(in_srgb,var(--surface)_94%,transparent)] shadow-[var(--shadow)] overflow-hidden">
      <div className="px-6 py-5 border-b border-[var(--line)] bg-gradient-to-b from-[rgba(88,140,255,0.12)] to-transparent">
        <h2 className="flex flex-wrap items-baseline gap-2.5 m-0">
          <b className="text-[13px] tracking-[0.12em] uppercase text-[var(--muted)] font-bold">{phase}</b>
          <span className="text-[22px] font-extrabold leading-tight">{title}</span>
        </h2>
        <p className="mt-2.5 text-[var(--muted)] max-w-[90ch] m-0">{subtitle}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 md:p-5">
        {/* Goal Card */}
        <article className="border border-[var(--line)] rounded-2xl bg-[color-mix(in_srgb,var(--surface)_96%,transparent)] p-5 min-h-[170px]">
          <h4 className="m-0 mb-2.5 text-sm tracking-[0.08em] uppercase text-[var(--muted)]">Das Nutzer-Ziel</h4>
          <p className="m-0 text-[color-mix(in_srgb,var(--text)_94%,var(--muted))] max-w-[80ch]" dangerouslySetInnerHTML={{ __html: goal }} />
        </article>

        {/* Friction Card */}
        <article className="border border-[var(--line)] rounded-2xl bg-[color-mix(in_srgb,var(--surface)_96%,transparent)] p-5 min-h-[170px]">
          <h4 className="m-0 mb-2.5 text-sm tracking-[0.08em] uppercase text-[var(--muted)]">Der Friction Point (Status Quo)</h4>
          <ul className="m-0 pl-4 text-[color-mix(in_srgb,var(--text)_90%,var(--muted))]">
            {friction.map((item, i) => (
              <li key={i} className="my-1.5" dangerouslySetInnerHTML={{ __html: item }} />
            ))}
          </ul>
        </article>

        {/* Solution Card */}
        <article className="border border-[var(--line)] rounded-2xl bg-[color-mix(in_srgb,var(--surface)_96%,transparent)] p-5 min-h-[170px]">
          <h4 className="m-0 mb-2.5 text-sm tracking-[0.08em] uppercase text-[var(--muted)]">Die Umzugscheck-Lösung</h4>
          <ul className="m-0 pl-4 text-[color-mix(in_srgb,var(--text)_90%,var(--muted))]">
            {solution.map((item, i) => (
              <li key={i} className="my-1.5" dangerouslySetInnerHTML={{ __html: item }} />
            ))}
          </ul>
        </article>

        {/* Visual Card */}
        <article className="border border-[var(--line)] rounded-2xl bg-[color-mix(in_srgb,var(--surface)_96%,transparent)] p-5 min-h-[170px]">
          <h4 className="m-0 mb-2.5 text-sm tracking-[0.08em] uppercase text-[var(--muted)]">Visuelle Beschreibung (UI-Screen)</h4>
          <ul className="m-0 pl-4 text-[color-mix(in_srgb,var(--text)_90%,var(--muted))]">
            {visual.map((item, i) => (
              <li key={i} className="my-1.5" dangerouslySetInnerHTML={{ __html: item }} />
            ))}
          </ul>
        </article>

        {/* Scenario Card */}
        <article className="md:col-span-2 border border-[var(--line)] rounded-2xl bg-[color-mix(in_srgb,var(--surface)_96%,transparent)] p-5">
          <blockquote className="m-0 p-4 border-l-4 border-[rgba(40,200,140,0.65)] bg-[color-mix(in_srgb,rgba(40,200,140,0.10)_70%,var(--surface))] text-[color-mix(in_srgb,var(--text)_92%,var(--muted))] rounded-[14px]">
            <span dangerouslySetInnerHTML={{ __html: scenario }} />
          </blockquote>
        </article>
      </div>
    </section>
  );
});

// Main Blueprint Page
const BlueprintV2 = memo(function BlueprintV2() {
  const phases = [
    {
      phase: 'PHASE 1',
      title: 'VISUALISIERUNG · Das Inventar wird zur „Linse"',
      subtitle: 'Konzept: Ersetze die Liste durch einen AR-Walkthrough. Der Nutzer zeigt seine Realität – das System erzeugt den Digital Twin (Volumen, Gewicht, Risiko, Zustand) automatisch.',
      goal: '„Ich will in 10 Minuten verstehen, <strong>was</strong> ich zügle – ohne Schätzen, ohne Excel, ohne Angst vor Nachforderungen – und ich will gleichzeitig meine Abgabe/Schäden sauber dokumentiert haben."',
      friction: [
        'Volumen wird vom Laien geschätzt → systematische Unterschätzung, später teure Überraschungen.',
        'Inventarlisten sind mühsam, brechen ab, sind unvollständig und nicht auditierbar.',
        'Bestehende Schäden werden nicht dokumentiert → Streit bei Abgabe/Kaution.'
      ],
      solution: [
        '<strong>„Vibe Check" Onboarding:</strong> Ein Satz, natürlich: „Zeig uns wo du bist, und sag uns, wo du hinwillst."',
        '<strong>Sentiment-Analyse:</strong> Tipp-/Stimmsignale → <em>Calm Mode</em> (ruhig, geführt) oder <em>Power Mode</em> (kompakt, schnell).',
        '<strong>Walkthrough Mode:</strong> Computer Vision erkennt Möbel/Objekte; LiDAR/Photogrammetrie ermittelt m³ präzise.',
        '<strong>Zustandsbericht:</strong> Erkennung markanter Kratzer/Spuren als „Pre-Move Evidence" (Zeitstempel, Ort, Bildhash).',
        '<strong>Entrümpeln im Flow:</strong> „Tinder-Prinzip": Behalten / Verkaufen / Entsorgen direkt am Objekt-Tag.'
      ],
      visual: [
        '<strong>Full-Screen Kamera</strong> mit live Objekt-Tags („Sofa", „Esstisch", „TV"), inkl. Gewicht/Volumen-Badge.',
        '<strong>Progress-Ring</strong> „Digital Twin erstellt: 62%" + Raum-Navigation („Wohnzimmer", „Schlafzimmer").',
        '<strong>Dollhouse-Preview</strong>: rechts oben wächst live ein 3D-Modell (räumlich nachvollziehbar).',
        '<strong>Swipe-Tray</strong> am unteren Rand: Behalten / Verkaufen / Entsorgen (Gamification + Kreislaufwirtschaft).',
        '<strong>Preis-Ticker</strong> im Header (read-only): „Verifizierter Move-Preisindikator" aktualisiert sich live.'
      ],
      scenario: '<strong>Stell dir vor: Sarah</strong> wohnt in einer 3.5-Zimmer-Wohnung in Zürich. Sie hasst Formulare, hat Angst vor Nachforderungen und ist gestresst. Umzugscheck startet im <em>Calm Mode</em>: große Schaltflächen, klare Sprache. Sarah geht einmal durch die Wohnung – die App erkennt das massive Bücherregal, markiert „schwer" und schlägt automatisch kleinere, stabilere Bücherkartons vor. Beim Parkett erkennt die KI einen bestehenden Kratzer, protokolliert ihn und sagt: „Schon dokumentiert. Du bist geschützt."'
    },
    {
      phase: 'PHASE 2',
      title: 'MARKTPLATZ · Reverse Auction & Green Slots',
      subtitle: 'Konzept: Der Nutzer sucht keine Firmen. Der verifizierte Digital Twin wird anonymisiert ausgeschrieben. Anbieter bieten auf Fakten – nicht auf Bauchgefühl. Das Ergebnis sind drei visuelle, verständliche Optionen.',
      goal: '„Ich will eine Entscheidung, die sich sicher anfühlt: <strong>Preisgarantie</strong>, klare Leistung, klare Qualität – und wenn ich flexibel bin, will ich dafür belohnt werden."',
      friction: [
        'Vergleichsportale liefern Leads, aber keine echte Verifizierung → Risikoaufschläge & Intransparenz.',
        '„Günstig" wird oft teuer am Umzugstag (Volumenabweichung, Zusatzleistungen, Zeitstreit).',
        'CO₂-optimierte Leerfahrten werden kaum genutzt, weil Information fehlt.'
      ],
      solution: [
        '<strong>Reverse Auction:</strong> Anbieter bieten auf verifiziertes Volumen. Kein „Risiko-Aufschlag" für Unwägbarkeiten.',
        '<strong>Yield Management:</strong> Erkennung von „Empty Legs" → <em>Green Slots</em> mit Preis- & CO₂-Vorteil.',
        '<strong>3 Karten statt Liste:</strong> „Saver" (geteilt/flexibel), „Balanced" (fix), „Royal" (Full-Service + Concierge).',
        '<strong>Smart Contract Booking:</strong> Preisgarantie + Leistungsumfang als kodierte Regeln (Escrow-Logik).',
        '<strong>Tap-to-Insure:</strong> Mikro-Versicherung pro Objekt (TV antippen → „CHF 5 Schutzschild").'
      ],
      visual: [
        'Screen „Angebote laufen ein": <strong>Live-Bidding</strong> (ohne Preis-Casino) + „verifiziert"-Badge.',
        'Optionenkarten mit <strong>Preis</strong>, <strong>Fix/Flex-Zeitfenster</strong>, <strong>CO₂-Label</strong>, <strong>Team-Rating</strong>, <strong>Preisgarantie</strong>.',
        '„Green Slot" wird als <strong>grüne Route</strong> visualisiert (geteilt, gleiche Strecke, weniger Leerfahrt).',
        'Im Dollhouse/Inventar kann der Nutzer Objekte antippen → „Schutzschild aktivieren" (Mikro-Versicherung).'
      ],
      scenario: '<strong>Stell dir vor: Sarah</strong> erhält drei Karten. „Saver" ist 18% günstiger, weil ein Anbieter ohnehin auf der Strecke Zürich → Bern fährt und freie Kapazität hat. Sarah sieht das als grüne Route mit „CO₂-Ersparnis" und entscheidet sich dafür, weil sie an diesem Tag flexibel ist. Ihren OLED-TV tippt sie im 3D-Modell an: Ein Schutzschild-Overlay erscheint, sie aktiviert die Mikro-Versicherung mit einem Tap. Keine Formulare, keine Diskussion.'
    },
    {
      phase: 'PHASE 3',
      title: 'BÜROKRATIE · Auto-Admin & Deposit Bridge',
      subtitle: 'Konzept: Umzugscheck wird zur interoperablen Schicht zwischen Nutzer, Vermieter, Gemeinde und Versorgern. Der Nutzer bestätigt – die KI erledigt.',
      goal: '„Ich will <strong>nichts verpassen</strong>: Kündigungsfrist, Einschreiben, Umzugsmeldung, Strom/Internet – und ich will nicht in der Zwischenzeit an der doppelten Kaution scheitern."',
      friction: [
        'Fristen, Formulare, unterschiedliche Gemeindeprozesse → hohe Fehlerquote und Doppelzahlungen.',
        '„Einschreiben" ist Pflicht, aber umständlich (Druck, Weg zur Post, Tracking).',
        'Neue Kaution wird fällig, bevor die alte zurückkommt → Liquiditätsstress.'
      ],
      solution: [
        '<strong>Kündigungs-Engine:</strong> Mietvertrag per Foto-Scan (OCR) → Kündigung generiert (inkl. Frist-Logik) → Versand als Einschreiben.',
        '<strong>Juristisch verwertbarer Nachweis:</strong> Tracking-Status + Empfangsbestätigung im Projekt-Timeline-Ledger.',
        '<strong>eUmzug-Brücke:</strong> API-Integration, sonst „Fallback": korrekte PDF-Formulare, vorbefüllt, versandfertig.',
        '<strong>Utility-Switch:</strong> Internet/Strom-Umstellung als geführter Ein-Tap-Flow (Bestätigung statt Dateneingabe).',
        '<strong>Deposit Bridge:</strong> Sofortige Kautions-Überbrückung auf Basis verifizierter Mietdaten + Risiko-Scoring (FinTech-Modul).'
      ],
      visual: [
        '„Auto-Admin" Dashboard als <strong>Timeline</strong> (Heute → Umzug → Übergabe): jede Aufgabe mit Status (Entwurf → bestätigt → erledigt).',
        'Aufgabe „Kündigung": Vorschau des Briefs + 1 Button „Jetzt als Einschreiben senden". Danach erscheint Tracking-Chip.',
        'Aufgabe „Umzug melden": 1 Button „eUmzug starten"; falls Gemeinde nicht angebunden: „PDF wird vorbereitet" + Versandoption.',
        '„Deposit Bridge": Kautions-Balken „Alt: in Rückzahlung / Neu: fällig" + „Überbrücken"-Schalter (Konditionen klar, inline).'
      ],
      scenario: '<strong>Stell dir vor: Sarah</strong> fotografiert ihren Mietvertrag. Umzugscheck erkennt die Kündigungsfrist und zeigt nur eine Entscheidung: „Kündigung jetzt fristwahrend als Einschreiben senden?" Sarah tippt „Ja". Sekunden später sieht sie Tracking und einen Countdown bis zur Zustellung. Gleichzeitig erscheint „Deposit Bridge verfügbar" – Sarah überbrückt die neue Kaution, ohne in Stress zu geraten.'
    },
    {
      phase: 'PHASE 4',
      title: 'AUSFÜHRUNG · Tactical Ops am Umzugstag',
      subtitle: 'Konzept: Die App wird zum taktischen Command Center. Alles ist live, messbar und konfliktarm: Tracking, Zeitstart per QR, AR-Damage-Validation.',
      goal: '„Ich will <strong>Kontrolle ohne Aufwand</strong>: Wann kommt das Team, was passiert gerade, wofür bezahle ich, und wie werden Schäden fair geklärt?"',
      friction: [
        'Unklare Ankunftszeiten → Stillstand, Stress, Nachbarn/Liftreservationen kollidieren.',
        'Abrechnungsstreit über Arbeitszeit („Die Uhr läuft schon…") und Zusatzleistungen.',
        'Schäden werden emotional diskutiert statt objektiv belegt.'
      ],
      solution: [
        '<strong>Live-Command-Map:</strong> Uber-Style Tracking der Crew + ETA + Schrittstatus (Anfahrt · Laden · Transit · Entladen).',
        '<strong>Digitaler Handschlag (QR):</strong> Zeitstart erst beim Scan vor Ort → Abrechnungsbetrug wird systemisch verhindert.',
        '<strong>Realtime Scope Check:</strong> Wenn etwas hinzukommt (z.B. Klavier), wird es via Scan erfasst → Preis-Ticker aktualisiert.',
        '<strong>Damage AR:</strong> Kamera auf Schaden → Vergleich mit Pre-Move Scan → „war schon da" vs. „neu" → automatisierter Versicherungsfall.'
      ],
      visual: [
        'Großer Screen mit Karte, ETA und Crew-Profil (verifiziert). Darunter ein einziger Button: <strong>„QR-Handshake starten"</strong>.',
        'Nach Scan: Timer-Leiste „Arbeitszeit läuft" + transparentes Live-Kostenband (read-only) + Leistungs-Checkliste.',
        '„Damage AR" als Kameramodus mit Overlay-Match („Pre-Scan gefunden: ja/nein") und 1-Tap „Fall eröffnen".'
      ],
      scenario: '<strong>Stell dir vor: Sarah</strong> sieht morgens die Live-Karte. Das Team ist 8 Minuten entfernt. Beim Eintreffen scannt der Teamleiter den QR-Code auf Sarahs Handy – erst jetzt startet die Uhr. Später streift ein Möbelstück an der Wand entlang. Sarah aktiviert „Damage AR", die KI vergleicht automatisch mit dem Pre-Move Scan und markiert den Schaden als „neu". Der Versicherungsfall ist in 20 Sekunden eröffnet – ohne Streit, ohne Telefonkette.'
    },
    {
      phase: 'PHASE 5',
      title: 'LANDING · Übergabe, Abnahmegarantie 2.0 & Nesting',
      subtitle: 'Konzept: Umzugscheck endet nicht am Transport. Es schützt die Kaution, orchestriert die Abgabe und wird danach zum „Haus-Handbuch" – nützlich statt gelöscht.',
      goal: '„Ich will die Wohnung stressfrei abgeben, die Kaution fair zurückerhalten – und im neuen Zuhause sofort funktionieren (Abfallkalender, Recycling, Basics)."',
      friction: [
        'Reinigungs- und Abnahme-Streit („besenrein" vs. Abgabegarantie) → Nachreinigung, Zusatzkosten.',
        'Unklare Bewertung von „Abnutzung vs. Schaden" → ungerechtfertigte Abzüge.',
        'Nach dem Umzug fehlen lokale Infos; die App wird gelöscht → kein Lifecycle-Value.'
      ],
      solution: [
        '<strong>Abnahmegarantie 2.0:</strong> Reinigung wird erst bezahlt, wenn das digitale Abnahmeprotokoll signiert ist (Escrow-Release).',
        '<strong>HEV-Protokoll digital:</strong> Vermieter/Verwaltung unterschreibt auf Tablet → sofortige, unveränderbare Protokollkopie.',
        '<strong>Lebensdauertabelle-Overlay:</strong> Bei Streit blendet die App Restwert-Logik ein („Restwert 0% → kein Abzug").',
        '<strong>Neighborhood Concierge:</strong> Abfallkalender-Push, Recyclinghof, lokale Services, opt-in Nachbarschaft.'
      ],
      visual: [
        '„Übergabe-Modus": Checkliste Raum für Raum + Foto-Proof + Signatur-Screen (Vermieter-Tablet).',
        '„Escrow-Status": Balken „Reinigung: gehalten" → „signiert" → „Zahlung freigegeben".',
        'Bei Mängeln: 1-Tap „Lebensdauer prüfen" → Overlay zeigt plausiblen Restwert / Hinweistext.',
        'Nach Einzug: „Nesting" Startscreen mit Abfallkalender, WLAN-Setup-Reminder, nächster Recyclinghof (Map-Pin).'
      ],
      scenario: '<strong>Stell dir vor: Sarah</strong> steht bei der Wohnungsabgabe. Der Vermieter markiert einen „Schaden" an der Wand. Sarah tippt auf „Lebensdauer prüfen". Die App blendet die paritätische Logik ein: „Farbe 8 Jahre alt → Restwert 0%". Das Gespräch wird sachlich, der Abzug fällt weg. Nach der Signatur wird die Reinigungszahlung automatisch freigegeben – erst jetzt. Eine Woche später erhält Sarah den lokalen Abfallkalender als Push und findet den nächsten Recyclinghof in der App.'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Umzugscheck.ch 2026 – Prozess-Spezifikation: Der Invisible Move</title>
        <meta 
          name="description" 
          content="Die detaillierte A–Z Journey-Definition für den Schweizer Markt: Visual Relocation Concierge mit Zero-UI, Preis-Transparenz und Smart-Contract-Mechanismen." 
        />
      </Helmet>

      <style>{`
        :root {
          --bg: #fafafa;
          --surface: #ffffff;
          --text: #0b0f14;
          --muted: #55606f;
          --line: rgba(11,15,20,.12);
          --shadow: 0 8px 30px rgba(11,15,20,.08);
        }
        @media (prefers-color-scheme: dark) {
          :root {
            --bg: #07090c;
            --surface: #0c1016;
            --text: #e9eef6;
            --muted: #a9b6c8;
            --line: rgba(233,238,246,.14);
            --shadow: 0 10px 30px rgba(0,0,0,.35);
          }
        }
      `}</style>

      <div 
        className="min-h-screen"
        style={{
          background: `
            radial-gradient(900px 400px at 15% 10%, rgba(88, 140, 255, .10), transparent 60%),
            radial-gradient(900px 400px at 85% 18%, rgba(40, 200, 140, .08), transparent 55%),
            var(--bg)
          `,
          color: 'var(--text)',
          fontFamily: 'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
          lineHeight: 1.55
        }}
      >
        <main className="max-w-[980px] mx-auto px-5 py-14 md:py-20">
          {/* Header */}
          <motion.header
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-7 border border-[var(--line)] rounded-[22px] shadow-[var(--shadow)]"
            style={{
              background: 'linear-gradient(180deg, rgba(255,255,255,.10), rgba(255,255,255,0))',
              backgroundColor: 'color-mix(in srgb, var(--surface) 92%, transparent)'
            }}
          >
            <p className="text-[13px] tracking-[0.12em] uppercase text-[var(--muted)] m-0 mb-2.5">
              PROJEKT-OUTPUT · MASTER PROMPT UMSETZUNG
            </p>
            <h1 className="text-[clamp(28px,3.4vw,44px)] leading-[1.12] m-0 mb-3 font-bold">
              Umzugscheck.ch 2026 – Die Prozess-Spezifikation des „Invisible Move"
            </h1>
            <p className="text-base text-[var(--muted)] m-0 max-w-[74ch]">
              Dies ist die detaillierte A–Z Journey-Definition für den Schweizer Markt: kein Kostenrechner, sondern ein{' '}
              <strong>Visual Relocation Concierge</strong>, der per Zero-UI (Kamera, GPS, LiDAR, Mikrofon) arbeitet und Vertrauen
              über Preis-Transparenz, Verifizierung und Smart-Contract-Mechanismen erzwingt.
            </p>
            <div className="grid gap-1.5 mt-4 text-[var(--muted)] text-sm">
              <span><strong>Archetyp:</strong> Magier × Fürsorger (Transformation von Chaos in Ordnung, proaktive Entlastung)</span>
              <span><strong>Tonalität:</strong> Visionär · Präzise · Schweizer Qualität · Empathisch („Wir haben das im Griff.")</span>
              <span><strong>Ziel:</strong> Branchen-Archetyp / Vorzeigemodell für den „Digital Marketing Award 2026"</span>
            </div>

            <div className="h-px bg-[var(--line)] my-5" />

            {/* Rules Box */}
            <div className="border border-[var(--line)] rounded-2xl p-5 shadow-[var(--shadow)]" style={{ backgroundColor: 'color-mix(in srgb, var(--surface) 94%, transparent)' }}>
              <h3 className="m-0 mb-2.5 text-base font-semibold">Das Gesetz des Systems (nicht verhandelbar)</h3>
              <ul className="m-0 pl-4 text-[var(--muted)]">
                <li className="my-2"><strong>Rule of One Decision:</strong> Pro Screen genau eine primäre Entscheidung – alles andere ist Kontext.</li>
                <li className="my-2"><strong>The No-Typing Decree:</strong> Wenn es gescannt, geklickt oder gesprochen werden kann, wird nicht getippt.</li>
                <li className="my-2"><strong>Transparency First:</strong> Preis- und Status-Updates in Echtzeit (keine „Offerte anfordern"-Blackbox).</li>
                <li className="my-2"><strong>Trust Architecture:</strong> Jedes Versprechen ist verifizierbar (Digital Twin, Zeit-QR, Protokoll, Escrow).</li>
                <li className="my-2"><strong>Calm vs. Power Mode:</strong> UI passt sich dem Stresslevel an – nicht umgekehrt.</li>
              </ul>
            </div>
          </motion.header>

          {/* Phases */}
          {phases.map((phase, index) => (
            <motion.div
              key={phase.phase}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <PhaseCard {...phase} />
            </motion.div>
          ))}

          {/* Visual Language */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-6 border border-[var(--line)] rounded-[22px] p-6 shadow-[var(--shadow)]"
            style={{ backgroundColor: 'color-mix(in srgb, var(--surface) 94%, transparent)' }}
          >
            <h3 className="m-0 mb-3 text-lg font-semibold">Visuelle Sprache (Farbe · Typografie · Motion)</h3>
            <p className="text-[var(--muted)] m-0 mb-4">
              Ziel: „Zero-UI" darf nicht nach „weniger" aussehen, sondern nach <strong>mehr Kontrolle</strong>.
              Jede visuelle Entscheidung dient Stressreduktion, Transparenz und Schweizer Präzision.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="inline-block text-xs tracking-[0.08em] uppercase text-[var(--muted)] border border-[var(--line)] rounded-full px-2.5 py-1.5 mb-2">Farbe</div>
                <ul className="m-0 pl-4 text-[var(--muted)] text-sm">
                  <li><strong>Neutral & hochwertig</strong> als Standard (ruhig, seriös).</li>
                  <li><strong>Grün</strong> = „Saver/Green Slot", sichtbare CO₂- und Kosten-Vorteile.</li>
                  <li><strong>Blau</strong> = Vertrauen, Verifizierung, „Smart Contract aktiv".</li>
                  <li><strong>Rot</strong> nur für Fristen/risikorelevante Ereignisse.</li>
                </ul>
              </div>
              <div>
                <div className="inline-block text-xs tracking-[0.08em] uppercase text-[var(--muted)] border border-[var(--line)] rounded-full px-2.5 py-1.5 mb-2">Typografie</div>
                <ul className="m-0 pl-4 text-[var(--muted)] text-sm">
                  <li><strong>Große, klare Zahlen</strong> für Fristen, ETA, Preis-Ticker.</li>
                  <li><strong>Kurze Sätze</strong>, keine juristischen Textwände.</li>
                  <li><strong>Einheitliche Labels</strong>: Entwurf · Bestätigt · Erledigt · Gesichert.</li>
                  <li><strong>Schweizer Tonalität</strong>: präzise, ruhig, nicht flapsig.</li>
                </ul>
              </div>
              <div>
                <div className="inline-block text-xs tracking-[0.08em] uppercase text-[var(--muted)] border border-[var(--line)] rounded-full px-2.5 py-1.5 mb-2">Motion</div>
                <ul className="m-0 pl-4 text-[var(--muted)] text-sm">
                  <li><strong>Scan-Feedback</strong> (Progress-Ring, leichte Haptik).</li>
                  <li><strong>Realtime-Updates</strong> als ruhige Ticker-Bewegung.</li>
                  <li><strong>Transitions</strong> erklären den Prozess visuell.</li>
                  <li><strong>Konflikt-Momente</strong> bekommen langsame Motion (Deeskalation).</li>
                </ul>
              </div>
            </div>
          </motion.section>

          {/* Why Win */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-4 border border-[var(--line)] rounded-[22px] p-6 shadow-[var(--shadow)]"
            style={{ backgroundColor: 'color-mix(in srgb, var(--surface) 94%, transparent)' }}
          >
            <h3 className="m-0 mb-3 text-lg font-semibold">Warum dies 2026 gewinnt</h3>
            <ul className="m-0 pl-4 text-[var(--muted)]">
              <li className="my-2"><strong>Radikaler Anti-Rechner:</strong> Volumen, Risiko und Scope werden verifiziert – nicht geschätzt.</li>
              <li className="my-2"><strong>Zero-UI als Marketing-Story:</strong> „Du tippst nicht – du zeigst." Das ist demonstrierbar, teilbar, preiswürdig.</li>
              <li className="my-2"><strong>Trust by Design:</strong> Preisgarantie, QR-Zeitstart, Protokolle, Escrow → weniger Konflikte, höhere Conversion, höhere NPS.</li>
              <li className="my-2"><strong>Ökonomie & Nachhaltigkeit:</strong> Green Slots monetarisieren Effizienz und reduzieren CO₂ sichtbar für den Nutzer.</li>
              <li className="my-2"><strong>End-to-End Lifecycle:</strong> Von Kündigung bis Nesting – nicht Lead-Weitergabe, sondern echte Orchestrierung.</li>
              <li className="my-2"><strong>Schweizer-fit:</strong> Bürokratie, Fristen, Datenschutz-Souveränität und Abnahme-Realität sind integral, nicht nachträglich.</li>
            </ul>
            <p className="mt-4 pt-4 border-t border-[var(--line)] text-[var(--muted)] text-[13px]">
              Hinweis: Dieses Dokument ist als Prozess-Archetyp und UX-Spezifikation gedacht (Vorzeigemodell).
              Rechtliche Details (OR/nDSG) und API-Integrationen werden im Produkt-Engineering in verbindliche Spezifikationen überführt.
            </p>
          </motion.section>
        </main>
      </div>
    </>
  );
});

export default BlueprintV2;
