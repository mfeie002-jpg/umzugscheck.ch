/**
 * Institutional Trust Bar V5 - Financial & regulatory trust signals
 * Addresses: SRO/PolyReg, ASTAG, Swiss Online Garantie, Ombudsstelle
 */
import { memo } from 'react';
import { Shield, Building2, Scale, Lock, Award, FileCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface TrustEntity {
  id: string;
  name: string;
  shortName: string;
  description: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  category: 'financial' | 'quality' | 'consumer' | 'data';
}

const TRUST_ENTITIES: TrustEntity[] = [
  {
    id: 'sro',
    name: 'SRO PolyReg',
    shortName: 'FINMA',
    description: 'Regulierte Treuhandzahlungen nach FINMA-Standard',
    icon: Building2,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    category: 'financial',
  },
  {
    id: 'astag',
    name: 'ASTAG Partner',
    shortName: 'ASTAG',
    description: 'Offizieller Partner des Schweizer Nutzfahrzeugverbands',
    icon: Award,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    category: 'quality',
  },
  {
    id: 'swiss-garantie',
    name: 'Swiss Online Garantie',
    shortName: 'Garantie',
    description: 'Zertifiziert durch Handelsverband.swiss',
    icon: Shield,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    category: 'consumer',
  },
  {
    id: 'ombudsstelle',
    name: 'Ombudsstelle',
    shortName: 'Schlichtung',
    description: 'Kostenlose Schlichtung bei Streitfällen',
    icon: Scale,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    category: 'consumer',
  },
  {
    id: 'swiss-hosting',
    name: 'Swiss Hosting',
    shortName: 'CH-Server',
    description: 'Daten 100% auf Schweizer Servern',
    icon: Lock,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    category: 'data',
  },
  {
    id: 'handelsregister',
    name: 'Handelsregister',
    shortName: 'Verifiziert',
    description: 'Alle Partner im Zefix verifiziert',
    icon: FileCheck,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    category: 'quality',
  },
];

export const InstitutionalTrustBar = memo(function InstitutionalTrustBar() {
  return (
    <section className="py-8 bg-muted/30 border-y border-border">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-6">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Institutionelle Sicherheit auf Schweizer Niveau
          </h3>
        </div>

        {/* Trust Grid */}
        <TooltipProvider>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {TRUST_ENTITIES.map((entity, index) => (
              <Tooltip key={entity.id}>
                <TooltipTrigger asChild>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className={`flex flex-col items-center p-3 rounded-xl ${entity.bgColor} cursor-help group hover:shadow-md transition-shadow`}
                  >
                    <entity.icon className={`w-6 h-6 ${entity.color} mb-2`} />
                    <span className={`text-xs font-semibold ${entity.color} text-center`}>
                      {entity.shortName}
                    </span>
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-[200px]">
                  <div className="text-center">
                    <p className="font-semibold text-sm">{entity.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {entity.description}
                    </p>
                  </div>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </TooltipProvider>

        {/* Verification Link */}
        <div className="text-center mt-6">
          <a 
            href="#verification" 
            className="text-xs text-muted-foreground hover:text-primary underline underline-offset-2"
          >
            Alle Zertifikate verifizierbar ↗
          </a>
        </div>
      </div>
    </section>
  );
});
