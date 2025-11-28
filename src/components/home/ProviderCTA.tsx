import { Button } from "@/components/ui/button";
import { Building2, TrendingUp, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export const ProviderCTA = () => {
  return (
    <section className="py-20 md:py-28 bg-gradient-to-br from-slate-900 to-slate-800 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto"
        >
          <div className="text-center text-white">
            <Building2 className="h-16 w-16 mx-auto mb-6 text-cyan-400" />
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Sind Sie eine Umzugsfirma?
            </h2>
            
            <p className="text-xl md:text-2xl text-slate-300 mb-4">
              Wir schicken Ihnen qualifizierte Aufträge
            </p>

            <p className="text-lg text-slate-400 mb-12 max-w-2xl mx-auto">
              Profitieren Sie von unserer Plattform mit über 25'000 Umzügen und werden Sie Teil unseres Netzwerks geprüfter Partner
            </p>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-2xl bg-blue-500/20 flex items-center justify-center mb-4">
                  <TrendingUp className="h-8 w-8 text-blue-400" />
                </div>
                <div className="font-bold text-xl mb-2">Mehr Aufträge</div>
                <div className="text-slate-400">Qualifizierte Leads aus Ihrer Region</div>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 flex items-center justify-center mb-4">
                  <Users className="h-8 w-8 text-cyan-400" />
                </div>
                <div className="font-bold text-xl mb-2">25'000+ Nutzer</div>
                <div className="text-slate-400">Zugriff auf große Kundenbasis</div>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-2xl bg-blue-500/20 flex items-center justify-center mb-4">
                  <Building2 className="h-8 w-8 text-blue-400" />
                </div>
                <div className="font-bold text-xl mb-2">Fair & transparent</div>
                <div className="text-slate-400">Keine versteckten Kosten</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/fuer-firmen">
                <Button size="lg" className="h-16 px-10 text-lg font-bold bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-xl">
                  Jetzt Partner werden
                </Button>
              </Link>
              <Link to="/fuer-firmen/preise">
                <Button size="lg" variant="outline" className="h-16 px-10 text-lg font-semibold border-2 border-white text-white hover:bg-white hover:text-slate-900">
                  Preise & Modelle ansehen
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
