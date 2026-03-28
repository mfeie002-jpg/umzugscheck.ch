import { useRef } from "react";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { motion } from "framer-motion";
import { Printer, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PrintViewProps {
  data: {
    price: number;
    rooms: number;
    distance: number;
    floor: number;
    hasLift: boolean;
    moveType: string;
    selectedDate?: Date;
    packing: boolean;
    assembly: boolean;
    storage: boolean;
    teamSize: number;
    hours: number;
    inventoryWeight: number;
    inventoryItems: number;
    priceBreakdown: {
      basePrice: number;
      roomsPrice: number;
      distancePrice: number;
      floorPrice: number;
      packingPrice: number;
      assemblyPrice: number;
      storagePrice: number;
      inventoryExtra: number;
      typeSurcharge: number;
      dateSurcharge: number;
    };
  };
  onClose: () => void;
}

const PrintView = ({ data, onClose }: PrintViewProps) => {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const printContent = printRef.current;
    if (!printContent) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Umzugskostenvoranschlag - Feierabend Umzüge</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              padding: 40px;
              max-width: 800px;
              margin: 0 auto;
              color: #1a1a1a;
              line-height: 1.6;
            }
            .header { 
              text-align: center; 
              margin-bottom: 40px; 
              padding-bottom: 20px;
              border-bottom: 3px solid #1e3a5f;
            }
            .logo { 
              font-size: 28px; 
              font-weight: bold; 
              color: #1e3a5f;
              margin-bottom: 8px;
            }
            .tagline { 
              font-size: 14px; 
              color: #666; 
              font-style: italic;
            }
            .date { 
              font-size: 12px; 
              color: #888; 
              margin-top: 12px;
            }
            .section { 
              margin: 24px 0; 
              padding: 20px;
              background: #f8f9fa;
              border-radius: 8px;
            }
            .section-title { 
              font-size: 16px; 
              font-weight: 600; 
              margin-bottom: 16px;
              color: #1e3a5f;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .row { 
              display: flex; 
              justify-content: space-between; 
              padding: 8px 0;
              border-bottom: 1px solid #e0e0e0;
            }
            .row:last-child { border-bottom: none; }
            .label { color: #555; }
            .value { font-weight: 500; }
            .total-section {
              background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%);
              color: white;
              padding: 24px;
              border-radius: 8px;
              margin: 32px 0;
            }
            .total-row {
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            .total-label { font-size: 18px; }
            .total-value { 
              font-size: 32px; 
              font-weight: bold;
            }
            .total-note {
              font-size: 12px;
              opacity: 0.8;
              margin-top: 8px;
            }
            .team-info {
              display: flex;
              gap: 40px;
              margin-top: 16px;
              padding-top: 16px;
              border-top: 1px solid rgba(255,255,255,0.2);
            }
            .team-item { text-align: center; }
            .team-number { font-size: 24px; font-weight: bold; }
            .team-label { font-size: 12px; opacity: 0.8; }
            .footer {
              margin-top: 40px;
              padding-top: 20px;
              border-top: 2px solid #e0e0e0;
              text-align: center;
              font-size: 12px;
              color: #666;
            }
            .disclaimer {
              background: #fff3cd;
              color: #856404;
              padding: 16px;
              border-radius: 8px;
              margin: 24px 0;
              font-size: 13px;
            }
            @media print {
              body { padding: 20px; }
              .section { break-inside: avoid; }
            }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const getMoveTypeName = () => {
    switch (data.moveType) {
      case 'express': return 'Express';
      case 'premium': return 'Premium VIP';
      default: return 'Standard';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-background rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-background border-b p-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Druckvorschau</h2>
          <div className="flex gap-2">
            <Button onClick={handlePrint} className="bg-alpine hover:bg-alpine/90 gap-2">
              <Printer className="h-4 w-4" />
              Drucken
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div ref={printRef} className="p-6">
          <div className="header">
            <div className="logo">Feierabend Umzüge</div>
            <div className="tagline">Die Kunst des Umziehens</div>
            <div className="date">
              Erstellt am {format(new Date(), 'dd. MMMM yyyy', { locale: de })}
            </div>
          </div>

          <div className="section">
            <div className="section-title">Umzugsdetails</div>
            <div className="row">
              <span className="label">Umzugsdatum</span>
              <span className="value">
                {data.selectedDate 
                  ? format(data.selectedDate, 'dd. MMMM yyyy', { locale: de })
                  : 'Nach Vereinbarung'}
              </span>
            </div>
            <div className="row">
              <span className="label">Wohnungsgrösse</span>
              <span className="value">{data.rooms} Zimmer</span>
            </div>
            <div className="row">
              <span className="label">Stockwerk</span>
              <span className="value">{data.floor}. OG {data.hasLift ? '(mit Lift)' : '(ohne Lift)'}</span>
            </div>
            <div className="row">
              <span className="label">Distanz</span>
              <span className="value">{data.distance} km</span>
            </div>
            <div className="row">
              <span className="label">Servicepaket</span>
              <span className="value">{getMoveTypeName()}</span>
            </div>
          </div>

          <div className="section">
            <div className="section-title">Inventar</div>
            <div className="row">
              <span className="label">Geschätztes Gewicht</span>
              <span className="value">ca. {data.inventoryWeight} kg</span>
            </div>
            <div className="row">
              <span className="label">Anzahl Möbelstücke</span>
              <span className="value">{data.inventoryItems} Stück</span>
            </div>
          </div>

          {(data.packing || data.assembly || data.storage) && (
            <div className="section">
              <div className="section-title">Zusatzleistungen</div>
              {data.packing && (
                <div className="row">
                  <span className="label">Professionelles Einpacken</span>
                  <span className="value">CHF {data.priceBreakdown.packingPrice}</span>
                </div>
              )}
              {data.assembly && (
                <div className="row">
                  <span className="label">Möbelmontage</span>
                  <span className="value">CHF {data.priceBreakdown.assemblyPrice}</span>
                </div>
              )}
              {data.storage && (
                <div className="row">
                  <span className="label">Zwischenlagerung (1 Monat)</span>
                  <span className="value">CHF {data.priceBreakdown.storagePrice}</span>
                </div>
              )}
            </div>
          )}

          <div className="section">
            <div className="section-title">Kostenaufstellung</div>
            <div className="row">
              <span className="label">Basispreis</span>
              <span className="value">CHF {data.priceBreakdown.basePrice}</span>
            </div>
            <div className="row">
              <span className="label">Wohnungsgrösse ({data.rooms} Zimmer)</span>
              <span className="value">CHF {data.priceBreakdown.roomsPrice}</span>
            </div>
            <div className="row">
              <span className="label">Distanz ({data.distance} km)</span>
              <span className="value">CHF {data.priceBreakdown.distancePrice}</span>
            </div>
            {!data.hasLift && data.priceBreakdown.floorPrice > 0 && (
              <div className="row">
                <span className="label">Stockwerk ohne Lift</span>
                <span className="value">CHF {data.priceBreakdown.floorPrice}</span>
              </div>
            )}
            {data.priceBreakdown.inventoryExtra > 0 && (
              <div className="row">
                <span className="label">Schweres Inventar</span>
                <span className="value">CHF {data.priceBreakdown.inventoryExtra}</span>
              </div>
            )}
            {data.priceBreakdown.typeSurcharge > 0 && (
              <div className="row">
                <span className="label">{getMoveTypeName()}-Zuschlag</span>
                <span className="value">CHF {data.priceBreakdown.typeSurcharge}</span>
              </div>
            )}
            {data.priceBreakdown.dateSurcharge > 0 && (
              <div className="row">
                <span className="label">Datumszuschlag</span>
                <span className="value">CHF {data.priceBreakdown.dateSurcharge}</span>
              </div>
            )}
          </div>

          <div className="total-section">
            <div className="total-row">
              <span className="total-label">Geschätzte Gesamtkosten</span>
              <span className="total-value">CHF {data.price.toLocaleString('de-CH')}</span>
            </div>
            <div className="total-note">inkl. MwSt.</div>
            <div className="team-info">
              <div className="team-item">
                <div className="team-number">{data.teamSize}</div>
                <div className="team-label">Umzugshelfer</div>
              </div>
              <div className="team-item">
                <div className="team-number">~{data.hours}h</div>
                <div className="team-label">Geschätzte Dauer</div>
              </div>
            </div>
          </div>

          <div className="disclaimer">
            <strong>Hinweis:</strong> Dies ist eine unverbindliche Kostenschätzung basierend auf Ihren Angaben. 
            Für ein verbindliches Angebot empfehlen wir eine kostenlose Besichtigung vor Ort, 
            bei der wir alle Details berücksichtigen können.
          </div>

          <div className="footer">
            <div><strong>Feierabend Umzüge</strong> – Die Kunst des Umziehens</div>
            <div style={{ marginTop: '8px' }}>
              Tel: 044 XXX XX XX | info@feierabend-umzuege.ch | www.feierabend-umzuege.ch
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PrintView;
