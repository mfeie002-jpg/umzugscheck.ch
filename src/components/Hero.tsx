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
      {/* Animated Background Layers with Emotional Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary-dark bg-[length:200%_200%] animate-gradient-shift">
        {/* Moving box icons pattern - subtle relief feeling */}
        <div className="absolute inset-0 opacity-[0.07]">
          <div className="absolute top-[10%] left-[5%] w-16 h-16 text-white/40">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 16V8C21 7.45 20.55 7 20 7H4C3.45 7 3 7.45 3 8V16C3 16.55 3.45 17 4 17H20C20.55 17 21 16.55 21 16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 7V17M7 12H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="absolute top-[60%] left-[15%] w-20 h-20 text-white/30 animate-pulse" style={{animationDuration: '4s'}}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
              <path d="M3 9H21M3 15H21" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
          </div>
          <div className="absolute top-[25%] right-[10%] w-14 h-14 text-white/35">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z" stroke="currentColor" strokeWidth="2"/>
              <path d="M9 10L12 7L15 10M12 7V17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="absolute top-[70%] right-[20%] w-12 h-12 text-white/40 animate-pulse" style={{animationDuration: '5s'}}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <path d="M8 12L11 15L16 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
        
        {/* Warm accent gradient for human touch */}
        <div className="absolute -top-20 -right-20 w-[600px] h-[600px] bg-gradient-to-br from-orange-400/30 via-accent/40 to-primary/30 rounded-full blur-3xl animate-blob opacity-60"></div>
        <div className="absolute top-1/2 -left-32 w-[500px] h-[500px] bg-gradient-to-br from-green-400/20 via-success/30 to-primary/20 rounded-full blur-3xl animate-blob opacity-50" style={{animationDelay: '2s', animationDuration: '8s'}}></div>
        
        {/* Moving truck silhouette - very subtle */}
        <div className="absolute bottom-[15%] right-[8%] w-32 h-32 opacity-[0.08] animate-pulse" style={{animationDuration: '6s'}}>
          <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="text-white">
            <path d="M1 6.99999V16C1 16.5523 1.44772 17 2 17H3.05493C3.26014 18.6961 4.73751 20 6.5 20C8.26249 20 9.73986 18.6961 9.94507 17H14.0549C14.2601 18.6961 15.7375 20 17.5 20C19.2625 20 20.7399 18.6961 20.9451 17H22C22.5523 17 23 16.5523 23 16V12.5C23 12.2239 22.7761 12 22.5 12H19V8.49999C19 8.22385 18.7761 7.99999 18.5 7.99999H15V6.99999C15 6.44771 14.5523 5.99999 14 5.99999H2C1.44772 5.99999 1 6.44771 1 6.99999Z"/>
          </svg>
        </div>
        
        {/* House icon - representing new home */}
        <div className="absolute top-[40%] left-[8%] w-24 h-24 opacity-[0.06]">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
            <path d="M3 12L5 10M21 12L19 10M5 10L12 3L19 10M5 10V20C5 20.5523 5.44772 21 6 21H9M19 10V20C19 20.5523 18.5523 21 18 21H15M9 21C9 21 9 18 9 16C9 14 10 14 12 14C14 14 15 14 15 16C15 18 15 21 15 21M9 21H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        
        {/* Gradient overlay for depth and emotion */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-primary/10"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDE4YzAtMy4zMTQgMi42ODYtNiA2LTZzNiAyLjY4NiA2IDYtMi42ODYgNi02IDYtNi0yLjY4Ni02LTZ6bTAgMjRjMC0zLjMxNCAyLjY4Ni02IDYtNnM2IDIuNjg2IDYgNi0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNnpNMTIgMThjMC0zLjMxNCAyLjY4Ni02IDYtNnM2IDIuNjg2IDYgNi0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNnptMCAyNGMwLTMuMzE0IDIuNjg2LTYgNi02czYgMi42ODYgNiA2LTIuNjg2IDYtNiA2LTYtMi42ODYtNi02eiIvPjwvZz48L2c+PC9zdmc+')] opacity-10"></div>
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
