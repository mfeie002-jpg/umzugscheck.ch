import { Link } from "react-router-dom";
import { Mail, CheckCircle, Star, Shield, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FooterLogo } from "@/components/ui/footer-logo";
import { useFlowPath } from "@/hooks/useUnifiedAB";

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
  const flowPath = useFlowPath();
  
  return (
    <footer className="bg-uc-footer text-uc-footer-text">
      <div className="container mx-auto px-4 py-12 md:py-16">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-10">
          {/* Logo & Description */}
          <div className="col-span-2 md:col-span-1">
            <div className="mb-4">
              <FooterLogo variant="dark" />
            </div>
            <p className="text-sm text-uc-footer-text/70 mb-3">
              Die führende Vergleichsplattform für Umzüge in der Schweiz. Kostenlos, unverbindlich, zuverlässig.
            </p>
            <div className="text-xs text-uc-footer-text/60 space-y-1 mb-4">
              <p className="font-medium text-uc-footer-text/80">Umzugscheck GmbH</p>
              <p>Bahnhofstrasse 100, 8001 Zürich</p>
              <p>CHE-xxx.xxx.xxx</p>
            </div>
            
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
            <Link to={flowPath}>
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
