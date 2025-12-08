import { memo } from "react";
import { motion } from "framer-motion";
import { MapPin, ArrowRight, Building2, TrendingUp, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SmoothReveal, StaggerContainer, StaggerItem, LiveDot, AnimatedGradientText } from "@/components/common";

const regions = [
  { name: "Zürich", count: 45, href: "/zuerich", trending: true, growth: "+12%" },
  { name: "Bern", count: 32, href: "/bern", trending: false, growth: "+8%" },
  { name: "Basel", count: 28, href: "/basel", trending: true, growth: "+15%" },
  { name: "Luzern", count: 22, href: "/luzern", trending: false, growth: "+5%" },
  { name: "Aargau", count: 26, href: "/aargau", trending: false, growth: "+7%" },
  { name: "St. Gallen", count: 20, href: "/st-gallen", trending: true, growth: "+10%" },
  { name: "Genf", count: 24, href: "/genf", trending: false, growth: "+6%" },
  { name: "Waadt", count: 30, href: "/waadt", trending: false, growth: "+9%" },
];

export const EnhancedRegionsSection = memo(function EnhancedRegionsSection() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-muted/30 to-background relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Content */}
          <SmoothReveal direction="left" className="space-y-6">
            <motion.span 
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/10 text-secondary text-sm font-medium"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <MapPin className="w-4 h-4" />
              Schweizweit verfügbar
            </motion.span>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
              In allen{" "}
              <AnimatedGradientText>26 Kantonen</AnimatedGradientText>
              {" "}für Sie da
            </h2>
            
            <p className="text-muted-foreground text-lg">
              Egal ob Grossstadt oder ländliche Gemeinde – wir haben geprüfte Umzugspartner in Ihrer Nähe.
            </p>
            
            {/* Stats */}
            <div className="flex gap-8 py-4">
              <motion.div 
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <div className="text-4xl font-bold text-secondary">200+</div>
                <div className="text-sm text-muted-foreground">Geprüfte Partner</div>
              </motion.div>
              <motion.div 
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                <div className="text-4xl font-bold text-secondary">26</div>
                <div className="text-sm text-muted-foreground">Kantone</div>
              </motion.div>
              <motion.div 
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                <div className="text-4xl font-bold text-secondary flex items-center justify-center gap-1">
                  100%
                  <LiveDot color="green" size="sm" />
                </div>
                <div className="text-sm text-muted-foreground">Abdeckung</div>
              </motion.div>
            </div>
            
            <Button asChild size="lg" className="bg-secondary hover:bg-secondary/90 group">
              <Link to="/regionen">
                Alle Regionen ansehen
                <motion.span
                  className="ml-2"
                  initial={{ x: 0 }}
                  whileHover={{ x: 4 }}
                >
                  <ArrowRight className="w-4 h-4" />
                </motion.span>
              </Link>
            </Button>
          </SmoothReveal>

          {/* Right - Region Grid */}
          <StaggerContainer staggerDelay={0.05} className="grid grid-cols-2 gap-3">
            {regions.map((region) => (
              <StaggerItem key={region.name}>
                <Link
                  to={region.href}
                  className="group flex items-center justify-between bg-card rounded-xl p-4 border border-border shadow-sm hover:shadow-lg hover:border-secondary/30 transition-all duration-300"
                >
                  <div className="flex items-center gap-3">
                    <motion.div 
                      className="w-10 h-10 rounded-lg bg-gradient-to-br from-secondary/20 to-secondary/5 flex items-center justify-center"
                      whileHover={{ rotate: 5, scale: 1.1 }}
                    >
                      <MapPin className="w-5 h-5 text-secondary" />
                    </motion.div>
                    <div>
                      <div className="font-medium group-hover:text-secondary transition-colors flex items-center gap-2">
                        {region.name}
                        {region.trending && (
                          <motion.span 
                            className="flex items-center gap-0.5 text-xs text-green-600 bg-green-500/10 px-1.5 py-0.5 rounded-full"
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <TrendingUp className="w-3 h-3" />
                            {region.growth}
                          </motion.span>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <Building2 className="w-3 h-3" />
                        {region.count} Firmen
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-secondary group-hover:translate-x-1 transition-all" />
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </div>
    </section>
  );
});