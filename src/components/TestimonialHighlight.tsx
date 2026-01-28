import { Star, Quote } from "lucide-react";
import { Card } from "@/components/ui/card";
import AnimatedSection from "./AnimatedSection";

const TestimonialHighlight = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-primary/5 to-transparent">
      <div className="container mx-auto px-4">
        <AnimatedSection>
          <Card className="p-8 md:p-12 max-w-3xl mx-auto text-center relative">
            <Quote className="absolute top-4 left-4 h-8 w-8 text-primary/10" />
            <div className="flex justify-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-warm text-warm" />
              ))}
            </div>
            <blockquote className="text-lg md:text-xl font-medium mb-6">
              "Der beste Umzugsservice, den wir je erlebt haben. Das Team war pünktlich, 
              professionell und hat jeden Karton mit grösster Sorgfalt behandelt. 
              Absolut empfehlenswert!"
            </blockquote>
            <div className="flex items-center justify-center gap-4">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center font-bold text-primary">
                SM
              </div>
              <div className="text-left">
                <p className="font-bold">Stefan Müller</p>
                <p className="text-sm text-muted-foreground">Zürich → Basel, Mai 2024</p>
              </div>
            </div>
          </Card>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default TestimonialHighlight;
