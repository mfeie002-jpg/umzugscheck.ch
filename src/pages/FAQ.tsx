import { SimplifiedFooter } from "@/components/home/SimplifiedFooter";
import { StickyMobileCTA } from "@/components/StickyMobileCTA";
import { EmotionalHero } from "@/components/home/EmotionalHero";
import { GradientCTA } from "@/components/home/GradientCTA";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Card } from "@/components/ui/card";
import { HelpCircle } from "lucide-react";
import { Helmet } from "react-helmet";

const faqCategories = [
  {
    title: "Offerten",
    icon: "📋",
    questions: [
      {
        q: "Wie erhalte ich Umzugsofferten?",
        a: "Füllen Sie einfach unser kurzes Formular aus. Sie erhalten innerhalb von 24 Stunden kostenlose Offerten von geprüften Umzugsfirmen in Ihrer Region."
      },
      {
        q: "Sind die Offerten wirklich kostenlos?",
        a: "Ja, 100% kostenlos und unverbindlich. Sie zahlen nichts für den Vergleich oder die Offerten – nur für den Umzug selbst, falls Sie sich für eine Firma entscheiden."
      },
      {
        q: "Wie viele Offerten erhalte ich?",
        a: "In der Regel erhalten Sie 3-5 Offerten von verschiedenen Umzugsfirmen, die zu Ihren Anforderungen passen."
      },
      {
        q: "Muss ich alle Firmen kontaktieren?",
        a: "Nein, die Firmen kontaktieren Sie. Sie können in Ruhe die Offerten vergleichen und sich dann für Ihren Favoriten entscheiden."
      },
      {
        q: "Wie lange ist eine Offerte gültig?",
        a: "Die meisten Offerten sind 30 Tage gültig. Details finden Sie in der jeweiligen Offerte."
      }
    ]
  },
  {
    title: "Preise",
    icon: "💰",
    questions: [
      {
        q: "Was kostet ein Umzug in der Schweiz?",
        a: "Die Kosten variieren je nach Wohnungsgröße, Distanz und Services. Ein 2-Zimmer-Umzug kostet durchschnittlich CHF 800-1'500, ein 3-Zimmer-Umzug CHF 1'200-2'200."
      },
      {
        q: "Welche Faktoren beeinflussen den Preis?",
        a: "Hauptfaktoren sind: Wohnungsgröße, Distanz, Stockwerk (mit/ohne Lift), Volumen des Umzugsguts, Zusatzservices wie Reinigung oder Montage, und Umzugstermin (Wochenende/Ferienzeit teurer)."
      },
      {
        q: "Kann ich durch Vergleich wirklich sparen?",
        a: "Ja! Erfahrungsgemäß sparen Nutzer durch den Vergleich zwischen 20-40% gegenüber der ersten Offerte."
      },
      {
        q: "Gibt es versteckte Kosten?",
        a: "Bei seriösen Umzugsfirmen nicht. Achten Sie darauf, dass alle Leistungen in der Offerte aufgeführt sind. Umzugscheck.ch arbeitet nur mit geprüften Firmen."
      },
      {
        q: "Wann ist ein Umzug am günstigsten?",
        a: "Umzüge unter der Woche und außerhalb der Ferienzeit (Sommer/Jahresende) sind meist günstiger als Wochenenden und Hauptsaison."
      }
    ]
  },
  {
    title: "Ablauf",
    icon: "📦",
    questions: [
      {
        q: "Wie läuft ein Umzug ab?",
        a: "1) Offerte einholen 2) Firma auswählen 3) Termin vereinbaren 4) Umzugsgut vorbereiten 5) Profis führen Umzug durch 6) Abnahme und Zahlung."
      },
      {
        q: "Wie lange dauert ein Umzug?",
        a: "Ein 2-Zimmer-Umzug dauert ca. 4-6 Stunden, ein 3-Zimmer-Umzug 6-8 Stunden, ein 4-Zimmer-Umzug 8-10 Stunden. Abhängig von Distanz und Aufwand."
      },
      {
        q: "Muss ich selbst packen?",
        a: "Das entscheiden Sie. Viele Firmen bieten Packservice an (gegen Aufpreis). Selbst packen spart Geld, ist aber zeitaufwendig."
      },
      {
        q: "Was passiert mit meinen Möbeln?",
        a: "Die Umzugsfirma trägt Ihre Möbel aus, lädt sie auf den LKW, transportiert sie und stellt sie am neuen Ort auf. Montage und Demontage sind meist optional."
      },
      {
        q: "Wie weit im Voraus muss ich buchen?",
        a: "Mindestens 2-3 Wochen vor dem Umzugstermin. In der Hauptsaison (Sommer, Monatsende) besser 4-6 Wochen."
      }
    ]
  },
  {
    title: "Qualität & Firmenprüfung",
    icon: "✅",
    questions: [
      {
        q: "Sind alle Firmen geprüft?",
        a: "Ja, wir arbeiten nur mit verifizierten Umzugsfirmen, die unsere Qualitätskriterien erfüllen und positive Kundenbewertungen haben."
      },
      {
        q: "Wie werden die Firmen bewertet?",
        a: "Wir sammeln echte Kundenbewertungen und prüfen regelmäßig Zuverlässigkeit, Professionalität, Pünktlichkeit und Schadenfreiheit."
      },
      {
        q: "Was passiert bei schlechtem Service?",
        a: "Kontaktieren Sie uns bei Problemen. Wir nehmen Beschwerden ernst und entfernen unseriöse Firmen aus unserem Netzwerk."
      },
      {
        q: "Gibt es eine Garantie?",
        a: "Die Umzugsfirma selbst haftet für Schäden. Achten Sie darauf, dass die Firma versichert ist (steht in der Offerte)."
      },
      {
        q: "Kann ich Bewertungen sehen?",
        a: "Ja, jede Firma hat ein Profil mit echten Kundenbewertungen und Sternebewertung."
      }
    ]
  },
  {
    title: "Versicherung & Sicherheit",
    icon: "🔒",
    questions: [
      {
        q: "Sind meine Sachen versichert?",
        a: "Ja, seriöse Umzugsfirmen haben eine Transportversicherung. Details stehen in der Offerte. Wertsachen sollten Sie ggf. zusätzlich versichern."
      },
      {
        q: "Was passiert bei Schäden?",
        a: "Schäden müssen sofort gemeldet werden. Die Umzugsfirma oder ihre Versicherung reguliert den Schaden gemäß Versicherungsbedingungen."
      },
      {
        q: "Wie sicher sind meine Daten?",
        a: "Ihre Daten werden nach Schweizer Datenschutzgesetz behandelt und nur an die von Ihnen ausgewählten Firmen weitergegeben."
      },
      {
        q: "Kann ich der Firma vertrauen?",
        a: "Alle Firmen auf Umzugscheck.ch sind geprüft und verifiziert. Sie sehen echte Kundenbewertungen zur Orientierung."
      },
      {
        q: "Was ist bei Zahlungen zu beachten?",
        a: "Zahlen Sie erst nach erfolgreichem Umzug. Seriöse Firmen verlangen keine Vorauszahlung. Bar oder Rechnung sind üblich."
      }
    ]
  }
];

