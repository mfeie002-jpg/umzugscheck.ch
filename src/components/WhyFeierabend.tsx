import { Heart, Shield, Award, Clock, Star, MapPin, Users, CheckCircle, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import AnimatedSection from "@/components/AnimatedSection";
import SectionBadge from "@/components/SectionBadge";
import LazyImage from "@/components/LazyImage";
import teamImage from "@/assets/branded-team-professional.jpg";

const WhyFeierabend = () => {
  const reasons = [
    {
      icon: Heart,
      title: "Familiärer Service",
      description: "In 3. Generation behandeln wir Ihr Hab und Gut wie unser eigenes.",
      color: "warm",
    },
    {
      icon: Shield,
      title: "Vollversichert",
      description: "Ihr Umzugsgut ist bis CHF 2 Mio. versichert.",
      color: "alpine",
    },
    {
      icon: Clock,
      title: "Pünktlich",
      description: "Termintreue ist für uns selbstverständlich.",
      color: "forest",
    },
    {
      icon: Award,
      title: "Festpreise",
      description: "Transparent ohne versteckte Kosten.",
      color: "warm",
    },
  ];

  const numbers = [
    { value: "40+", label: "Jahre", icon: Clock, color: "alpine" },
    { value: "5000+", label: "Umzüge", icon: CheckCircle, color: "forest" },
    { value: "26", label: "Kantone", icon: MapPin, color: "warm" },
    { value: "30+", label: "Mitarbeiter", icon: Users, color: "alpine" },
    { value: "5.0", label: "Sterne", icon: Star, color: "warm" },
  ];

  return (
    <section className="py-16 sm:py-20 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <AnimatedSection className="text-center mb-10 sm:mb-12 lg:mb-14">
          <SectionBadge variant="warm">Warum wir?</SectionBadge>
          <h2 className="text-balance font-display mt-4">
            Warum <span className="text-gradient">Feierabend Umzüge</span>?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mt-3">
            Mehr als nur Möbelpacker – Ihr Partner für einen stressfreien Neustart.
          </p>
        </AnimatedSection>

        {/* USP Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-16 sm:mb-20">
          {reasons.map((reason, index) => (
            <AnimatedSection key={index} delay={index * 0.1}>
              <Card className="p-5 sm:p-6 h-full hover-lift text-center group">
                <div className={`inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-2xl mb-4 transition-transform group-hover:scale-110 ${
                  reason.color === 'warm' ? 'bg-gradient-warm' :
                  reason.color === 'alpine' ? 'bg-gradient-hero' :
                  'bg-gradient-forest'
                }`}>
                  <reason.icon className="h-6 w-6 sm:h-7 sm:w-7 text-primary-foreground" />
                </div>
                <h3 className="text-base sm:text-lg font-bold mb-2 font-display">{reason.title}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{reason.description}</p>
              </Card>
            </AnimatedSection>
          ))}
        </div>

        {/* Familiengeschichte */}
        <div className="relative rounded-3xl bg-muted/40 p-6 sm:p-8 lg:p-12 mb-16 sm:mb-20 overflow-hidden">
          {/* Subtle background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-alpine/5 to-transparent rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <AnimatedSection animation="slide-left">
              <div className="relative h-[300px] sm:h-[350px] lg:h-[400px] rounded-2xl overflow-hidden shadow-strong">
                <LazyImage
                  src={teamImage}
                  alt="Familie Feierabend - Ihr Umzugsteam"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                  <div className="flex items-center justify-center gap-6 sm:gap-8 text-white">
                    <div className="text-center">
                      <p className="text-2xl sm:text-3xl font-bold font-display">3</p>
                      <p className="text-xs opacity-80">Generationen</p>
                    </div>
                    <div className="w-px h-10 bg-white/30" />
                    <div className="text-center">
                      <p className="text-2xl sm:text-3xl font-bold font-display">40+</p>
                      <p className="text-xs opacity-80">Jahre</p>
                    </div>
                    <div className="w-px h-10 bg-white/30" />
                    <div className="text-center">
                      <p className="text-2xl sm:text-3xl font-bold font-display">30+</p>
                      <p className="text-xs opacity-80">Mitarbeiter</p>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="slide-right" className="space-y-5">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-warm/10 border border-warm/20">
                <Heart className="h-4 w-4 text-warm fill-warm" />
                <span className="text-sm font-semibold text-warm">Seit 1980</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-display font-bold leading-tight">
                Mehr als nur <span className="text-gradient-warm">Umzugshelfer</span>
              </h3>

              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Was vor über 40 Jahren mit einem Transporter und dem Traum von <strong className="text-foreground">Hans Feierabend</strong> begann, 
                  ist heute eines der renommiertesten Umzugsunternehmen der Schweiz.
                </p>
                <p>
                  Drei Generationen, ein Versprechen: <strong className="text-foreground">Wir behandeln Ihr Hab und Gut wie unser eigenes</strong>.
                </p>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-background border border-border/50">
                  <Users className="h-5 w-5 text-alpine" />
                  <span className="text-sm font-medium">Persönlicher Service</span>
                </div>
                <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-background border border-border/50">
                  <Star className="h-5 w-5 text-warm fill-warm" />
                  <span className="text-sm font-medium">5.0 Google Rating</span>
                </div>
              </div>

              <Link to="/about">
                <Button variant="outline" className="mt-2 group">
                  Mehr über uns
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </AnimatedSection>
          </div>
        </div>

        {/* Zahlen & Fakten */}
        <AnimatedSection>
          <div className="bg-gradient-premium rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="absolute top-0 left-1/4 w-64 h-64 rounded-full bg-white blur-3xl" />
              <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-white blur-3xl" />
            </div>
            
            <div className="relative">
              <h3 className="text-center text-xl sm:text-2xl font-display font-bold text-primary-foreground mb-8 sm:mb-10">
                Zahlen, die für sich sprechen
              </h3>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 sm:gap-6 lg:gap-8 text-center text-primary-foreground max-w-4xl mx-auto">
                {numbers.map((item, index) => (
                  <div 
                    key={index}
                    className="animate-fade-in"
                    style={{ animationDelay: `${0.1 + index * 0.08}s` }}
                  >
                    <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary-foreground/10 mb-2 sm:mb-3 hover:scale-110 transition-transform">
                      <item.icon className={`h-5 w-5 sm:h-6 sm:w-6 ${
                        item.color === 'warm' ? 'text-warm' :
                        item.color === 'forest' ? 'text-forest' :
                        'text-alpine'
                      }`} />
                    </div>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold font-display">{item.value}</p>
                    <p className="text-[10px] sm:text-xs opacity-80 mt-0.5">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default WhyFeierabend;
