import { memo, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Copy, Check, ChevronUp, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Helmet } from 'react-helmet';

// Master Prompt for copy functionality
const MASTER_PROMPT = `ROLLE:
Du bist der Chief Product Officer & Lead UX Architect für "Umzugscheck.ch", ein visionäres Schweizer PropTech-Startup. Deine Expertise umfasst Schweizer Mietrecht, Verhaltenspsychologie (Stressmanagement) und Generative UI Design Patterns. Du hast den Auftrag, die Plattform zu entwerfen, die den "Digital Marketing Award 2026" gewinnen wird.

ZIELSETZUNG:
Entwirf den perfekten, reibungslosen Umzugsprozess (A-Z) für den Schweizer Markt. Dies ist KEIN Kostenrechner. Es ist ein "Visual Relocation Concierge". Dein Output muss eine User Journey beschreiben, die radikal schneller, sicherer und transparenter ist als jede bestehende Lösung (Movu, Comparis).

KERNPHILOSOPHIE (DAS SYSTEM):
Archetyp: Der Magier (Komplexe Backend-Logik, magisch einfaches Frontend).
Die "Zero-UI" Regel: Der Nutzer darf niemals Daten eintippen, wenn ein Sensor (Kamera, GPS, LiDAR, Mikrofon) diese erfassen kann.
Visuelle Logik: Erkläre Prozesse durch visuelle Metaphern ("Digitaler Zwilling", "Command Center", "Schutzschild").
Trust Architecture: Jeder Preis muss datengestützt sein; jedes Versprechen durch Smart Contracts gesichert.

AUFGABE:
Erstelle eine detaillierte Prozess-Spezifikation für die Phasen A bis Z. Für jede Phase definierst du:
Das Nutzer-Ziel: Was will der Kunde erreichen?
Der Friction Point: Was läuft heute falsch (Status Quo)?
Die "Umzugscheck" Lösung: Der innovative, KI-gesteuerte Mechanismus.
Visuelle Beschreibung: Beschreibe den UI-Screen oder die Interaktion bildhaft (für das Design-Team).

ZU DETAILLIERENDE PHASEN:

PHASE 1: VISUALISIERUNG (Das Inventar)
Konzept: Ersetze die "Liste" durch die "Linse".
Mechanismus: Beschreibe einen AR-basierten "Walkthrough Mode". Wie erkennt die KI Möbel, Materialien (Glas vs. Holz) und Volumen ($m^3$)? Wie wird das "Entrümpeln" (Tinder-Prinzip: Behalten/Verkaufen/Entsorgen) integriert?
Feature: "Der Stresstest" – Sentiment-Analyse zur Anpassung des UI-Designs (Calm Mode vs. Power Mode).

PHASE 2: DER MARKTPLATZ (Die Buchung)
Konzept: Dynamisches Yield Management (Reverse Auction).
Mechanismus: Umzugsfirmen bieten auf den verifizierten Digitalen Zwilling. Wie werden "Green Slots" (Leerfahrten) hervorgehoben, um Kosten und CO2 zu sparen?
Innovation: Kontextuelle Mikro-Versicherungen (Tap-to-Insure).

PHASE 3: DIE BÜROKRATIE (Der Auto-Admin)
Konzept: Automatisierte Governance.
Mechanismus: Integration der eUmzugCH API. Automatische Generierung und physischer Versand (via API) der Kündigung (Einschreiben).
Feature: "The Deposit Bridge" – Finanzierungslösung für die Mietkaution.

PHASE 4: DIE AUSFÜHRUNG (Der Umzugstag)
Konzept: Taktisches Kommando.
Mechanismus: Live-Tracking der Crew (Uber-Style). Digitaler "Handschlag" (QR-Code) für Arbeitszeit-Start.
Feature: "Damage AR" – Bei Schaden richtet der Nutzer die Kamera darauf; KI vergleicht mit Pre-Move-Scan zur sofortigen Validierung.

PHASE 5: DIE LANDUNG (Übergabe & Setup)
Konzept: Die Abnahmegarantie 2.0.
Mechanismus: Digitale Signatur des HEV-Protokolls auf dem Tablet. Verknüpfung der Reinigungs-Zahlung an die erfolgreiche Unterschrift.
Innovation: Integration der "Lebensdauertabelle" (Paritätisch) zur Abwehr ungerechtfertigter Forderungen.

FORMATIERUNG:
Nutze fette Überschriften für Phasen.
Nutze "Szenario"-Vignetten ("Stell dir vor: Sarah..."), um die UX zu illustrieren.
Füge eine Sektion "Visuelle Sprache" (Farbe, Typografie, Motion) hinzu.
Schliesse mit einem "Warum dies 2026 gewinnt"-Fazit.

TONALITY:
Visionär, Präzise, Schweizer Qualität, Nutzerzentriert.`;

