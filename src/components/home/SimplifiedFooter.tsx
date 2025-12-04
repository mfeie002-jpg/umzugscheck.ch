import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, CheckCircle } from "lucide-react";
import logo from "@/assets/logo.png";
import { Button } from "@/components/ui/button";

export const SimplifiedFooter = () => {
  return (
    <footer className="bg-uc-footer text-uc-footer-text">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Logo & Description */}
          <div className="md:col-span-1">
            <Link to="/" className="inline-block mb-4">
              <img 
                src={logo}
                alt="Umzugscheck.ch" 
                className="h-10"
                width={164}
                height={40}
                loading="lazy"
              />
            </Link>
            <p className="text-sm text-uc-footer-text/70">
              Die führende Vergleichsplattform für Umzüge in der Schweiz.
            </p>
            
            {/* Contact Info */}
            <div className="mt-4 space-y-2">
              <a href="mailto:info@umzugscheck.ch" className="flex items-center gap-2 text-sm text-uc-footer-text/70 hover:text-white transition-colors">
                <Mail className="h-4 w-4 text-primary" />
                info@umzugscheck.ch
              </a>
              <a href="tel:+41445001234" className="flex items-center gap-2 text-sm text-uc-footer-text/70 hover:text-white transition-colors">
                <Phone className="h-4 w-4 text-primary" />
                +41 44 500 12 34
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Services</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/umzugsofferten" className="text-uc-footer-text/70 hover:text-white transition-colors">Offerte anfragen</Link></li>
              <li><Link to="/firmen" className="text-uc-footer-text/70 hover:text-white transition-colors">Firmenliste</Link></li>
              <li><Link to="/rechner" className="text-uc-footer-text/70 hover:text-white transition-colors">Preisrechner</Link></li>
              <li><Link to="/regionen" className="text-uc-footer-text/70 hover:text-white transition-colors">Regionen</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-white mb-4">Unternehmen</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/ueber-uns" className="text-uc-footer-text/70 hover:text-white transition-colors">Über uns</Link></li>
              <li><Link to="/kontakt" className="text-uc-footer-text/70 hover:text-white transition-colors">Kontakt</Link></li>
              <li><Link to="/fuer-firmen" className="text-uc-footer-text/70 hover:text-white transition-colors">Für Firmen</Link></li>
              <li><Link to="/faq" className="text-uc-footer-text/70 hover:text-white transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-white mb-4">Rechtliches</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/datenschutz" className="text-uc-footer-text/70 hover:text-white transition-colors">Datenschutz</Link></li>
              <li><Link to="/agb" className="text-uc-footer-text/70 hover:text-white transition-colors">AGB</Link></li>
              <li><Link to="/impressum" className="text-uc-footer-text/70 hover:text-white transition-colors">Impressum</Link></li>
            </ul>
          </div>
        </div>
        
        {/* CTA Section */}
        <div className="py-6 border-t border-white/10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-wrap justify-center sm:justify-start">
              <div className="flex items-center gap-1.5 text-sm text-uc-footer-text/70">
                <CheckCircle className="h-4 w-4 text-primary" />
                100% kostenlos
              </div>
              <div className="flex items-center gap-1.5 text-sm text-uc-footer-text/70">
                <CheckCircle className="h-4 w-4 text-primary" />
                Geprüfte Firmen
              </div>
            </div>
            <Link to="/umzugsofferten">
              <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-cta">
                Jetzt Offerten vergleichen
              </Button>
            </Link>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-6 border-t border-white/10 text-center">
          <p className="text-sm text-uc-footer-text/50">
            © {new Date().getFullYear()} Umzugscheck.ch – Alle Rechte vorbehalten
          </p>
        </div>
      </div>
    </footer>
  );
};
