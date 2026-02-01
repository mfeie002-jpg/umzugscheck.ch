/**
 * LegalFooterStrip - UID + Handelsregister-Link
 * V1 Behörden-Fokus: Rechtliche Transparenz
 */

import { memo } from "react";
import { Building2, FileText, ExternalLink, Shield } from "lucide-react";

export const LegalFooterStrip = memo(() => {
  return (
    <section className="bg-foreground text-background py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Legal Info */}
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-red-400" />
              <span>umzugscheck.ch GmbH</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-red-400" />
              <span>UID: CHE-123.456.789</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-red-400" />
              <span>MWST-Nr: CHE-123.456.789 MWST</span>
            </div>
          </div>

          {/* Verify Link */}
          <a
            href="https://www.zefix.ch/de/search/entity/welcome"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition-colors"
          >
            Im Handelsregister verifizieren
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {/* Full Legal */}
        <div className="mt-4 pt-4 border-t border-background/20 text-xs text-background/60 text-center md:text-left">
          <p>
            Sitz: Zürich, Schweiz | Eingetragen im Handelsregister des Kantons Zürich | 
            Geschäftsführer: [Name] | Zweck: Vermittlung von Umzugsdienstleistungen
          </p>
        </div>
      </div>
    </section>
  );
});

LegalFooterStrip.displayName = "LegalFooterStrip";
