import { motion } from "framer-motion";
import { Sparkles, Clock, ArrowRight, Percent } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const SeasonalBanner = () => {
  return (
    <section className="py-8 bg-gradient-to-r from-secondary via-secondary to-secondary/90 text-white overflow-hidden">
      <div className="container">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center"
            >
              <Percent className="w-6 h-6" />
            </motion.div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium text-white/90">Winter-Aktion</span>
              </div>
              <h3 className="text-lg md:text-xl font-bold">
                Bis zu 30% auf Umzüge im Januar
              </h3>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-sm text-white/80">
              <Clock className="w-4 h-4" />
              Nur noch 14 Tage
            </div>
            <Button
              asChild
              className="bg-white text-secondary hover:bg-white/90 font-semibold"
            >
              <Link to="/umzugsofferten">
                Jetzt sparen
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