const FAQ = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>FAQ - Häufige Fragen | Umzugscheck.ch</title>
        <meta 
          name="description" 
          content="Antworten auf häufig gestellte Fragen zu Umzugsofferten, Preisen, Ablauf, Qualität und Versicherung. Alles was Sie über Ihren Umzug wissen müssen."
        />
      </Helmet>

      {/* Hero */}
      <EmotionalHero
        title="Häufige Fragen zum Umzug"
        subtitle="Hier findest du alle Antworten rund um Offerten, Preise und Ablauf."
        primaryCTA={{
          text: "Kostenlose Offerte erhalten",
          link: "/umzugsofferten"
        }}
        badgeText="Alles was du wissen musst"
        trustBadges={false}
        backgroundImage="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1920&q=80"
      />

      <main>
        {/* FAQ Categories */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {faqCategories.map((category, categoryIndex) => (
                <ScrollReveal key={categoryIndex}>
                  <Card className="mb-8 p-6 md:p-8 shadow-medium hover:shadow-strong transition-shadow">
                    <div className="flex items-center gap-3 mb-6">
                      <span className="text-4xl">{category.icon}</span>
                      <h2 className="text-2xl md:text-3xl font-bold">{category.title}</h2>
                    </div>

                    <Accordion type="single" collapsible className="w-full">
                      {category.questions.map((faq, faqIndex) => (
                        <AccordionItem key={faqIndex} value={`item-${categoryIndex}-${faqIndex}`}>
                          <AccordionTrigger className="text-left text-base md:text-lg font-semibold hover:text-primary">
                            <div className="flex items-start gap-3">
                              <HelpCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                              <span>{faq.q}</span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="text-muted-foreground pl-8 pt-2">
                            {faq.a}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </Card>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Block */}
        <GradientCTA
          title="Noch Fragen? Erhalte jetzt kostenlose Offerten."
          description="Starte deinen stressfreien Umzug in nur 2 Minuten"
          buttonText="Kostenlose Offerten starten"
          buttonLink="/umzugsofferten"
        />
      </main>

      <SimplifiedFooter />
      <StickyMobileCTA />
    </div>
  );
};

export default FAQ;
