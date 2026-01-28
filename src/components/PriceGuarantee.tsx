import { motion } from 'framer-motion';
import { Shield, Check, BadgePercent } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const PriceGuarantee = () => {
  return (
    <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0"
          >
            <Shield className="w-8 h-8 text-primary" />
          </motion.div>
          
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
              <BadgePercent className="w-5 h-5 text-primary" />
              Preisgarantie
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Wir garantieren den vereinbarten Preis. Keine versteckten Kosten, 
              keine bösen Überraschungen.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                'Festpreis-Garantie',
                'Keine Zusatzkosten',
                'Transparente Abrechnung'
              ].map((item, index) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-2"
                >
                  <Check className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="text-sm">{item}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PriceGuarantee;
