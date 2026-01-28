import { Shield, Clock, Banknote, HeartHandshake, Award, Undo2, FileCheck, BadgeCheck, Lock, Heart, CheckCircle2, TrendingUp, ThumbsUp, Star, Users, Truck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AnimatedSection from "./AnimatedSection";
import SectionBadge from "./SectionBadge";

const guarantees = [
  { icon: Shield, title: "Vollversicherung", description: "CHF 2 Mio. Haftpflicht inklusive" },
  { icon: Banknote, title: "Festpreis-Garantie", description: "Keine versteckten Kosten" },
  { icon: Clock, title: "Pünktlichkeit", description: "100% termingerecht" },
  { icon: HeartHandshake, title: "Zufriedenheit", description: "Oder Geld zurück" },
  { icon: Award, title: "Qualität", description: "Geprüft & zertifiziert" },
  { icon: Undo2, title: "Flexibilität", description: "Kostenlose Umbuchung" },
];

const insuranceItems = [
  { icon: FileCheck, title: "CHF 2 Mio.", description: "Betriebshaftpflicht inklusive" },
  { icon: BadgeCheck, title: "Transportversicherung", description: "Für Ihre gesamte Einrichtung" },
  { icon: Lock, title: "Schadengarantie", description: "Schnelle & faire Abwicklung" },
];

const certifications = [
  { name: "Swiss Made", icon: Shield },
  { name: "ISO 9001", icon: Award },
  { name: "Familienunternehmen", icon: Heart },
  { name: "Vollversichert", icon: CheckCircle2 },
];

const trustMetrics = [
  { icon: Star, value: "5.0", label: "Google Bewertung", subtext: "247 Bewertungen", color: "text-warm" },
  { icon: Truck, value: "15'000+", label: "Umzüge", subtext: "Seit 1980", color: "text-primary" },
  { icon: Users, value: "98%", label: "Empfehlungsrate", subtext: "Zufriedenheit", color: "text-forest" },
  { icon: Clock, value: "< 2h", label: "Antwortzeit", subtext: "Anfragen", color: "text-alpine" },
];

const recentStats = [
  { label: "Diese Woche", value: "23 Umzüge", trend: "+12%" },
  { label: "Durchschnittliche Bewertung", value: "4.9 / 5", trend: "stabil" },
  { label: "Termingenauigkeit", value: "99.2%", trend: "+0.5%" },
];

const TrustAndSecurity = () => {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-muted/30 via-background to-muted/30 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 sm:w-48 sm:h-48 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-20 right-10 w-40 h-40 sm:w-64 sm:h-64 rounded-full bg-alpine/5 blur-3xl" />
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <AnimatedSection className="text-center mb-8 sm:mb-10 lg:mb-12">
          <SectionBadge variant="alpine">Vertrauen & Sicherheit</SectionBadge>
          <h2 className="text-balance font-display mt-3 sm:mt-4">
            Sicherheit und <span className="text-gradient">Qualität</span>
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto mt-2">
            Transparenz, Versicherungsschutz und geprüfte Qualität
          </p>
        </AnimatedSection>

        {/* Trust Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-8 sm:mb-10 lg:mb-12">
          {trustMetrics.map((metric, index) => (
            <div
              key={metric.label}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <Card className="text-center h-full hover:shadow-xl transition-all duration-300 border-primary/10 hover:border-primary/30 group bg-card/80 backdrop-blur-sm">
                <CardContent className="p-4 sm:p-5 lg:p-6">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-3 sm:mb-4 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <metric.icon className={`w-6 h-6 sm:w-7 sm:h-7 ${metric.color}`} />
                  </div>
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold font-display mb-0.5 sm:mb-1 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
                    {metric.value}
                  </div>
                  <div className="font-medium text-sm sm:text-base text-foreground">{metric.label}</div>
                  <div className="text-xs sm:text-sm text-muted-foreground mt-1">
                    {metric.subtext}
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* Guarantees Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 lg:gap-4 mb-8 sm:mb-10 lg:mb-12">
          {guarantees.map((guarantee, index) => (
            <div
              key={guarantee.title}
              className="text-center p-3 sm:p-4 bg-card/60 backdrop-blur-sm rounded-xl border border-border/50 hover:border-primary/40 hover:shadow-lg hover:bg-card transition-all duration-300 animate-fade-in group"
              style={{ animationDelay: `${index * 0.08}s` }}
            >
              <div className="w-10 h-10 sm:w-11 sm:h-11 mx-auto mb-2 sm:mb-3 rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                <guarantee.icon className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground text-xs sm:text-sm mb-0.5 sm:mb-1 leading-tight">
                {guarantee.title}
              </h3>
              <p className="text-[10px] sm:text-xs text-muted-foreground leading-snug">
                {guarantee.description}
              </p>
            </div>
          ))}
        </div>

        {/* Insurance + Certifications + Live Stats */}
        <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Insurance Info */}
          <AnimatedSection delay={0.1}>
            <Card className="h-full bg-gradient-to-br from-slate-900 to-slate-800 text-white border-0">
              <CardContent className="p-4 sm:p-5 lg:p-6">
                <div className="flex items-center gap-2 mb-4 sm:mb-5">
                  <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" />
                  <h3 className="text-base sm:text-lg font-semibold">Vollversichert & Geschützt</h3>
                </div>
                <div className="space-y-3 sm:space-y-4">
                  {insuranceItems.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-white/10 backdrop-blur-sm rounded-lg animate-fade-in"
                      style={{ animationDelay: `${0.2 + index * 0.1}s` }}
                    >
                      <item.icon className="w-6 h-6 sm:w-8 sm:h-8 text-green-400 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-sm sm:text-base">{item.title}</p>
                        <p className="text-xs sm:text-sm text-slate-300">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </AnimatedSection>

          {/* Certifications */}
          <AnimatedSection delay={0.2}>
            <Card className="h-full">
              <CardContent className="p-4 sm:p-5 lg:p-6">
                <div className="flex items-center gap-2 mb-4 sm:mb-5">
                  <Award className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  <h3 className="text-base sm:text-lg font-semibold">Zertifizierungen & Qualität</h3>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  {certifications.map((cert, index) => (
                    <div 
                      key={cert.name}
                      className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-muted/50 rounded-lg animate-fade-in"
                      style={{ animationDelay: `${0.3 + index * 0.1}s` }}
                    >
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <cert.icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                      </div>
                      <span className="font-medium text-xs sm:text-sm">{cert.name}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 sm:mt-5 pt-4 sm:pt-5 border-t">
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                    <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                    <span>Alle Umzüge sind bis CHF 100'000 vollversichert</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </AnimatedSection>

          {/* Live Stats */}
          <AnimatedSection delay={0.3}>
            <Card className="h-full bg-gradient-to-br from-primary/5 to-background">
              <CardContent className="p-4 sm:p-5 lg:p-6">
                <div className="flex items-center gap-2 mb-4 sm:mb-5">
                  <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  <h3 className="text-base sm:text-lg font-semibold">Live-Statistiken</h3>
                </div>
                <div className="space-y-3 sm:space-y-4">
                  {recentStats.map((stat, index) => (
                    <div
                      key={stat.label}
                      className="flex items-center justify-between p-3 sm:p-4 bg-card rounded-lg border animate-fade-in"
                      style={{ animationDelay: `${0.4 + index * 0.1}s` }}
                    >
                      <div>
                        <p className="text-xs sm:text-sm text-muted-foreground">{stat.label}</p>
                        <p className="text-lg sm:text-xl font-bold">{stat.value}</p>
                      </div>
                      <Badge 
                        variant="secondary" 
                        className={`text-xs ${stat.trend.includes('+') ? 'text-forest bg-forest/10' : ''}`}
                      >
                        {stat.trend}
                      </Badge>
                    </div>
                  ))}
                </div>
                <div className="mt-4 sm:mt-5 flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                  <span className="w-2 h-2 bg-forest rounded-full animate-pulse" />
                  <span>Aktualisiert vor 5 Minuten</span>
                </div>
              </CardContent>
            </Card>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

export default TrustAndSecurity;