// Table of Contents items
const tocItems = [
  { id: 'executive-summary', title: '1. Executive Summary', level: 1 },
  { id: 'markt-anatomie', title: '2. Markt-Anatomie', level: 1 },
  { id: 'standard-rechner', title: '2.1 Die Falle des "Standard-Rechners"', level: 2 },
  { id: 'labyrinth-buerokratie', title: '2.2 Das Labyrinth der Bürokratie', level: 2 },
  { id: 'diskrepanz-ux', title: '2.3 Die Diskrepanz der "User Experience"', level: 2 },
  { id: 'core-philosophy', title: '3. Core Build Philosophy', level: 1 },
  { id: 'visuelles-imperativ', title: '3.1 Das visuelle Imperativ', level: 2 },
  { id: 'unmoegliches-dreieck', title: '3.2 Das "Unmögliche Dreieck"', level: 2 },
  { id: 'ux-regeln', title: '3.3 UX-Regeln & Heuristiken', level: 2 },
  { id: 'idealer-prozess', title: '4. Der Ideale Prozess', level: 1 },
  { id: 'phase-1', title: 'Phase I: Visualisierung', level: 2 },
  { id: 'phase-2', title: 'Phase II: Orchestrierung', level: 2 },
  { id: 'phase-3', title: 'Phase III: Bürokratie', level: 2 },
  { id: 'phase-4', title: 'Phase IV: Ausführung', level: 2 },
  { id: 'phase-5', title: 'Phase V: Landing', level: 2 },
  { id: 'tech-spec', title: '5. Technologische Spezifikation', level: 1 },
  { id: 'genui', title: '5.1 Generative UI', level: 2 },
  { id: 'pwa', title: '5.2 Offline-First PWA', level: 2 },
  { id: 'business-model', title: '6. Business Model', level: 1 },
  { id: 'master-prompt', title: '7. Master Prompt', level: 1 },
  { id: 'rechtlicher-kontext', title: '8. Rechtlicher Kontext', level: 1 },
  { id: 'fazit', title: '9. Fazit', level: 1 },
  { id: 'referenzen', title: 'Referenzen', level: 1 },
];

// Copy Button Component
const CopyButton = memo(function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [text]);

  return (
    <Button
      onClick={handleCopy}
      variant="outline"
      size="sm"
      className="absolute top-4 right-4 gap-2 bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-300"
    >
      {copied ? (
        <>
          <Check className="w-4 h-4 text-green-400" />
          <span>Kopiert!</span>
        </>
      ) : (
        <>
          <Copy className="w-4 h-4" />
          <span>Kopieren</span>
        </>
      )}
    </Button>
  );
});

// Back to Top Button
const BackToTop = memo(function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 w-12 h-12 bg-slate-800 border border-slate-700 rounded-full flex items-center justify-center shadow-lg hover:bg-slate-700 transition-colors"
        >
          <ChevronUp className="w-5 h-5 text-slate-300" />
        </motion.button>
      )}
    </AnimatePresence>
  );
});

// Table of Contents Component
const TableOfContents = memo(function TableOfContents({ 
  activeId, 
  isOpen, 
  onToggle 
}: { 
  activeId: string; 
  isOpen: boolean;
  onToggle: () => void;
}) {
  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    if (window.innerWidth < 1024) {
      onToggle();
    }
  };

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={onToggle}
        className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 bg-slate-800 border border-slate-700 rounded-lg flex items-center justify-center shadow-lg"
      >
        {isOpen ? <X className="w-5 h-5 text-slate-300" /> : <Menu className="w-5 h-5 text-slate-300" />}
      </button>

      {/* TOC Sidebar */}
      <AnimatePresence>
        {(isOpen || window.innerWidth >= 1024) && (
          <motion.aside
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            className={cn(
              "fixed top-0 left-0 h-screen w-72 bg-slate-900/95 backdrop-blur-lg border-r border-slate-800 z-40 overflow-y-auto",
              "lg:sticky lg:top-0 lg:h-screen"
            )}
          >
            <div className="p-6 pt-20 lg:pt-6">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-4">
                Inhaltsverzeichnis
              </h2>
              <nav className="space-y-1">
                {tocItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleClick(item.id)}
                    className={cn(
                      "w-full text-left py-2 px-3 rounded-lg text-sm transition-colors",
                      item.level === 2 && "pl-6 text-xs",
                      activeId === item.id
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                    )}
                  >
                    {item.title}
                  </button>
                ))}
              </nav>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={onToggle}
        />
      )}
    </>
  );
});

