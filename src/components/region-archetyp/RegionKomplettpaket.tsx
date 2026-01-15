import { memo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  Truck, 
  Sparkles, 
  KeyRound, 
  ArrowRight,
  CheckCircle2,
  Package
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface RegionKomplettpaketProps {
  regionName: string;
}

const PAKET_ITEMS = [
  {
    icon: Truck,
    title: "Professioneller Umzug",
    features: ["Möbeltransport", "Montage & Demontage", "Verpackungsservice"]
  },
  {
    icon: Sparkles,
    title: "Endreinigung",
    features: ["Abgabereinigung", "Fenster & Böden", "Küche & Bad"]
  },
  {
    icon: KeyRound,
    title: "Wohnungsabgabe",
    features: ["Mängelprotokoll", "Schlüsselübergabe", "Dokumentation"]
  }
];

export const RegionKomplettpaket = memo(({ regionName }: RegionKomplettpaketProps) => {
  return (
    <section id="komplettpaket" className="py-12 scroll-mt-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary font-medium text-sm mb-4">
              <Package className="h-4 w-4" />
              <span>Alles aus einer Hand</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
              Komplettpaket für Ihren Umzug in {regionName}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Kombinieren Sie Umzug, Endreinigung und Wohnungsabgabe – 
              über unsere geprüften Partner erhalten Sie alles koordiniert.
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {PAKET_ITEMS.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className="h-full border-2 border-dashed border-primary/20 hover:border-primary/40 transition-colors">
                  <CardContent className="p-6 text-center">
                    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mx-auto mb-4">
                      <item.icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="font-bold text-lg text-foreground mb-4">
                      {item.title}
                    </h3>
                    <ul className="space-y-2">
                      {item.features.map((feature) => (
                        <li key={feature} className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Connector Line (visual) */}
          <div className="hidden md:flex items-center justify-center -mt-4 mb-8">
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="w-20 h-0.5 bg-gradient-to-r from-transparent to-primary/30" />
              <span className="text-sm font-medium">+</span>
              <div className="w-20 h-0.5 bg-primary/30" />
              <span className="text-sm font-medium">+</span>
              <div className="w-20 h-0.5 bg-gradient-to-l from-transparent to-primary/30" />
            </div>
          </div>

          {/* CTA Card */}
          <Card className="bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-center md:text-left">
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    Komplettpaket anfragen
                  </h3>
                  <p className="text-muted-foreground">
                    Erhalten Sie ein koordiniertes Angebot für alle drei Services.
                  </p>
                </div>
                <Button size="lg" asChild className="shrink-0">
                  <Link to="/umzugsofferten" className="flex items-center gap-2">
                    Jetzt Offerten erhalten
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Trust Note */}
          <p className="text-xs text-muted-foreground text-center mt-4">
            Alle Services werden von unabhängigen, geprüften Partnern erbracht.
          </p>
        </motion.div>
      </div>
    </section>
  );
});

RegionKomplettpaket.displayName = "RegionKomplettpaket";
