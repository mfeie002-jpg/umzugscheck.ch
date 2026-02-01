/**
 * StateAuthorityBar - eUmzugCH, Die Post, Kantone
 * V1 Behörden-Fokus: Staatliche Partner prominent
 */

import { memo } from "react";
import { Building, Mail, MapPin, ExternalLink, CheckCircle2 } from "lucide-react";

const STATE_PARTNERS = [
  {
    name: "Zefix/UID-Register",
    description: "Handelsregister-Eintrag",
    icon: Building,
    url: "https://www.zefix.ch",
    verified: true,
  },
  {
    name: "eUmzugCH",
    description: "Elektronische Ummeldung",
    icon: MapPin,
    url: "https://www.eumzug.swiss",
    verified: true,
  },
  {
    name: "Die Post",
    description: "Nachsendeauftrag",
    icon: Mail,
    url: "https://www.post.ch",
    verified: true,
  },
];

const CANTONS = ["ZH", "BE", "BS", "AG", "LU", "SG"];

export const StateAuthorityBar = memo(() => {
  return (
    <section className="bg-red-50 dark:bg-red-950/20 py-8 border-y border-red-100 dark:border-red-900/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-6">
          <h3 className="text-sm font-semibold text-red-800 dark:text-red-200 uppercase tracking-wide">
            Staatlich verifizierte Partner
          </h3>
        </div>

        {/* Main Partners */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          {STATE_PARTNERS.map((partner) => (
            <a
              key={partner.name}
              href={partner.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-white dark:bg-card p-4 rounded-lg border border-red-100 dark:border-red-900/50 hover:border-red-300 transition-colors group"
            >
              <div className="w-10 h-10 bg-red-100 dark:bg-red-900/50 rounded-lg flex items-center justify-center">
                <partner.icon className="w-5 h-5 text-red-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground">{partner.name}</span>
                  {partner.verified && (
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                  )}
                </div>
                <span className="text-sm text-muted-foreground">{partner.description}</span>
              </div>
              <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-red-600 transition-colors" />
            </a>
          ))}
        </div>

        {/* Cantons */}
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">Aktiv in:</span>
          {CANTONS.map((canton) => (
            <span
              key={canton}
              className="px-2 py-1 bg-white dark:bg-card text-xs font-medium rounded border border-red-100 dark:border-red-900/50"
            >
              {canton}
            </span>
          ))}
          <span className="text-sm text-muted-foreground">und weitere</span>
        </div>
      </div>
    </section>
  );
});

StateAuthorityBar.displayName = "StateAuthorityBar";
