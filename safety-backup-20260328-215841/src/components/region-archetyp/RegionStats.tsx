import { memo } from "react";
import { motion } from "framer-motion";
import { Star, Users, Building2, Clock, Shield, TrendingUp } from "lucide-react";

interface RegionStatsProps {
  stats: {
    providerCount: number;
    reviewCount: number;
    avgRating: number;
    activeUsers: number;
  };
  regionName: string;
}

export const RegionStats = memo(({ stats, regionName }: RegionStatsProps) => {
  const statItems = [
    {
      icon: Building2,
      value: `${stats.providerCount}+`,
      label: "Geprüfte Firmen",
      color: "text-primary",
    },
    {
      icon: Star,
      value: stats.avgRating.toString(),
      label: "Durchschnitt",
      color: "text-yellow-500",
    },
    {
      icon: Users,
      value: stats.reviewCount.toLocaleString('de-CH'),
      label: "Bewertungen",
      color: "text-green-600",
    },
    {
      icon: Clock,
      value: "< 24h",
      label: "Antwortzeit",
      color: "text-blue-500",
    },
  ];

  return (
    <section className="py-8 md:py-12 bg-muted/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
        >
          {statItems.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-card rounded-xl p-4 md:p-6 border border-border/50 text-center"
            >
              <div className={`inline-flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-muted mb-3 ${stat.color}`}>
                <stat.icon className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <div className="text-2xl md:text-3xl font-bold text-foreground">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Trust Statement */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-4 md:gap-6 mt-6 text-sm text-muted-foreground"
        >
          <span className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-green-600" />
            Alle Firmen geprüft
          </span>
          <span className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            Aktuelle Preise für {regionName}
          </span>
        </motion.div>
      </div>
    </section>
  );
});

RegionStats.displayName = 'RegionStats';
