import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, CheckCircle, Star, Shield, Award } from "lucide-react";
import { Button } from "@/components/ui/button";

const serviceLinks = [
  { label: "Umzugsofferten", href: "/umzugsofferten" },
  { label: "Preisrechner", href: "/rechner" },
  { label: "Umzugsfirmen", href: "/umzugsfirmen" },
  { label: "Privatumzug", href: "/privatumzug" },
  { label: "Firmenumzug", href: "/firmenumzug" },
  { label: "Reinigung", href: "/reinigung" },
];

const regionLinks = [
  { label: "Zürich", href: "/zuerich" },
  { label: "Bern", href: "/bern" },
  { label: "Basel", href: "/basel" },
  { label: "Luzern", href: "/luzern" },
  { label: "Aargau", href: "/aargau" },
  { label: "St. Gallen", href: "/st-gallen" },
  { label: "Alle Regionen", href: "/regionen" },
];

const companyLinks = [
  { label: "Über uns", href: "/ueber-uns" },
  { label: "Für Umzugsfirmen", href: "/fuer-firmen" },
  { label: "Ratgeber", href: "/ratgeber" },
  { label: "Kontakt", href: "/kontakt" },
  { label: "FAQ", href: "/faq" },
];

const legalLinks = [
  { label: "Impressum", href: "/impressum" },
  { label: "Datenschutz", href: "/datenschutz" },
  { label: "AGB", href: "/agb" },
];

export const SimplifiedFooter = () => {
  return (
    <footer className="bg-uc-footer text-uc-footer-text">
      <div className="container mx-auto px-4 py-12 md:py-16">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-10">
          {/* Logo & Description */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="inline-flex items-center gap-2 mb-4 group">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </div>
              <span className="text-xl font-bold">
                <span className="text-white">Umzugs</span>
                <span className="text-secondary">check</span>
                <span className="text-white">.ch</span>
              </span>
            </Link>
            <p className="text-sm text-uc-footer-text/70 mb-4">
              Die führende Vergleichsplattform für Umzüge in der Schweiz. Kostenlos, unverbindlich, zuverlässig.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-2">
              <a href="mailto:info@umzugscheck.ch" className="flex items-center gap-2 text-sm text-uc-footer-text/70 hover:text-white transition-colors">
                <Mail className="h-4 w-4 text-secondary" />
                info@umzugscheck.ch
              </a>
            </div>

            {/* Trust Badges */}
            <div className="flex gap-2 mt-4">
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                <Shield className="w-5 h-5 text-secondary" />
              </div>
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                <Award className="w-5 h-5 text-swiss-gold" />
              </div>
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                <Star className="w-5 h-5 text-primary" fill="currentColor" />
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-white mb-4">Services</h4>
            <ul className="space-y-2.5 text-sm">
              {serviceLinks.map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="text-uc-footer-text/70 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Regionen */}
          <div>
            <h4 className="font-semibold text-white mb-4">Regionen</h4>
            <ul className="space-y-2.5 text-sm">
              {regionLinks.map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="text-uc-footer-text/70 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Unternehmen */}
          <div>
            <h4 className="font-semibold text-white mb-4">Unternehmen</h4>
            <ul className="space-y-2.5 text-sm">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="text-uc-footer-text/70 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Rechtliches */}
          <div>
            <h4 className="font-semibold text-white mb-4">Rechtliches</h4>
            <ul className="space-y-2.5 text-sm">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="text-uc-footer-text/70 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* CTA Section */}
        <div className="py-6 border-t border-white/10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-wrap justify-center sm:justify-start">
              <div className="flex items-center gap-1.5 text-sm text-uc-footer-text/70">
                <CheckCircle className="h-4 w-4 text-secondary" />
                100% kostenlos
              </div>
              <div className="flex items-center gap-1.5 text-sm text-uc-footer-text/70">
                <CheckCircle className="h-4 w-4 text-secondary" />
                200+ geprüfte Firmen
              </div>
              <div className="flex items-center gap-1.5 text-sm text-uc-footer-text/70">
                <CheckCircle className="h-4 w-4 text-secondary" />
                Bis zu 40% sparen
              </div>
            </div>
            <Link to="/umzugsofferten">
              <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-cta font-semibold">
                Jetzt Offerten erhalten
              </Button>
            </Link>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-uc-footer-text/50">
            © {new Date().getFullYear()} Umzugscheck.ch – Alle Rechte vorbehalten
          </p>
          <div className="flex items-center gap-4 text-xs text-uc-footer-text/40">
            <span>Made with ❤️ in der Schweiz</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
