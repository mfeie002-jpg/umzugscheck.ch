import { motion } from "framer-motion";
import { Phone, Clock, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

const EmergencyHotline = () => {
  return (
    <section className="py-8 bg-red-50 dark:bg-red-950/20 border-y border-red-200 dark:border-red-900/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8"
        >
          <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
            <AlertTriangle className="w-6 h-6" />
            <span className="font-semibold">Eilumzug nötig?</span>
          </div>
          
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>24/7 Notfall-Hotline</span>
          </div>

          <Button
            asChild
            variant="destructive"
            size="lg"
            className="font-semibold"
          >
            <a href="tel:+41765681302" className="flex items-center gap-2">
              <Phone className="w-5 h-5" />
              +41 76 568 13 02
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default EmergencyHotline;
