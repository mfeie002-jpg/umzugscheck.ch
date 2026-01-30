/**
 * SocialProofBlock - Premium Trust Section
 * 
 * Redesigned for maximum impact:
 * ✅ Colored background (not white)
 * ✅ High-contrast logos
 * ✅ Cards with avatars
 * ✅ Proper visual hierarchy
 */

import { Star, Quote, CheckCircle2, Shield, BadgeCheck } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";

const reviews = [
  {
    name: "Sarah M.",
    location: "Zürich",
    rating: 5,
    text: "Sehr einfach und transparent. Habe 35% gespart im Vergleich zur ersten Offerte!",
    avatar: "https://randomuser.me/api/portraits/women/32.jpg",
    company: "Budget Umzüge",
    verified: true,
  },
  {
    name: "Thomas K.",
    location: "Bern",
    rating: 5,
    text: "Schnell, unkompliziert und die Firmen waren wirklich top. Kann ich nur empfehlen.",
    avatar: "https://randomuser.me/api/portraits/men/45.jpg",
    company: "SwissMove AG",
    verified: true,
  },
  {
    name: "Maria L.",
    location: "Basel",
    rating: 5,
    text: "Endlich kann man Umzugsfirmen einfach vergleichen. Hat mir viel Zeit gespart!",
    avatar: "https://randomuser.me/api/portraits/women/28.jpg",
    company: "Express Umzug",
    verified: true,
  },
];

// Media logos: Nur SVGs aus /public/logos/trust/
const mediaLogos = [
  { name: "SRF", src: "/logos/trust/srf.svg" },
  { name: "NZZ", src: "/logos/trust/nzz.svg" },
  { name: "20 Minuten", src: "/logos/trust/20min.svg" },
  { name: "Blick", src: "/logos/trust/blick.svg" },
  { name: "Watson", src: "/logos/trust/watson.svg" },
  { name: "TCS", src: "/logos/trust/tcs.svg" },
];

export const SocialProofBlock = () => {
  return (
    <section className="relative py-16 md:py-20 overflow-hidden">
      {/* Gradient background - creates visual "zone" */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/8 via-secondary/10 to-background" />
      
      <div className="container mx-auto px-4 relative">
        {/* Hero Rating */}
        <div className="text-center mb-10">
          <div className="inline-flex flex-col items-center">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-8 h-8 md:w-10 md:h-10 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-4xl md:text-5xl font-bold text-foreground">4.8</span>
              <span className="text-xl text-muted-foreground">/5</span>
            </div>
            <p className="text-lg text-muted-foreground">
              aus <span className="font-bold text-foreground">2'400+</span> Bewertungen
            </p>
          </div>
        </div>

        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Was unsere Nutzer sagen
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Über 15'000 zufriedene Kunden vertrauen auf Umzugscheck.ch
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
          {reviews.map((review, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-card rounded-2xl p-6 shadow-md border border-border hover:shadow-lg hover:border-primary/30 hover:-translate-y-1 transition-all"
            >
              <div className="flex items-start gap-4 mb-4">
                <Avatar className="h-12 w-12 border-2 border-primary/20">
                  <AvatarImage src={review.avatar} alt={review.name} />
                  <AvatarFallback>{review.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-foreground">{review.name}</h4>
                      {review.verified && (
                        <span className="inline-flex items-center gap-1 text-xs text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3" />
                          Verifiziert
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{review.location} • {review.company}</p>
                </div>
              </div>
              <div className="flex gap-0.5 mb-3">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <Quote className="h-5 w-5 text-primary/30 mb-2" />
              <p className="text-foreground/90 leading-relaxed">
                {review.text}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Trust Logos - HIGH CONTRAST */}
        <div className="text-center">
          <p className="text-xs md:text-sm font-bold uppercase tracking-widest text-muted-foreground mb-6">
            Bekannt aus & geprüft von
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-5">
            {mediaLogos.map((logo, index) => (
              <motion.div
                key={logo.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.08, y: -2 }}
                className="px-4 py-2.5 rounded-lg bg-card border border-border shadow-sm hover:shadow-md transition-all cursor-pointer"
              >
                <img
                  src={logo.src}
                  alt={logo.name}
                  className="h-8 w-auto max-w-[90px] object-contain"
                  loading="lazy"
                  onError={e => { e.currentTarget.style.display = "none"; }}
                  width={90}
                  height={32}
                  decoding="async"
                  draggable={false}
                />
              </motion.div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-5">
            Partnerprüfung: Handelsregister, Versicherung & Bewertungen verifiziert
          </p>
        </div>
      </div>
    </section>
  );
};
