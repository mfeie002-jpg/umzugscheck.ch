import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Shield, Clock, Award } from "lucide-react";
import { Link } from "react-router-dom";
import { QuickCalculator } from "@/components/calculator/QuickCalculator";

export const EmotionalHero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large gradient blobs */}
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl animate-blob"></div>
        <div className="absolute top-1/3 -left-20 w-[500px] h-[500px] bg-gradient-to-tr from-accent/8 to-transparent rounded-full blur-3xl animate-blob-reverse animation-delay-2000"></div>
        <div className="absolute bottom-0 right-1/3 w-[450px] h-[450px] bg-gradient-to-tl from-primary/8 to-transparent rounded-full blur-3xl animate-blob animation-delay-4000"></div>
        
        {/* Subtle particles */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(var(--primary)/0.03),transparent_70%)]"></div>
        
        {/* Grid overlay for depth */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PHBhdGggZD0iTTM2IDE4YzAtMy4zMTQgMi42ODYtNiA2LTZzNiAyLjY4NiA2IDYtMi42ODYgNi02IDYtNi0yLjY4Ni02LTZ6bTAgMjRjMC0zLjMxNCAyLjY4Ni02IDYtNnM2IDIuNjg2IDYgNi0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNnpNMTIgMThjMC0zLjMxNCAyLjY4Ni02IDYtNnM2IDIuNjg2IDYgNi0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNnptMCAyNGMwLTMuMzE0IDIuNjg2LTYgNi02czYgMi42ODYgNiA2LTIuNjg2IDYtNiA2LTYtMi42ODYtNi02eiIvPjwvZz48L2c+PC9zdmc+')] opacity-40"></div>
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center max-w-7xl mx-auto">
          {/* Left Column - Emotional Content */}
          <div className="space-y-8 lg:pr-8">
            {/* Premium Badge */}
            <div className="inline-flex items-center gap-3 bg-gradient-premium text-white px-6 py-3 rounded-full text-sm font-semibold shadow-accent animate-fade-in">
              <Sparkles className="w-5 h-5" />
              <span>Schweizer KI-Technologie • Familiengeführt • Premium Service</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-4">
              <h1 className="leading-[1.1] tracking-tight">
                Der intelligenteste Weg<br />
                zum <span className="bg-gradient-premium bg-clip-text text-transparent">perfekten Umzug</span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-2xl">
                Unser <strong className="text-foreground">KI-Preisrechner</strong> liefert Ihnen in Sekunden eine präzise Offerte – 
                transparent, fair und 100% schweizerisch.
              </p>
            </div>

            {/* Trust USPs */}
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="flex items-start gap-3 bg-card border border-border rounded-xl p-4 hover-lift">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="font-bold text-sm mb-1">Sofortige Berechnung</div>
                  <div className="text-xs text-muted-foreground">KI-gestützte Präzision</div>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-card border border-border rounded-xl p-4 hover-lift">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <div className="font-bold text-sm mb-1">Marktvergleich</div>
                  <div className="text-xs text-muted-foreground">Garantiert fair</div>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-card border border-border rounded-xl p-4 hover-lift">
                <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-success" />
                </div>
                <div>
                  <div className="font-bold text-sm mb-1">24/7 verfügbar</div>
                  <div className="text-xs text-muted-foreground">Immer für Sie da</div>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link to="/rechner" className="flex-1">
                <Button 
                  size="lg" 
                  className="w-full h-16 text-lg bg-gradient-premium hover:opacity-90 text-white shadow-accent group transition-all duration-300 hover:scale-105 hover-shine relative overflow-hidden"
                >
                  <span className="relative z-10 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 mr-2" />
                    Jetzt KI-Preis berechnen
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
              </Link>
              <Link to="/firmen" className="flex-1">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="w-full h-16 text-lg border-2 border-primary/30 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300"
                >
                  Offerte anfragen
                </Button>
              </Link>
            </div>

            {/* Trust Line with Rating */}
            <div className="flex flex-wrap items-center gap-6 pt-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Award key={i} className="w-4 h-4 fill-warning text-warning" />
                  ))}
                </div>
                <span className="font-semibold">4.9/5</span>
                <span className="text-muted-foreground">von echten Kunden</span>
              </div>
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground">12'000+ zufriedene Kunden</span>
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground">200+ geprüfte Firmen</span>
            </div>
          </div>

          {/* Right Column - Calculator Card */}
          <div className="lg:ml-auto w-full max-w-xl">
            <div className="relative">
              {/* Floating badge */}
              <div className="absolute -top-4 -right-4 bg-accent text-white text-xs font-bold px-4 py-2 rounded-full shadow-accent z-20 animate-bounce-slow">
                🔥 Meistgenutzte Funktion
              </div>
              
              {/* Main calculator card */}
              <div className="backdrop-blur-xl bg-white/98 rounded-3xl shadow-2xl p-8 md:p-10 border-2 border-primary/10 hover-lift relative overflow-hidden">
                {/* Decorative corner accent */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-premium opacity-10 rounded-bl-[100px]"></div>
                
                {/* Header */}
                <div className="mb-6 relative z-10">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-6 h-6 text-primary" />
                    <h3 className="text-2xl font-bold">KI-Preisrechner</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Präzise Sofort-Offerte in unter 60 Sekunden
                  </p>
                </div>
                
                {/* Calculator */}
                <QuickCalculator embedded />
                
                {/* Trust indicators */}
                <div className="mt-6 pt-6 border-t border-border relative z-10">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Shield className="w-3 h-3" />
                      SSL-verschlüsselt
                    </span>
                    <span className="flex items-center gap-1">
                      <Award className="w-3 h-3" />
                      DSGVO-konform
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Sofort-Ergebnis
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom wave decoration */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="hsl(var(--background))"/>
        </svg>
      </div>
    </section>
  );
};