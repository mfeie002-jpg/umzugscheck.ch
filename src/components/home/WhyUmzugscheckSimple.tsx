import { Star, DollarSign, Zap } from "lucide-react";

const usps = [
  {
    icon: Star,
    title: "Geprüfte Qualität",
    description: "Nur verifizierte & bewertete Schweizer Umzugsfirmen.",
  },
  {
    icon: DollarSign,
    title: "100% Kostenlos",
    description: "Du zahlst nichts. Die Firmen bewerben sich bei dir.",
  },
  {
    icon: Zap,
    title: "Schnell & unkompliziert",
    description: "Offerten in Minuten statt Tagen.",
  },
];

export const WhyUmzugscheckSimple = () => {
  return (
    <section className="py-16 md:py-20 bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Warum Umzugscheck?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Die transparente Vergleichsplattform für Ihren stressfreien Umzug
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {usps.map((usp, index) => (
            <div
              key={index}
              className="text-center p-8 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-lg transition-all hover:-translate-y-1"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent mb-6 shadow-lg">
                <usp.icon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground">
                {usp.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {usp.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
