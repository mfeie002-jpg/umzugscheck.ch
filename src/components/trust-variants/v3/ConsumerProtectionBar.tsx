/**
 * ConsumerProtectionBar - Trusted Shops, SKS
 * V3 Konsumenten-Fokus: Käuferschutz-Organisationen
 */

import { memo } from "react";
import { Shield, Building2, CreditCard, Lock, ExternalLink } from "lucide-react";

const CONSUMER_ORGS = [
  {
    id: "sks",
    name: "Stiftung für Konsumentenschutz",
    shortName: "SKS",
    description: "Empfohlen",
    icon: Shield,
    color: "bg-green-600",
    url: "https://www.konsumentenschutz.ch",
  },
  {
    id: "trusted",
    name: "Trusted Shops",
    shortName: "Trusted Shops",
    description: "Zertifiziert",
    icon: Lock,
    color: "bg-amber-500",
    url: "https://www.trustedshops.ch",
  },
  {
    id: "mobiliar",
    name: "Die Mobiliar",
    shortName: "Mobiliar",
    description: "Versichert",
    icon: Building2,
    color: "bg-red-600",
  },
  {
    id: "twint",
    name: "TWINT",
    shortName: "TWINT",
    description: "Sichere Zahlung",
    icon: CreditCard,
    color: "bg-black",
  },
];

export const ConsumerProtectionBar = memo(() => {
  return (
    <section className="bg-success/5 py-10 border-y border-success/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h3 className="text-lg font-bold text-foreground mb-2">
            Ihr Schutz ist uns wichtig
          </h3>
          <p className="text-sm text-muted-foreground">
            Unterstützt von führenden Konsumentenschutz-Organisationen
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {CONSUMER_ORGS.map((org) => (
            <div
              key={org.id}
              className="bg-card rounded-xl p-4 border border-border hover:border-success/50 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 ${org.color} rounded-lg flex items-center justify-center shrink-0`}>
                  <org.icon className="w-5 h-5 text-white" />
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-foreground text-sm truncate">
                    {org.shortName}
                  </div>
                  <div className="text-xs text-success font-medium">
                    {org.description}
                  </div>
                </div>
                {org.url && (
                  <a
                    href={org.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ExternalLink className="w-4 h-4 text-muted-foreground" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Additional Trust Signal */}
        <div className="text-center mt-6">
          <p className="text-xs text-muted-foreground">
            Bei Problemen steht Ihnen die{" "}
            <a href="#" className="text-success hover:underline">Reklamationszentrale</a>{" "}
            zur Verfügung
          </p>
        </div>
      </div>
    </section>
  );
});

ConsumerProtectionBar.displayName = "ConsumerProtectionBar";
