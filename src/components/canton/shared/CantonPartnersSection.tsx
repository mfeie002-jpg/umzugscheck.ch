import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Award, Building2, Truck, LucideIcon } from "lucide-react";

interface Partner {
  name: string;
  desc: string;
  icon: LucideIcon;
}

interface CantonPartnersSectionProps {
  cantonName: string;
  partners?: Partner[];
}

const defaultPartners: Partner[] = [
  { name: "Swiss Movers", desc: "Zertifizierter Verband", icon: Award },
  { name: "TCS Partner", desc: "Mitgliedervorteil", icon: Shield },
  { name: "Gemeindepartner", desc: "Lokale Kooperation", icon: Building2 },
  { name: "Logistiknetz", desc: "Transportnetzwerk", icon: Truck },
];

export const CantonPartnersSection = ({ cantonName, partners = defaultPartners }: CantonPartnersSectionProps) => (
  <section className="py-10 bg-muted/30">
    <div className="container mx-auto px-4">
      <p className="text-center text-sm text-muted-foreground mb-6">Unsere Partner in der Region {cantonName}</p>
      <div className="flex flex-wrap justify-center gap-6">
        {partners.map((partner, i) => {
          const Icon = partner.icon;
          return (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 10 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }} 
              transition={{ delay: i * 0.1 }}
            >
              <Card className="hover:shadow-md transition-all">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{partner.name}</p>
                    <p className="text-xs text-muted-foreground">{partner.desc}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  </section>
);
