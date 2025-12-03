import { Star, Quote } from "lucide-react";
import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Sandra K.",
    location: "Zürich",
    type: "Privatumzug 3.5-Zimmer",
    rating: 5,
    text: "Der Vergleich war unglaublich einfach. Innerhalb eines Tages hatte ich drei faire Offerten und konnte in Ruhe vergleichen. Absolut empfehlenswert!"
  },
  {
    name: "Thomas M.",
    location: "Basel",
    type: "Firmenumzug 15 Arbeitsplätze",
    rating: 5,
    text: "Als KMU-Inhaber war mir Zuverlässigkeit wichtig. Die vorgeschlagenen Firmen waren alle top – professionell, pünktlich und fair im Preis."
  },
  {
    name: "Nicole B.",
    location: "Bern",
    type: "Privatumzug 4.5-Zimmer",
    rating: 5,
    text: "Endlich ein Portal, das hält, was es verspricht. Transparente Preise, keine nervigen Anrufe, nur seriöse Angebote. Genau so sollte es sein."
  },
  {
    name: "Marco R.",
    location: "Luzern",
    type: "Privatumzug 2.5-Zimmer",
    rating: 5,
    text: "Ich war skeptisch, aber positiv überrascht. Die AI-Analyse hat genau die richtigen Firmen gefunden. Sehr moderne und effiziente Plattform."
  }
];

const stats = [
  { value: "15'000+", label: "Erfolgreiche Umzüge" },
  { value: "4.8/5", label: "Durchschnittsbewertung" },
  { value: "200+", label: "Geprüfte Partner" },
  { value: "26", label: "Kantone abgedeckt" }
];

export const PremiumSocialProof = () => {
  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
        >
          {stats.map((stat, idx) => (
            <div key={idx} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-foreground mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </motion.div>
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Das sagen unsere Kunden
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Tausende zufriedene Kunden haben mit Umzugscheck.ch den passenden Partner für ihren Umzug gefunden.
          </p>
        </motion.div>
        
        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-card rounded-2xl p-6 shadow-premium border border-border/50 hover:shadow-lift transition-shadow"
            >
              {/* Quote Icon */}
              <Quote className="h-8 w-8 text-primary/20 mb-4" />
              
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-swiss-gold text-swiss-gold" />
                ))}
              </div>
              
              {/* Text */}
              <p className="text-foreground mb-6 leading-relaxed text-sm">
                "{testimonial.text}"
              </p>
              
              {/* Author */}
              <div className="border-t border-border pt-4">
                <div className="font-semibold text-foreground">{testimonial.name}</div>
                <div className="text-sm text-muted-foreground">{testimonial.location}</div>
                <div className="text-xs text-primary mt-1">{testimonial.type}</div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Average Rating */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-card rounded-full border border-border shadow-sm">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-swiss-gold text-swiss-gold" />
              ))}
            </div>
            <span className="font-semibold text-foreground">4.8 von 5</span>
            <span className="text-muted-foreground">basierend auf 2'847 Bewertungen</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
