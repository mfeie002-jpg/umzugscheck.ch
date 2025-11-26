import { Clock, Heart, Award, TrendingUp, Leaf, Package } from "lucide-react";
import { motion } from "framer-motion";

const usps = [
  {
    icon: Clock,
    title: "Live-Preis & Kapazitäts-Check",
    subtitle: "Echtzeit-Verfügbarkeit statt Formular-Spam",
    description: "Sehen Sie sofort verfügbare Firmen, Zeitfenster und realistische Preise. Unsere KI kalkuliert präzise basierend auf Wohnungsgrösse, Etage, Distanz und Spezialobjekten.",
    highlight: "Keine Wartezeit auf E-Mails",
    image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&auto=format&fit=crop"
  },
  {
    icon: Heart,
    title: "Ihr persönlicher Umzugs-Coach",
    subtitle: "Begleitung durch den gesamten Prozess",
    description: "Nicht nur Firmen vergleichen – wir führen Sie durch jeden Schritt. Personalisierte Checklisten, Erinnerungen und interaktive Tools für einen stressfreien Umzug.",
    highlight: "Von Kündigung bis Adressänderung",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop"
  },
  {
    icon: Award,
    title: "Fairer Qualitäts-Score",
    subtitle: "Echte Leistung statt gekaufter Sterne",
    description: "Unser datenbasierter Score berücksichtigt verifizierte Bewertungen, Schadensquote, Pünktlichkeit und Reaktionszeit. Nur nach echten Umzügen bewertbar.",
    highlight: "Manipulationssicher & transparent",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop"
  },
  {
    icon: TrendingUp,
    title: "Performance-Marktplatz",
    subtitle: "Firmen zahlen nur für Ergebnisse",
    description: "Kein Lead-Spam. Umzugsfirmen zahlen nur für qualifizierte Buchungen mit klarem ROI. Pay-per-Auftrag oder Abo-Modelle mit transparenten Kosten.",
    highlight: "Messbare Ergebnisse garantiert",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop"
  },
  {
    icon: Leaf,
    title: "Fair & Green",
    subtitle: "Das Gewissen der Umzugsbranche",
    description: "Filtern Sie nach fairen Löhnen, CO₂-optimierten Routen und Recycling-Partnern. Sehen Sie genau, wie viel CO₂ Ihr Umzug verursacht und wie viel kompensiert wird.",
    highlight: "Nachhaltig & sozial verantwortlich",
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop"
  },
  {
    icon: Package,
    title: "Komplettes Service-Ökosystem",
    subtitle: "Vom Umzug zur kompletten Lebensumstellung",
    description: "Nicht nur zügeln, sondern ankommen. Reinigung, Malerarbeiten, Möbelmontage, Internet-Setup, Versicherungen – alles aus einer Hand mit All-in-One-Paketen.",
    highlight: "Ein Ansprechpartner für alles",
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
