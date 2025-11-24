import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

export const CTASection = () => {
  return (
    <section className="py-20 md:py-28 gradient-accent text-white relative overflow-hidden">
      {/* Animated gradient blobs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-white/20 to-transparent rounded-full blur-3xl animate-blob"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-accent-dark/40 to-transparent rounded-full blur-3xl animate-blob-reverse animation-delay-2000"></div>
      
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE4YzAtMy4zMTQgMi42ODYtNiA2LTZzNiAyLjY4NiA2IDYtMi42ODYgNi02IDYtNi0yLjY4Ni02LTZ6bTAgMjRjMC0zLjMxNCAyLjY4Ni02IDYtNnM2IDIuNjg2IDYgNi0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNnpNMTIgMThjMC0zLjMxNCAyLjY4Ni02IDYtNnM2IDIuNjg2IDYgNi0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNnptMCAyNGMwLTMuMzE0IDIuNjg2LTYgNi02czYgMi42ODYgNiA2LTIuNjg2IDYtNiA2LTYtMi42ODYtNi02eiIvPjwvZz48L2c+PC9zdmc+')] opacity-10"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold mb-6 border border-white/20">
            <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
            <span>Unverbindlich & kostenlos</span>
          </div>
          
          <h2 className="mb-6 drop-shadow-lg">
            Bereit für Ihren stressfreien Umzug?
          </h2>
          <p className="text-xl md:text-2xl text-white/95 mb-10 leading-relaxed">
            Vergleichen Sie jetzt <strong className="text-white">kostenlos Umzugsofferten</strong> von geprüften Firmen 
            und sparen Sie bis zu <strong className="text-white">40%</strong>.
          </p>
          <Link to="/rechner">
            <Button 
              size="lg" 
              className="bg-white text-accent hover:bg-white/95 shadow-strong group text-lg px-10 h-16 hover-shine hover:scale-105 transition-all"
            >
              <span className="relative z-10">Jetzt kostenlos Preis berechnen</span>
              <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform relative z-10" />
            </Button>
          </Link>
          <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-white/90">
            <span className="flex items-center gap-2 text-sm font-medium">
              <CheckCircle2 className="w-5 h-5" />
              100% kostenlos
            </span>
            <span className="flex items-center gap-2 text-sm font-medium">
              <CheckCircle2 className="w-5 h-5" />
              Nur geprüfte Firmen
            </span>
            <span className="flex items-center gap-2 text-sm font-medium">
              <CheckCircle2 className="w-5 h-5" />
              In 2 Minuten
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
