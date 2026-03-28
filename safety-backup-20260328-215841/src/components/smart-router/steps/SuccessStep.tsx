/**
 * Success Step - Confirmation after submission
 */

import { motion } from 'framer-motion';
import { CheckCircle2, Mail, Phone, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SmartRouterData, SmartRouterPriceEstimate } from '../types';
import { Link } from 'react-router-dom';

interface SuccessStepProps {
  formData: SmartRouterData;
  priceEstimate: SmartRouterPriceEstimate | null;
  matchedCompanies: number;
}

export function SuccessStep({ 
  formData, 
  priceEstimate, 
  matchedCompanies 
}: SuccessStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-lg mx-auto text-center space-y-6"
    >
      {/* Success icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', delay: 0.2 }}
        className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30"
      >
        <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
      </motion.div>

      {/* Headline */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Anfrage erfolgreich gesendet!
        </h2>
        <p className="text-muted-foreground">
          {matchedCompanies > 0 
            ? `${matchedCompanies} passende Umzugsfirmen wurden benachrichtigt.`
            : 'Wir haben Ihre Anfrage erhalten.'
          }
        </p>
      </div>

      {/* Summary card */}
      <div className="p-4 bg-muted/50 rounded-xl text-left space-y-3">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Route:</span>
          <span className="font-medium">
            {formData.fromPLZ} → {formData.toPLZ}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Wohnung:</span>
          <span className="font-medium">{formData.rooms} Zimmer</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Methode:</span>
          <span className="font-medium">
            {formData.selectedMethod === 'video' ? '📹 Video-Analyse' : '📝 Express-Formular'}
          </span>
        </div>
        {priceEstimate && (
          <div className="flex justify-between pt-2 border-t">
            <span className="text-muted-foreground">Preisschätzung:</span>
            <span className="font-semibold text-primary">
              CHF {priceEstimate.min.toLocaleString()} - {priceEstimate.max.toLocaleString()}
            </span>
          </div>
        )}
      </div>

      {/* What happens next */}
      <div className="text-left p-4 border rounded-xl">
        <h3 className="font-semibold mb-3">Was passiert jetzt?</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <Mail className="h-4 w-4 mt-0.5 text-primary" />
            <span>Sie erhalten eine Bestätigung per E-Mail an <strong className="text-foreground">{formData.email}</strong></span>
          </li>
          <li className="flex items-start gap-2">
            <Phone className="h-4 w-4 mt-0.5 text-primary" />
            <span>Geprüfte Umzugsfirmen werden sich innerhalb von 24h bei Ihnen melden</span>
          </li>
        </ul>
      </div>

      {/* CTA */}
      <div className="pt-4">
        <Button asChild className="w-full h-12">
          <Link to="/">
            Zurück zur Startseite
            <ArrowRight className="h-4 w-4 ml-2" />
          </Link>
        </Button>
      </div>
    </motion.div>
  );
}
