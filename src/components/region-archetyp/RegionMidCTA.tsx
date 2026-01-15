import { memo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Users, Clock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RegionMidCTAProps {
  regionName: string;
}

export const RegionMidCTA = memo(({ regionName }: RegionMidCTAProps) => {
  // Generate a realistic-looking random number for social proof
  const todayCount = Math.floor(Math.random() * 8) + 12; // 12-20

  return (
    <section className="py-10">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-primary/80 p-6 md:p-10"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
          </div>

          <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Content */}
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
                <Users className="h-4 w-4 text-primary-foreground/80" />
                <span className="text-sm text-primary-foreground/80">
                  {todayCount} Offerten heute in {regionName}
                </span>
              </div>
              
              <h2 className="text-xl md:text-2xl font-bold text-primary-foreground mb-3">
                Kostenlos Offerten vergleichen
              </h2>
              
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-primary-foreground/90">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Unverbindlich</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  <span>In 2 Minuten</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Bis 40% sparen</span>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <Button 
              size="lg" 
              variant="secondary"
              asChild 
              className="shrink-0 shadow-lg hover:shadow-xl transition-shadow"
            >
              <Link to="/umzugsofferten" className="flex items-center gap-2">
                Offerten erhalten
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
});

RegionMidCTA.displayName = "RegionMidCTA";
