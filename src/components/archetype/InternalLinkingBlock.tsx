/**
 * INTERNAL LINKING BLOCK
 * 
 * SEO-optimized internal links section
 * - Parent link (Canton for city pages)
 * - Neighbor links
 * - Service links
 */

import { memo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, MapPin, Sparkles, Building2 } from "lucide-react";
import type { InternalLink, ServiceConfig } from "@/data/archetypeConfig";
import { getServiceLink } from "@/data/archetypeConfig";

interface InternalLinkingBlockProps {
  parent?: InternalLink;
  neighbors?: InternalLink[];
  services: ServiceConfig[];
  placeName: string;
  placeSlug: string;
  placeKind: 'canton' | 'city';
}

export const InternalLinkingBlock = memo(({
  parent,
  neighbors = [],
  services,
  placeName,
  placeSlug,
  placeKind,
}: InternalLinkingBlockProps) => {
  const locationPrefix = placeKind === 'canton' ? 'im Kanton' : 'in';

  return (
    <section className="py-16 md:py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Weitere Angebote entdecken
          </h2>
          <p className="text-muted-foreground">
            Umzugsfirmen in der Nähe und beliebte Services
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Parent Link (for city pages) */}
          {parent && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-card border border-border rounded-xl p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">Übergeordnete Region</h3>
              </div>
              <Link
                to={parent.href}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors group"
              >
                <span className="font-medium">{parent.label}</span>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </Link>
            </motion.div>
          )}

          {/* Neighbor Links */}
          {neighbors.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-card border border-border rounded-xl p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">
                  {placeKind === 'canton' ? 'Nachbarkantone' : 'Nahe Orte'}
                </h3>
              </div>
              <div className="space-y-2">
                {neighbors.slice(0, 5).map((neighbor) => (
                  <Link
                    key={neighbor.href}
                    to={neighbor.href}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-muted transition-colors group"
                  >
                    <span className="text-sm">Umzugsfirmen {neighbor.label}</span>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </Link>
                ))}
              </div>
            </motion.div>
          )}

          {/* Service Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-card border border-border rounded-xl p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Beliebte Services {locationPrefix} {placeName}</h3>
            </div>
            <div className="space-y-2">
              {services.slice(0, 5).map((service) => (
                <Link
                  key={service.key}
                  to={getServiceLink(service.slug, placeSlug, placeKind)}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-muted transition-colors group"
                >
                  <span className="text-sm">{service.title} {locationPrefix} {placeName}</span>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
});

InternalLinkingBlock.displayName = 'InternalLinkingBlock';
