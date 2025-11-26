import { Shield, Users, Star, Award } from "lucide-react";

const stats = [
  {
    icon: Users,
    number: "12'000+",
    label: "Zufriedene Kunden",
    color: "text-primary"
  },
  {
    icon: Award,
    number: "200+",
    label: "Geprüfte Unternehmen",
    color: "text-accent"
  },
  {
    icon: Star,
    number: "4.8/5",
    label: "Ø Kundenbewertung",
    color: "text-success"
  },
  {
    icon: Shield,
    number: "100%",
    label: "Kostenlos & sicher",
    color: "text-primary"
  }
];

export const TrustSignals = () => {
  return (
    <section className="py-12 md:py-16 bg-gradient-to-b from-white to-secondary/20">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="bg-card border-2 border-primary/10 rounded-3xl shadow-medium p-6 md:p-10">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center relative group">
                  <div className="inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-secondary group-hover:bg-primary/10 transition-all duration-300 mb-4 group-hover:scale-110">
                    <stat.icon className={`w-7 h-7 md:w-8 md:h-8 ${stat.color} group-hover:scale-110 transition-transform`} />
                  </div>
                  <div className="text-2xl md:text-3xl lg:text-4xl font-bold mb-1 text-primary">{stat.number}</div>
                  <div className="text-sm md:text-base text-foreground font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
