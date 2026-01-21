/**
 * GoldenFlowSuccess - Success state with next steps
 */

import { motion } from 'framer-motion';
import { CheckCircle, Clock, Phone, Mail, PartyPopper, ArrowRight, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { GoldenFlowData, GoldenFlowPriceEstimate } from '../types';

interface GoldenFlowSuccessProps {
  formData: GoldenFlowData;
  priceEstimate: GoldenFlowPriceEstimate | null;
  leadId?: string | null;
  matchedCompanies?: number;
}

export function GoldenFlowSuccess({ formData, priceEstimate, leadId, matchedCompanies = 0 }: GoldenFlowSuccessProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center space-y-6 py-8"
    >
      {/* Success icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
        className="mx-auto w-20 h-20 rounded-full bg-green-100 flex items-center justify-center"
      >
        <CheckCircle className="w-10 h-10 text-green-600" />
      </motion.div>
      
      {/* Title */}
      <div>
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-2xl sm:text-3xl font-bold text-foreground mb-2"
        >
          Anfrage erfolgreich gesendet! <PartyPopper className="inline h-6 w-6" />
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-muted-foreground"
        >
          Vielen Dank, {formData.name.split(' ')[0]}! Ihre Umzugsanfrage wurde an unsere Partner übermittelt.
        </motion.p>
      </div>

      {/* Matched companies badge */}
      {matchedCompanies > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full font-medium"
        >
          <Building2 className="h-4 w-4" />
          {matchedCompanies} passende Umzugsfirmen gefunden
        </motion.div>
      )}
      
      {/* Summary card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-muted/50 rounded-xl p-6 text-left max-w-md mx-auto"
      >
        <h3 className="font-semibold mb-3">Ihre Anfrage im Überblick:</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Route:</span>
            <span>{formData.fromCity} → {formData.toCity}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Grösse:</span>
            <span>{formData.rooms} Zimmer</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Datum:</span>
            <span>{formData.moveDate || 'Flexibel'}</span>
          </div>
          {priceEstimate && (
            <div className="flex justify-between pt-2 border-t font-medium">
              <span>Preis-Schätzung:</span>
              <span className="text-primary">
                CHF {priceEstimate.min.toLocaleString()} – {priceEstimate.max.toLocaleString()}
              </span>
            </div>
          )}
          {leadId && (
            <div className="flex justify-between pt-2 border-t text-xs">
              <span className="text-muted-foreground">Referenz:</span>
              <span className="font-mono">{leadId.substring(0, 8).toUpperCase()}</span>
            </div>
          )}
        </div>
      </motion.div>
      
      {/* Next steps */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="space-y-4"
      >
        <h3 className="font-semibold">Was passiert jetzt?</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
            <Clock className="h-8 w-8 text-primary mx-auto mb-2" />
            <p className="text-sm font-medium">Innerhalb 24h</p>
            <p className="text-xs text-muted-foreground">Firmen prüfen Ihre Anfrage</p>
          </div>
          <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
            <Mail className="h-8 w-8 text-primary mx-auto mb-2" />
            <p className="text-sm font-medium">E-Mail erhalten</p>
            <p className="text-xs text-muted-foreground">Offerten in Ihrem Postfach</p>
          </div>
          <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
            <Phone className="h-8 w-8 text-primary mx-auto mb-2" />
            <p className="text-sm font-medium">Vergleichen</p>
            <p className="text-xs text-muted-foreground">Beste Firma auswählen</p>
          </div>
        </div>
      </motion.div>
      
      {/* CTAs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="flex flex-col sm:flex-row gap-3 justify-center pt-4"
      >
        <Button asChild variant="outline" size="lg">
          <Link to="/umzugsfirmen">
            Alle Firmen ansehen
            <ArrowRight className="h-4 w-4 ml-2" />
          </Link>
        </Button>
        <Button asChild size="lg">
          <Link to="/">
            Zur Startseite
          </Link>
        </Button>
      </motion.div>
    </motion.div>
  );
}
