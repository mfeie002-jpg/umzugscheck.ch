import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Star, Shield, Award, Sparkles } from "lucide-react";
import { Helmet } from "react-helmet";
import { Button } from "./ui/button";
import logo from "@/assets/umzugscheck-logo.png";

const ORGANIZATION_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Umzugscheck.ch",
  "url": "https://umzugscheck.ch",
  "logo": "https://umzugscheck.ch/assets/umzugscheck-logo.png",
  "description": "Die führende Vergleichsplattform für Umzüge in der Schweiz mit KI-Preisrechner. Kostenlos, transparent und einfach.",
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
  ],
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "12000",
    "bestRating": "5",
    "worstRating": "1"
  }
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
      
      {/* CTA Section */}
      <div className="bg-gradient-to-br from-primary/90 to-primary border-b border-primary-foreground/10">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <Sparkles className="w-4 h-4" />
              <span>Bereit für Ihren Umzug?</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Jetzt kostenlos Umzugspreis berechnen
            </h2>
            <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
              Nutzen Sie unseren KI-Preisrechner und erhalten Sie in Sekunden eine transparente Offerte von geprüften Schweizer Umzugsfirmen.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90 shadow-lg" asChild>
                <Link to="/rechner">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Jetzt Preis berechnen
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10" asChild>
                <Link to="/kontakt">
                  Kostenlose Beratung
                </Link>
              </Button>
            </div>
            
            {/* Trust indicators */}
            <div className="flex flex-wrap items-center justify-center gap-6 mt-8 pt-8 border-t border-white/10">
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-white text-white" />
                  ))}
                </div>
                <span className="text-sm font-semibold">4.9/5</span>
              </div>
              <div className="h-4 w-px bg-white/30" />
              <span className="text-sm">12'000+ zufriedene Kunden</span>
              <div className="h-4 w-px bg-white/30" />
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span className="text-sm">SSL-verschlüsselt</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Company Info */}
          <div className="space-y-4 lg:col-span-2">
            <Link to="/" className="flex items-center hover:opacity-90 transition-opacity">
              <img 
                src={logo} 
                alt="Umzugscheck.ch Logo" 
                className="h-16 w-auto"
              />
            </Link>
            <p className="text-primary-foreground/80 text-sm leading-relaxed">
              Die führende Vergleichsplattform für Umzüge in der Schweiz. 
              Mit unserem KI-Preisrechner erhalten Sie sofort transparente Offerten von geprüften Umzugsfirmen.
            </p>
            
            {/* Trust badges */}
            <div className="flex flex-wrap gap-3 pt-2">
              <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg text-xs">
                <Award className="w-3 h-3" />
                <span>TÜV-zertifiziert</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg text-xs">
                <Shield className="w-3 h-3" />
                <span>DSGVO-konform</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-3 pt-2">
              <a href="https://www.facebook.com/umzugscheck" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all">
                <span className="sr-only">Facebook</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="https://www.linkedin.com/company/umzugscheck" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all">
                <span className="sr-only">LinkedIn</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
              <a href="https://www.instagram.com/umzugscheck" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all">
                <span className="sr-only">Instagram</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-4">Services</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/rechner" className="text-primary-foreground/80 hover:text-white transition-base">
                  KI-Preisrechner
                </Link>
              </li>
              <li>
                <Link to="/firmen" className="text-primary-foreground/80 hover:text-white transition-base">
                  Umzugsfirmen vergleichen
                </Link>
              </li>
              <li>
                <Link to="/reinigungsrechner" className="text-primary-foreground/80 hover:text-white transition-base">
                  Endreinigung
                </Link>
              </li>
              <li>
                <Link to="/entsorgungsrechner" className="text-primary-foreground/80 hover:text-white transition-base">
                  Entsorgung
                </Link>
              </li>
              <li>
                <Link to="/lagerrechner" className="text-primary-foreground/80 hover:text-white transition-base">
                  Lagerung
                </Link>
              </li>
              <li>
                <Link to="/gesamtpreis-konfigurator" className="text-primary-foreground/80 hover:text-white transition-base">
                  Gesamtpaket
                </Link>
              </li>
            </ul>
          </div>

          {/* Informationen */}
          <div>
            <h4 className="font-bold mb-4">Informationen</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/ueber-uns" className="text-primary-foreground/80 hover:text-white transition-base">
                  Über uns
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-primary-foreground/80 hover:text-white transition-base">
                  Ratgeber & Blog
                </Link>
              </li>
              <li>
                <Link to="/kontakt" className="text-primary-foreground/80 hover:text-white transition-base">
                  Kontakt
                </Link>
              </li>
              <li>
                <Link to="/anbieter-werden" className="text-primary-foreground/80 hover:text-white transition-base">
                  Anbieter werden
                </Link>
              </li>
              <li>
                <Link to="/sitemap" className="text-primary-foreground/80 hover:text-white transition-base">
                  Sitemap
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
                <address className="text-primary-foreground/80 not-italic">
                  Umzugscheck GmbH<br />
                  Bahnhofstrasse 100<br />
                  8001 Zürich, Schweiz
                </address>
              </li>
            </ul>
            
            {/* Review badges */}
            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="text-xs text-primary-foreground/60 mb-2">Bewerten Sie uns auf:</div>
              <div className="flex gap-2">
                <a href="https://www.google.com/maps" target="_blank" rel="noopener noreferrer" className="text-xs bg-white/10 px-2 py-1 rounded hover:bg-white/20 transition-all">
                  Google
                </a>
                <a href="https://www.trustpilot.com" target="_blank" rel="noopener noreferrer" className="text-xs bg-white/10 px-2 py-1 rounded hover:bg-white/20 transition-all">
                  Trustpilot
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-primary-foreground/60">
            <p>© {currentYear} Umzugscheck.ch – Alle Rechte vorbehalten</p>
            <div className="flex flex-wrap gap-4 md:gap-6 justify-center">
              <Link to="/datenschutz" className="hover:text-white transition-base">
                Datenschutz
              </Link>
              <Link to="/agb" className="hover:text-white transition-base">
                AGB
              </Link>
              <Link to="/impressum" className="hover:text-white transition-base">
                Impressum
              </Link>
              <Link to="/cookies" className="hover:text-white transition-base">
                Cookie-Richtlinie
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
