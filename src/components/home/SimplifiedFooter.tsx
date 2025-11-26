import { Link } from "react-router-dom";

export const SimplifiedFooter = () => {
  return (
    <footer className="bg-muted/30 border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Logo & Description */}
          <div className="md:col-span-1">
            <Link to="/" className="inline-block mb-4">
              <img 
                src="/lovable-uploads/d4aa8c36-01f9-47b7-8e18-bd2a8e22467a.png" 
                alt="Umzugscheck.ch" 
                className="h-8"
              />
            </Link>
            <p className="text-sm text-muted-foreground">
              Die führende Vergleichsplattform für Umzüge in der Schweiz.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-foreground mb-4">Services</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/umzugsofferten" className="text-muted-foreground hover:text-primary transition-colors">Offerte anfragen</Link></li>
              <li><Link to="/firmen" className="text-muted-foreground hover:text-primary transition-colors">Firmenliste</Link></li>
              <li><Link to="/rechner" className="text-muted-foreground hover:text-primary transition-colors">Preisrechner</Link></li>
              <li><Link to="/regionen" className="text-muted-foreground hover:text-primary transition-colors">Regionen</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-bold text-foreground mb-4">Unternehmen</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">Über uns</Link></li>
              <li><Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">Kontakt</Link></li>
              <li><Link to="/become-provider" className="text-muted-foreground hover:text-primary transition-colors">Für Firmen</Link></li>
              <li><Link to="/faq" className="text-muted-foreground hover:text-primary transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-bold text-foreground mb-4">Rechtliches</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Datenschutz</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">AGB</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Impressum</a></li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Umzugscheck.ch – Alle Rechte vorbehalten
          </p>
        </div>
      </div>
    </footer>
  );
};
