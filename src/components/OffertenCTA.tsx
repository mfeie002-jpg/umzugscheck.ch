import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface OffertenCTAProps {
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  variant?: "primary" | "secondary";
  className?: string;
}

export const OffertenCTA = ({
  title,
  description,
  buttonText,
  buttonLink,
  variant = "primary",
  className = ""
}: OffertenCTAProps) => {
  return (
    <Card className={`p-6 sm:p-8 md:p-10 ${variant === "primary" ? "bg-gradient-to-br from-accent/5 to-primary/5 border-accent/20" : "bg-gradient-to-br from-secondary to-secondary/50"} ${className}`}>
      <div className="max-w-3xl mx-auto text-center space-y-4 sm:space-y-6">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold leading-tight">{title}</h2>
        <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed">{description}</p>
        <Link to={buttonLink}>
          <Button 
            size="lg" 
            className={`w-full sm:w-auto text-sm sm:text-base ${variant === "primary" ? "bg-accent hover:bg-accent/90 shadow-accent" : ""}`}
          >
            {buttonText}
            <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
        </Link>
      </div>
    </Card>
  );
};
