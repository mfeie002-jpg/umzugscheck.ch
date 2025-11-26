import { Button } from "@/components/ui/button";
import { Building2, TrendingUp, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export const ProviderCTA = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-gradient-to-br from-secondary to-secondary/80 rounded-3xl p-8 md:p-12 shadow-strong text-white relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full blur-3xl" />
            </div>

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <Building2 className="h-12 w-12" />
                <h2 className="text-3xl md:text-4xl font-bold">
                  Für Umzugsfirmen
                </h2>
              </div>

              <p className="text-xl text-white/90 mb-8 max-w-2xl">
                Werden Sie Partner und erhalten Sie qualifizierte Anfragen von umzugswilligen Kunden in Ihrer Region
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-bold text-lg">Mehr Aufträge</div>
                    <div className="text-white/80 text-sm">Qualifizierte Leads aus Ihrer Region</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-bold text-lg">15'000+ Nutzer</div>
                    <div className="text-white/80 text-sm">Zugriff auf große Kundenbasis</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-bold text-lg">Fair & transparent</div>
                    <div className="text-white/80 text-sm">Keine versteckten Kosten</div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/fuer-firmen">
                  <Button size="lg" className="bg-white text-secondary hover:bg-white/90 h-14 px-8 text-lg font-bold shadow-strong">
                    Partner werden
                  </Button>
                </Link>
                <Link to="/fuer-firmen/preise">
                  <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10 h-14 px-8 text-lg font-semibold">
                    Preise ansehen
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
