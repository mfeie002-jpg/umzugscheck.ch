/**
 * Zug Partners Section Component
 * #101+: Partner logos and affiliations
 */

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Award, Shield, BadgeCheck } from "lucide-react";

const partners = [
  { name: "TCS", logo: "TCS" },
  { name: "ASTAG", logo: "ASTAG" },
  { name: "Hauseigentümerverband", logo: "HEV" },
  { name: "Mieterverband", logo: "MV" },
  { name: "Swiss Quality", logo: "SQ" },
  { name: "Trusted Shops", logo: "TS" },
];

const certifications = [
  { name: "ISO 9001", description: "Qualitätsmanagement" },
  { name: "Swiss Made", description: "100% Schweizer Service" },
  { name: "DSGVO", description: "Datenschutz-konform" },
];

export const ZugPartnersSection = () => {
  return (
    <section className="py-12 sm:py-16 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <Badge variant="outline" className="mb-4">
            <Award className="w-3 h-3 mr-1" />
            Vertrauenswürdig
          </Badge>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
            Unsere Partner & Zertifizierungen
          </h2>
          <p className="text-sm text-muted-foreground">
            Empfohlen von führenden Schweizer Organisationen
          </p>
        </motion.div>

        {/* Partner Logos */}
        <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-10 mb-10">
          {partners.map((partner, index) => (
            <motion.div
              key={partner.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center justify-center w-20 h-12 sm:w-24 sm:h-14 bg-background rounded-lg border border-border/50 hover:border-primary/30 hover:shadow-md transition-all"
            >
              <span className="text-xs sm:text-sm font-bold text-muted-foreground">
                {partner.logo}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Certifications */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-4"
        >
          {certifications.map((cert, index) => (
            <div
              key={cert.name}
              className="flex items-center gap-2 px-4 py-2 bg-background rounded-full border border-border/50"
            >
              <BadgeCheck className="w-4 h-4 text-primary" />
              <div className="text-left">
                <span className="text-sm font-medium">{cert.name}</span>
                <span className="text-xs text-muted-foreground ml-1">
                  – {cert.description}
                </span>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
