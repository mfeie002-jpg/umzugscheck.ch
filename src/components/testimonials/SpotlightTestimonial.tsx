/**
 * Spotlight Testimonial Component
 * 
 * "Hero Story" Strategy - One prominent testimonial instead of slider
 * 
 * Features:
 * - Spotlight card with premium customer quote
 * - Video thumbnail with overlay
 * - Trust statistics row
 * - Mobile-first, conversion-optimized
 */

import { memo } from "react";
import { motion } from "framer-motion";
import { Star, Play, Quote, CheckCircle2, Users, ThumbsUp } from "lucide-react";
import { TRUST } from "@/content/trust";
import { cn } from "@/lib/utils";

export interface SpotlightTestimonialProps {
  /** Variant: platform (Umzugscheck) or company (Partner) */
  variant?: "platform" | "company";
  /** Company name for company variant */
  companyName?: string;
  /** Custom headline */
  headline?: string;
  /** Custom subline */
  subline?: string;
  /** Video thumbnail URL */
  videoThumbnail?: string;
  /** Video URL or YouTube ID */
  videoUrl?: string;
  /** Video duration text */
  videoDuration?: string;
  /** Show video section */
  showVideo?: boolean;
  /** Custom className */
  className?: string;
}

// Platform testimonials (Umzugscheck)
const platformTestimonials = {
  hero: {
    quote: "Ich hätte nie gedacht, dass ein Umzug so stressfrei sein kann. Dank Umzugscheck hatte ich innert 48 Stunden 4 Offerten – und habe am Ende CHF 800 gespart.",
    author: "Dr. med. Sarah Keller",
    role: "Ärztin",
    location: "Umzug in Zürich",
    date: "Oktober 2024",
    highlights: ["stressfrei", "CHF 800 gespart"],
  },
  stats: [
    { value: TRUST.movesCount, label: TRUST.movesLabel, icon: Users },
    { value: "98%", label: "Weiterempfehlung", icon: ThumbsUp },
  ],
};

// Company testimonials template
const companyTestimonials = {
  hero: {
    quote: "Als Arzt habe ich wenig Zeit. Das Team hat alles übernommen – vom Einpacken bis zum Aufhängen der Bilder. Absolut empfehlenswert.",
    author: "Dr. med. Thomas Keller",
    role: "Kunde",
    location: "Zürich",
    date: "2024",
    highlights: ["wenig Zeit", "alles übernommen"],
  },
  stats: [
    { value: "15'000+", label: "Umzüge seit 1980", icon: Users },
    { value: "98%", label: "Weiterempfehlung", icon: ThumbsUp },
  ],
};

// Highlight keywords in quote
function highlightQuote(quote: string, highlights: string[]): React.ReactNode {
  let result = quote;
  highlights.forEach((word) => {
    result = result.replace(
      word,
      `<strong class="text-primary font-semibold">${word}</strong>`
    );
  });
  return <span dangerouslySetInnerHTML={{ __html: result }} />;
}

export const SpotlightTestimonial = memo(function SpotlightTestimonial({
  variant = "platform",
  companyName,
  headline,
  subline,
  videoThumbnail,
  videoUrl,
  videoDuration = "45 Sek",
  showVideo = true,
  className,
}: SpotlightTestimonialProps) {
  const testimonial = variant === "platform" ? platformTestimonials : companyTestimonials;
  const defaultHeadline = variant === "platform" 
    ? "Zürcher Qualität, die man spürt" 
    : `So fühlt sich ${companyName || 'Qualität'} an`;
  const defaultSubline = variant === "platform"
    ? `Über ${TRUST.movesCount} Schweizer vertrauen Umzugscheck. Hier ist eine davon:`
    : `Über 15'000 Kunden vertrauen ${companyName || 'uns'}. Hier ist einer davon:`;

  return (
    <section className={cn("py-12 md:py-16 bg-background", className)}>
      <div className="container max-w-4xl px-4">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            {headline || defaultHeadline}
          </h2>
          <p className="text-muted-foreground">
            {subline || defaultSubline}
          </p>
        </motion.div>

        {/* Spotlight Card - The Hero Story */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-2xl shadow-lg border border-border/50 p-6 md:p-8 mb-8"
        >
          {/* Quote Icon */}
          <Quote className="w-8 h-8 text-primary/20 mb-4" />
          
          {/* Rating */}
          <div className="flex gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
            ))}
          </div>
          
          {/* Quote Text */}
          <blockquote className="text-lg md:text-xl text-foreground leading-relaxed mb-6">
            "{highlightQuote(testimonial.hero.quote, testimonial.hero.highlights)}"
          </blockquote>
          
          {/* Author */}
          <div className="flex items-center gap-4">
            {/* Avatar with initials */}
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-semibold text-sm">
                {testimonial.hero.author.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </span>
            </div>
            
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-foreground">
                  {testimonial.hero.author}
                </span>
                <CheckCircle2 className="w-4 h-4 text-primary" />
              </div>
              <span className="text-sm text-muted-foreground">
                {testimonial.hero.role} • {testimonial.hero.location}
                {testimonial.hero.date && ` • ${testimonial.hero.date}`}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Proof Row: Video + Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {/* Video Thumbnail */}
          {showVideo && (
            <a
              href={videoUrl || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative rounded-xl overflow-hidden bg-muted aspect-video 
                         hover:shadow-lg transition-shadow cursor-pointer"
            >
              {videoThumbnail ? (
                <img 
                  src={videoThumbnail} 
                  alt="Video ansehen" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 
                                flex items-center justify-center">
                  <div className="text-center">
                    <Play className="w-12 h-12 text-primary mx-auto mb-2" />
                    <span className="text-sm text-muted-foreground">Video laden...</span>
                  </div>
                </div>
              )}
              
              {/* Play Overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 
                              group-hover:bg-black/30 transition-colors">
                <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center
                                shadow-lg group-hover:scale-110 transition-transform">
                  <Play className="w-7 h-7 text-primary fill-primary ml-1" />
                </div>
              </div>
              
              {/* Duration Badge */}
              <div className="absolute bottom-3 left-3 px-2 py-1 rounded bg-black/70 text-white text-xs">
                ▶ Video ansehen ({videoDuration})
              </div>
            </a>
          )}

          {/* Stats Cards */}
          <div className={cn(
            "grid gap-4",
            showVideo ? "grid-cols-1" : "grid-cols-2"
          )}>
            {testimonial.stats.map((stat, index) => (
              <div
                key={index}
                className="bg-muted/50 rounded-xl p-4 md:p-6 text-center
                           hover:bg-muted transition-colors"
              >
                <stat.icon className="w-6 h-6 text-primary mx-auto mb-2" />
                <div className="text-2xl md:text-3xl font-bold text-foreground mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA Link */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-center mt-8"
        >
          <a
            href="https://g.page/r/umzugscheck/review"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 
                       font-medium transition-colors group"
          >
            Mehr als {TRUST.ratingCount.toLocaleString('de-CH')} Bewertungen lesen
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
});

export default SpotlightTestimonial;
