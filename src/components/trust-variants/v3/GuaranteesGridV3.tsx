/**
 * GuaranteesGridV3 - 4 Garantie-Karten (erweitert)
 * V3 Konsumenten-Fokus: Emotionale Sicherheit durch Garantien
 */

import { memo } from "react";
import { Shield, RefreshCw, Clock, HeartHandshake, CheckCircle2 } from "lucide-react";

const GUARANTEES = [
  {
    icon: Shield,
    title: "Vollkasko-Versicherung",
    description: "Alle Partner sind bis CHF 2 Millionen versichert. Bei Schäden erhalten Sie vollständigen Ersatz.",
    highlight: "CHF 2 Mio.",
    color: "text-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-950/30",
  },
  {
    icon: RefreshCw,
    title: "30 Tage Geld-zurück",
    description: "Nicht zufrieden? Sie erhalten Ihr Geld zurück – ohne Wenn und Aber. Garantiert.",
    highlight: "Garantiert",
    color: "text-green-600",
    bgColor: "bg-green-50 dark:bg-green-950/30",
  },
  {
    icon: Clock,
    title: "Pünktlichkeits-Garantie",
    description: "Ihre Zeit ist wertvoll. Bei Verspätung über 30 Minuten: 10% Rabatt auf die Rechnung.",
    highlight: "10% Rabatt",
    color: "text-amber-600",
    bgColor: "bg-amber-50 dark:bg-amber-950/30",
  },
  {
    icon: HeartHandshake,
    title: "Zufriedenheits-Versprechen",
    description: "Wir vermitteln nur geprüfte Partner mit mindestens 4.5 Sternen Kundenbewertung.",
    highlight: "4.5+ Sterne",
    color: "text-purple-600",
    bgColor: "bg-purple-50 dark:bg-purple-950/30",
  },
];

export const GuaranteesGridV3 = memo(() => {
  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-success/10 px-4 py-2 rounded-full text-sm font-semibold text-success mb-4">
            <Shield className="w-4 h-4" />
            Ihre Sicherheit
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            Unsere Garantien für Sie
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Bei uns sind Sie vollständig abgesichert. Diese Versprechen geben wir Ihnen schriftlich.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {GUARANTEES.map((guarantee, idx) => (
            <div
              key={idx}
              className={`${guarantee.bgColor} rounded-2xl p-6 border border-transparent hover:border-${guarantee.color.replace('text-', '')} transition-colors`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl ${guarantee.color} bg-white dark:bg-card flex items-center justify-center shrink-0 shadow-sm`}>
                  <guarantee.icon className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-bold text-foreground">{guarantee.title}</h3>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${guarantee.color} bg-white dark:bg-card`}>
                      {guarantee.highlight}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {guarantee.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Footer */}
        <div className="text-center mt-10">
          <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <CheckCircle2 className="w-4 h-4 text-success" />
            Alle Garantien schriftlich dokumentiert und rechtlich bindend
          </div>
        </div>
      </div>
    </section>
  );
});

GuaranteesGridV3.displayName = "GuaranteesGridV3";
