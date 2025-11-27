import { motion } from "framer-motion";
import { ButtonPremium } from "@/components/ui/button-premium";
import { Link } from "react-router-dom";
import { Sparkles, TrendingUp, Shield, ArrowRight } from "lucide-react";

const benefits = [
  {
    icon: Sparkles,
    text: "Präzise Echtzeit-Kostenschätzungen",
  },
  {
    icon: TrendingUp,
    text: "Lernsystem aus 1000+ realen Umzügen",
  },
  {
    icon: Shield,
    text: "Transparenz statt Verkaufsdruck",
  },
];

export const PremiumAIShowcase = () => {
  return (
    <section className="section-spacing bg-white">
      <div className="container-premium">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-cream-gold rounded-full mb-6">
                <Sparkles className="w-4 h-4 text-copper" />
                <span className="text-sm font-semibold text-copper">
                  AI-Powered
                </span>
              </div>

              <h2 className="text-premium-h2 lg:text-premium-h2-lg text-swiss-noir mb-6">
                Der erste Schweizer AI-Umzugsrechner auf Premium-Niveau
              </h2>

              <p className="text-premium-body text-platinum">
                Unsere künstliche Intelligenz analysiert Ihren Umzug in Echtzeit und liefert 
                präzise Kostenschätzungen basierend auf tausenden erfolgreich durchgeführten 
                Umzügen in der Schweiz.
              </p>
            </div>

            {/* Benefits */}
            <div className="space-y-4">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 + 0.3, duration: 0.6 }}
                    className="flex items-center gap-4 p-5 bg-muted rounded-2xl"
                  >
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-cream-gold flex items-center justify-center">
                      <Icon className="w-6 h-6 text-copper" />
                    </div>
                    <p className="text-premium-small font-medium text-swiss-noir">
                      {benefit.text}
                    </p>
                  </motion.div>
                );
              })}
            </div>

            <ButtonPremium size="lg" variant="copper" asChild>
              <Link to="/rechner">
                Jetzt AI-Rechner testen
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </ButtonPremium>
          </motion.div>

          {/* Right - Visual/Mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="relative"
          >
            <div className="relative bg-white rounded-3xl shadow-deep p-10 border border-border">
              {/* Mockup Content */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>

                <div className="space-y-4">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                  <div className="h-16 bg-cream-gold rounded-2xl flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-copper" />
                  </div>
                  <div className="h-4 bg-muted rounded w-2/3"></div>
                  <div className="h-4 bg-muted rounded w-5/6"></div>
                </div>

                <div className="pt-6 border-t border-border">
                  <div className="flex justify-between items-center">
                    <div className="space-y-2">
                      <div className="h-3 bg-muted rounded w-24"></div>
                      <div className="h-6 bg-copper/20 rounded w-32 flex items-center justify-center">
                        <span className="text-xs font-bold text-copper">
                          CHF 2'400 - 2'800
                        </span>
                      </div>
                    </div>
                    <div className="w-12 h-12 bg-copper rounded-xl flex items-center justify-center">
                      <ArrowRight className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative Glow */}
            <div className="absolute -z-10 -inset-4 bg-gradient-to-br from-copper/20 to-swiss-gold/20 rounded-3xl blur-2xl"></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};