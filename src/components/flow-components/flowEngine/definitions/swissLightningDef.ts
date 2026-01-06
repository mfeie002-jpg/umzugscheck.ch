/**
 * Swiss Lightning Flow Definition
 * 
 * 2-Step ultra-fast flow for maximum conversion.
 */

import { FlowDefinition } from '../types';
import { validators } from '../validators';
import { MapPin, Calendar, Home, Mail, Phone, User } from 'lucide-react';

export const swissLightningDefinition: FlowDefinition = {
  id: 'swiss-lightning-engine',
  name: 'Swiss Lightning',
  description: '2-Step Ultra-Speed Flow',
  
  steps: [
    {
      id: 'basics',
      title: 'Umzug planen',
      subtitle: 'In 60 Sekunden zu Ihren Offerten',
      showTrustBar: true,
      fields: [
        {
          name: 'fromPLZ',
          type: 'plz',
          label: 'Von (PLZ)',
          placeholder: 'z.B. 8001',
          required: true,
          icon: MapPin,
          inputMode: 'numeric',
          validation: validators.plz,
          trustPill: 'Schweizer PLZ',
        },
        {
          name: 'toPLZ',
          type: 'plz',
          label: 'Nach (PLZ)',
          placeholder: 'z.B. 3011',
          required: true,
          icon: MapPin,
          inputMode: 'numeric',
          validation: validators.plz,
        },
        {
          name: 'rooms',
          type: 'rooms',
          label: 'Anzahl Zimmer',
          required: true,
        },
        {
          name: 'moveDate',
          type: 'date',
          label: 'Umzugsdatum',
          placeholder: 'Datum wählen',
          required: false,
          helperText: 'Optional: Lassen Sie leer für flexible Termine',
        },
        {
          name: 'flexibleDate',
          type: 'toggle',
          label: 'Datum flexibel',
          helperText: 'Ich bin bei den Terminen flexibel',
          defaultValue: false,
        },
      ],
    },
    {
      id: 'contact',
      title: 'Kontaktdaten',
      subtitle: 'Erhalten Sie 3 kostenlose Offerten',
      showTrustBar: true,
      showReview: true,
      reviewEditable: true,
      fields: [
        {
          name: 'name',
          type: 'text',
          label: 'Vor- und Nachname',
          placeholder: 'Max Muster',
          required: true,
          icon: User,
          autoComplete: 'name',
          validation: validators.name,
        },
        {
          name: 'email',
          type: 'email',
          label: 'E-Mail',
          placeholder: 'max@beispiel.ch',
          required: true,
          icon: Mail,
          autoComplete: 'email',
          inputMode: 'email',
          validation: validators.email,
        },
        {
          name: 'phone',
          type: 'tel',
          label: 'Telefon',
          placeholder: '079 123 45 67',
          required: true,
          icon: Phone,
          autoComplete: 'tel',
          inputMode: 'tel',
          validation: validators.phone,
          trustPill: 'Nur für Offerten-Rückfragen',
        },
        {
          name: 'consent',
          type: 'toggle',
          label: 'Ich akzeptiere die AGB und Datenschutzerklärung',
          required: true,
        },
      ],
    },
  ],
  
  successMessage: 'Ihre Anfrage wurde gesendet!',
  submitButtonText: 'Kostenlose Offerten erhalten',
  showProgressBar: true,
  showStepCount: true,
  trackingPrefix: 'swiss_lightning',
};

export default swissLightningDefinition;
