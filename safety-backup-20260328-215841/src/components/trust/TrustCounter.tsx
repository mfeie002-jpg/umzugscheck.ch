import { useEffect, useState } from "react";
import { Users, Building2, Star, CheckCircle } from "lucide-react";

interface CounterProps {
  end: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
}

const AnimatedCounter = ({ end, duration = 2000, suffix = "", prefix = "" }: CounterProps) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    const startValue = 0;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      const easeOutQuad = (t: number) => t * (2 - t);
      const currentCount = Math.floor(startValue + (end - startValue) * easeOutQuad(progress));
      
      setCount(currentCount);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    requestAnimationFrame(animate);
  }, [end, duration]);

  return <span>{prefix}{count.toLocaleString('de-CH')}{suffix}</span>;
};

export const TrustCounter = () => {
  const stats = [
    {
      icon: Users,
      value: 12000,
      suffix: "+",
      label: "Zufriedene Kunden",
      color: "text-primary"
    },
    {
      icon: Building2,
      value: 200,
      suffix: "+",
      label: "Geprüfte Firmen",
      color: "text-accent"
    },
    {
      icon: Star,
      value: 4.8,
      suffix: "/5",
      label: "Durchschnittsbewertung",
      color: "text-warning"
    },
    {
      icon: CheckCircle,
      value: 98,
      suffix: "%",
      label: "Kundenzufriedenheit",
      color: "text-success"
    }
  ];

  return (
    <section className="py-16 md:py-20 bg-gradient-subtle border-y border-border">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Vertrauen durch Zahlen</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Tausende zufriedene Kunden vertrauen auf unseren Service
          </p>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-6xl mx-auto">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="text-center bg-card border border-border rounded-2xl p-6 md:p-8 hover-lift hover-shine"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-secondary mb-4 md:mb-6">
                <stat.icon className={`w-8 h-8 md:w-10 md:h-10 ${stat.color}`} />
              </div>
              <div className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2 text-primary">
                <AnimatedCounter end={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-sm md:text-base text-foreground font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};