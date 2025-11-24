import { Shield, Heart, Zap, Award, Users, TrendingUp, Clock, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const benefits = [
  {
    icon: Shield,
    title: "Schweizer Qualität",
    description: "100% in der Schweiz entwickelt und betrieben. Höchste Qualitätsstandards nach Schweizer Norm.",
    color: "text-primary",
    gradient: "from-primary/10 to-primary/5"
  },
  {
    icon: Heart,
    title: "Familiengeführtes Unternehmen",
    description: "Persönliche Betreuung mit Herz. Bei uns sind Sie keine Nummer, sondern ein geschätzter Kunde.",
    color: "text-accent",
    gradient: "from-accent/10 to-accent/5"
  },
  {
    icon: Award,
    title: "White-Glove Service",
    description: "Premium-Umzugsservice mit höchster Sorgfalt. Ihre Möbel und Gegenstände sind bei uns in besten Händen.",
    color: "text-warning",
    gradient: "from-warning/10 to-warning/5"
  },
  {
    icon: Zap,
    title: "KI-gestützte Preisberechnung",
    description: "Modernste Technologie für transparente Preise. Unser KI-Rechner berücksichtigt alle relevanten Faktoren.",
    color: "text-info",
    gradient: "from-info/10 to-info/5"
  },
  {
    icon: Clock,
    title: "Schnelle Reaktionszeiten",
    description: "Antwort innerhalb von 2 Stunden garantiert. Wir wissen, dass Zeit bei einem Umzug kostbar ist.",
    color: "text-success",
    gradient: "from-success/10 to-success/5"
  },
  {
    icon: TrendingUp,
    title: "Extra-Mile Mentalität",
    description: "Wir gehen die Extra-Meile für Sie. Ihr Erfolg ist unser Erfolg – wir geben immer 110%.",
    color: "text-primary",
    gradient: "from-primary/10 to-primary/5"
  }
];

export const PremiumWhyChooseUs = () => {
  return (
    <section className="py-20 md:py-28 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/10 to-background pointer-events-none"></div>
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 bg-gradient-premium text-white px-5 py-2 rounded-full text-sm font-semibold mb-6 shadow-accent">
            <Award className="w-5 h-5" />
            <span>Premium Unterschied</span>
          </div>
          <h2 className="mb-6">
            Warum <span className="bg-gradient-premium bg-clip-text text-transparent">Umzugscheck.ch</span>?
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Als <strong className="text-foreground">familiengeführtes Schweizer Unternehmen</strong> verbinden wir 
            modernste KI-Technologie mit persönlichem Service und Schweizer Qualität.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
          {benefits.map((benefit, index) => (
            <Card
              key={index}
              className="border-2 border-border hover:border-primary/30 hover-lift hover-shine group transition-all relative overflow-hidden"
              style={{ animationDelay: `${index * 75}ms` }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${benefit.gradient} opacity-0 group-hover:opacity-100 transition-opacity`}></div>
              
              <CardContent className="p-8 relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-gradient-premium flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-soft">
                  <benefit.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                  {benefit.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {benefit.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional trust section */}
        <div className="mt-16 max-w-4xl mx-auto">
          <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
            <CardContent className="p-8 md:p-12">
              <div className="text-center">
                <Users className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-4">Unser Versprechen an Sie</h3>
                <div className="grid md:grid-cols-2 gap-4 text-left">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-1" />
                    <p className="text-muted-foreground">
                      <strong className="text-foreground">Transparenz:</strong> Keine versteckten Kosten, faire Preise
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-1" />
                    <p className="text-muted-foreground">
                      <strong className="text-foreground">Qualität:</strong> Nur geprüfte Schweizer Umzugsfirmen
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-1" />
                    <p className="text-muted-foreground">
                      <strong className="text-foreground">Service:</strong> Persönliche Betreuung von Anfang bis Ende
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-1" />
                    <p className="text-muted-foreground">
                      <strong className="text-foreground">Innovation:</strong> Modernste KI für beste Ergebnisse
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};