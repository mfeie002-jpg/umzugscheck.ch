import { useEffect, useState } from "react";
import { Shield, Users, Star, Award, CheckCircle2, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import teamImage from "@/assets/happy-family-home.jpg";

interface CounterProps {
  end: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
}

const AnimatedCounter = ({ end, duration = 2000, suffix = "", prefix = "" }: CounterProps) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = (currentTime - startTime) / duration;

      if (progress < 1) {
        setCount(Math.floor(end * progress));
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return (
    <span>
      {prefix}
      {count.toLocaleString('de-CH')}
      {suffix}
    </span>
  );
};

const stats = [
  {
    icon: Users,
    value: 12000,
    suffix: "+",
    label: "Zufriedene Kunden",
    color: "text-primary"
  },
  {
    icon: Award,
    value: 200,
    suffix: "+",
    label: "Geprüfte Unternehmen",
    color: "text-accent"
  },
  {
    icon: Star,
    value: 4.9,
    prefix: "",
    suffix: "/5",
    label: "Ø Kundenbewertung",
    color: "text-warning"
  },
  {
    icon: CheckCircle2,
    value: 100,
    suffix: "%",
    label: "Kostenlos & sicher",
    color: "text-success"
  },
  {
    icon: TrendingUp,
    value: 95,
    suffix: "%",
    label: "Weiterempfehlungsrate",
    color: "text-info"
  },
  {
    icon: Shield,
    value: 24,
    suffix: "/7",
    label: "Support verfügbar",
    color: "text-primary"
  }
];

export const TrustCounter = () => {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-background via-secondary/5 to-background relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full text-sm font-semibold text-primary mb-4">
            <Star className="w-4 h-4 fill-primary" />
            <span>Vertraut von Tausenden</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-foreground">
            Ihre Zufriedenheit ist unser Erfolg
          </h2>
          <p className="text-lg text-muted-foreground">
            Über 12'000 Schweizer Familien haben uns bereits vertraut. Mit 4.9/5 Sternen gehören wir zu den bestbewerteten Umzugsplattformen der Schweiz.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-16">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="border-2 border-border hover:border-primary/30 hover-lift transition-all group">
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-secondary group-hover:bg-primary/10 flex items-center justify-center mb-4 transition-all group-hover:scale-110">
                    <stat.icon className={`w-7 h-7 ${stat.color}`} />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold mb-2 text-foreground">
                    <AnimatedCounter 
                      end={stat.value} 
                      suffix={stat.suffix || ""} 
                      prefix={stat.prefix || ""}
                    />
                  </div>
                  <div className="text-sm text-muted-foreground font-medium">
                    {stat.label}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Team & Trust Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid md:grid-cols-2 gap-8 items-center"
        >
          {/* Team Image */}
          <div className="relative rounded-3xl overflow-hidden shadow-2xl">
            <img 
              src={teamImage} 
              alt="Glückliche Familie in ihrem neuen Zuhause" 
              className="w-full h-[400px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-3">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="w-12 h-12 rounded-full bg-primary/20 border-2 border-background flex items-center justify-center">
                      <Users className="w-5 h-5 text-primary" />
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">12'000+ Familien</p>
                  <p className="text-xs text-muted-foreground">haben bereits gewechselt</p>
                </div>
              </div>
            </div>
          </div>

          {/* Trust Content */}
          <div className="space-y-6">
            <h3 className="text-2xl md:text-3xl font-bold text-foreground">
              Vertrauen durch Transparenz und Qualität
            </h3>
            <p className="text-lg text-muted-foreground">
              Als familiengeführtes Schweizer Unternehmen stehen wir für höchste Qualität, transparente Preise und persönlichen Service.
            </p>

            <div className="space-y-4">
              {[
                { icon: Shield, text: "100% geprüfte und versicherte Umzugsfirmen" },
                { icon: Star, text: "Nur Anbieter mit mindestens 4.0 Sternen" },
                { icon: CheckCircle2, text: "DSGVO-konforme Datenverwaltung" },
                { icon: Award, text: "TÜV-zertifizierte Prozesse" }
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-4 p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-all">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-foreground font-medium pt-2">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
