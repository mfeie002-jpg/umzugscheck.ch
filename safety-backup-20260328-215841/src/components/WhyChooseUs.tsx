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
    <section className="py-20 md:py-28 gradient-light relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.08),transparent_50%)] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(var(--accent)/0.06),transparent_50%)] pointer-events-none"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full text-sm font-semibold text-primary mb-6 border border-primary/20">
            <CheckCircle2 className="w-4 h-4" />
            <span>Ihr Vorteil</span>
          </div>
          <h2 className="mb-6 text-foreground">Warum Umzugscheck.ch?</h2>
          <p className="text-xl md:text-2xl text-foreground/70 max-w-3xl mx-auto leading-relaxed">
            Die führende Schweizer Vergleichsplattform für stressfreie Umzüge – 
            transparent, schnell und 100% kostenlos.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
          {benefits.map((benefit, index) => (
            <div 
              key={index} 
              className="bg-card border-2 border-border rounded-2xl p-8 hover:border-primary/30 hover-lift hover-shine group transition-all"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="w-14 h-14 rounded-2xl gradient-hero flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-soft">
                <benefit.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold mb-3 group-hover:text-primary transition-colors text-foreground">{benefit.title}</h3>
              <p className="text-foreground/70 leading-relaxed text-base">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
