import { Clock, Heart, Award, TrendingUp, Leaf, Package } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const usps = [
  {
    number: "1",
    icon: Clock,
    title: "Live-Preis & Verfügbarkeit in Echtzeit",
    subtitle: "Sofort sehen: Wer kann WANN, WO und für WIE VIEL umziehen",
    description: "KI-gestützter Preisrechner mit Echtzeitverfügbarkeit. Wohnungsgrösse, Etage, Distanz, Spezialobjekte eingeben – und sofort sehen, welche Umzugsfirmen verfügbar sind, Zeitfenster, realistische Preisbandbreite und optimierte Routen. Keine 5-Tage-Wartezeit mehr.",
    highlight: "Live-AI-Kalkulation statt Formular-Spam",
    ctaText: "Jetzt Preis berechnen",
    ctaLink: "/rechner",
    image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&auto=format&fit=crop"
  },
  {
    number: "2",
    icon: Heart,
    title: "Persönlicher Umzugs-Coach",
    subtitle: "Geführt durch den Stress – von Kündigung bis Einzug",
    description: "Automatisierte To-do-Listen, personalisierte Timeline, Erinnerungen per E-Mail/SMS. Pack-Anleitungen, Raumplaner, Kündigungsfristen-Tracker. Du wirst nicht allein gelassen mit 20 PDFs, sondern begleitet durch jede Phase deines Umzugs.",
    highlight: "Dein persönlicher Begleiter – nicht nur Firmenliste",
    ctaText: "Mehr erfahren",
    ctaLink: "/ratgeber",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop"
  },
  {
    number: "3",
    icon: Award,
    title: "Manipulations-sicherer Qualitäts-Score",
    subtitle: "Echte Daten statt gekaufte 5-Sterne-Bewertungen",
    description: "Umzugscheck-Score basierend auf verifizierten Kundenbewertungen, Schadensquote, Pünktlichkeit, Reaktionszeit. Nur nach abgewickelten Umzügen darf bewertet werden. Kein Fake-Rating-Spam – datenbasierte Qualitätsmessung wie Trustpilot für Umzugsfirmen.",
    highlight: "Verifizierte Qualität – nicht manipulierbar",
    ctaText: "Geprüfte Firmen ansehen",
    ctaLink: "/firmen",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop"
  },
  {
    number: "4",
    icon: TrendingUp,
    title: "Performance-Marktplatz statt Lead-Spam",
    subtitle: "Firmen zahlen nur für echte Ergebnisse – transparenter ROI",
    description: "Pay-per-Buchung oder qualifizierte Offerte, kein unnützer Lead-Spam. Umzugsfirmen sehen Kosten pro Auftrag, Auftragswert und ROI. Das bedeutet für dich: nur motivierte, qualifizierte Angebote statt 20 Standard-Mails.",
    highlight: "Klarer ROI für Firmen = bessere Offerten für dich",
    ctaText: "Offerten vergleichen",
    ctaLink: "/umzugsofferten",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop"
  },
  {
    number: "5",
    icon: Leaf,
    title: "Fair & Green zertifiziert",
    subtitle: "Faire Löhne, CO₂-optimierte Routen, transparente Umweltbilanz",
    description: "Filter nach Fair-Pay-Label, Schweizer Sozialstandards und CO₂-Kompensation. Sieh genau, wie viele Kilo CO₂ dein Umzug verursacht und wie viel davon kompensiert wird. Preis, Qualität UND Fairness auf einen Blick.",
    highlight: "Umzug mit gutem Gewissen – für Mensch & Umwelt",
    ctaText: "Faire Firmen finden",
    ctaLink: "/beste-umzugsfirma",
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop"
  },
  {
    number: "6",
    icon: Package,
    title: "Komplettes Service-Ökosystem",
    subtitle: "Umzug, Reinigung, Lagerung, Internet – alles aus einer Hand",
    description: "Endreinigung mit Abgabegarantie, Möbelmontage, Selfstorage, Internet/Strom-Wechsel, Entsorgung. Buchbare Pakete: All-in-One-Umzugspaket oder Stressfrei-Komplettservice. Nicht nur zügeln. Ankommen.",
    highlight: "Ein Portal für dein neues Lebenskapitel",
    ctaText: "Alle Services ansehen",
    ctaLink: "/dienstleistungen",
    image: "https://images.unsplash.com/photo-1556912167-f556f1f39faa?w=800&auto=format&fit=crop"
  }
];

export const WhyUmzugscheckSimple = () => {
  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-background via-secondary/10 to-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Warum umzugscheck.ch?
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Nicht nur ein Vergleichsportal – Ihr komplettes Umzugs-Ökosystem für einen stressfreien Start ins neue Zuhause
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {usps.map((usp, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative bg-card rounded-2xl overflow-hidden border border-border/50 hover:border-primary/30 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              {/* Image with overlay */}
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={usp.image} 
                  alt={usp.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
                
                {/* Number Badge */}
                <div className="absolute top-4 left-4 bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold shadow-lg">
                  {usp.number}
                </div>

                {/* Icon Badge */}
                <div className="absolute top-4 right-4 bg-primary/90 backdrop-blur-sm p-3 rounded-xl shadow-lg">
                  <usp.icon className="h-6 w-6 text-white" />
                </div>

                {/* Highlight Badge */}
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="inline-block bg-accent/90 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                    {usp.highlight}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-foreground group-hover:text-primary transition-colors">
                  {usp.title}
                </h3>
                <p className="text-sm font-medium text-primary mb-3">
                  {usp.subtitle}
                </p>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  {usp.description}
                </p>
                <Link to={usp.ctaLink}>
                  <Button variant="outline" size="sm" className="w-full group-hover:bg-primary group-hover:text-white transition-colors">
                    {usp.ctaText}
                  </Button>
                </Link>
              </div>

              {/* Decorative corner accent */}
              <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-primary/10 to-transparent rounded-br-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-16"
        >
          <p className="text-lg text-muted-foreground mb-6">
            <strong className="text-foreground">Das schweizweit führende, faire, KI-getriebene Umzugs- & Service-Ökosystem</strong>
          </p>
        </motion.div>
      </div>
    </section>
  );
};
