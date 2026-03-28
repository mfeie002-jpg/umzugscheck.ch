import { motion } from "framer-motion";
import { Smartphone, Star, Download, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const PremiumMobileAppBanner = () => {
  return (
    <section className="py-10 md:py-16 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-12">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4 }}
            className="flex-1 text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full text-sm mb-6">
              <Smartphone className="w-4 h-4" />
              <span>Neu: Mobile App</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Umzugscheck.ch für unterwegs
            </h2>
            <p className="text-primary-foreground/80 text-lg mb-6 max-w-xl">
              Vergleichen Sie Umzugsfirmen, tracken Sie Ihren Umzug und erhalten Sie Push-Benachrichtigungen - alles in einer App.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                <Download className="w-5 h-5 mr-2" />
                App Store
              </Button>
              <Button variant="outline" size="lg" className="w-full sm:w-auto bg-transparent border-white/30 hover:bg-white/10">
                <Download className="w-5 h-5 mr-2" />
                Play Store
              </Button>
            </div>

            <div className="flex items-center gap-4 mt-6 justify-center lg:justify-start">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-sm text-primary-foreground/80">4.9/5 • 10'000+ Downloads</span>
            </div>
          </motion.div>

          {/* Phone mockup - hidden on mobile for performance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4 }}
            className="flex-shrink-0 hidden md:block"
          >
            <div className="relative">
              <div className="w-64 h-[500px] bg-black rounded-[3rem] p-2 shadow-2xl">
                <div className="w-full h-full bg-gradient-to-b from-background to-muted rounded-[2.5rem] overflow-hidden">
                  {/* App screen simulation */}
                  <div className="p-4">
                    <div className="h-6 w-20 bg-muted rounded-full mx-auto mb-4" />
                    <div className="space-y-3">
                      <div className="h-24 bg-primary/10 rounded-xl" />
                      <div className="h-16 bg-muted rounded-xl" />
                      <div className="h-16 bg-muted rounded-xl" />
                      <div className="h-16 bg-muted rounded-xl" />
                    </div>
                  </div>
                </div>
              </div>
              {/* Glow effect */}
              <div className="absolute -inset-4 bg-white/20 rounded-[4rem] blur-3xl -z-10" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
