import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";

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
    <footer className="bg-foreground text-background/80">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-block mb-6">
              <span className="text-2xl font-bold text-background">
                Umzugscheck<span className="text-primary">.ch</span>
              </span>
            </Link>
            <p className="text-background/70 mb-6 max-w-sm leading-relaxed">
              Die führende Schweizer Plattform für den Vergleich von Umzugsfirmen. 
              AI-gestützt, transparent und kostenlos.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <a href="mailto:info@umzugscheck.ch" className="flex items-center gap-3 text-sm hover:text-primary transition-colors">
                <Mail className="h-4 w-4" />
                info@umzugscheck.ch
              </a>
              <a href="tel:+41445001234" className="flex items-center gap-3 text-sm hover:text-primary transition-colors">
                <Phone className="h-4 w-4" />
                +41 44 500 12 34
              </a>
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="h-4 w-4" />
                Zürich, Schweiz
              </div>
            </div>
          </div>
          
          {/* Services */}
          <div>
            <h4 className="font-semibold text-background mb-4">Services</h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link, idx) => (
                <li key={idx}>
                  <Link 
                    to={link.href} 
                    className="text-sm hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Regions */}
          <div>
            <h4 className="font-semibold text-background mb-4">Regionen</h4>
            <ul className="space-y-3">
              {footerLinks.regions.map((link, idx) => (
                <li key={idx}>
                  <Link 
                    to={link.href} 
                    className="text-sm hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Company */}
          <div>
            <h4 className="font-semibold text-background mb-4">Unternehmen</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link, idx) => (
                <li key={idx}>
                  <Link 
                    to={link.href} 
                    className="text-sm hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      
      {/* Bottom Bar */}
      <div className="border-t border-background/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-background/60">
              © {currentYear} Umzugscheck.ch. Alle Rechte vorbehalten.
            </p>
            <div className="flex items-center gap-6">
              {footerLinks.legal.map((link, idx) => (
                <Link 
                  key={idx}
                  to={link.href} 
                  className="text-sm text-background/60 hover:text-primary transition-colors"
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
