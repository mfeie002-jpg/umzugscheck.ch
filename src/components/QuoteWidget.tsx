import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Home, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import AnimatedSection from "./AnimatedSection";

const QuoteWidget = () => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  return (
    <section className="py-16 bg-gradient-to-b from-primary/5 to-transparent">
      <div className="container mx-auto px-4">
        <AnimatedSection className="max-w-2xl mx-auto">
          <Card className="p-6 md:p-8 shadow-xl border-primary/20">
            <h3 className="text-xl font-bold text-center mb-6">
              Schnelle Offerte in 30 Sekunden
            </h3>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="relative">
                <Home className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Von (PLZ oder Ort)"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Nach (PLZ oder Ort)"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Button className="w-full bg-gradient-hero" size="lg">
              Kostenlose Offerte erhalten
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <p className="text-xs text-center text-muted-foreground mt-4">
              Unverbindlich & kostenlos • Antwort in 24h garantiert
            </p>
          </Card>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default QuoteWidget;
