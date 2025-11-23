import { CheckCircle2, TrendingDown, Shield, Clock, FileCheck, Phone } from "lucide-react";

const benefits = [
  {
    icon: TrendingDown,
    title: "Bis zu 40% günstiger",
    description: "Durch unseren Vergleich sparen Sie durchschnittlich 40% gegenüber Direktbuchungen."
  },
  {
    icon: Shield,
    title: "100% geprüfte Firmen",
    description: "Alle Partner werden von uns persönlich geprüft – Qualität, Zuverlässigkeit, Versicherung."
  },
  {
    icon: Clock,
    title: "Schnell & unkompliziert",
    description: "Offerten in 60 Sekunden anfordern. Keine langen Formulare, keine Wartezeiten."
  },
  {
    icon: FileCheck,
    title: "Transparent & unverbindlich",
    description: "Alle Preise, Services und Bewertungen auf einen Blick. Keine versteckten Kosten."
  },
  {
    icon: CheckCircle2,
    title: "Schweizweit verfügbar",
    description: "In allen 26 Kantonen verfügbar – von Zürich bis Genf, von Basel bis Lugano."
  },
  {
    icon: Phone,
    title: "Persönlicher Support",
    description: "Unser Team unterstützt Sie bei Fragen – per Telefon, E-Mail oder Chat."
  }
];

export const WhyChooseUs = () => {
  return (
    <section className="py-16 md:py-24 gradient-light">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="mb-4">Warum Umzugscheck.ch?</h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Die führende Vergleichsplattform für Umzüge in der Schweiz – 
            transparent, schnell und kostenlos.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {benefits.map((benefit, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-soft hover:shadow-medium transition-smooth">
              <div className="w-12 h-12 rounded-lg gradient-hero flex items-center justify-center mb-4">
                <benefit.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
