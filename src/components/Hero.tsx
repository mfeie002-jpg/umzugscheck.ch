import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Shield, Clock, TrendingDown } from "lucide-react";
import { Link } from "react-router-dom";
import { QuickCalculator } from "./calculator/QuickCalculator";
import { SecurityBadges } from "@/components/trust/SecurityBadges";
import { LiveActivityIndicator } from "@/components/trust/LiveActivityIndicator";
import { PopularBadge } from "@/components/trust/PopularBadge";
import { useHaptic } from "@/hooks/use-haptic";

// Import partner logos
import logo20min from "@/assets/logos/20min-logo.png";
import logoWatson from "@/assets/logos/watson-logo.png";
import logoBlick from "@/assets/logos/blick-logo.png";
import logoTagesanzeiger from "@/assets/logos/tagesanzeiger-logo.png";
import logoTCS from "@/assets/logos/tcs-logo.png";
import logoASTAG from "@/assets/logos/astag-logo.png";

export const Hero = () => {
  const { trigger } = useHaptic();
  
  return (
    <section className="relative overflow-hidden gradient-hero text-white">
      {/* Enhanced Emotional Background with Dynamic Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary-dark">
        
        {/* Large Warm Gradient Blobs - MORE VISIBLE */}
        <div className="absolute -top-32 -right-32 w-[800px] h-[800px] bg-gradient-to-br from-orange-500/40 via-amber-400/35 to-yellow-400/30 rounded-full blur-3xl animate-blob opacity-70"></div>
        <div className="absolute top-1/3 -left-40 w-[700px] h-[700px] bg-gradient-to-br from-emerald-400/30 via-teal-400/35 to-cyan-400/25 rounded-full blur-3xl animate-blob-reverse opacity-60" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-0 right-1/3 w-[600px] h-[600px] bg-gradient-to-br from-rose-400/25 via-pink-400/30 to-fuchsia-400/20 rounded-full blur-3xl animate-blob opacity-50" style={{animationDelay: '4s'}}></div>
        
        {/* Accent Color Overlays for Warmth */}
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-accent/20 rounded-full blur-2xl animate-pulse" style={{animationDuration: '4s'}}></div>
        <div className="absolute bottom-40 right-1/4 w-80 h-80 bg-success/15 rounded-full blur-2xl animate-pulse" style={{animationDuration: '5s', animationDelay: '1s'}}></div>
        
        {/* Floating Moving Elements - Relief & Freedom Feeling */}
        <div className="absolute inset-0 opacity-[0.12]">
          {/* Happy family moving in - top left */}
          <div className="absolute top-[12%] left-[8%] w-20 h-20 text-white/60 animate-pulse" style={{animationDuration: '3s'}}>
            <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z"/>
            </svg>
          </div>
          
          {/* Moving truck - bottom right */}
          <div className="absolute bottom-[18%] right-[10%] w-28 h-28 opacity-100 animate-pulse" style={{animationDuration: '6s'}}>
            <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="text-white/40">
              <path d="M18 18.5C18 19.88 16.88 21 15.5 21C14.12 21 13 19.88 13 18.5C13 17.12 14.12 16 15.5 16C16.88 16 18 17.12 18 18.5ZM19.5 9.5H17V12H21.46L19.5 9.5ZM8.5 16C7.12 16 6 17.12 6 18.5C6 19.88 7.12 21 8.5 21C9.88 21 11 19.88 11 18.5C11 17.12 9.88 16 8.5 16ZM17 8V4H3C1.9 4 1 4.9 1 6V15H3C3 16.66 4.34 18 6 18C7.66 18 9 16.66 9 15H15C15 16.66 16.34 18 18 18C19.66 18 21 16.66 21 15H23V12L19 8H17Z"/>
            </svg>
          </div>
          
          {/* New home with heart - left center */}
          <div className="absolute top-[45%] left-[5%] w-24 h-24 text-white/50 animate-pulse" style={{animationDuration: '4.5s'}}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 9L12 2L21 9V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 21V12H15V21" stroke="currentColor" strokeWidth="2"/>
              <path d="M12 8C12.8284 8 13.5 7.32843 13.5 6.5C13.5 5.67157 12.8284 5 12 5C11.1716 5 10.5 5.67157 10.5 6.5C10.5 7.32843 11.1716 8 12 8Z" fill="currentColor"/>
            </svg>
          </div>
          
          {/* Checkmark - success feeling top right */}
          <div className="absolute top-[20%] right-[15%] w-16 h-16 text-success/70 animate-pulse" style={{animationDuration: '3.5s'}}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5"/>
              <path d="M7 12L10.5 15.5L17 9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          
          {/* Box stack - organized feeling */}
          <div className="absolute top-[55%] right-[8%] w-18 h-18 text-white/45 animate-pulse" style={{animationDuration: '5s'}}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2" rx="1"/>
              <rect x="14" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2" rx="1"/>
              <rect x="3" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2" rx="1"/>
              <rect x="14" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2" rx="1"/>
            </svg>
          </div>
          
          {/* Stars/quality indicators */}
          <div className="absolute top-[35%] right-[25%] w-10 h-10 text-yellow-300/60 animate-pulse" style={{animationDuration: '4s'}}>
            <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
            </svg>
          </div>
        </div>
        
        {/* Subtle Dot Pattern for Texture */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMyIgY3k9IjMiIHI9IjIiLz48Y2lyY2xlIGN4PSIzMyIgY3k9IjMiIHI9IjIiLz48Y2lyY2xlIGN4PSIzIiBjeT0iMzMiIHI9IjIiLz48Y2lyY2xlIGN4PSIzMyIgY3k9IjMzIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>
        
        {/* Depth Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-primary/20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/10"></div>
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

      <div className="relative z-20 pb-8 border-t border-white/20 mt-8">
        <div className="container mx-auto px-4">
          <p className="text-center text-white font-medium mb-6">Bekannt aus & geprüft von:</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-6xl mx-auto">
            <div className="relative flex items-center justify-center px-4 py-5 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all group min-h-[110px]">
              <img src={logo20min} alt="20 Minuten" className="max-h-16 max-w-full object-contain group-hover:scale-105 transition-transform" />
            </div>

            <div className="relative flex items-center justify-center px-4 py-5 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all group min-h-[110px]">
              <img src={logoTagesanzeiger} alt="Tages-Anzeiger" className="max-h-16 max-w-full object-contain group-hover:scale-105 transition-transform" />
            </div>

            <div className="relative flex items-center justify-center px-4 py-5 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all group min-h-[110px]">
              <img src={logoBlick} alt="Blick" className="max-h-16 max-w-full object-contain group-hover:scale-105 transition-transform" />
            </div>

            <div className="relative flex items-center justify-center px-4 py-5 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all group min-h-[110px]">
              <img src={logoWatson} alt="watson" className="max-h-16 max-w-full object-contain group-hover:scale-105 transition-transform" />
            </div>

            <div className="relative flex items-center justify-center px-4 py-5 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all group min-h-[110px]">
              <img src={logoTCS} alt="TCS Schweiz" className="max-h-16 max-w-full object-contain group-hover:scale-105 transition-transform" />
            </div>

            <div className="relative flex items-center justify-center px-4 py-5 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all group min-h-[110px]">
              <img src={logoASTAG} alt="ASTAG" className="max-h-16 max-w-full object-contain group-hover:scale-105 transition-transform" />
            </div>
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
