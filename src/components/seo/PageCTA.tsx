import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, CheckCircle, Shield, Star } from "lucide-react";
import { Link } from "react-router-dom";

interface PageCTAProps {
  /** Variant determines styling and messaging */
  variant?: "beste" | "guenstige" | "standard" | "compact";
  /** Custom headline */
  headline?: string;
  /** Custom description */
  description?: string;
  /** Custom button text */
  buttonText?: string;
  /** Target URL */
  href?: string;
  /** Show trust badges */
  showTrust?: boolean;
  /** Additional CSS classes */
  className?: string;
}

const defaultContent = {
  beste: {
    headline: "Jetzt beste Umzugsfirma finden",
    description: "Vergleichen Sie geprüfte Top-Umzugsfirmen und erhalten Sie kostenlos bis zu 5 unverbindliche Offerten.",
    buttonText: "Kostenlos Offerten erhalten",
  },
  guenstige: {
    headline: "Günstige Angebote sichern",
    description: "Sparen Sie bis zu 40% bei Ihrem Umzug. Vergleichen Sie jetzt Preise von günstigen Umzugsfirmen.",
    buttonText: "Jetzt günstige Offerten erhalten",
  },
  standard: {
    headline: "Jetzt Umzugsfirmen vergleichen",
    description: "Erhalten Sie kostenlos bis zu 5 Offerten von geprüften Schweizer Umzugsfirmen.",
    buttonText: "Kostenlos Offerten erhalten",
  },
  compact: {
    headline: "Bereit für Ihr Umzugsangebot?",
    description: "Kostenlos und unverbindlich.",
    buttonText: "Offerten anfordern",
  },
};

const trustItems = [
  { icon: CheckCircle, text: "100% kostenlos" },
  { icon: Shield, text: "Geprüfte Firmen" },
  { icon: Star, text: "4.8/5 Bewertung" },
];

export function PageCTA({
  variant = "standard",
  headline,
  description,
  buttonText,
  href = "/umzugsofferten",
  showTrust = true,
  className = "",
}: PageCTAProps) {
  const content = defaultContent[variant];
  const finalHeadline = headline || content.headline;
  const finalDescription = description || content.description;
  const finalButtonText = buttonText || content.buttonText;

  if (variant === "compact") {
    return (
      <Card className={`border-primary/20 bg-primary/5 ${className}`}>
        <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-semibold text-lg">{finalHeadline}</h3>
            <p className="text-sm text-muted-foreground">{finalDescription}</p>
          </div>
          <Link to={href}>
            <Button size="lg" className="whitespace-nowrap">
              {finalButtonText}
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <section className={`py-12 sm:py-16 bg-gradient-to-br from-primary/10 via-primary/5 to-background ${className}`}>
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
            {finalHeadline}
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8">
            {finalDescription}
          </p>
          
          <Link to={href}>
            <Button size="lg" className="text-base sm:text-lg px-6 sm:px-8 h-12 sm:h-14">
              {finalButtonText}
              <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
          </Link>

          {showTrust && (
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mt-6 sm:mt-8">
              {trustItems.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <item.icon className="w-4 h-4 text-primary" />
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export function InlineCTA({
  text = "Jetzt kostenlos Offerten erhalten",
  href = "/umzugsofferten",
  className = "",
}: {
  text?: string;
  href?: string;
  className?: string;
}) {
  return (
    <div className={`my-8 p-6 rounded-lg bg-primary/5 border border-primary/10 text-center ${className}`}>
      <p className="text-muted-foreground mb-4">
        Möchten Sie Angebote von geprüften Umzugsfirmen erhalten?
      </p>
      <Link to={href}>
        <Button>
          {text}
          <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </Link>
    </div>
  );
}

export default PageCTA;
