import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, TrendingDown } from "lucide-react";
import { Link } from "react-router-dom";
import { QuickCalculator } from "./calculator/QuickCalculator";

export const Hero = () => {
  return (
  <section className="relative overflow-hidden gradient-hero text-white">
    {/* Animated Background Layers */}
    <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary-dark bg-[length:200%_200%] animate-gradient-shift">
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE4YzAtMy4zMTQgMi42ODYtNiA2LTZzNiAyLjY4NiA2IDYtMi42ODYgNi02IDYtNi0yLjY4Ni02LTZ6bTAgMjRjMC0zLjMxNCAyLjY4Ni02IDYtNnM2IDIuNjg2IDYgNi0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNnpNMTIgMThjMC0zLjMxNCAyLjY4Ni02IDYtNnM2IDIuNjg2IDYgNi0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNnptMCAyNGMwLTMuMzE0IDIuNjg2LTYgNi02czYgMi42ODYgNiA2LTIuNjg2IDYtNiA2LTYtMi42ODYtNi02eiIvPjwvZz48L2c+PC9zdmc+')] opacity-10"></div>
      
      {/* Animated Gradient Blobs */}
      <div className="absolute -top-20 -right-20 w-[600px] h-[600px] bg-gradient-to-br from-accent/40 to-primary/30 rounded-full blur-3xl animate-blob opacity-70"></div>
      <div className="absolute top-40 right-40 w-[500px] h-[500px] bg-gradient-to-br from-primary-light/50 to-accent/30 rounded-full blur-3xl animate-blob-reverse animation-delay-2000 opacity-60"></div>
      <div className="absolute -bottom-40 -left-40 w-[700px] h-[700px] bg-gradient-to-tr from-accent/30 to-primary-light/40 rounded-full blur-3xl animate-blob animation-delay-4000 opacity-70"></div>
      <div className="absolute bottom-20 left-1/3 w-[550px] h-[550px] bg-gradient-to-br from-white/15 to-accent/20 rounded-full blur-3xl animate-blob-reverse animation-delay-6000 opacity-50"></div>
      
      {/* Additional moving elements for more depth */}
      <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-gradient-to-br from-accent/20 to-transparent rounded-full blur-2xl animate-blob animation-delay-3000 opacity-40"></div>
      <div className="absolute bottom-1/3 left-1/4 w-[450px] h-[450px] bg-gradient-to-tl from-primary-light/30 to-transparent rounded-full blur-2xl animate-blob-reverse animation-delay-5000 opacity-40"></div>
      
      {/* Overlay gradient for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-primary/10"></div>
    </div>
      
    <div className="container mx-auto px-4 py-20 md:py-28 lg:py-36 relative z-10">
      <div className="grid lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">
        {/* Left Column - Content */}
        <div className="space-y-8 lg:pr-8">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium">
            <span className="w-2 h-2 bg-success rounded-full animate-pulse"></span>
            <span>100% kostenlos & unverbindlich</span>
          </div>

          <h1 className="leading-tight">
            Ihren Umzug<br />
            <span className="text-accent">einfach vergleichen</span>
          </h1>

          <p className="text-xl md:text-2xl text-white/90 leading-relaxed font-light max-w-xl">
            Beste Preise vergleichen – kostenlos in 2 Minuten.
          </p>

          {/* Trust Signals */}
          <div className="grid grid-cols-3 gap-6 pt-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-success" />
                <span className="text-2xl font-bold">100%</span>
              </div>
              <p className="text-sm text-white/80">kostenlos</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-success" />
                <span className="text-2xl font-bold">4.8/5</span>
              </div>
              <p className="text-sm text-white/80">Kundenbewertung</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-success" />
                <span className="text-2xl font-bold">2 Min</span>
              </div>
              <p className="text-sm text-white/80">Zeitaufwand</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <Link to="/rechner" className="flex-1">
              <Button size="lg" className="w-full h-14 text-lg bg-accent hover:bg-accent-dark text-white shadow-accent group transition-all duration-300 hover:shadow-xl hover:scale-105 animate-glow-pulse">
                Jetzt Offerten vergleichen
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Button 
              size="lg" 
              variant="outline" 
              className="flex-1 h-14 text-lg border-white/30 bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-all duration-300"
              onClick={() => {
                document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Wie es funktioniert
            </Button>
          </div>
        </div>

        {/* Right Column - Quick Calculator Preview Card */}
        <div className="lg:ml-auto w-full max-w-md">
          <div className="backdrop-blur-md bg-white/95 rounded-2xl shadow-2xl p-8 border border-white/20 hover-lift">
            <QuickCalculator embedded />
          </div>
        </div>
      </div>
    </div>

      {/* Bottom Wave Decoration */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="hsl(var(--background))"/>
        </svg>
      </div>
    </section>
  );
};
