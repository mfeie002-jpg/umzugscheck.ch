import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface GradientCTAProps {
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
}

export const GradientCTA = ({
  title,
  description,
  buttonText,
  buttonLink,
}: GradientCTAProps) => {
  return (
    <section className="py-16 md:py-20 relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-accent to-primary opacity-95" />
      
      {/* Animated blobs */}
      <div className="absolute inset-0 overflow-hidden opacity-30">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl animate-blob" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl animate-blob-reverse" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center text-white max-w-3xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            {title}
          </h2>
          <p className="text-lg md:text-xl mb-10 text-white/90">
            {description}
          </p>
          <Link to={buttonLink}>
            <Button 
              size="lg" 
              className="h-14 px-10 text-lg font-bold bg-white text-primary hover:bg-white/90 shadow-strong"
            >
              {buttonText}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <p className="text-sm mt-6 text-white/80">
            ✓ Kostenlos  ✓ Unverbindlich  ✓ In 2 Minuten
          </p>
        </motion.div>
      </div>
    </section>
  );
};
