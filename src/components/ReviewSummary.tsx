import { Star, ThumbsUp, MessageSquare } from "lucide-react";
import AnimatedSection from "./AnimatedSection";

const ReviewSummary = () => {
  return (
    <section className="py-10 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
          <AnimatedSection className="text-center">
            <div className="flex justify-center gap-1 mb-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-warm text-warm" />
              ))}
            </div>
            <p className="font-bold text-2xl">4.9</p>
            <p className="text-xs text-muted-foreground">Google Bewertung</p>
          </AnimatedSection>
          <AnimatedSection delay={0.1} className="text-center">
            <ThumbsUp className="h-6 w-6 mx-auto mb-1 text-forest" />
            <p className="font-bold text-2xl">98%</p>
            <p className="text-xs text-muted-foreground">Weiterempfehlung</p>
          </AnimatedSection>
          <AnimatedSection delay={0.2} className="text-center">
            <MessageSquare className="h-6 w-6 mx-auto mb-1 text-alpine" />
            <p className="font-bold text-2xl">500+</p>
            <p className="text-xs text-muted-foreground">Kundenbewertungen</p>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

export default ReviewSummary;