// Main Blueprint Content
const BlueprintContent = memo(function BlueprintContent() {
  return (
    <article className="prose prose-invert prose-slate max-w-none">
      {/* Header */}
      <header className="not-prose mb-16 pb-8 border-b border-slate-800">
        <p className="text-sm text-slate-500 uppercase tracking-wider mb-4">Projekt Blueprint</p>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
          UMZUGSCHECK.CH – DIE DEFINITIVE ARCHITEKTUR DES "INVISIBLE MOVE"
        </h1>
        <p className="text-xl text-slate-400 mb-8">
          Eine umfassende Forschungsarbeit & Strategische Framework-Analyse für den "Digital Marketing Award Winner 2026"
        </p>
        <div className="flex flex-wrap gap-6 text-sm text-slate-500">
          <div>
            <span className="text-slate-400">Datum:</span> 28. Dezember 2025
          </div>
          <div>
            <span className="text-slate-400">Verfasst von:</span> Lead Digital Transformation Architect, PropTech Strategy Unit Switzerland
          </div>
        </div>
      </header>

      {/* Section 1 */}
      <section id="executive-summary" className="scroll-mt-8">
        <h2>1. Executive Summary: Das Manifest des "Anti-Rechners"</h2>
        <p>
          Die Schweizer Zügelbranche steht an einem entscheidenden Wendepunkt. Während die physische Logistikinfrastruktur der Schweiz – von den Strassen bis zur Bauqualität – von hoher Präzision geprägt ist, verharrt der digitale Prozess der Umzugsorganisation in einem archaischen Zustand der Fragmentierung und kognitiven Überlastung. Der Status quo wird dominiert vom "Rechner-Paradigma": Einem linearen, formularbasierten Ansatz, bei dem der Nutzer manuell Daten (Anzahl Zimmer, Quadratmeter, Kartons) eingeben muss, um statische Offerten zu erhalten. Dieses Modell ist fundamental fehlerhaft, da es die kognitive Last der Volumenschätzung auf den Nutzer abwälzt, der typischerweise über keinerlei logistische Expertise verfügt. Die Konsequenzen sind dokumentierte "Pain Points" wie massive Unterschätzung des Volumens, versteckte Kosten, Nachforderungen am Umzugstag ("Ransom Tactics") und tiefe Verbraucherverunsicherung.<sup>1</sup>
        </p>
        <p>
          Dieser Bericht liefert den umfassenden Blueprint für Umzugscheck.ch 2026. Das Ziel ist nicht die Digitalisierung einer Papier-Checkliste, sondern die Schaffung eines <strong>Generative Relocation Ecosystems</strong>. Die Kernphilosophie verschiebt die Nutzerinteraktion vom "Berechnen" (aktiver Input, hohe Fehleranfälligkeit) zum "Visualisieren" (passiver Capture, hohe Präzision) und "Concierging" (agentische Delegation).
        </p>
        <p>
          Um als "Digital Marketing Award Winner 2026" zu reüssieren und als Branchenreferenz zu dienen, muss Umzugscheck.ch einen <strong>"Zero-UI"-Ansatz</strong> verfolgen. Die Benutzeroberfläche löst sich visuell auf und wird durch KI-Agenten gesteuert, die im Hintergrund die komplexe Orchestrierung von Logistik, Bürokratie und Finanzen übernehmen. Der Kunde "füllt" keine Formulare; der Kunde "zeigt" seine Realität, und das System "generiert" die Lösung.
        </p>
        <p>
          Diese Analyse integriert die neuesten Erkenntnisse aus PropTech-Trends 2025<sup>4</sup>, Schweizer E-Government-Standards (eCH-0221)<sup>6</sup>, und Generative UI Patterns<sup>7</sup>, um eine Lösung zu entwerfen, die das "magische Dreieck" aus schnell, gut und günstig durch algorithmische Optimierung löst.
        </p>
      </section>

      <hr className="border-slate-800 my-12" />

      {/* Section 2 */}
      <section id="markt-anatomie" className="scroll-mt-8">
        <h2>2. Markt-Anatomie: Die Landschaft der Reibung & Das Vertrauensdefizit</h2>
        <p>
          Um den idealen Prozess zu definieren, müssen wir zunächst die Pathologie des bestehenden Marktes sezieren. Der Schweizer Umzugsmarkt ist derzeit fragmentiert zwischen traditionellen Logistikunternehmen, Kleinanzeigenportalen (Ricardo, Tutti) und Vermittlungsplattformen (Comparis, Movu). Diese Akteure bedienen jeweils nur Teile der Wertschöpfungskette, lassen den Kunden jedoch bei der Integration der Schritte allein.
        </p>

        <h3 id="standard-rechner" className="scroll-mt-8">2.1 Die Falle des "Standard-Rechners" und die versteckten Kosten</h3>
        <p>
          Recherchen zeigen, dass die primäre Quelle von Nutzerangst nicht der physische Transport ist, sondern die finanzielle und rechtliche Undurchsichtigkeit. Nutzer berichten von Praktiken, bei denen Umzugsfirmen am Tag des Umzugs aufgrund von Volumenabweichungen mehr Geld verlangen.<sup>3</sup> In der Schweiz, wo Arbeitskosten hoch sind (CHF 200/Tag für Hilfskräfte gelten als niedrig<sup>1</sup>), kann die Varianz zwischen einer "günstigen" Offerte und dem Endpreis Tausende von Franken betragen.
        </p>
        <p>
          Das "Rechner-Paradigma" verschärft dies. Ein Nutzer, der "3.5 Zimmer" eingibt, berücksichtigt nicht die Dichte der Möblierung, das Vorhandensein eines massiven Kirschholzschranks oder den spezifischen Wendekreis des Treppenhauses. Wenn die Umzugscrew eintrifft und die Realität nicht mit dem naiven Input des Nutzers übereinstimmt, eskalieren die Kosten. Die Vision von Umzugscheck.ch eliminiert dies radikal, indem dem Nutzer die Verantwortung für die Volumenschätzung entzogen und an Computer-Vision-Algorithmen übergeben wird.
        </p>

        <h3 id="labyrinth-buerokratie" className="scroll-mt-8">2.2 Das Labyrinth der Bürokratie</h3>
        <p>
          Ein Umzug in der Schweiz ist ein komplexes, behördenübergreifendes Ereignis, das weit über den Transport hinausgeht:
        </p>
        <ul>
          <li><strong>Kündigung (Termination):</strong> Die strikte Einhaltung offizieller Zügeltermine und die Notwendigkeit eingeschriebener Briefe sind zwingend.<sup>8</sup> Fehler hier führen zu doppelten Mietzahlungen.</li>
          <li><strong>Übergabe (Wohnungsabgabe):</strong> Die Reinigungsstandards sind notorisch hoch ("Besenrein" vs. "Abgabegarantie"). Streitigkeiten über "normale Abnutzung" versus "übermässige Schäden" gemäss den Lebensdauertabellen sind an der Tagesordnung.<sup>9</sup></li>
          <li><strong>Meldewesen (An/Abmeldung):</strong> Obwohl eUmzugCH existiert, ist die Adoption durch mangelnde Sichtbarkeit und fragmentierte Integration in private Plattformen gehemmt.<sup>11</sup></li>
        </ul>
        <p>
          Der Markt bietet derzeit keine "Golden Thread"-Lösung, die diese Silos verbindet. Ein Nutzer bucht den Transporter auf einer Seite, sucht die Reinigungskraft auf einer anderen und lädt sich ein PDF-Protokoll für die Übergabe herunter.<sup>8</sup> Umzugscheck.ch positioniert sich als die interoperable Schicht, die diese Dienste in einen einzigen narrativen Fluss bindet – ein "One-Stop-Government"-Ansatz für den Privatsektor.<sup>13</sup>
        </p>

        <h3 id="diskrepanz-ux" className="scroll-mt-8">2.3 Die Diskrepanz der "User Experience" 2025</h3>
        <p>
          Während Nutzer im E-Commerce (Amazon) oder Travel (Booking.com) an nahtlose One-Click-Erlebnisse gewöhnt sind, wirkt die Zügelbranche wie ein Relikt aus den 2000er Jahren. Dropdown-Menüs, lange Ladezeiten und fehlende mobile Optimierung führen zu Abbruchraten von über 20% in Formularen.<sup>14</sup> Die Erwartungshaltung für 2026 ist "Hyper-Personalisierung" und "Antizipation".<sup>15</sup> Das System muss wissen, dass der Nutzer Kisten benötigt, bevor der Nutzer danach sucht.
        </p>
      </section>

      <hr className="border-slate-800 my-12" />

      {/* Section 3 */}
      <section id="core-philosophy" className="scroll-mt-8">
        <h2>3. Core Build Philosophy: Der Archetyp des "Magiers"</h2>
        <p>
          Die Definition des Marken- und UX-Archetyps ist entscheidend für die Konsistenz des Designs. Umzugscheck.ch verkörpert den <strong>Magier</strong> (Transformation von Chaos in Ordnung) gepaart mit dem <strong>Fürsorger</strong> (Antizipation von Bedürfnissen).
        </p>

        <h3 id="visuelles-imperativ" className="scroll-mt-8">3.1 Das visuelle Imperativ & Spatial Computing</h3>
        <p>
          Die Anforderung lautet explizit, einen Prozess zu schaffen, den der Kunde "visuell und bildlich nachvollziehen kann". Dies korreliert direkt mit den UX-Trends 2025/2026, die sich von textbasierten Interfaces hin zu Generative UI und Spatial Computing bewegen.<sup>7</sup>
        </p>
        <ul>
          <li><strong>Alter Weg:</strong> Auswahl aus Dropdown "Sofa - 3-Sitzer".</li>
          <li><strong>Neuer Weg:</strong> Augmented Reality (AR) Ansicht, bei der der Nutzer die Kamera auf das Objekt richtet. Die KI identifiziert das Sofa, schätzt Gewicht/Volumen und blendet in Echtzeit ein "Packing Cost"-Tag ein.<sup>7</sup></li>
        </ul>
        <p>
          <strong>Implikation:</strong> Dies reduziert die kognitive Last auf null. Der Prozess wird zu einem "Spiel" der Erfassung (Gamification), statt einer Arbeit der Auflistung.
        </p>

        <h3 id="unmoegliches-dreieck" className="scroll-mt-8">3.2 Die Optimierung des "Unmöglichen Dreiecks" (Schnell, Gut, Günstig)</h3>
        <p>Um alle drei Parameter zu erfüllen, muss das System Informationsasymmetrie zugunsten des Nutzers nutzen:</p>
        <ul>
          <li><strong>Schnell:</strong> KI-Agenten verhandeln im Millisekundentakt mit Anbietern im Hintergrund.</li>
          <li><strong>Gut:</strong> Qualität wird durch algorithmische Reputationssysteme und Smart-Contract-Escrows erzwungen. Schlechte Leistung führt zu sofortigem Ausschluss aus dem Netzwerk.</li>
          <li><strong>Günstig:</strong> Durch dynamische "Reverse Auctions" und Yield Management werden Leerfahrten ("Empty Legs") genutzt. Ein Umzugsunternehmen, das ohnehin von Bern nach Zürich fährt, kann den Auftrag günstiger annehmen als eines, das extra anreist.<sup>17</sup> Das System identifiziert diese "grünen Slots" und bietet sie dem flexiblen Nutzer proaktiv an.</li>
        </ul>

        <h3 id="ux-regeln" className="scroll-mt-8">3.3 UX-Regeln & Heuristiken (Das Gesetz des Systems)</h3>
        <p>Für die KI, die den Prozess entwerfen soll, gelten folgende unverhandelbare Regeln:</p>
        <ul>
          <li><strong>Rule of "One Decision":</strong> Niemals mehr als eine primäre Entscheidung pro Screen präsentieren.</li>
          <li><strong>The "No-Typing" Decree:</strong> Wenn es gescannt, geklickt oder gesprochen werden kann, darf es nicht getippt werden. (OCR für Mietverträge, LiDAR für Räume).</li>
          <li><strong>Transparency First:</strong> Preis-Updates erfolgen in Echtzeit. Fügt der Nutzer ein Klavier hinzu, aktualisiert sich der Preis-Ticker sofort. Keine "Offerte anfordern"-Blackboxes.</li>
          <li><strong>Tone of Voice:</strong> Professionell, aber empathisch ("Wir haben das im Griff", "Fast geschafft").</li>
        </ul>
      </section>

      <hr className="border-slate-800 my-12" />

      {/* Section 4 */}
      <section id="idealer-prozess" className="scroll-mt-8">
        <h2>4. Der Ideale Prozess: A-Z Journey Mapping (Deep Dive)</h2>
        <p>
          Wir definieren nun den "Best-Case-Scenario"-Prozess. Dies ist die narrative Struktur, die der Prompt (in Kapitel 7) der KI vorgeben wird, um die visuelle Lösung zu generieren. Wir unterteilen dies in fünf Phasen der Transformation.
        </p>

        <h3 id="phase-1" className="scroll-mt-8">PHASE I: VISUALISIERUNG & ERFASSUNG ("The Magic Lens")</h3>
        <p><strong>Zeitrahmen:</strong> 1–3 Monate vor Umzug</p>
        <p>Das Ziel dieser Phase ist die Erstellung des Digitalen Zwillings des Haushalts.</p>
        
        <h4>Schritt 1.1: Das "Vibe Check" Onboarding</h4>
        <ul>
          <li><strong>Interaktion:</strong> Kein Account-Zwang zu Beginn ("Guest Checkout" Prinzip<sup>18</sup>). Der Nutzer landet auf einer visuell immersiven Seite (kein Text-Wall).</li>
          <li><strong>Eingabe:</strong> Eine einzige, natürliche Sprachfrage: "Zeig uns wo du bist, und sag uns, wo du hinwillst."</li>
          <li><strong>Innovation (Sentiment Analysis):</strong> Die KI analysiert Tippgeschwindigkeit oder Stimmlage. Bei hoher erkannter Angst (zitternde Stimme, hektische Eingabe) schaltet das UI in den "Calm Mode" (weiche Farben, Step-by-Step). Bei Effizienzorientierung in den "Power Mode" (Datendichte, schnelle Aktionen).<sup>7</sup></li>
          <li><strong>Kontextuelle Verankerung:</strong> Integration mit Swisstopo-Daten, um den Vektor "A nach B" sofort auf einer 3D-Karte zu visualisieren. Dies gibt dem Nutzer das Gefühl von Kontrolle und Orientierung.</li>
        </ul>

        <h4>Schritt 1.2: Das Inventar durch die Linse</h4>
        <p><strong>Das Problem:</strong> Listen sind langweilig und ungenau.</p>
        <p><strong>Die Lösung:</strong> Der Nutzer aktiviert den "Walkthrough Mode". Er geht mit aktiver Kamera durch die Wohnung.</p>
        <p><strong>Technologie:</strong></p>
        <ul>
          <li><strong>Computer Vision:</strong> Identifiziert Objekte in Echtzeit (Stuhl, Tisch, Lampe).</li>
          <li><strong>Volumetrie:</strong> LiDAR (auf iPhone Pro) oder Photogrammetrie schätzt Kubikmeter (m³) präzise.</li>
          <li><strong>Zustandsbericht:</strong> Die KI erkennt vorhandene Kratzer (Contrast Edge Detection) und protokolliert diese: "Bestehender Kratzer auf Parkett, Wohnzimmer." Dies schafft die Basis für die spätere Kautionsrückforderung.<sup>9</sup></li>
        </ul>
        <p><strong>Visueller Output:</strong> Ein 3D "Dollhouse"-Modell der Wohnung entsteht in Echtzeit auf dem Screen. Der Nutzer sieht sein Zuhause digitalisiert.</p>
        <p><strong>Gamification ("Entrümpelung"):</strong> Der Nutzer kann Objekte im 3D-Modell antippen und in Buckets werfen: "Behalten", "Verkaufen", "Entsorgen".</p>
        <p><strong>Insight:</strong> Dies integriert die Entrümpelung direkt in den Buchungsprozess und fördert die Kreislaufwirtschaft (Integration mit Tutti/Ricardo API).</p>

        <h3 id="phase-2" className="scroll-mt-8">PHASE II: ORCHESTRIERUNG & MARKTPLATZ ("The Matching")</h3>
        <p><strong>Zeitrahmen:</strong> 4–8 Wochen vor Umzug</p>
        <p>Hier verwandelt sich der Prozess von einem Werkzeug in einen Makler.</p>

        <h4>Schritt 2.1: Die Reverse Auction (Buchung)</h4>
        <ul>
          <li><strong>Interaktion:</strong> Der Nutzer sucht keine Umzugsfirmen. Der Digitale Zwilling seines Umzugs wird anonymisiert an ein geprüftes Netzwerk gesendet.</li>
          <li><strong>Algorithmus:</strong> Umzugsfirmen sehen das präzise 3D-Volumen und bieten darauf. Da das Volumen durch LiDAR verifiziert ist, entfällt der "Risiko-Aufschlag" für Unwägbarkeiten.</li>
          <li><strong>Yield Management:</strong> Das System identifiziert Firmen, die die Route bereits fahren ("Empty Legs").</li>
        </ul>
        <p><strong>Visueller Output:</strong> Der Nutzer erhält drei visuelle Karten (keine Liste):</p>
        <ul>
          <li><strong>Option "Saver" (Grün):</strong> Flexibles Zeitfenster, geteilter LKW, höchste CO2-Einsparung.</li>
          <li><strong>Option "Balanced":</strong> Fixer Termin, dedizierte Crew.</li>
          <li><strong>Option "Royal":</strong> Full-Service mit Packen, De-Montage und Concierge.</li>
        </ul>

        <h4>Schritt 2.2: Der Smart Contract</h4>
        <ul>
          <li><strong>Innovation:</strong> Die Buchung ist ein Smart Contract. Preisgarantie ist codiert.</li>
          <li><strong>Versicherung:</strong> Mikro-Versicherungen werden kontextuell angeboten. "Versichere diesen spezifischen OLED TV für den Transport für CHF 5". Der Nutzer tippt einfach auf den TV im 3D-Modell.<sup>20</sup></li>
        </ul>

        <h3 id="phase-3" className="scroll-mt-8">PHASE III: BÜROKRATIE & AUTOMATISIERUNG ("The Auto-Admin")</h3>
        <p><strong>Zeitrahmen:</strong> 4 Wochen vor Umzug</p>
        <p>Der Umzugscheck übernimmt die Interaktion mit dem Staat.</p>

        <h4>Schritt 3.1: Die Kündigungs-Engine</h4>
        <ul>
          <li><strong>Funktion:</strong> Das System generiert das Kündigungsschreiben (Art. 266 OR) basierend auf den Mietvertragsdaten (die via Foto-Scan eingelesen wurden).</li>
          <li><strong>Logistik:</strong> Via API zur Schweizerischen Post wird der Brief als "Einschreiben" physisch gedruckt und versendet. Der Nutzer erhält den Tracking-Code in der App als Beweis der Fristwahrung.<sup>21</sup></li>
        </ul>

        <h4>Schritt 3.2: Die eUmzugCH-Brücke</h4>
        <ul>
          <li><strong>Interaktion:</strong> Integration der kantonalen eUmzugCH-Schnittstelle.<sup>11</sup></li>
          <li><strong>Fallback:</strong> Für Gemeinden, die noch nicht angeschlossen sind, generiert das System die korrekten PDF-Formulare und versendet sie im Namen des Nutzers.</li>
          <li><strong>Utility-Switch:</strong> Automatische Umschaltung von Internet (Swisscom/Sunrise) und Strom (EKZ/EWZ) auf die neue Adresse.<sup>8</sup></li>
        </ul>

        <h3 id="phase-4" className="scroll-mt-8">PHASE IV: AUSFÜHRUNG ("The Tactical Ops")</h3>
        <p><strong>Zeitrahmen:</strong> Umzugstag</p>
        <p>Die App wird zum taktischen Dashboard.</p>

        <h4>Schritt 4.1: Live Command Center</h4>
        <ul>
          <li><strong>Visuell:</strong> Uber-Style Karte zeigt die Anfahrt des LKW.</li>
          <li><strong>Digitaler Handschlag:</strong> Bei Ankunft scannt der Teamleiter einen QR-Code auf dem Handy des Nutzers. Dies startet den offiziellen "Arbeitszeit-Timer" (verhindert Abrechnungsbetrug).</li>
        </ul>

        <h4>Schritt 4.2: Damage Control AR</h4>
        <p><strong>Szenario:</strong> Ein Kratzer passiert.</p>
        <p><strong>Lösung:</strong> Der Nutzer richtet die Kamera darauf. Die KI vergleicht das Bild mit dem Scan aus Phase I.</p>
        <ul>
          <li><strong>Match:</strong> "Schaden war schon da." (Deeskalation).</li>
          <li><strong>No Match:</strong> "Neuer Schaden." (Versicherungsfall).</li>
        </ul>
        <p><strong>Flow:</strong> Der Fall wird automatisch eröffnet, Fotos werden dem Smart Contract angehängt.</p>

        <h3 id="phase-5" className="scroll-mt-8">PHASE V: LANDING & INTEGRATION ("The Nesting")</h3>
        <p><strong>Zeitrahmen:</strong> Woche 1 im neuen Heim</p>

        <h4>Schritt 5.1: Die Abnahmegarantie 2.0</h4>
        <ul>
          <li><strong>Innovation:</strong> Die Reinigungsfirma wird erst bezahlt, wenn das digitale Abnahmeprotokoll (basierend auf HEV-Standards) vom Vermieter auf dem Tablet signiert wurde.<sup>10</sup></li>
          <li><strong>Lebensdauertabelle:</strong> Bei Diskussionen über Schäden (z.B. Wandfarbe) blendet die App die paritätische Lebensdauertabelle ein. "Die Farbe ist 8 Jahre alt. Restwert 0%. Kein Abzug erlaubt.".<sup>9</sup></li>
        </ul>

        <h4>Schritt 5.2: Der Neighborhood Concierge</h4>
        <ul>
          <li><strong>Feature:</strong> Die App löscht sich nicht. Sie wird zum "Haus-Handbuch".</li>
          <li><strong>Inhalt:</strong> Abfallkalender-Push, nächster Recyclinghof, Vorstellung der Nachbarn (opt-in).</li>
        </ul>
      </section>

      <hr className="border-slate-800 my-12" />

      {/* Section 5 */}
      <section id="tech-spec" className="scroll-mt-8">
        <h2>5. Technologische Spezifikation: Die "Brain"-Architektur</h2>
        <p>
          Um diese Vision 2026 realisieren zu können, muss der Tech-Stack modernste Standards erfüllen und gleichzeitig robust genug für den Schweizer Keller sein.
        </p>

        <div className="overflow-x-auto my-8">
          <table className="min-w-full">
            <thead>
              <tr>
                <th>Komponente</th>
                <th>Technologie / Standard</th>
                <th>Begründung</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Frontend</td>
                <td>React Native / Flutter (PWA)</td>
                <td>Cross-Platform, Offline-First Capability für Keller/Lifte.<sup>22</sup></td>
              </tr>
              <tr>
                <td>GenUI Engine</td>
                <td>Vercel AI SDK (React Server Components)</td>
                <td>Dynamische Generierung von UI-Elementen basierend auf Nutzerintent.<sup>24</sup></td>
              </tr>
              <tr>
                <td>Vision & AR</td>
                <td>ARKit (iOS) / ARCore (Android) + TensorFlow.js</td>
                <td>Client-seitige Bilderkennung für Datenschutz & Speed.</td>
              </tr>
              <tr>
                <td>Mapping</td>
                <td>Mapbox + Swisstopo API</td>
                <td>Höchste Präzision für Schweizer Adressen und Gebäudegeometrie.</td>
              </tr>
              <tr>
                <td>Bureaucracy</td>
                <td>eCH-0020 / eCH-0221 Standards</td>
                <td>Standardisierter Datenaustausch mit Schweizer Behörden.<sup>6</sup></td>
              </tr>
              <tr>
                <td>Database</td>
                <td>Graph Database (Neo4j)</td>
                <td>Modellierung der Beziehungen (Möbel → Raum → LKW → Route).</td>
              </tr>
              <tr>
                <td>Trust</td>
                <td>Blockchain / Smart Contracts</td>
                <td>Unveränderbare Speicherung von Protokollen und Zahlungsfreigaben.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 id="genui" className="scroll-mt-8">5.1 Generative UI (GenUI) Implementierung</h3>
        <p>Anstatt statische HTML-Formulare zu verwenden, nutzt die Applikation Generative UI.</p>
        <ul>
          <li><strong>Mechanismus:</strong> Ein LLM (Large Language Model) analysiert die Situation des Nutzers.</li>
          <li><strong>Dynamik:</strong> Wenn der Nutzer sagt "Ich habe viele Bücher", generiert das System ein spezifisches UI-Modul zur Berechnung von Bücherkartons (schwer, klein). Sagt er "Ich habe nur Kleider", erscheint dieses Modul nie.</li>
          <li><strong>Vorteil:</strong> Die Oberfläche "atmet". Sie ist so komplex wie nötig, aber so simpel wie möglich.<sup>25</sup></li>
        </ul>

        <h3 id="pwa" className="scroll-mt-8">5.2 Offline-First PWA Strategie</h3>
        <p>Da Umzüge oft in Neubauten (noch kein Internet) oder Untergeschossen stattfinden, ist eine Progressive Web App (PWA) Architektur zwingend.<sup>26</sup></p>
        <ul>
          <li><strong>Caching:</strong> Alle Protokolle, Inventarlisten und Kontaktdaten werden lokal im ServiceWorker gecacht.</li>
          <li><strong>Sync:</strong> Sobald wieder Konnektivität besteht (5G), synchronisiert sich der State mit der Cloud. Dies verhindert Datenverlust und Frustration am Umzugstag.<sup>27</sup></li>
        </ul>
      </section>

      <hr className="border-slate-800 my-12" />

      {/* Section 6 */}
      <section id="business-model" className="scroll-mt-8">
        <h2>6. Business Model & Monetarisierung</h2>
        <p>Um als "Award Winner" zu gelten, muss das Geschäftsmodell ebenso innovativ sein wie die UX. Wir bewegen uns weg von reinen Lead-Gebühren.<sup>28</sup></p>

        <h3>6.1 Das "Ecosystem Revenue" Modell</h3>
        <ul>
          <li><strong>Primary Stream (Dynamic Commission):</strong> Variable Kommission (10-20%) auf Logistikdienstleistungen, abhängig von Nachfrage und "Green Slot" Auslastung.</li>
          <li><strong>Secondary Stream (FinTech & InsurTech):</strong>
            <ul>
              <li><strong>Kautions-Überbrückung (Deposit Bridge):</strong> Finanzprodukt, das die neue Mietkaution vorstreckt, während auf die Rückzahlung der alten gewartet wird (Zins-Marge).</li>
              <li><strong>Mikro-Versicherungen:</strong> Kontextuelle Angebote während des Scan-Prozesses.</li>
            </ul>
          </li>
        </ul>

        <h3>6.2 Data Monetization (B2B)</h3>
        <ul>
          <li><strong>Aggregierte Insights:</strong> Daten über Umzugsströme (Zuzug/Wegzug) sind wertvoll für Gemeinden, Immobilienentwickler und Retailer (z.B. IKEA: "Wohin ziehen junge Familien?").</li>
          <li><strong>SaaS für Umzugsfirmen:</strong> Die "Command Center" App für die Fahrer wird als SaaS-Lösung lizenziert, was die Anbieter an die Plattform bindet (Lock-in).<sup>29</sup></li>
        </ul>
      </section>

      <hr className="border-slate-800 my-12" />

      {/* Section 7 - Master Prompt */}
      <section id="master-prompt" className="scroll-mt-8">
        <h2>7. DIE UMFASSENDE "MASTER PROMPT" ARCHITEKTUR (Das Deliverable)</h2>
        <p>
          Dies ist der Kern-Output, den der Kunde einer anderen KI (z.B. Claude 3.5 Sonnet, GPT-4o) geben kann, um die detaillierten Wireframes, User Stories und Designs zu generieren.
        </p>
        
        <div className="not-prose relative my-8 bg-slate-900 border border-slate-700 rounded-xl overflow-hidden">
          <CopyButton text={MASTER_PROMPT} />
          <pre className="p-6 pt-16 overflow-x-auto text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
            {MASTER_PROMPT}
          </pre>
        </div>
      </section>

      <hr className="border-slate-800 my-12" />

      {/* Section 8 */}
      <section id="rechtlicher-kontext" className="scroll-mt-8">
        <h2>8. Rechtlicher Kontext & Schweizer Spezifika (Integration)</h2>
        <p>Eine "Branchenreferenz" muss juristisch wasserdicht sein. Der Prozess berücksichtigt zwingend:</p>

        <h3>8.1 Mietrechtliche Integration (OR)</h3>
        <ul>
          <li><strong>Kündigungsfristen:</strong> Das System kennt die ortsüblichen Kündigungstermine (oft Ende März, Juni, September im Kanton Zürich) und warnt den Nutzer proaktiv per Push-Notification, wenn ein Termin droht zu verfallen.<sup>30</sup></li>
          <li><strong>Einschreiben-Zwang:</strong> Da Kündigungen rechtlich nur gültig sind, wenn sie empfangen wurden, nutzt das System Tracking-APIs der Post, um dem Nutzer die Zustellung juristisch verwertbar zu bestätigen.</li>
        </ul>

        <h3>8.2 Datenschutz (nDSG)</h3>
        <ul>
          <li><strong>Data Sovereignty:</strong> Die sensiblen Daten des "Digital Twin" (Fotos der Wohnung) müssen in der Schweiz gehostet werden (Swiss Cloud).<sup>31</sup></li>
          <li><strong>Anonymisierung:</strong> Bei der Ausschreibung an Umzugsfirmen ("Reverse Auction") werden Adresse und Name maskiert. Die Firmen sehen nur PLZ-Regionen und Volumina, um "Predatory Pricing" oder Belästigung zu verhindern.</li>
        </ul>
      </section>

      <hr className="border-slate-800 my-12" />

      {/* Section 9 */}
      <section id="fazit" className="scroll-mt-8">
        <h2>9. Fazit: Der Weg zum "Invisible Move"</h2>
        <p>
          Der hier definierte Prozess für Umzugscheck.ch stellt einen Paradigmenwechsel dar. Er transformiert den Umzug von einer Serie unverbundener, stressiger Transaktionen in einen einzigen, fliessenden Service-Strom.
        </p>
        <p>
          Indem wir Computer Vision nutzen, um die Realität zu digitalisieren, und Generative UI, um die Komplexität zu verbergen, lösen wir die Informationsasymmetrie auf, die die Branche seit Jahrzehnten plagt. Es entsteht ein System, in dem der Nutzer nicht mehr Bittsteller ist, sondern Kommandant – unterstützt durch eine KI, die wie ein erfahrener Concierge agiert.
        </p>
        <p>
          Das Resultat ist ein Prozess, der so visuell intuitiv ist, dass er kaum erklärt werden muss. Er ist <strong>schnell</strong> (durch Automatisierung), <strong>gut</strong> (durch Verifizierung) und <strong>günstig</strong> (durch Effizienz). Dies ist die Definition einer Branchenreferenz für 2026.
        </p>
      </section>

      <hr className="border-slate-800 my-12" />

      {/* References */}
      <section id="referenzen" className="scroll-mt-8">
        <h2>Anhang: Referenzierte Forschungsmaterialien</h2>
        <p>Die Analyse stützt sich auf umfassende Marktdaten und technische Standards:</p>
        <ul>
          <li>Prozesse & Checklisten: <sup>8</sup></li>
          <li>Markt-Pain Points: <sup>1</sup></li>
          <li>Technologie & GenUI: <sup>7</sup></li>
          <li>Schweizer Standards: <sup>9</sup> (Lebensdauer), <sup>11</sup> (eUmzugCH), <sup>6</sup> (eCH), <sup>21</sup> (Post)</li>
          <li>PropTech Trends: <sup>4</sup></li>
        </ul>

        <h3>Referenzen</h3>
        <ol className="text-sm text-slate-400 space-y-2">
          <li>Finger weg von Movu – total unprofessionell und unehrlich : r/Switzerland - Reddit</li>
          <li>The top pain points of running a moving company - MoversTech CRM</li>
          <li>Understanding the Bad Reputation of the Moving Industry: Scams, Pitfal - Caddy Moving</li>
          <li>Proptech Trends in 2025: What to Expect in Real Estate Technology - ButterflyMX</li>
          <li>PropTech Industry Landscape and Projections (2025-2030)</li>
          <li>eCH-0221 Referenzmodell eUmzug CH V1.1.0 | eCH E-Government Standards</li>
          <li>Generative UI for Flutter: Build Adaptive, Branded, and Intelligent User Experiences</li>
          <li>Checkliste Umzug - EKZ</li>
          <li>Wohnungsabnahmeprotokoll – Mängelliste - Mieterverband</li>
          <li>Wohnungsabgabe - HEV Schweiz</li>
          <li>Merkblatt zur Positionierung/Verlinkung eUmzugCH auf der Website der Gemeinde/Stadt</li>
          <li>eUmzugCH - eOperations</li>
          <li>Implement one-stop government - Digital Public Services Switzerland</li>
          <li>12 Form UI/UX Design Best Practices to Follow in 2025</li>
          <li>Top 9 real estate tech trends for 2025 - Blog | ShareFile</li>
          <li>UX Design Without Designers? How LLMs Are Rewriting UI in Real Time - FRANKI T</li>
          <li>Best Service Marketplaces to Learn From in 2025 - Shipturtle</li>
          <li>Checkout UX Best Practices 2025 – Baymard Institute</li>
          <li>Adaptive UI for Seamless Multi-Device Experiences</li>
          <li>Checkliste für Umzug: Die Zügelliste für die Schweiz (2025) - Allianz</li>
          <li>Authorizations at Swiss Post</li>
          <li>How Progressive Web Apps (PWAs) Optimize US Logistics and Transportation Companies</li>
          <li>Progressive Web App Examples That Show Why Your Business Needs One</li>
          <li>Introducing AI SDK 3.0 with Generative UI support - Vercel</li>
          <li>How Generative UI and AI-First Interaction Are Changing Design, Business, and Trust</li>
          <li>Progressive Web Apps in the Future of Website Interface Design - Withum</li>
          <li>The PWA Revolution: Why Aren't We Embracing It? : r/sveltejs - Reddit</li>
          <li>7 Marketplace Business Models You Should Know in 2025: Complete Guide</li>
          <li>EasyGov.swiss lanciert neues Update mit SHAB-Meldungen und Markenanmeldungen</li>
          <li>Checkliste Umzug - Mieterverband</li>
          <li>Swiss alternatives to ChatGPT - Providers from Switzerland - Swiss Made Software</li>
          <li>Checkliste «Umzug in mein Eigenheim» - GKB</li>
          <li>Checkliste für den Umzug - ch.ch</li>
          <li>Commercial Real Estate & PropTech Trends: 2025 Outlook | Espresso Capital</li>
        </ol>
      </section>
    </article>
  );
});

// Main Page Component
const Blueprint = memo(function Blueprint() {
  const [activeId, setActiveId] = useState('executive-summary');
  const [tocOpen, setTocOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-100px 0px -80% 0px' }
    );

    tocItems.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Helmet>
        <title>Umzugscheck.ch – Blueprint 2026 | Invisible Move</title>
        <meta 
          name="description" 
          content="Der umfassende Blueprint für Umzugscheck.ch 2026 – die Schaffung eines Generative Relocation Ecosystems für die Schweizer Zügelbranche." 
        />
      </Helmet>

      <div className="min-h-screen bg-slate-950 text-slate-200">
        {/* TOC */}
        <TableOfContents 
          activeId={activeId} 
          isOpen={tocOpen}
          onToggle={() => setTocOpen(!tocOpen)}
        />

        {/* Main Content */}
        <main className="lg:ml-72 min-h-screen">
          <div className="max-w-4xl mx-auto px-6 py-12 lg:py-20">
            <BlueprintContent />
          </div>
        </main>

        {/* Back to Top */}
        <BackToTop />
      </div>
    </>
  );
});

export default Blueprint;
