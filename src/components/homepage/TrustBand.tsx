import { memo } from "react";
import { motion } from "framer-motion";
import { Users, Award, Star, TrendingUp, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const stats = [
  {
    icon: Users,
    value: "15'000+",
    label: "Erfolgreiche Umzüge",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-100",
  },
  {
    icon: Award,
    value: "200+",
    label: "Geprüfte Partner",
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-100",
  },
  {
    icon: Star,
    value: "4.8",
    label: "Kundenbewertung",
    color: "text-amber-500",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-100",
  },
  {
    icon: TrendingUp,
    value: "40%",
    label: "Durchschnittliche Ersparnis",
    color: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-100",
  },
];

export const TrustBand = memo(function TrustBand() {
  return (
    <section className="py-6 md:py-8 bg-gradient-to-b from-slate-50 to-white border-y border-slate-100">
      <div className="container">
        {/* Trust Header - Mobile Only */}
        <div className="flex items-center justify-center gap-2 mb-4 md:hidden">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span className="text-xs font-medium text-slate-600">Geprüft & Verifiziert</span>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className={cn(
                "flex items-center gap-2.5 md:gap-3 p-3 md:p-4 rounded-xl",
                "bg-white border shadow-sm hover:shadow-md transition-shadow",
                stat.borderColor
              )}
            >
              <div 
                className={cn(
                  "w-10 h-10 md:w-11 md:h-11 rounded-lg flex items-center justify-center flex-shrink-0",
                  stat.bgColor
                )}
              >
                <stat.icon className={cn("w-5 h-5 md:w-5.5 md:h-5.5", stat.color)} />
              </div>
              <div className="min-w-0">
                <div className="text-lg md:text-xl font-bold text-slate-900 leading-tight">{stat.value}</div>
                <div className="text-[10px] md:text-xs text-slate-500 leading-tight truncate">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
});
