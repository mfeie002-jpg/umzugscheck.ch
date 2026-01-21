/**
 * Trust Logos Component
 * Shows technology partners and data sources for borrowed credibility
 */

import { memo } from "react";
import { motion } from "framer-motion";
import { Shield, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { VisionLanguage } from "@/lib/vision-translations";

interface VisionTrustLogosProps {
  language: VisionLanguage;
}

// Technology Partners with grayscale logos
const techPartners = [
  { name: "Stripe", url: "https://stripe.com", category: "payments" },
  { name: "Supabase", url: "https://supabase.com", category: "backend" },
  { name: "Vercel", url: "https://vercel.com", category: "hosting" },
  { name: "OpenAI", url: "https://openai.com", category: "ai" },
  { name: "Twint", url: "https://twint.ch", category: "payments" },
];

// Data sources with citations
const dataSources = [
  { name: "BFS 2024", desc: "Bundesamt für Statistik", url: "https://www.bfs.admin.ch" },
  { name: "Comparis", desc: "Marktanalysen", url: "https://www.comparis.ch" },
  { name: "MOVU Reports", desc: "Wettbewerbs-Analyse", url: null },
];

const content = {
  de: {
    badge: "Technologie & Quellen",
    title: "Vertrauen durch Transparenz",
    techTitle: "Technologie-Partner",
    sourcesTitle: "Datenquellen",
    swissHosting: "100% Swiss Hosting",
    dsgvoCompliant: "DSGVO/nDSG konform"
  },
  bg: {
    badge: "Технология & Източници",
    title: "Доверие чрез прозрачност",
    techTitle: "Технологични партньори",
    sourcesTitle: "Източници на данни",
    swissHosting: "100% швейцарски хостинг",
    dsgvoCompliant: "GDPR/nDSG съвместим"
  }
};

export const VisionTrustLogos = memo(({ language }: VisionTrustLogosProps) => {
  const t = content[language];
  
  return (
    <section className="py-10 border-y bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <Badge className="mb-3 bg-primary/10 text-primary">
              <Shield className="w-3 h-3 mr-1" />
              {t.badge}
            </Badge>
            <h3 className="text-xl font-bold">{t.title}</h3>
          </motion.div>
          
          {/* Technology Partners */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <p className="text-sm text-muted-foreground text-center mb-4">{t.techTitle}</p>
            <div className="flex flex-wrap items-center justify-center gap-6">
              {techPartners.map((partner, i) => (
                <motion.a
                  key={i}
                  href={partner.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  className="px-4 py-2 bg-background border rounded-lg hover:border-primary/50 transition-colors flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  {partner.name}
                </motion.a>
              ))}
            </div>
          </motion.div>
          
          {/* Data Sources */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <p className="text-sm text-muted-foreground text-center mb-4">{t.sourcesTitle}</p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              {dataSources.map((source, i) => (
                <div key={i} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className="font-medium">{source.name}</span>
                  <span className="text-muted-foreground/50">({source.desc})</span>
                  {source.url && (
                    <a href={source.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-3 h-3 hover:text-primary" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
          
          {/* Compliance Badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-wrap items-center justify-center gap-3"
          >
            <Badge variant="outline" className="text-green-700 border-green-300 bg-green-50">
              <Shield className="w-3 h-3 mr-1" />
              {t.swissHosting}
            </Badge>
            <Badge variant="outline" className="text-blue-700 border-blue-300 bg-blue-50">
              <Shield className="w-3 h-3 mr-1" />
              {t.dsgvoCompliant}
            </Badge>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
});

VisionTrustLogos.displayName = 'VisionTrustLogos';
