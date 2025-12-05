import { motion } from "framer-motion";
import { Star, CheckCircle, MapPin, Users } from "lucide-react";

const stats = [
  { value: "15'000+", label: "Erfolgreiche Umzüge", icon: CheckCircle },
  { value: "4.8/5", label: "Durchschnittsbewertung", icon: Star },
  { value: "200+", label: "Geprüfte Partner", icon: Users },
  { value: "26", label: "Kantone abgedeckt", icon: MapPin },
];

export const SocialProofSection = () => {
  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Image (Desktop only) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="hidden lg:block relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-premium">
              <img
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80"
                alt="Zufriedene Kunden nach Umzug"
                className="w-full h-[450px] object-cover"
                loading="lazy"
              />
              {/* Overlay Card */}
              <div className="absolute bottom-6 left-6 bg-card/95 backdrop-blur-sm rounded-xl p-4 shadow-medium border border-border">
                <div className="flex gap-1 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-swiss-gold text-swiss-gold" />
                  ))}
                </div>
                <p className="text-sm font-medium">15'000+ zufriedene Kunden</p>
              </div>
            </div>
          </motion.div>

          {/* Right - Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                Tausende Schweizer vertrauen uns
              </h2>
              <p className="text-muted-foreground text-lg max-w-lg">
                Seit 2020 helfen wir Menschen dabei, den perfekten Umzugspartner zu finden – transparent, unabhängig und kostenlos.
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  className="bg-card rounded-xl p-5 border border-border shadow-soft hover:shadow-medium transition-shadow"
                >
                  <stat.icon className="w-6 h-6 text-secondary mb-3" />
                  <div className="text-2xl md:text-3xl font-bold text-foreground">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
