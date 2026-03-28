import { memo } from "react";
import { motion } from "framer-motion";
import { Star, Quote, CheckCircle, MapPin, Calendar, Verified, TrendingUp } from "lucide-react";
import { 
  RevealOnScroll, 
  RatingStars, 
  GlassmorphismCard, 
  TypingText,
  AnimatedGradientText,
  StaggerContainer,
  StaggerItem,
  SectionBadge,
  NumberTicker,
  Marquee,
  BlurReveal
} from "@/components/common";

const testimonials = [
  {
    id: 1,
    name: "Sarah M.",
    location: "Zürich → Bern",
    date: "November 2024",
    rating: 5,
    text: "Der Service war ausgezeichnet! Innerhalb von 24 Stunden hatte ich 4 Offerten. Die Firma, die ich gewählt habe, war pünktlich und professionell.",
    avatar: "SM",
    verified: true,
    savings: "CHF 1'200"
  },
  {
    id: 2,
    name: "Thomas K.",
    location: "Basel → Luzern",
    date: "Oktober 2024",
    rating: 5,
    text: "Habe über 30% gespart im Vergleich zum ersten Angebot, das ich direkt eingeholt hatte. Der Vergleich hat sich absolut gelohnt!",
    avatar: "TK",
    verified: true,
    savings: "CHF 890"
  },
  {
    id: 3,
    name: "Maria L.",
    location: "Genf → Zürich",
    date: "September 2024",
    rating: 5,
    text: "Sehr einfacher Prozess. Die AI-Analyse hat genau verstanden, was ich brauche. Klare Empfehlung!",
    avatar: "ML",
    verified: true,
    savings: "CHF 1'450"
  },
  {
    id: 4,
    name: "Peter S.",
    location: "St. Gallen → Winterthur",
    date: "August 2024",
    rating: 5,
    text: "Zum dritten Mal genutzt und wieder super zufrieden. Der beste Umzugsvergleich der Schweiz!",
    avatar: "PS",
    verified: true,
    savings: "CHF 750"
  }
];

const marqueeTestimonials = [
  "\"Super schnell und unkompliziert!\" - Anna B.",
  "\"Habe 1'300 CHF gespart\" - Marco T.",
  "\"Beste Plattform für Umzüge\" - Lisa W.",
  "\"Sehr professionell\" - Daniel K.",
  "\"Klare Empfehlung!\" - Sandra M.",
];

export const PremiumTestimonialsSection = memo(function PremiumTestimonialsSection() {
  return (
    <section className="py-20 md:py-28 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-muted/30 via-background to-muted/30" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />

      <div className="container relative z-10">
        {/* Header */}
        <RevealOnScroll direction="up" className="text-center mb-12">
          <SectionBadge icon={<Star className="w-4 h-4" />} variant="primary" className="mb-4">
            Kundenstimmen
          </SectionBadge>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            Was unsere Kunden{" "}
            <AnimatedGradientText>sagen</AnimatedGradientText>
          </h2>
          
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            <TypingText 
              text="Über 15'000 zufriedene Kunden vertrauen uns bei ihrem Umzug."
              speed={30}
              cursor={false}
            />
          </p>
        </RevealOnScroll>

        {/* Marquee Testimonials */}
        <div className="mb-10 py-4 bg-muted/30 rounded-xl">
          <Marquee speed="slow" pauseOnHover direction="right">
            {marqueeTestimonials.map((text, i) => (
              <span key={i} className="text-sm text-muted-foreground px-8 italic">
                {text}
              </span>
            ))}
          </Marquee>
        </div>

        {/* Testimonials Grid */}
        <StaggerContainer staggerDelay={0.1} className="grid md:grid-cols-2 gap-6">
          {testimonials.map((testimonial, index) => (
            <StaggerItem key={testimonial.id}>
              <BlurReveal delay={index * 0.1}>
                <GlassmorphismCard 
                  className="h-full p-6 group hover:shadow-xl transition-all duration-300"
                  blur="md"
                  opacity={0.8}
                >
                  <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {/* Avatar */}
                        <motion.div 
                          className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold"
                          whileHover={{ scale: 1.1 }}
                        >
                          {testimonial.avatar}
                        </motion.div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{testimonial.name}</span>
                            {testimonial.verified && (
                              <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: index * 0.1 + 0.3 }}
                              >
                                <Verified className="w-4 h-4 text-primary fill-primary/20" />
                              </motion.span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <MapPin className="w-3 h-3" />
                            {testimonial.location}
                          </div>
                        </div>
                      </div>
                      
                      {/* Quote Icon */}
                      <Quote className="w-8 h-8 text-primary/20" />
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-3">
                      <RatingStars rating={testimonial.rating} size="sm" />
                      <span className="text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3 inline mr-1" />
                        {testimonial.date}
                      </span>
                    </div>

                    {/* Text */}
                    <p className="text-muted-foreground flex-grow mb-4 leading-relaxed">
                      "{testimonial.text}"
                    </p>

                    {/* Footer - Savings Badge */}
                    <motion.div 
                      className="flex items-center gap-2 pt-4 border-t border-border"
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 + 0.2 }}
                    >
                      <div className="flex items-center gap-1.5 bg-green-500/10 text-green-600 px-3 py-1.5 rounded-full text-sm font-medium">
                        <CheckCircle className="w-4 h-4" />
                        Gespart: {testimonial.savings}
                      </div>
                    </motion.div>
                  </div>
                </GlassmorphismCard>
              </BlurReveal>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Stats Row with Number Tickers */}
        <motion.div 
          className="mt-12 flex flex-wrap justify-center gap-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <div className="bg-card rounded-2xl border border-border p-6 shadow-soft">
            <div className="text-3xl font-bold text-foreground">4.8/5</div>
            <div className="text-sm text-muted-foreground flex items-center gap-1 justify-center">
              <Star className="w-4 h-4 text-swiss-gold fill-swiss-gold" />
              Durchschnittliche Bewertung
            </div>
          </div>
          <div className="bg-card rounded-2xl border border-border p-6 shadow-soft">
            <div className="text-3xl font-bold text-foreground">
              <NumberTicker value={15000} suffix="+" />
            </div>
            <div className="text-sm text-muted-foreground">Zufriedene Kunden</div>
          </div>
          <div className="bg-card rounded-2xl border border-border p-6 shadow-soft">
            <div className="text-3xl font-bold text-green-600">
              CHF <NumberTicker value={1100} />
            </div>
            <div className="text-sm text-muted-foreground flex items-center gap-1 justify-center">
              <TrendingUp className="w-4 h-4 text-green-500" />
              Ø Ersparnis pro Umzug
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
});