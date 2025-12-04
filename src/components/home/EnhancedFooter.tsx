import { Link } from "react-router-dom";
import { Facebook, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";
import logo from "@/assets/logo.png";

export const EnhancedFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted/30 border-t border-border">
      <div className="container mx-auto px-4 py-12 md:py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Logo & Company Info */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-block mb-6" aria-label="Zur Startseite">
              <img 
                src={logo} 
                alt="Umzugscheck.ch - Schweizer Umzugsvergleichsportal" 
                className="h-10 w-auto"
                sizes="164px"
                width={164}
                height={40}
                loading="lazy"
              />
            </Link>
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed max-w-md">
              Die führende Vergleichsplattform für Umzüge in der Schweiz. 
              Vergleichen Sie geprüfte Umzugsfirmen kostenlos und sparen Sie bis zu 40%.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <a 
                href="tel:+41445566778" 
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                aria-label="Telefon: +41 44 556 67 78"
              >
                <Phone className="w-4 h-4" aria-hidden="true" />
                <span>+41 44 556 67 78</span>
              </a>
              <a 
                href="mailto:info@umzugscheck.ch" 
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                aria-label="E-Mail: info@umzugscheck.ch"
              >
                <Mail className="w-4 h-4" aria-hidden="true" />
                <span>info@umzugscheck.ch</span>
              </a>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" aria-hidden="true" />
                <span>Zürich, Schweiz</span>
              </div>
            </div>

            {/* Social Media */}
            <div className="flex gap-4 mt-6">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-secondary/10 flex items-center justify-center hover:bg-secondary/20 transition-colors"
                aria-label="Facebook Profil besuchen"
              >
                <Facebook className="w-4 h-4" aria-hidden="true" />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-secondary/10 flex items-center justify-center hover:bg-secondary/20 transition-colors"
                aria-label="Instagram Profil besuchen"
              >
                <Instagram className="w-4 h-4" aria-hidden="true" />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-secondary/10 flex items-center justify-center hover:bg-secondary/20 transition-colors"
                aria-label="LinkedIn Profil besuchen"
              >
                <Linkedin className="w-4 h-4" aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-bold text-foreground mb-4">Services</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/umzugsofferten" className="text-muted-foreground hover:text-primary transition-colors">Umzugsofferten</Link></li>
              <li><Link to="/rechner" className="text-muted-foreground hover:text-primary transition-colors">Preisrechner</Link></li>
              <li><Link to="/firmen" className="text-muted-foreground hover:text-primary transition-colors">Umzugsfirmen</Link></li>
              <li><Link to="/vergleich" className="text-muted-foreground hover:text-primary transition-colors">Firmen vergleichen</Link></li>
              <li><Link to="/services" className="text-muted-foreground hover:text-primary transition-colors">Alle Services</Link></li>
            </ul>
          </div>

          {/* Regions */}
          <div>
            <h4 className="font-bold text-foreground mb-4">Regionen</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/zug" className="text-muted-foreground hover:text-primary transition-colors">Umzug Zug</Link></li>
              <li><Link to="/zuerich/umzugsfirmen" className="text-muted-foreground hover:text-primary transition-colors">Umzug Zürich</Link></li>
              <li><Link to="/bern/umzugsfirmen" className="text-muted-foreground hover:text-primary transition-colors">Umzug Bern</Link></li>
              <li><Link to="/basel/umzugsfirmen" className="text-muted-foreground hover:text-primary transition-colors">Umzug Basel</Link></li>
              <li><Link to="/regionen" className="text-muted-foreground hover:text-primary transition-colors">Alle Kantone</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-bold text-foreground mb-4">Unternehmen</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">Über uns</Link></li>
              <li><Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">Kontakt</Link></li>
              <li><Link to="/become-provider" className="text-muted-foreground hover:text-primary transition-colors">Für Firmen</Link></li>
              <li><Link to="/faq" className="text-muted-foreground hover:text-primary transition-colors">FAQ</Link></li>
              <li><Link to="/ratgeber" className="text-muted-foreground hover:text-primary transition-colors">Ratgeber</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground text-center md:text-left">
              © {currentYear} Umzugscheck.ch – Alle Rechte vorbehalten
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <Link to="/datenschutz" className="text-muted-foreground hover:text-primary transition-colors">
                Datenschutz
              </Link>
              <Link to="/agb" className="text-muted-foreground hover:text-primary transition-colors">
                AGB
              </Link>
              <Link to="/impressum" className="text-muted-foreground hover:text-primary transition-colors">
                Impressum
              </Link>
              <Link to="/cookies" className="text-muted-foreground hover:text-primary transition-colors">
                Cookie-Richtlinien
              </Link>
            </div>
          </div>
        </div>

        {/* Trust Signals */}
        <div className="mt-8 pt-8 border-t border-border">
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <span className="text-xs text-muted-foreground">✓ SSL-verschlüsselt</span>
            <span className="text-xs text-muted-foreground">✓ Datenschutz DSGVO-konform</span>
            <span className="text-xs text-muted-foreground">✓ Schweizer Qualität</span>
            <span className="text-xs text-muted-foreground">✓ 15'000+ zufriedene Kunden</span>
          </div>
        </div>
      </div>
    </footer>
  );
};