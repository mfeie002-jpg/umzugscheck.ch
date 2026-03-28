import { memo } from "react";
import { motion } from "framer-motion";
import { Building2, TrendingUp, Users, Award, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const benefits = [
  { icon: Users, title: "Qualifizierte Leads", desc: "Nur vorqualifizierte Umzugsanfragen" },
  { icon: TrendingUp, title: "Umsatzsteigerung", desc: "Ø 40% mehr Aufträge" },
  { icon: Award, title: "Premium Platzierung", desc: "Sichtbarkeit auf der Plattform" },
];

export const PartnerBenefitsSection = memo(function PartnerBenefitsSection() {
  return (
    <section className="py-12 md:py-16 border-t border-border/50">
      <div className="container">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full mb-4">
              <Building2 className="w-3.5 h-3.5" />
              Für Umzugsfirmen
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              Werden Sie Partner
            </h2>
            <p className="text-muted-foreground mb-6">
              Profitieren Sie von qualifizierten Umzugsanfragen und steigern Sie Ihren Umsatz 
              durch unsere Plattform.
            </p>
            
            <div className="space-y-4 mb-6">
              {benefits.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-4 h-4 text-secondary" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{item.title}</div>
                    <div className="text-xs text-muted-foreground">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            
            <Button asChild className="bg-primary hover:bg-primary/90">
              <Link to="/fuer-firmen">
                Jetzt Partner werden
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl p-8 text-center"
          >
            <div className="text-4xl font-bold text-primary mb-2">200+</div>
            <div className="text-muted-foreground mb-4">Partner vertrauen uns</div>
            <div className="flex justify-center gap-4 text-sm">
              <div>
                <div className="font-bold">15'000+</div>
                <div className="text-xs text-muted-foreground">Vermittelte Umzüge</div>
              </div>
              <div className="w-px bg-border" />
              <div>
                <div className="font-bold">CHF 5M+</div>
                <div className="text-xs text-muted-foreground">Vermitteltes Volumen</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
});
