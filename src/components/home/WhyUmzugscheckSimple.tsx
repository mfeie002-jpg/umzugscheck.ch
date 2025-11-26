import { Clock, Heart, Award, TrendingUp, Leaf, Package } from "lucide-react";
import { motion } from "framer-motion";

const usps = [
  {
    icon: Clock,
    title: "Live-Preis & Kapazitäts-Check",
    subtitle: "Der einzige Umzugsvergleich, der wirklich sagt: Wer kann mich WANN, WO und für WIE VIEL zügeln?",
    description: "Nutzer sehen sofort verfügbare Umzugsfirmen, Zeitfenster, Fahrstrecken, geschätzte Dauer und Preisbandbreite. Die AI-Kalkulation berücksichtigt Wohnungsgrösse, Etage, Lift, Distanz und Spezialobjekte (Piano, Tresor, Aquarium). Firmen hinterlegen ihre Kapazitäten & Routen – das System matcht freie Kapazitäten und optimiert Leerfahrten.",
    highlight: "Halb live, halb AI – alles in einer Oberfläche",
    image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&auto=format&fit=crop"
  },
  {
    icon: Heart,
    title: "Der Umzugs-Coach",
    subtitle: "Nicht nur Firmen anzeigen, sondern Menschen durch ihren Umzug führen",
    description: "Personalisierter Umzugsfahrplan mit automatisch generierter To-do-Liste & Timeline (Kündigungsfristen, Nachsendeauftrag, Versicherungen, Adressänderungen). Checklisten, Erinnerungen per E-Mail/SMS, interaktive Pack-Anleitungen, Raumplaner und PDF-Checklisten zum Ausdrucken. Ihr Begleiter durch eine der stressigsten Phasen.",
    highlight: "Nicht allein gelassen mit 5 PDFs und 20 Mails",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop"
  },
  {
    icon: Award,
    title: "Fairer Qualitäts-Score",
    subtitle: "Endlich ein Rating-System, das nicht jeder kaufen oder faken kann",
    description: "Eigener Umzugscheck-Score pro Firma basierend auf verifizierten Kundenbewertungen, Schadensquote, Pünktlichkeitsrate, Reaktionszeit und Stornorate. Nur nach tatsächlich abgewickelten Umzügen über die Plattform darf bewertet werden. Datenbasierter, manipulationsarmer Qualitätsindex statt kurzfristiger 5-Stern-Spam-Bewertungen.",
    highlight: "Ähnlich Trustpilot + Telemetrie für Umzugsfirmen",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop"
  },
  {
    icon: TrendingUp,
    title: "Performance-Marktplatz",
    subtitle: "Firmen zahlen nur für das, was ihnen wirklich Geld bringt",
    description: "Kein 'Wir verkaufen dir 20 Anfragen und du schaust, was passiert'. Verschiedene Modelle: Pay-per-Buchung (Fixbetrag oder % vom Auftrag), Pay-per-verbindliche Offerte (Kunde vollständig ausgefüllt & kaufbereit), oder Abo-Modell mit inkludierten qualifizierten Leads. Firmen sehen Kosten pro Auftrag, durchschnittlicher Auftragswert und ROI pro Monat.",
    highlight: "Klarer ROI, planbare Lead-Pipelines",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop"
  },
  {
    icon: Leaf,
    title: "Fair & Green",
    subtitle: "Nicht nur günstig – auch fair zu Menschen & Umwelt",
    description: "Firmen können sich zertifizieren lassen mit Badges: Faire Löhne/Schweizer Sozialstandards, CO₂-optimierte Routen, Recycling/Entsorgung mit Partnerbetrieben. Nutzer können filtern nach Fair-Pay-Label und CO₂-Kompensation. Transparente Infos: wie viele Kilo CO₂ der Umzug verursacht und wie viel davon kompensiert wird.",
    highlight: "Preis, Qualität, Fairness, Umwelt auf einen Blick",
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop"
  },
  {
    icon: Package,
    title: "Service-Ökosystem",
    subtitle: "Ein Umzug ist nicht nur ein Auftrag, sondern der Start eines neuen Lebenskapitels",
    description: "Umzugscheck wird zur Zentrale für: Reinigung (Endreinigung mit Abgabegarantie), Malerarbeiten/kleine Reparaturen, Möbelmontage/Handyman, Selfstorage, Internet/TV/Strom/Versicherungen, Möbel- & Deko-Shops. Nutzer können Pakete buchen: All-in-One-Umzugspaket oder Stressfrei-Komplettservice inkl. Reinigung & Internet-Setup.",
    highlight: "Nicht nur zügeln. Ankommen.",
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
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {usp.description}
                </p>
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
