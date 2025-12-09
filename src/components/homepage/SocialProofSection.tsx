import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { Star, CheckCircle, MapPin, Users, TrendingUp, Award, Zap, Shield } from "lucide-react";
import { AnimatedCounter } from "./AnimatedCounter";
import { useEffect, useRef, useState } from "react";

const stats = [
  { value: 15000, suffix: "+", label: "Erfolgreiche Umzüge", icon: CheckCircle, gradient: "from-green-500 to-emerald-600" },
  { value: 4.8, suffix: "/5", label: "Durchschnittsbewertung", icon: Star, decimals: 1, gradient: "from-amber-500 to-orange-600" },
  { value: 200, suffix: "+", label: "Geprüfte Partner", icon: Users, gradient: "from-blue-500 to-indigo-600" },
  { value: 26, suffix: "", label: "Kantone abgedeckt", icon: MapPin, gradient: "from-purple-500 to-pink-600" },
];

const testimonials = [
  { name: "Familie Müller", location: "Zürich → Bern", rating: 5, text: "Perfekter Service!" },
  { name: "Thomas K.", location: "Basel → Luzern", rating: 5, text: "Sehr empfehlenswert!" },
  { name: "Sandra B.", location: "Genf → Lausanne", rating: 5, text: "Top Preis-Leistung!" },
];

export const SocialProofSection = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-muted/30 via-background to-muted/20 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
      </div>
      
      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Image with Enhanced Effects */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="hidden lg:block relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-premium group">
              <motion.img
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80"
                alt="Zufriedene Kunden nach Umzug"
                className="w-full h-[500px] object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              {/* Floating Testimonial Card */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="absolute bottom-6 left-6 right-6 bg-card/95 backdrop-blur-md rounded-2xl p-5 shadow-lg border border-border/50"
              >
                <motion.div
                  key={activeTestimonial}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-2"
                >
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-swiss-gold text-swiss-gold" />
                    ))}
                  </div>
                  <p className="text-sm font-medium italic">"{testimonials[activeTestimonial].text}"</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{testimonials[activeTestimonial].name}</span>
                    <span className="text-xs text-muted-foreground">{testimonials[activeTestimonial].location}</span>
                  </div>
                </motion.div>
                
                {/* Testimonial Dots */}
                <div className="flex gap-1.5 justify-center mt-3">
                  {testimonials.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveTestimonial(i)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        i === activeTestimonial ? "bg-secondary w-6" : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                      }`}
                    />
                  ))}
                </div>
              </motion.div>
              
              {/* Award Badge with Pulse */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.4 }}
                className="absolute top-6 right-6"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-secondary rounded-2xl animate-ping opacity-20" />
                  <div className="relative bg-gradient-to-br from-secondary to-secondary/80 text-white rounded-2xl p-4 shadow-cta">
                    <Award className="w-7 h-7" />
                  </div>
                </div>
              </motion.div>
              
              {/* Verified Badge */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6, duration: 0.4 }}
                className="absolute top-6 left-6 bg-green-500 text-white rounded-full px-4 py-2 flex items-center gap-2 shadow-lg"
              >
                <Shield className="w-4 h-4" />
                <span className="text-sm font-semibold">Verifiziert</span>
              </motion.div>
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
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 text-sm bg-secondary/10 text-secondary font-medium px-4 py-2 rounded-full"
              >
                <Zap className="w-4 h-4" />
                Vertrauenswürdig seit 2020
              </motion.div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                Tausende Schweizer vertrauen uns
              </h2>
              <p className="text-muted-foreground text-lg max-w-lg leading-relaxed">
                Seit 2020 helfen wir Menschen dabei, den perfekten Umzugspartner zu finden – transparent, unabhängig und kostenlos.
              </p>
            </div>

            {/* Animated Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="group bg-card rounded-2xl p-5 border border-border shadow-soft hover:shadow-lg transition-all duration-300 relative overflow-hidden"
                >
                  {/* Hover Gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                  
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center mb-3 shadow-md`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-foreground">
                    <AnimatedCounter 
                      end={stat.value} 
                      suffix={stat.suffix} 
                      decimals={stat.decimals || 0}
                    />
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="flex flex-wrap gap-3"
            >
              {["SSL Gesichert", "DSGVO Konform", "Schweizer Server"].map((badge, i) => (
                <span key={badge} className="inline-flex items-center gap-2 text-xs bg-muted/50 text-muted-foreground px-3 py-2 rounded-full">
                  <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                  {badge}
                </span>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
