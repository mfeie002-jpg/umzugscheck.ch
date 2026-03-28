import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Download, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { de, fr, it, enUS } from "date-fns/locale";

interface PDFQuoteGeneratorProps {
  estimateData: {
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
    priceBreakdown: {
      basePrice: number;
      roomsPrice: number;
      distancePrice: number;
      floorPrice: number;
      packingPrice: number;
      assemblyPrice: number;
      storagePrice: number;
      typeSurcharge: number;
      dateSurcharge: number;
    };
  };
}

const PDFQuoteGenerator = ({ estimateData }: PDFQuoteGeneratorProps) => {
  const { language } = useLanguage();
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [fromAddress, setFromAddress] = useState("");
  const [toAddress, setToAddress] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);

  const dateLocale = language === 'fr' ? fr : language === 'it' ? it : language === 'en' ? enUS : de;

  const translations: Record<string, Record<string, string>> = {
    de: {
      title: "Professionelle Offerte",
      subtitle: "Erstellen Sie ein PDF-Dokument mit allen Details",
      customerInfo: "Kundeninformationen",
      name: "Name",
      email: "E-Mail",
      phone: "Telefon",
      addresses: "Adressen",
      fromAddress: "Auszugsadresse",
      toAddress: "Einzugsadresse",
      generate: "PDF generieren",
      generating: "Wird erstellt...",
      download: "PDF herunterladen",
      quoteNumber: "Offerte Nr.",
      date: "Datum",
      validUntil: "Gültig bis",
      movingDate: "Umzugsdatum",
      details: "Umzugsdetails",
      rooms: "Zimmer",
      floor: "Stockwerk",
      lift: "Lift",
      yes: "Ja",
      no: "Nein",
      distance: "Distanz",
      moveType: "Umzugsart",
      standard: "Standard",
      express: "Express",
      premium: "Premium VIP",
      services: "Leistungen",
      packing: "Packservice",
      assembly: "Möbelmontage",
      storage: "Zwischenlagerung",
      included: "Inklusive",
      notIncluded: "Nicht inklusive",
      pricing: "Preisübersicht",
      basePrice: "Basispreis",
      roomsPrice: "Zimmerzuschlag",
      distancePrice: "Distanzzuschlag",
      floorPrice: "Stockwerkzuschlag",
      typeSurcharge: "Servicezuschlag",
      dateSurcharge: "Datumszuschlag",
      total: "Gesamtpreis",
      inclVat: "inkl. MwSt.",
      team: "Team",
      persons: "Personen",
      duration: "Geschätzte Dauer",
      hours: "Stunden",
      terms: "Allgemeine Bedingungen",
      termsText: "Diese Offerte ist 30 Tage gültig. Preise verstehen sich inkl. MwSt. Änderungen vorbehalten bei Abweichungen vom angegebenen Inventar.",
      company: "Feierabend Umzüge GmbH",
      success: "PDF erfolgreich erstellt",
    },
    fr: {
      title: "Devis Professionnel",
      subtitle: "Créez un document PDF avec tous les détails",
      customerInfo: "Informations client",
      name: "Nom",
      email: "E-mail",
      phone: "Téléphone",
      addresses: "Adresses",
      fromAddress: "Adresse de départ",
      toAddress: "Adresse d'arrivée",
      generate: "Générer PDF",
      generating: "En cours...",
      download: "Télécharger PDF",
      quoteNumber: "Devis N°",
      date: "Date",
      validUntil: "Valide jusqu'au",
      movingDate: "Date de déménagement",
      details: "Détails du déménagement",
      rooms: "Pièces",
      floor: "Étage",
      lift: "Ascenseur",
      yes: "Oui",
      no: "Non",
      distance: "Distance",
      moveType: "Type de déménagement",
      standard: "Standard",
      express: "Express",
      premium: "Premium VIP",
      services: "Services",
      packing: "Service d'emballage",
      assembly: "Montage de meubles",
      storage: "Stockage",
      included: "Inclus",
      notIncluded: "Non inclus",
      pricing: "Tarification",
      basePrice: "Prix de base",
      roomsPrice: "Supplément pièces",
      distancePrice: "Supplément distance",
      floorPrice: "Supplément étage",
      typeSurcharge: "Supplément service",
      dateSurcharge: "Supplément date",
      total: "Prix total",
      inclVat: "TVA incl.",
      team: "Équipe",
      persons: "personnes",
      duration: "Durée estimée",
      hours: "heures",
      terms: "Conditions générales",
      termsText: "Ce devis est valable 30 jours. Prix TVA incluse. Sous réserve de modifications en cas d'écarts par rapport à l'inventaire indiqué.",
      company: "Feierabend Umzüge GmbH",
      success: "PDF créé avec succès",
    },
    it: {
      title: "Preventivo Professionale",
      subtitle: "Crea un documento PDF con tutti i dettagli",
      customerInfo: "Informazioni cliente",
      name: "Nome",
      email: "E-mail",
      phone: "Telefono",
      addresses: "Indirizzi",
      fromAddress: "Indirizzo di partenza",
      toAddress: "Indirizzo di arrivo",
      generate: "Genera PDF",
      generating: "In corso...",
      download: "Scarica PDF",
      quoteNumber: "Preventivo N°",
      date: "Data",
      validUntil: "Valido fino al",
      movingDate: "Data trasloco",
      details: "Dettagli trasloco",
      rooms: "Stanze",
      floor: "Piano",
      lift: "Ascensore",
      yes: "Sì",
      no: "No",
      distance: "Distanza",
      moveType: "Tipo di trasloco",
      standard: "Standard",
      express: "Express",
      premium: "Premium VIP",
      services: "Servizi",
      packing: "Servizio imballaggio",
      assembly: "Montaggio mobili",
      storage: "Deposito",
      included: "Incluso",
      notIncluded: "Non incluso",
      pricing: "Prezzi",
      basePrice: "Prezzo base",
      roomsPrice: "Supplemento stanze",
      distancePrice: "Supplemento distanza",
      floorPrice: "Supplemento piano",
      typeSurcharge: "Supplemento servizio",
      dateSurcharge: "Supplemento data",
      total: "Prezzo totale",
      inclVat: "IVA incl.",
      team: "Team",
      persons: "persone",
      duration: "Durata stimata",
      hours: "ore",
      terms: "Condizioni generali",
      termsText: "Questo preventivo è valido 30 giorni. Prezzi IVA inclusa. Soggetto a modifiche in caso di variazioni rispetto all'inventario indicato.",
      company: "Feierabend Umzüge GmbH",
      success: "PDF creato con successo",
    },
    en: {
      title: "Professional Quote",
      subtitle: "Create a PDF document with all details",
      customerInfo: "Customer Information",
      name: "Name",
      email: "Email",
      phone: "Phone",
      addresses: "Addresses",
      fromAddress: "From Address",
      toAddress: "To Address",
      generate: "Generate PDF",
      generating: "Generating...",
      download: "Download PDF",
      quoteNumber: "Quote No.",
      date: "Date",
      validUntil: "Valid until",
      movingDate: "Moving Date",
      details: "Moving Details",
      rooms: "Rooms",
      floor: "Floor",
      lift: "Elevator",
      yes: "Yes",
      no: "No",
      distance: "Distance",
      moveType: "Move Type",
      standard: "Standard",
      express: "Express",
      premium: "Premium VIP",
      services: "Services",
      packing: "Packing Service",
      assembly: "Furniture Assembly",
      storage: "Storage",
      included: "Included",
      notIncluded: "Not included",
      pricing: "Pricing",
      basePrice: "Base Price",
      roomsPrice: "Room Surcharge",
      distancePrice: "Distance Surcharge",
      floorPrice: "Floor Surcharge",
      typeSurcharge: "Service Surcharge",
      dateSurcharge: "Date Surcharge",
      total: "Total Price",
      inclVat: "VAT incl.",
      team: "Team",
      persons: "persons",
      duration: "Estimated Duration",
      hours: "hours",
      terms: "Terms & Conditions",
      termsText: "This quote is valid for 30 days. Prices include VAT. Subject to changes in case of deviations from the stated inventory.",
      company: "Feierabend Umzüge GmbH",
      success: "PDF created successfully",
    },
  };

  const t = translations[language] || translations.de;

  const generatePDF = () => {
    setIsGenerating(true);
    
    const quoteNumber = `FU-${Date.now().toString().slice(-8)}`;
    const today = new Date();
    const validUntil = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
    
    const moveTypeLabel = estimateData.moveType === "express" ? t.express : 
                          estimateData.moveType === "premium" ? t.premium : t.standard;

    const pdfContent = `
════════════════════════════════════════════════════════════════
                    ${t.company}
                 Premium Umzüge Schweiz
════════════════════════════════════════════════════════════════

${t.quoteNumber}: ${quoteNumber}
${t.date}: ${format(today, "dd.MM.yyyy", { locale: dateLocale })}
${t.validUntil}: ${format(validUntil, "dd.MM.yyyy", { locale: dateLocale })}

────────────────────────────────────────────────────────────────
                    ${t.customerInfo}
────────────────────────────────────────────────────────────────
${t.name}: ${customerName || "-"}
${t.email}: ${customerEmail || "-"}
${t.phone}: ${customerPhone || "-"}

${t.fromAddress}: ${fromAddress || "-"}
${t.toAddress}: ${toAddress || "-"}

────────────────────────────────────────────────────────────────
                    ${t.details}
────────────────────────────────────────────────────────────────
${t.movingDate}: ${estimateData.selectedDate ? format(estimateData.selectedDate, "dd.MM.yyyy", { locale: dateLocale }) : "-"}
${t.rooms}: ${estimateData.rooms}
${t.floor}: ${estimateData.floor}. OG
${t.lift}: ${estimateData.hasLift ? t.yes : t.no}
${t.distance}: ${estimateData.distance} km
${t.moveType}: ${moveTypeLabel}

${t.team}: ${estimateData.teamSize} ${t.persons}
${t.duration}: ~${estimateData.hours} ${t.hours}

────────────────────────────────────────────────────────────────
                    ${t.services}
────────────────────────────────────────────────────────────────
${t.packing}: ${estimateData.packing ? `✓ ${t.included}` : `✗ ${t.notIncluded}`}
${t.assembly}: ${estimateData.assembly ? `✓ ${t.included}` : `✗ ${t.notIncluded}`}
${t.storage}: ${estimateData.storage ? `✓ ${t.included}` : `✗ ${t.notIncluded}`}

────────────────────────────────────────────────────────────────
                    ${t.pricing}
────────────────────────────────────────────────────────────────
${t.basePrice}:                           CHF ${estimateData.priceBreakdown.basePrice.toLocaleString("de-CH")}
${t.roomsPrice} (${estimateData.rooms} ${t.rooms}):        CHF ${estimateData.priceBreakdown.roomsPrice.toLocaleString("de-CH")}
${t.distancePrice} (${estimateData.distance} km):      CHF ${estimateData.priceBreakdown.distancePrice.toLocaleString("de-CH")}
${estimateData.priceBreakdown.floorPrice > 0 ? `${t.floorPrice}:                       CHF ${estimateData.priceBreakdown.floorPrice.toLocaleString("de-CH")}\n` : ""}${estimateData.packing ? `${t.packing}:                     CHF ${estimateData.priceBreakdown.packingPrice.toLocaleString("de-CH")}\n` : ""}${estimateData.assembly ? `${t.assembly}:                       CHF ${estimateData.priceBreakdown.assemblyPrice.toLocaleString("de-CH")}\n` : ""}${estimateData.storage ? `${t.storage}:                      CHF ${estimateData.priceBreakdown.storagePrice.toLocaleString("de-CH")}\n` : ""}${estimateData.priceBreakdown.typeSurcharge > 0 ? `${t.typeSurcharge}:                      CHF ${estimateData.priceBreakdown.typeSurcharge.toLocaleString("de-CH")}\n` : ""}${estimateData.priceBreakdown.dateSurcharge > 0 ? `${t.dateSurcharge}:                       CHF ${estimateData.priceBreakdown.dateSurcharge.toLocaleString("de-CH")}\n` : ""}
────────────────────────────────────────────────────────────────
${t.total}:                          CHF ${estimateData.price.toLocaleString("de-CH")}
                                          (${t.inclVat})
════════════════════════════════════════════════════════════════

${t.terms}:
${t.termsText}

────────────────────────────────────────────────────────────────
${t.company}
Musterstrasse 123, 8000 Zürich
Tel: +41 44 XXX XX XX
info@feierabend-umzuege.ch
www.feierabend-umzuege.ch
════════════════════════════════════════════════════════════════
    `;

    setTimeout(() => {
      const blob = new Blob([pdfContent], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Offerte_${quoteNumber}_${format(today, "yyyy-MM-dd")}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      setIsGenerating(false);
      setIsGenerated(true);
      toast({
        title: t.success,
        description: `${t.quoteNumber} ${quoteNumber}`,
      });
    }, 1500);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <FileText className="h-5 w-5 text-alpine" />
        <div>
          <h3 className="font-semibold">{t.title}</h3>
          <p className="text-xs text-muted-foreground">{t.subtitle}</p>
        </div>
      </div>

      {/* Customer Info */}
      <div className="space-y-3">
        <Label className="text-xs font-medium">{t.customerInfo}</Label>
        <div className="grid grid-cols-1 gap-2">
          <Input
            placeholder={t.name}
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="h-8 text-sm"
          />
          <Input
            placeholder={t.email}
            type="email"
            value={customerEmail}
            onChange={(e) => setCustomerEmail(e.target.value)}
            className="h-8 text-sm"
          />
          <Input
            placeholder={t.phone}
            type="tel"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            className="h-8 text-sm"
          />
        </div>
      </div>

      {/* Addresses */}
      <div className="space-y-3">
        <Label className="text-xs font-medium">{t.addresses}</Label>
        <div className="grid grid-cols-1 gap-2">
          <Input
            placeholder={t.fromAddress}
            value={fromAddress}
            onChange={(e) => setFromAddress(e.target.value)}
            className="h-8 text-sm"
          />
          <Input
            placeholder={t.toAddress}
            value={toAddress}
            onChange={(e) => setToAddress(e.target.value)}
            className="h-8 text-sm"
          />
        </div>
      </div>

      {/* Generate Button */}
      <Button
        onClick={generatePDF}
        disabled={isGenerating}
        className="w-full bg-alpine hover:bg-alpine/90"
      >
        {isGenerating ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            {t.generating}
          </>
        ) : isGenerated ? (
          <>
            <CheckCircle2 className="h-4 w-4 mr-2" />
            {t.download}
          </>
        ) : (
          <>
            <Download className="h-4 w-4 mr-2" />
            {t.generate}
          </>
        )}
      </Button>
    </div>
  );
};

export default PDFQuoteGenerator;
