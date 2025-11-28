import { motion } from "framer-motion";
import { ButtonPremium } from "@/components/ui/button-premium";
import { Link } from "react-router-dom";
import { Star, Users, Shield, ArrowRight } from "lucide-react";

export const PremiumHero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center gradient-hero overflow-hidden">
      {/* Background Blur Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-96 h-96 bg-copper/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-swiss-gold/10 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-[1350px] mx-auto px-6 md:px-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Side - Content */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8"
          >
            {/* Headline */}
            <h1 className="text-premium-h1 lg:text-premium-h1-lg text-swiss-noir leading-tight">
              Der exklusivste Weg,<br />
              Ihren Umzug zu planen.
            </h1>

            {/* Subline */}
            <p className="text-premium-body lg:text-premium-body-lg text-platinum max-w-2xl">
              AI-gestützte Schweizer Premium-Vergleiche.<br />
              Transparente Preise. Handverlesene Firmen.
            </p>

            {/* Trust Bar - below headline */}
            <div className="flex flex-wrap gap-6 py-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="flex items-center gap-2 px-5 py-3 bg-white rounded-2xl shadow-premium"
              >
                <Star className="w-5 h-5 text-swiss-gold fill-swiss-gold" />
                <span className="font-semibold text-swiss-noir">4.8 / 5</span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="flex items-center gap-2 px-5 py-3 bg-white rounded-2xl shadow-premium"
              >
                <Users className="w-5 h-5 text-copper" />
                <span className="font-semibold text-swiss-noir">15'000+ Umzüge</span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="flex items-center gap-2 px-5 py-3 bg-white rounded-2xl shadow-premium"
              >
                <Shield className="w-5 h-5 text-success" />
                <span className="font-semibold text-swiss-noir">Nur geprüfte Partner</span>
              </motion.div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                <ButtonPremium size="lg" variant="copper" asChild>
                  <Link to="/rechner">
                    Jetzt gratis Offerten vergleichen
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </ButtonPremium>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
              >
                <ButtonPremium size="lg" variant="copper-outline" asChild>
                  <Link to="/fuer-firmen">Für Umzugsfirmen</Link>
                </ButtonPremium>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Side - Premium AI Calculator Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
            className="relative"
          >
            <div className="bg-white rounded-3xl shadow-deep p-10 border border-border">
              <div className="space-y-6">
                <div>
                  <h3 className="text-premium-h3 text-swiss-noir mb-2">
                    AI-Umzugsrechner
                  </h3>
                  <p className="text-platinum text-premium-small">
                    Exklusiv, schnell, zuverlässig.
                  </p>
                </div>

                {/* Calculator Form */}
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold text-swiss-noir mb-2 block">
                      1. Von (PLZ oder Ort)
                    </label>
                    <input
                      type="text"
                      placeholder="z.B. 8001 Zürich"
                      className="w-full h-14 px-5 rounded-2xl border-2 border-border focus:border-copper focus:ring-2 focus:ring-copper/20 transition-all outline-none text-swiss-noir"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-swiss-noir mb-2 block">
                      2. Nach (PLZ oder Ort)
                    </label>
                    <input
                      type="text"
                      placeholder="z.B. 3011 Bern"
                      className="w-full h-14 px-5 rounded-2xl border-2 border-border focus:border-copper focus:ring-2 focus:ring-copper/20 transition-all outline-none text-swiss-noir"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-swiss-noir mb-2 block">
                      3. Offerten erhalten
                    </label>
                    <ButtonPremium className="w-full" size="lg" variant="copper">
                      Jetzt vergleichen
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </ButtonPremium>
                  </div>
                </div>

                <p className="text-sm text-center text-platinum">
                  ✓ 100% kostenlos & unverbindlich
                </p>
              </div>
            </div>

            {/* Decorative element */}
            <div className="absolute -z-10 -top-4 -right-4 w-full h-full bg-copper/5 rounded-3xl"></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};