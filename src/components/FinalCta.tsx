import { ArrowRight, Phone, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AnimatedSection from "./AnimatedSection";

const FinalCta = () => {
  return (
    <section className="py-20 bg-gradient-hero text-primary-foreground">
      <div className="container mx-auto px-4">
        <AnimatedSection className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Bereit für Ihren stressfreien Umzug?
          </h2>
          <p className="text-lg opacity-90 mb-8">
            Kontaktieren Sie uns noch heute für eine kostenlose, unverbindliche Offerte.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                <Calendar className="mr-2 h-5 w-5" />
                Offerte anfragen
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10 w-full sm:w-auto"
              onClick={() => window.location.href = "tel:+41765681302"}
            >
              <Phone className="mr-2 h-5 w-5" />
              +41 76 568 13 02
            </Button>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default FinalCta;
