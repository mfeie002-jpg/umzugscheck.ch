import { useState } from "react";
import { motion } from "framer-motion";
import { Check, X, Info, Star, Zap, Crown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Link } from "react-router-dom";

interface Feature {
  name: string;
  description?: string;
  basic: boolean | string;
  half: boolean | string;
  full: boolean | string;
}

interface ComparisonSliderProps {
  features: Feature[];
}

const plans = [
  {
    id: "basic",
    name: "Basis-Paket",
    subtitle: "Kostengünstig",
    icon: Zap,
    color: "alpine",
    price: "ab CHF 890",
    link: "/plan/basic",
  },
  {
    id: "half",
    name: "Halb-Paket",
    subtitle: "Optimal",
    icon: Star,
    color: "warm",
    price: "ab CHF 1'290",
    link: "/plan/half",
    popular: true,
  },
  {
    id: "full",
    name: "Voll-Paket",
    subtitle: "Rundum-Sorglos",
    icon: Crown,
    color: "forest",
    price: "ab CHF 1'890",
    link: "/plan/full",
  },
];

export const ComparisonSlider = ({ features }: ComparisonSliderProps) => {
  const [selectedPlans, setSelectedPlans] = useState<string[]>(["basic", "half", "full"]);
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null);

  const togglePlan = (planId: string) => {
    if (selectedPlans.includes(planId)) {
      if (selectedPlans.length > 1) {
        setSelectedPlans(selectedPlans.filter((p) => p !== planId));
      }
    } else {
      setSelectedPlans([...selectedPlans, planId]);
    }
  };

  const renderValue = (value: boolean | string) => {
    if (value === true) {
      return (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="flex items-center justify-center"
        >
          <div className="w-8 h-8 rounded-full bg-forest/10 flex items-center justify-center">
            <Check className="h-5 w-5 text-forest" />
          </div>
        </motion.div>
      );
    }
    if (value === false) {
      return (
        <div className="flex items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
            <X className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      );
    }
    return (
      <span className="text-sm font-medium text-warm">{value}</span>
    );
  };

  const visiblePlans = plans.filter((p) => selectedPlans.includes(p.id));

  return (
    <div className="space-y-8">
      {/* Plan Toggle Buttons */}
      <div className="flex flex-wrap justify-center gap-3">
        {plans.map((plan) => {
          const Icon = plan.icon;
          const isSelected = selectedPlans.includes(plan.id);
          return (
            <motion.button
              key={plan.id}
              onClick={() => togglePlan(plan.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`relative px-6 py-3 rounded-xl border-2 transition-all ${
                isSelected
                  ? `border-${plan.color} bg-${plan.color}/10`
                  : "border-border bg-card hover:border-muted-foreground/30"
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 text-[10px] font-bold uppercase bg-warm text-warm-foreground rounded-full">
                  Beliebt
                </span>
              )}
              <div className="flex items-center gap-2">
                <Icon className={`h-5 w-5 ${isSelected ? `text-${plan.color}` : "text-muted-foreground"}`} />
                <span className={`font-semibold ${isSelected ? "" : "text-muted-foreground"}`}>
                  {plan.name}
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Comparison Table */}
      <Card className="overflow-hidden">
        {/* Header */}
        <div className="grid border-b bg-muted/30" style={{ gridTemplateColumns: `1fr repeat(${visiblePlans.length}, 1fr)` }}>
          <div className="p-6 font-semibold">Leistungen</div>
          {visiblePlans.map((plan) => {
            const Icon = plan.icon;
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-6 text-center ${plan.popular ? "bg-warm/5" : ""}`}
              >
                <Icon className={`h-6 w-6 mx-auto mb-2 text-${plan.color}`} />
                <h3 className="font-display font-semibold">{plan.name}</h3>
                <p className="text-sm text-muted-foreground">{plan.subtitle}</p>
                <p className="text-lg font-bold mt-2">{plan.price}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Features */}
        <div className="divide-y">
          {features.map((feature, index) => (
            <motion.div
              key={feature.name}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.03 }}
              className="grid items-center hover:bg-muted/30 transition-colors"
              style={{ gridTemplateColumns: `1fr repeat(${visiblePlans.length}, 1fr)` }}
              onMouseEnter={() => setHoveredFeature(feature.name)}
              onMouseLeave={() => setHoveredFeature(null)}
            >
              <div className="p-4 flex items-center gap-2">
                <span className={`font-medium transition-colors ${hoveredFeature === feature.name ? "text-alpine" : ""}`}>
                  {feature.name}
                </span>
                {feature.description && (
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">{feature.description}</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
              {visiblePlans.map((plan) => (
                <div
                  key={plan.id}
                  className={`p-4 text-center ${plan.popular ? "bg-warm/5" : ""}`}
                >
                  {renderValue(feature[plan.id as keyof Pick<Feature, "basic" | "half" | "full">])}
                </div>
              ))}
            </motion.div>
          ))}
        </div>

        {/* Footer CTAs */}
        <div className="grid border-t bg-muted/30" style={{ gridTemplateColumns: `1fr repeat(${visiblePlans.length}, 1fr)` }}>
          <div className="p-6" />
          {visiblePlans.map((plan) => (
            <div key={plan.id} className={`p-6 text-center ${plan.popular ? "bg-warm/5" : ""}`}>
              <Link to={plan.link}>
                <Button
                  className={`w-full ${plan.popular ? "bg-gradient-warm text-warm-foreground" : ""}`}
                  variant={plan.popular ? "default" : "outline"}
                >
                  Details ansehen
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default ComparisonSlider;
