import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Shield, Clock, TrendingDown } from "lucide-react";
import { Link } from "react-router-dom";
import { QuickCalculator } from "./calculator/QuickCalculator";
import { SecurityBadges } from "@/components/trust/SecurityBadges";
import { LiveActivityIndicator } from "@/components/trust/LiveActivityIndicator";
import { PopularBadge } from "@/components/trust/PopularBadge";
import { useHaptic } from "@/hooks/use-haptic";

export const Hero = () => {
  const { trigger } = useHaptic();
  
  return (
    <section className="relative overflow-hidden gradient-hero text-white">
      {/* Animated Background Layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary-dark bg-[length:200%_200%] animate-gradient-shift">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE4YzAtMy4zMTQgMi42ODYtNiA2LTZzNiAyLjY4NiA2IDYtMi42ODYgNi02IDYtNi0yLjY4Ni02LTZ6bTAgMjRjMC0zLjMxNCAyLjY4Ni02IDYtNnM2IDIuNjg2IDYgNi0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNnpNMTIgMThjMC0zLjMxNCAyLjY4Ni02IDYtNnM2IDIuNjg2IDYgNi0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNnptMCAyNGMwLTMuMzE0IDIuNjg2LTYgNi02czYgMi42ODYgNiA2LTIuNjg2IDYtNiA2LTYtMi42ODYtNi02eiIvPjwvZz48L2c+PC9zdmc+')] opacity-10"></div>
        <div className="absolute -top-20 -right-20 w-[600px] h-[600px] bg-gradient-to-br from-accent/40 to-primary/30 rounded-full blur-3xl animate-blob opacity-70"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-primary/10"></div>
      </div>
        
      <div className="container mx-auto px-4 py-12 sm:py-16 md:py-24 lg:py-32 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center max-w-7xl mx-auto">
          <div className="space-y-6 sm:space-y-8 lg:pr-8">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium">
              <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 text-success animate-pulse flex-shrink-0" />
              <span className="truncate">100% kostenlos & unverbindlich · In 2 Minuten zu 3–5 Offerten</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
              Ihren Umzug in der Schweiz<br />
              <span className="text-accent drop-shadow-lg">in 60 Sekunden vergleichen</span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-white/95 leading-relaxed max-w-2xl">
              Füllen Sie einmal Ihr Umzugsprofil aus und erhalten Sie in kurzer Zeit passende Angebote von geprüften Umzugsfirmen. Transparent, fair und ohne Telefon-Spam.
            </p>

            <div className="grid grid-cols-3 gap-3 sm:gap-4 pt-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 border border-white/20">
                <TrendingDown className="w-5 h-5 sm:w-6 sm:h-6 text-accent mx-auto mb-1 sm:mb-2" />
                <p className="text-lg sm:text-2xl font-bold text-center mb-0.5 sm:mb-1">40%</p>
                <p className="text-xs sm:text-sm text-white/90 text-center leading-tight">günstiger</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 border border-white/20">
                <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-success mx-auto mb-1 sm:mb-2" />
                <p className="text-lg sm:text-2xl font-bold text-center mb-0.5 sm:mb-1">4.8/5</p>
                <p className="text-xs sm:text-sm text-white/90 text-center leading-tight">Rating</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 border border-white/20">
                <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-white mx-auto mb-1 sm:mb-2" />
                <p className="text-lg sm:text-2xl font-bold text-center mb-0.5 sm:mb-1">15k+</p>
                <p className="text-xs sm:text-sm text-white/90 text-center leading-tight">Umzüge</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6">
              <Link to="/rechner" className="flex-1">
                <Button 
                  size="lg" 
                  className="w-full h-12 sm:h-14 text-sm sm:text-lg bg-accent hover:bg-accent-dark text-white"
                  onClick={() => trigger('medium')}
                >
                  <span>Umzugskosten berechnen</span>
                  <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
              </Link>
              <Link to="/firmen" className="flex-1">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="w-full h-12 sm:h-14 text-sm sm:text-lg border-2 border-white/40 bg-white/10 text-white"
                  onClick={() => trigger('light')}
                >
                  Umzugsfirmen vergleichen
                </Button>
              </Link>
            </div>

            <div className="pt-2 sm:pt-4">
              <p className="text-white/90 text-xs sm:text-sm flex items-center gap-2">
                <Shield className="w-4 h-4 flex-shrink-0" />
                <span>Kostenlos & unverbindlich. Ihre Daten werden nur für Ihre Offerten-Anfrage verwendet.</span>
              </p>
            </div>

            <SecurityBadges />
          </div>

          <div className="lg:ml-auto w-full max-w-md">
            <div className="backdrop-blur-lg bg-white/98 rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 lg:p-8 border-2 border-white/30 relative">
              <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
                <PopularBadge variant="popular" />
              </div>
              <div className="mb-4 sm:mb-6">
                <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-1 sm:mb-2">Schnell-Rechner</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">In 60 Sekunden zu Ihrer Kostenschätzung.</p>
              </div>
              <QuickCalculator embedded />
              <div className="mt-3 sm:mt-4 flex items-center gap-2 text-xs sm:text-sm text-muted-foreground justify-center">
                <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>Antwort: 3–24 Stunden</span>
              </div>
            </div>
            <div className="mt-3 sm:mt-4">
              <LiveActivityIndicator />
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 pb-12 border-t border-white/10 mt-12">
        <div className="container mx-auto px-4">
          <p className="text-center text-white/90 text-sm font-medium mb-6">Bekannt aus & geprüft von:</p>
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-8">
            {[
              { name: "Tages-Anzeiger", subtitle: "Tageszeitung" },
              { name: "20 Minuten", subtitle: "News" },
              { name: "Blick", subtitle: "Medienhaus" },
              { name: "watson.ch", subtitle: "Portal" },
              { name: "TÜV Schweiz", subtitle: "Geprüft" },
              { name: "VMS", subtitle: "Verband" }
            ].map((partner, idx) => (
              <div 
                key={idx}
                className="flex flex-col items-center gap-1 px-4 py-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 hover:bg-white/15 transition-all"
              >
                <span className="text-white font-semibold text-sm">{partner.name}</span>
                <span className="text-white/70 text-xs">{partner.subtitle}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="hsl(var(--background))"/>
        </svg>
      </div>
    </section>
  );
};
