import { Link } from "react-router-dom";
import { ArrowRight, Phone, MessageCircle } from "lucide-react";
import { Button } from "./ui/button";
import AnimatedSection from "./AnimatedSection";

interface CTABannerProps {
  title?: string;
  subtitle?: string;
  primaryCta?: {
    text: string;
    href: string;
  };
  showPhone?: boolean;
  showWhatsApp?: boolean;
  variant?: 'default' | 'gradient' | 'dark';
}

export default function CTABanner({
  title = "Bereit für Ihren Umzug?",
  subtitle = "Kontaktieren Sie uns noch heute für eine kostenlose, unverbindliche Offerte.",
  primaryCta = { text: "Offerte anfragen", href: "/contact" },
  showPhone = true,
  showWhatsApp = true,
  variant = 'gradient'
}: CTABannerProps) {
  const bgClasses = {
    default: 'bg-muted',
    gradient: 'bg-gradient-hero text-primary-foreground',
    dark: 'bg-foreground text-background'
  };

  return (
    <section className={`py-16 lg:py-20 ${bgClasses[variant]}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4 font-display">{title}</h2>
          <p className={`text-lg mb-8 ${variant === 'gradient' || variant === 'dark' ? 'opacity-90' : 'text-muted-foreground'}`}>
            {subtitle}
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to={primaryCta.href}>
              <Button
                size="lg"
                variant={variant === 'gradient' ? 'secondary' : 'default'}
                className="min-h-[52px] px-8"
              >
                {primaryCta.text}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>

            {showPhone && (
              <a href="tel:+41765681302">
                <Button
                  size="lg"
                  variant="outline"
                  className={`min-h-[52px] ${variant === 'gradient' ? 'border-white/30 text-white hover:bg-white/10' : ''}`}
                >
                  <Phone className="mr-2 h-5 w-5" />
                  Anrufen
                </Button>
              </a>
            )}

            {showWhatsApp && (
              <a
                href="https://wa.me/41765681302"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="lg"
                  variant="outline"
                  className={`min-h-[52px] ${variant === 'gradient' ? 'border-white/30 text-white hover:bg-white/10' : ''}`}
                >
                  <MessageCircle className="mr-2 h-5 w-5" />
                  WhatsApp
                </Button>
              </a>
            )}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

