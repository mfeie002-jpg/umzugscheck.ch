import { motion } from 'framer-motion';

const partners = [
  { name: 'Swiss Quality', logo: '🇨🇭' },
  { name: 'Trusted Shops', logo: '⭐' },
  { name: 'TÜV Zertifiziert', logo: '✓' },
  { name: 'Eco Friendly', logo: '🌿' },
  { name: 'Versichert', logo: '🛡️' },
  { name: 'ISO 9001', logo: '📋' },
];

interface PartnerLogosProps {
  variant?: 'scroll' | 'static';
}

const PartnerLogos = ({ variant = 'static' }: PartnerLogosProps) => {
  if (variant === 'scroll') {
    return (
      <div className="overflow-hidden py-6 bg-muted/30">
        <motion.div
          className="flex gap-12 items-center"
          animate={{ x: [0, -600] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        >
          {[...partners, ...partners].map((partner, index) => (
            <div
              key={`${partner.name}-${index}`}
              className="flex items-center gap-2 text-muted-foreground whitespace-nowrap"
            >
              <span className="text-2xl">{partner.logo}</span>
              <span className="font-medium">{partner.name}</span>
            </div>
          ))}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap justify-center gap-8 py-6">
      {partners.map((partner, index) => (
        <motion.div
          key={partner.name}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 }}
          className="flex items-center gap-2 text-muted-foreground"
        >
          <span className="text-2xl">{partner.logo}</span>
          <span className="font-medium text-sm">{partner.name}</span>
        </motion.div>
      ))}
    </div>
  );
};

export default PartnerLogos;
