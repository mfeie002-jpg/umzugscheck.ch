import { Link } from "react-router-dom";
import { ArrowRight, Phone, Star, Shield, Heart, CheckCircle, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import AnimatedSection from "@/components/AnimatedSection";
import FamilyBadge from "@/components/FamilyBadge";
import FloatingElement from "@/components/FloatingElement";
import { OptimizedImage } from "@/components/OptimizedImage";
import heroImage from "@/assets/hero-truck-branded.jpg";
import { trackCtaClick } from "@/hooks/useCtaTracking";

const HeroSection = () => {
  const benefits = [
    "Kostenlose & unverbindliche Offerte",
    "Fester Preis ohne versteckte Kosten",
    "Vollversichert bis CHF 2 Mio.",
    "Familienunternehmen seit 1980",
  ];

  return (
    <section className="relative pt-16 sm:pt-20 lg:pt-24 overflow-hidden min-h-[85vh] lg:min-h-[90vh] flex items-center">
      {/* Enhanced gradient background with new color scheme */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-secondary/30" />
      <div className="absolute inset-0 pattern-dots opacity-20" />
      
      {/* Animated gradient orbs - using consistent primary color */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-primary/8 blur-3xl animate-pulse-soft" />
      <div className="absolute bottom-1/4 -right-32 w-80 h-80 rounded-full bg-primary/10 blur-3xl animate-pulse-soft" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl animate-pulse-soft" style={{ animationDelay: '2s' }} />
      
      {/* Floating decorative elements - hidden on mobile for performance */}
      <div className="absolute top-32 left-10 opacity-20 hidden xl:block">
        <FloatingElement amplitude={15} duration={4}>
          <div className="w-20 h-20 rounded-full bg-primary/30 blur-2xl" />
        </FloatingElement>
      </div>
      <div className="absolute bottom-20 right-20 opacity-20 hidden xl:block">
        <FloatingElement amplitude={20} duration={5} delay={1}>
          <div className="w-32 h-32 rounded-full bg-primary/30 blur-3xl" />
        </FloatingElement>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-20 relative">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          <AnimatedSection direction="right" className="space-y-6 lg:space-y-8">
            <FamilyBadge variant="hero" />
            
            <div className="space-y-4 sm:space-y-5">
              <h1 className="text-balance font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-[1.1] animate-fade-in">
                Ihr Umzug in{' '}
                <span className="relative inline-block">
                  <span className="text-gradient">besten Händen</span>
                  <span className="absolute -bottom-1 left-0 w-full h-1 bg-primary rounded-full animate-scale-in" style={{ animationDelay: '0.5s' }} />
                </span>
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-xl leading-relaxed animate-fade-in" style={{ animationDelay: '0.2s' }}>
                Feierabend Umzüge: Ihr Schweizer Familienunternehmen für stressfreie Umzüge. 
                Persönlich, zuverlässig und mit über <strong className="text-foreground">40 Jahren Erfahrung</strong>.
              </p>
            </div>

            {/* Benefits list */}
            <ul className="space-y-2 sm:space-y-3 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-center gap-2 sm:gap-3 text-sm sm:text-base text-muted-foreground">
                  <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <Link to="/contact" className="w-full sm:w-auto touch-manipulation" onClick={() => trackCtaClick('Kostenlose Offerte', 'hero')}>
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all w-full sm:w-auto min-h-[48px] sm:min-h-[52px] text-sm sm:text-base shadow-medium group">
                  Kostenlose Offerte
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <a href="tel:+41765681302" className="w-full sm:w-auto touch-manipulation" onClick={() => trackCtaClick('Jetzt anrufen', 'hero')}>
                <Button size="lg" variant="outline" className="w-full sm:w-auto min-h-[48px] sm:min-h-[52px] text-sm sm:text-base border-2 border-primary/30 hover:border-primary hover:bg-primary/5 hover:text-primary transition-colors">
                  <Phone className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  Jetzt anrufen
                </Button>
              </a>
            </div>

            {/* Trust indicators - mobile optimized grid */}
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-3 sm:gap-6 pt-4 text-xs sm:text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: '0.5s' }}>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3 w-3 sm:h-4 sm:w-4 text-warm fill-warm" />
                  ))}
                </div>
                <span className="font-medium">5.0</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Shield className="h-3 w-3 sm:h-4 sm:w-4 text-primary flex-shrink-0" />
                <span>Vollversichert</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 col-span-2 sm:col-span-1">
                <Heart className="h-3 w-3 sm:h-4 sm:w-4 text-warm fill-warm flex-shrink-0" />
                <span>Familienunternehmen</span>
              </div>
            </div>
          </AnimatedSection>
          
          <AnimatedSection direction="left" delay={0.3}>
            <div className="relative h-[280px] sm:h-[400px] lg:h-[500px]">
              <div className="relative h-full">
                <OptimizedImage
                  src={heroImage}
                  alt="Feierabend Umzüge Premium Umzugsservice - Professionelles Team mit gebrandetem Fahrzeug vor Schweizer Alpen"
                  className="rounded-2xl object-cover h-full shadow-strong"
                  priority
                />
                {/* Subtle gradient overlay for depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-transparent rounded-2xl pointer-events-none" />
              </div>
              
              {/* Floating Stats Card */}
              <FloatingElement amplitude={8} duration={3} className="absolute -bottom-6 -left-6 lg:-left-10 hidden sm:block">
                <div className="glass rounded-xl p-4 shadow-medium border border-border/50 animate-scale-in" style={{ animationDelay: '0.6s' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-warm to-warm/80 flex items-center justify-center">
                      <Star className="h-6 w-6 text-warm-foreground fill-warm-foreground" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground font-display">5.0</p>
                      <p className="text-xs text-muted-foreground">Google Bewertung</p>
                    </div>
                  </div>
                </div>
              </FloatingElement>
              
              {/* Experience Badge */}
              <FloatingElement amplitude={6} duration={4} delay={0.5} className="absolute -top-4 -right-4 lg:-right-8 hidden sm:block">
                <div className="glass rounded-xl p-4 shadow-medium border border-border/50 animate-scale-in" style={{ animationDelay: '0.8s' }}>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-primary font-display">40+</p>
                    <p className="text-xs text-muted-foreground">Jahre Erfahrung</p>
                  </div>
                </div>
              </FloatingElement>

              {/* Swiss Quality Badge - New */}
              <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 animate-fade-in" style={{ animationDelay: '1s' }}>
                <div className="flex items-center gap-2 bg-background/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-medium border border-border/50">
                  <div className="w-6 h-6 bg-red-600 flex items-center justify-center rounded">
                    <span className="text-white font-bold text-sm">+</span>
                  </div>
                  <span className="text-xs font-semibold text-foreground">Swiss Quality</span>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;