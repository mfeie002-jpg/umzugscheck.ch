import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Facebook, Linkedin, Instagram, Shield, Award, CheckCircle } from "lucide-react";
import { Helmet } from "react-helmet";
import { FooterLogo } from "@/components/ui/footer-logo";

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
    <footer className="bg-gradient-to-br from-primary via-primary to-primary/90 text-primary-foreground pb-16 md:pb-0" role="contentinfo">
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(ORGANIZATION_SCHEMA)}
        </script>
      </Helmet>
      
      {/* Trust Bar - Enhanced */}
      <div className="border-b border-primary-foreground/10">
        <div className="container mx-auto px-4 py-4 sm:py-5">
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 md:gap-10 text-xs sm:text-sm text-primary-foreground/90">
            <span className="flex items-center gap-1.5 sm:gap-2 font-medium">
              <Shield className="h-4 w-4 sm:h-5 sm:w-5" />
              SSL-verschlüsselt
            </span>
            <span className="flex items-center gap-1.5 sm:gap-2 font-medium">
              <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5" />
              DSGVO-konform
            </span>
            <span className="flex items-center gap-1.5 sm:gap-2 font-medium">
              <Award className="h-4 w-4 sm:h-5 sm:w-5" />
              Swiss Made
            </span>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8 sm:py-10 md:py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 sm:gap-8 mb-8 sm:mb-12">
          {/* Company Info */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2 space-y-4">
            <FooterLogo variant="dark" />
            <p className="text-primary-foreground/90 text-sm leading-relaxed max-w-sm">
              Die führende Vergleichsplattform für Umzüge in der Schweiz. 
              Kostenlos, transparent und einfach.
            </p>
          </div>

          {/* Umzug planen */}
          <div>
            <h4 className="font-bold mb-4 text-primary-foreground">Umzug planen</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
              <Link to="/umzugsofferten" className="text-primary-foreground/80 hover:text-white hover:translate-x-1 transition-all inline-block">
                  Umzugskosten berechnen
                </Link>
              </li>
              <li>
                <Link to="/umzugsofferten" className="text-primary-foreground/80 hover:text-white hover:translate-x-1 transition-all inline-block">
                  Umzugsofferten vergleichen
                </Link>
              </li>
              <li>
                <Link to="/umzugsfirmen" className="text-primary-foreground/80 hover:text-white hover:translate-x-1 transition-all inline-block">
                  Alle Umzugsfirmen
                </Link>
              </li>
              <li>
                <Link to="/regionen" className="text-primary-foreground/80 hover:text-white hover:translate-x-1 transition-all inline-block">
                  Umzug nach Region
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-4 text-primary-foreground">Services</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/privatumzug" className="text-primary-foreground/80 hover:text-white hover:translate-x-1 transition-all inline-block">
                  Privatumzug
                </Link>
              </li>
              <li>
                <Link to="/firmenumzug" className="text-primary-foreground/80 hover:text-white hover:translate-x-1 transition-all inline-block">
                  Firmenumzug
                </Link>
              </li>
              <li>
                <Link to="/reinigung" className="text-primary-foreground/80 hover:text-white hover:translate-x-1 transition-all inline-block">
                  Umzugsreinigung
                </Link>
              </li>
              <li>
                <Link to="/entsorgung-raeumung" className="text-primary-foreground/80 hover:text-white hover:translate-x-1 transition-all inline-block">
                  Räumung & Entsorgung
                </Link>
              </li>
              <li>
                <Link to="/einlagerung" className="text-primary-foreground/80 hover:text-white hover:translate-x-1 transition-all inline-block">
                  Möbellager
                </Link>
              </li>
              <li>
                <Link to="/moebellift" className="text-primary-foreground/80 hover:text-white hover:translate-x-1 transition-all inline-block">
                  Möbellift
                </Link>
              </li>
            </ul>
          </div>

          {/* Informationen */}
          <div>
            <h4 className="font-bold mb-4 text-primary-foreground">Informationen</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/so-funktionierts" className="text-primary-foreground/80 hover:text-white hover:translate-x-1 transition-all inline-block">
                  So funktioniert's
                </Link>
              </li>
              <li>
                <Link to="/ratgeber" className="text-primary-foreground/80 hover:text-white hover:translate-x-1 transition-all inline-block">
                  Ratgeber
                </Link>
              </li>
              <li>
                <Link to="/ueber-uns" className="text-primary-foreground/80 hover:text-white hover:translate-x-1 transition-all inline-block">
                  Über uns
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-primary-foreground/80 hover:text-white hover:translate-x-1 transition-all inline-block">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Für Firmen */}
          <div>
            <h4 className="font-bold mb-4 text-primary-foreground">Für Firmen</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/anbieter" className="text-primary-foreground/80 hover:text-white hover:translate-x-1 transition-all inline-block">
                  Partner werden
                </Link>
              </li>
              <li>
                <Link to="/anbieter/login" className="text-primary-foreground/80 hover:text-white hover:translate-x-1 transition-all inline-block">
                  Anbieter Login
                </Link>
              </li>
              <li>
                <Link to="/kontakt" className="text-primary-foreground/80 hover:text-white hover:translate-x-1 transition-all inline-block">
                  Kontakt
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-2 md:col-span-1">
            <h4 className="font-bold mb-4 text-primary-foreground">Kontakt</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary-foreground/80" />
                <a href="mailto:info@umzugscheck.ch" className="text-primary-foreground/80 hover:text-white transition-colors">
                  info@umzugscheck.ch
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary-foreground/80" />
                <a href="tel:+41445678900" className="text-primary-foreground/80 hover:text-white transition-colors">
                  +41 44 567 89 00
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary-foreground/80" />
                <span className="text-primary-foreground/80 leading-relaxed">
                  Umzugscheck GmbH<br />
                  Bahnhofstrasse 100<br />
                  8001 Zürich
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground/20 pt-8 mt-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Copyright */}
            <p className="text-primary-foreground/70 text-sm">
              © {currentYear} Umzugscheck.ch – Alle Rechte vorbehalten
            </p>
            
            {/* Social Icons */}
            <div className="flex items-center gap-4">
              <a 
                href="https://facebook.com/umzugscheck" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a 
                href="https://linkedin.com/company/umzugscheck" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a 
                href="https://instagram.com/umzugscheck" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
            
            {/* Legal Links */}
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <Link to="/datenschutz" className="text-primary-foreground/80 hover:text-white transition-colors">
                Datenschutz
              </Link>
              <Link to="/agb" className="text-primary-foreground/80 hover:text-white transition-colors">
                AGB
              </Link>
              <Link to="/impressum" className="text-primary-foreground/80 hover:text-white transition-colors">
                Impressum
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
