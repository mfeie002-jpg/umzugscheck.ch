import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export const CTASection = () => {
  return (
    <section className="py-20 md:py-28 gradient-accent text-white relative overflow-hidden">
      {/* Enhanced background pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE4YzAtMy4zMTQgMi42ODYtNiA2LTZzNiAyLjY4NiA2IDYtMi42ODYgNi02IDYtNi0yLjY4Ni02LTZ6bTAgMjRjMC0zLjMxNCAyLjY4Ni02IDYtNnM2IDIuNjg2IDYgNi0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNnpNMTIgMThjMC0zLjMxNCAyLjY4Ni02IDYtNnM2IDIuNjg2IDYgNi0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNnptMCAyNGMwLTMuMzE0IDIuNjg2LTYgNi02czYgMi42ODYgNiA2LTIuNjg2IDYtNiA2LTYtMi42ODYtNi02eiIvPjwvZz48L2c+PC9zdmc+')] opacity-10"></div>
      
      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="mb-6 text-white">
            Bereit für Ihren stressfreien Umzug?
          </h2>
          <p className="text-lg md:text-xl text-white/95 mb-10 leading-relaxed max-w-2xl mx-auto">
            Vergleichen Sie jetzt kostenlos Umzugsofferten von geprüften Firmen und sparen Sie bis zu 40%. 
          </p>
          
          <Link to="/rechner">
            <Button 
              size="lg" 
              className="bg-white text-accent hover:bg-white/95 shadow-strong hover:shadow-hover group text-lg px-10 py-7 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
            >
              Jetzt Offerten vergleichen
              <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          
          <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-sm text-white/90">
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5" />
              <span className="font-medium">Kostenlos & unverbindlich</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5" />
              <span className="font-medium">Nur geprüfte Firmen</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5" />
              <span className="font-medium">In 60 Sekunden</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
