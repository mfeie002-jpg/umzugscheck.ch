import { memo } from "react";
import { motion } from "framer-motion";
import { 
  ShieldCheck, 
  CheckCircle2, 
  Star, 
  FileCheck,
  Users,
  Award
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface RegionTrustBoxProps {
  regionName: string;
}

const TRUST_CRITERIA = [
  {
    icon: FileCheck,
    title: "Firmendokumente geprüft",
    description: "Handelsregister, Versicherungsnachweis & Bewilligungen verifiziert"
  },
  {
    icon: ShieldCheck,
    title: "Haftpflicht & Transportversicherung",
    description: "Alle Partner verfügen über ausreichende Versicherungsdeckung"
  },
  {
    icon: Star,
    title: "Kundenbewertungen analysiert",
    description: "Nur Partner mit nachweislich positiven Kundenerfahrungen"
  },
  {
    icon: Users,
    title: "Qualifiziertes Personal",
    description: "Geschulte Mitarbeiter für fachgerechten Umzug"
  }
];

export const RegionTrustBox = memo(({ regionName }: RegionTrustBoxProps) => {
  return (
    <section id="vertrauen" className="py-12 bg-gradient-to-b from-primary/5 to-transparent scroll-mt-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {/* E-E-A-T Header */}
          <Card className="border-primary/20 bg-gradient-to-r from-primary/5 via-background to-primary/5 mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 shrink-0">
                  <Award className="h-8 w-8 text-primary" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-foreground mb-1">
                    Geprüft durch Umzugscheck Kriterien
                  </h2>
                  <p className="text-muted-foreground">
                    Alle Umzugsfirmen in {regionName} durchlaufen unseren mehrstufigen Qualitätscheck 
                    bevor sie auf unserer Plattform gelistet werden.
                  </p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 rounded-full border border-green-500/20">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium text-green-700">Qualitätsgeprüft</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Trust Criteria Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {TRUST_CRITERIA.map((criterion, index) => (
              <motion.div
                key={criterion.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-md transition-shadow border-border/50">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 shrink-0">
                        <criterion.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">
                          {criterion.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {criterion.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Disclaimer */}
          <p className="text-xs text-muted-foreground text-center mt-6">
            Die Prüfung erfolgt anhand öffentlich zugänglicher Informationen und Kundenrückmeldungen. 
            Umzugscheck.ch übernimmt keine Garantie für die erbrachten Dienstleistungen.
          </p>
        </motion.div>
      </div>
    </section>
  );
});

RegionTrustBox.displayName = "RegionTrustBox";
