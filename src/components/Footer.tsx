import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";
import { Helmet } from "react-helmet";
import logo from "@/assets/umzugscheck-logo.png";

const ORGANIZATION_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Umzugscheck.ch",
  "url": "https://umzugscheck.ch",
  "logo": "https://umzugscheck.ch/assets/umzugscheck-logo.png",
  "description": "Die führende Vergleichsplattform für Umzüge in der Schweiz. Kostenlos, transparent und einfach.",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+41-44-567-89-00",
    "contactType": "customer service",
    "email": "info@umzugscheck.ch",
    "areaServed": "CH",
    "availableLanguage": ["German", "French", "Italian"]
  },
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Bahnhofstrasse 100",
    "addressLocality": "Zürich",
    "postalCode": "8001",
    "addressCountry": "CH"
  },
  "sameAs": [
    "https://www.facebook.com/umzugscheck",
    "https://www.linkedin.com/company/umzugscheck",
    "https://www.instagram.com/umzugscheck",
    "https://twitter.com/umzugscheck"
  ]
};

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-primary-foreground">
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(ORGANIZATION_SCHEMA)}
        </script>
      </Helmet>
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Company Info */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center hover:opacity-90 transition-opacity">
              <img 
                src={logo} 
                alt="Umzugscheck.ch Logo" 
                className="h-16 w-auto"
              />
            </Link>
            <p className="text-primary-foreground/80 text-sm leading-relaxed">
              Die führende Vergleichsplattform für Umzüge in der Schweiz. 
              Kostenlos, transparent und einfach.
            </p>
          </div>

          {/* Umzug planen */}
          <div>
            <h4 className="font-bold mb-4">Umzug planen</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/umzugsrechner" className="text-primary-foreground/80 hover:text-white transition-base">
                  Umzugskosten berechnen
                </Link>
              </li>
              <li>
                <Link to="/umzug-offerte" className="text-primary-foreground/80 hover:text-white transition-base">
                  Umzugsofferten vergleichen
                </Link>
              </li>
              <li>
                <Link to="/umzugsfirmen-schweiz" className="text-primary-foreground/80 hover:text-white transition-base">
                  Alle Umzugsfirmen
                </Link>
              </li>
              <li>
                <Link to="/regionen" className="text-primary-foreground/80 hover:text-white transition-base">
                  Umzug nach Region
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-4">Services</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/umzug-schweiz" className="text-primary-foreground/80 hover:text-white transition-base">
                  Privatumzug
                </Link>
              </li>
              <li>
                <Link to="/firmenumzug-schweiz" className="text-primary-foreground/80 hover:text-white transition-base">
                  Firmenumzug
                </Link>
              </li>
              <li>
                <Link to="/umzugsreinigung-schweiz" className="text-primary-foreground/80 hover:text-white transition-base">
                  Umzugsreinigung
                </Link>
              </li>
              <li>
                <Link to="/entsorgung-schweiz" className="text-primary-foreground/80 hover:text-white transition-base">
                  Räumung & Entsorgung
                </Link>
              </li>
            </ul>
          </div>

          {/* Informationen */}
          <div>
            <h4 className="font-bold mb-4">Informationen</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/ratgeber" className="text-primary-foreground/80 hover:text-white transition-base">
                  Ratgeber
                </Link>
              </li>
              <li>
                <Link to="/so-funktionierts" className="text-primary-foreground/80 hover:text-white transition-base">
                  So funktioniert's
                </Link>
              </li>
              <li>
                <Link to="/ueber-uns" className="text-primary-foreground/80 hover:text-white transition-base">
                  Über uns
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-primary-foreground/80 hover:text-white transition-base">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Für Firmen */}
          <div>
            <h4 className="font-bold mb-4">Für Firmen</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/anbieter" className="text-primary-foreground/80 hover:text-white transition-base">
                  Partner werden
                </Link>
              </li>
              <li>
                <Link to="/anbieter/login" className="text-primary-foreground/80 hover:text-white transition-base">
                  Anbieter Login
                </Link>
              </li>
              <li>
                <Link to="/kontakt" className="text-primary-foreground/80 hover:text-white transition-base">
                  Kontakt
                </Link>
              </li>
              <li>
                <Link to="/auth" className="text-primary-foreground/80 hover:text-white transition-base">
                  Admin Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold mb-4">Kontakt</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <a href="mailto:info@umzugscheck.ch" className="text-primary-foreground/80 hover:text-white transition-base">
                  info@umzugscheck.ch
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <a href="tel:+41445678900" className="text-primary-foreground/80 hover:text-white transition-base">
                  +41 44 567 89 00
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span className="text-primary-foreground/80">
                  Umzugscheck GmbH<br />
                  Bahnhofstrasse 100<br />
                  8001 Zürich
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-primary-foreground/60">
            <p>© {currentYear} Umzugscheck.ch – Alle Rechte vorbehalten</p>
            <div className="flex gap-6">
              <Link to="/datenschutz" className="hover:text-white transition-base">
                Datenschutz
              </Link>
              <Link to="/agb" className="hover:text-white transition-base">
                AGB
              </Link>
              <Link to="/impressum" className="hover:text-white transition-base">
                Impressum
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
