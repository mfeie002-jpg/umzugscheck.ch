import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, CheckCircle } from "lucide-react";
import logo from "@/assets/logo.png";
import { Button } from "@/components/ui/button";

const footerLinks = {
  services: [
    { label: "Privatumzug", href: "/privatumzug" },
    { label: "Firmenumzug", href: "/firmenumzug" },
    { label: "Endreinigung", href: "/reinigung" },
    { label: "Entsorgung", href: "/entsorgung" },
    { label: "Lagerung", href: "/lagerung" },
    { label: "Spezialtransporte", href: "/spezialtransporte" }
  ],
  regions: [
    { label: "Zürich", href: "/zuerich/umzugsfirmen" },
    { label: "Bern", href: "/bern/umzugsfirmen" },
    { label: "Basel", href: "/basel/umzugsfirmen" },
    { label: "Luzern", href: "/luzern/umzugsfirmen" },
    { label: "Zug", href: "/zug" },
    { label: "Alle Regionen", href: "/regionen" }
  ],
  company: [
    { label: "Über uns", href: "/ueber-uns" },
    { label: "Für Firmen", href: "/fuer-firmen" },
    { label: "Ratgeber", href: "/ratgeber" },
    { label: "Kontakt", href: "/kontakt" },
    { label: "FAQ", href: "/faq" }
  ],
  legal: [
    { label: "AGB", href: "/agb" },
    { label: "Datenschutz", href: "/datenschutz" },
    { label: "Impressum", href: "/impressum" }
  ]
};

export const PremiumFooter = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-uc-footer text-uc-footer-text">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-block mb-6">
              <img 
                src={logo} 
                alt="Umzugscheck.ch" 
                className="h-10 w-auto brightness-0 invert"
                sizes="164px"
                width={164}
                height={40}
                loading="lazy"
              />
            </Link>
            <p className="text-uc-footer-text/70 mb-6 max-w-sm leading-relaxed">
              Die führende Schweizer Plattform für den Vergleich von Umzugsfirmen. 
              AI-gestützt, transparent und kostenlos.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <a href="mailto:info@umzugscheck.ch" className="flex items-center gap-3 text-sm text-uc-footer-text/80 hover:text-white transition-colors">
                <Mail className="h-4 w-4 text-uc-blue" />
                info@umzugscheck.ch
              </a>
              <a href="tel:+41445001234" className="flex items-center gap-3 text-sm text-uc-footer-text/80 hover:text-white transition-colors">
                <Phone className="h-4 w-4 text-uc-blue" />
                +41 44 500 12 34
              </a>
              <div className="flex items-center gap-3 text-sm text-uc-footer-text/80">
                <MapPin className="h-4 w-4 text-uc-blue" />
                Zürich, Schweiz
              </div>
            </div>
          </div>
          
          {/* Services */}
          <div>
            <h4 className="font-semibold text-white mb-4">Services</h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link, idx) => (
                <li key={idx}>
                  <Link 
                    to={link.href} 
                    className="text-sm text-uc-footer-text/70 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Regions */}
          <div>
            <h4 className="font-semibold text-white mb-4">Regionen</h4>
            <ul className="space-y-3">
              {footerLinks.regions.map((link, idx) => (
                <li key={idx}>
                  <Link 
                    to={link.href} 
                    className="text-sm text-uc-footer-text/70 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Company */}
          <div>
            <h4 className="font-semibold text-white mb-4">Unternehmen</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link, idx) => (
                <li key={idx}>
                  <Link 
                    to={link.href} 
                    className="text-sm text-uc-footer-text/70 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* CTA Section */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6 flex-wrap justify-center md:justify-start">
              <div className="flex items-center gap-2 text-sm text-uc-footer-text/70">
                <CheckCircle className="h-4 w-4 text-uc-blue" />
                100% kostenlos
              </div>
              <div className="flex items-center gap-2 text-sm text-uc-footer-text/70">
                <CheckCircle className="h-4 w-4 text-uc-blue" />
                Geprüfte Firmen
              </div>
              <div className="flex items-center gap-2 text-sm text-uc-footer-text/70">
                <CheckCircle className="h-4 w-4 text-uc-blue" />
                Schweizer Qualität
              </div>
            </div>
            <Link to="/umzugsofferten">
              <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-cta">
                Jetzt Offerten vergleichen
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-uc-footer-text/50">
              © {currentYear} Umzugscheck.ch. Alle Rechte vorbehalten.
            </p>
            <div className="flex items-center gap-6">
              {footerLinks.legal.map((link, idx) => (
                <Link 
                  key={idx}
                  to={link.href} 
                  className="text-sm text-uc-footer-text/50 hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
