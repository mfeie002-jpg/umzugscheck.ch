import { Button } from '@/components/ui/button';
import { FileDown } from 'lucide-react';
import { swissCities, extractPLZ } from './DistanceCalculator';

interface BookingPDFExportProps {
  formData: {
    serviceType: string;
    rooms: string;
    date: Date | undefined;
    timeSlot: string;
    from: string;
    to: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    notes: string;
  };
  estimate: {
    minPrice: number;
    maxPrice: number;
    distance: number;
    breakdown: {
      basePrice: number;
      distanceCost: number;
      serviceMultiplier: number;
    };
  } | null;
}

const serviceLabels: Record<string, string> = {
  basic: 'Basic (Transport)',
  standard: 'Standard (Transport + Montage)',
  premium: 'Premium (Vollservice)',
  vip: 'VIP (White-Glove)',
};

const timeLabels: Record<string, string> = {
  morning: '08:00 - 12:00',
  afternoon: '12:00 - 17:00',
  evening: '17:00 - 20:00',
};

export default function BookingPDFExport({ formData, estimate }: BookingPDFExportProps) {
  const generatePDF = () => {
    const fromPLZ = extractPLZ(formData.from);
    const toPLZ = extractPLZ(formData.to);
    const fromCity = fromPLZ && swissCities[fromPLZ] ? swissCities[fromPLZ].name : formData.from;
    const toCity = toPLZ && swissCities[toPLZ] ? swissCities[toPLZ].name : formData.to;

    const content = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Kostenvoranschlag - Feierabend Umzüge</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #1a1a2e; line-height: 1.6; padding: 40px; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; border-bottom: 3px solid #1e3a5f; padding-bottom: 20px; }
    .logo { font-size: 28px; font-weight: bold; color: #1e3a5f; }
    .logo span { color: #4a9eff; }
    .date { color: #666; font-size: 14px; text-align: right; }
    .title { font-size: 24px; color: #1e3a5f; margin-bottom: 30px; text-align: center; }
    .section { margin-bottom: 30px; }
    .section-title { font-size: 16px; font-weight: bold; color: #1e3a5f; margin-bottom: 15px; padding-bottom: 8px; border-bottom: 1px solid #e0e0e0; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
    .field { margin-bottom: 10px; }
    .label { font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 0.5px; }
    .value { font-size: 16px; color: #1a1a2e; font-weight: 500; }
    .route { background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); padding: 20px; border-radius: 12px; margin: 20px 0; }
    .route-line { display: flex; align-items: center; gap: 15px; justify-content: center; }
    .route-point { text-align: center; }
    .route-city { font-size: 18px; font-weight: bold; color: #1e3a5f; }
    .route-address { font-size: 12px; color: #666; max-width: 200px; }
    .arrow { font-size: 24px; color: #4a9eff; }
    .price-box { background: linear-gradient(135deg, #1e3a5f 0%, #4a9eff 100%); color: white; padding: 30px; border-radius: 12px; text-align: center; margin: 30px 0; }
    .price-label { font-size: 14px; opacity: 0.9; margin-bottom: 5px; }
    .price { font-size: 36px; font-weight: bold; }
    .price-note { font-size: 12px; opacity: 0.8; margin-top: 10px; }
    .breakdown { background: #f8fafc; padding: 20px; border-radius: 8px; margin-top: 20px; }
    .breakdown-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e0e0e0; }
    .breakdown-row:last-child { border-bottom: none; font-weight: bold; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e0e0e0; font-size: 12px; color: #666; text-align: center; }
    .contact { margin-top: 30px; background: #f8fafc; padding: 20px; border-radius: 8px; }
    .contact-title { font-weight: bold; margin-bottom: 10px; }
    @media print { body { padding: 20px; } }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">Feierabend<span>-Umzüge</span></div>
    <div class="date">
      Erstellt am: ${new Date().toLocaleDateString('de-CH')}<br>
      Gültig bis: ${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('de-CH')}
    </div>
  </div>

  <h1 class="title">Kostenvoranschlag</h1>

  <div class="section">
    <div class="section-title">Kundendaten</div>
    <div class="grid">
      <div class="field">
        <div class="label">Name</div>
        <div class="value">${formData.firstName} ${formData.lastName}</div>
      </div>
      <div class="field">
        <div class="label">E-Mail</div>
        <div class="value">${formData.email}</div>
      </div>
      <div class="field">
        <div class="label">Telefon</div>
        <div class="value">${formData.phone}</div>
      </div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Umzugsdetails</div>
    <div class="grid">
      <div class="field">
        <div class="label">Service-Paket</div>
        <div class="value">${serviceLabels[formData.serviceType] || formData.serviceType}</div>
      </div>
      <div class="field">
        <div class="label">Zimmeranzahl</div>
        <div class="value">${formData.rooms} Zimmer</div>
      </div>
      <div class="field">
        <div class="label">Datum</div>
        <div class="value">${formData.date ? formData.date.toLocaleDateString('de-CH') : 'Nicht angegeben'}</div>
      </div>
      <div class="field">
        <div class="label">Zeitfenster</div>
        <div class="value">${timeLabels[formData.timeSlot] || formData.timeSlot}</div>
      </div>
    </div>
  </div>

  <div class="route">
    <div class="route-line">
      <div class="route-point">
        <div class="route-city">${fromCity}</div>
        <div class="route-address">${formData.from}</div>
      </div>
      <div class="arrow">→</div>
      <div class="route-point">
        <div class="route-city">${toCity}</div>
        <div class="route-address">${formData.to}</div>
      </div>
    </div>
    ${estimate ? `<div style="text-align: center; margin-top: 15px; color: #666; font-size: 14px;">Geschätzte Distanz: ca. ${estimate.distance} km</div>` : ''}
  </div>

  ${estimate ? `
  <div class="price-box">
    <div class="price-label">Geschätzte Kosten</div>
    <div class="price">CHF ${estimate.minPrice.toLocaleString('de-CH')} - ${estimate.maxPrice.toLocaleString('de-CH')}</div>
    <div class="price-note">*Unverbindliche Schätzung. Endpreis nach Besichtigung.</div>
  </div>

  <div class="breakdown">
    <div class="section-title" style="margin-top: 0;">Kostenaufschlüsselung</div>
    <div class="breakdown-row">
      <span>Basispreis (${formData.rooms} Zimmer)</span>
      <span>CHF ${estimate.breakdown.basePrice.toLocaleString('de-CH')}</span>
    </div>
    <div class="breakdown-row">
      <span>Distanzzuschlag (${estimate.distance} km)</span>
      <span>CHF ${estimate.breakdown.distanceCost.toLocaleString('de-CH')}</span>
    </div>
    ${estimate.breakdown.serviceMultiplier > 1 ? `
    <div class="breakdown-row">
      <span>Service-Aufpreis (${serviceLabels[formData.serviceType]})</span>
      <span>+${Math.round((estimate.breakdown.serviceMultiplier - 1) * 100)}%</span>
    </div>
    ` : ''}
  </div>
  ` : ''}

  ${formData.notes ? `
  <div class="section">
    <div class="section-title">Zusätzliche Anmerkungen</div>
    <p>${formData.notes}</p>
  </div>
  ` : ''}

  <div class="contact">
    <div class="contact-title">Haben Sie Fragen?</div>
    <p>Kontaktieren Sie uns für eine persönliche Beratung:</p>
    <p style="margin-top: 10px;">
      📞 +41 44 XXX XX XX<br>
      ✉️ info@feierabend-umzuege.ch<br>
      🌐 www.feierabend-umzuege.ch
    </p>
  </div>

  <div class="footer">
    <p>Feierabend Umzüge GmbH • Schweizer Familienunternehmen seit 2010</p>
    <p>Dieser Kostenvoranschlag ist unverbindlich und 30 Tage gültig.</p>
  </div>
</body>
</html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(content);
      printWindow.document.close();
      printWindow.onload = () => {
        printWindow.print();
      };
    }
  };

  return (
    <Button 
      variant="outline" 
      onClick={generatePDF}
      className="gap-2"
    >
      <FileDown className="w-4 h-4" />
      <span className="hidden sm:inline">PDF Export</span>
      <span className="sm:hidden">PDF</span>
    </Button>
  );
}