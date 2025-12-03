import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import { motion } from "framer-motion";
import { getHomepageContent } from "@/lib/content";

export const SocialProofSimple = () => {
  const content = getHomepageContent().socialProof;
  return (
    <section className="py-16 md:py-20 bg-muted">
      <div className="container mx-auto px-4">
        
        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-3 gap-4 md:gap-8 mb-10 md:mb-16 max-w-6xl mx-auto"
        >
          {content.stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-2xl sm:text-3xl md:text-5xl font-bold text-primary mb-1 md:mb-2">{stat.value}</div>
              <p className="text-xs sm:text-sm md:text-base text-muted-foreground font-medium">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Reviews Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="overflow-x-auto pb-4 -mx-4 px-4 md:mx-0 md:px-0"
        >
          <div className="flex gap-4 md:gap-6 min-w-max md:grid md:grid-cols-3 md:min-w-0 max-w-6xl mx-auto">
            {content.testimonials.slice(0, 3).map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="w-[260px] md:w-auto flex-shrink-0"
              >
                <Card className="h-full bg-card border-border hover:shadow-lift transition-shadow">
                  <CardContent className="p-4 md:p-6">
                    <div className="flex items-center gap-1 mb-3">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-swiss-gold text-swiss-gold" />
                      ))}
                    </div>
                    <p className="text-foreground/80 mb-4 leading-relaxed">
                      "{testimonial.text}"
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                        {testimonial.name[0]}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-foreground">
                          {testimonial.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {testimonial.location}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
