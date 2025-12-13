import { memo } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

interface MiniCTAProps {
  title?: string;
  buttonText?: string;
  link?: string;
  variant?: "default" | "subtle";
}

export const MiniCTA = memo(function MiniCTA({
  title = "Bereit für Ihren Umzug?",
  buttonText = "Jetzt Offerten erhalten",
  link = "/umzugsofferten",
  variant = "default"
}: MiniCTAProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`py-8 ${variant === "subtle" ? "bg-transparent" : "bg-muted/20"}`}
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
          <p className="text-lg font-medium text-foreground">{title}</p>
          <Link to={link}>
            <Button 
              size="lg" 
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold shadow-cta"
            >
              <CheckCircle className="mr-2 h-5 w-5" />
              {buttonText}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
});
