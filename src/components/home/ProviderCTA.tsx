import { Button } from "@/components/ui/button";
import { Building2, TrendingUp, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export const ProviderCTA = () => {
  return (
    <section className="py-12 md:py-28 bg-gradient-to-br from-slate-900 to-slate-800 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-48 md:w-96 h-48 md:h-96 bg-blue-500 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 md:w-96 h-48 md:h-96 bg-cyan-500 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto"
        >
          <div className="text-center text-white">
            <Building2 className="h-10 w-10 md:h-16 md:w-16 mx-auto mb-4 md:mb-6 text-cyan-400" />
            
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">
              Mehr qualifizierte Anfragen für Ihre Umzugsfirma
            </h2>
            
            <p className="text-base md:text-2xl text-slate-300 mb-2 md:mb-4">
              Werden Sie Partner von umzugscheck.ch
            </p>

            <p className="text-sm md:text-lg text-slate-400 mb-8 md:mb-12 max-w-2xl mx-auto">
              Profitieren Sie von unserer Plattform mit über 25'000 Umzügen und erhalten Sie planbare, qualifizierte Umzugsanfragen aus Ihrer Region
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-8 md:mb-12">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-blue-500/20 flex items-center justify-center mb-3 md:mb-4">
                  <TrendingUp className="h-6 w-6 md:h-8 md:w-8 text-blue-400" />
                </div>
                <div className="font-bold text-base md:text-xl mb-1 md:mb-2">Planbare Umzugsanfragen</div>
                <div className="text-xs md:text-base text-slate-400">Qualifizierte Leads aus Ihrer Region</div>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-cyan-500/20 flex items-center justify-center mb-3 md:mb-4">
                  <Users className="h-6 w-6 md:h-8 md:w-8 text-cyan-400" />
                </div>
                <div className="font-bold text-base md:text-xl mb-1 md:mb-2">Transparente Konditionen</div>
                <div className="text-xs md:text-base text-slate-400">Faire Preise, keine versteckten Kosten</div>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-blue-500/20 flex items-center justify-center mb-3 md:mb-4">
                  <Building2 className="h-6 w-6 md:h-8 md:w-8 text-blue-400" />
                </div>
                <div className="font-bold text-base md:text-xl mb-1 md:mb-2">Sichtbarkeit bei interessierten Kunden</div>
                <div className="text-xs md:text-base text-slate-400">Zugriff auf große Kundenbasis</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/anbieter">
                <Button size="lg" className="h-12 md:h-16 px-6 md:px-10 text-sm md:text-lg font-bold bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-xl w-full sm:w-auto">
                  Partner werden
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
