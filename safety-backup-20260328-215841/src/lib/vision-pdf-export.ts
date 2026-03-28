/**
 * Vision PDF Export Utility
 * Generates a multi-page A4 PDF of the /vision page content
 * Using html2canvas and jsPDF
 */

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface ExportSection {
  elementId: string;
  title: string;
}

const SECTIONS: ExportSection[] = [
  { elementId: 'vision-hero', title: 'Cover' },
  { elementId: 'vision-customer-usps', title: '10 Kunden-USPs' },
  { elementId: 'vision-investor-pillars', title: '10 Investor-Säulen' },
  { elementId: 'vision-family-summary', title: 'Familie & Revenue Stacking' },
];

/**
 * Captures a DOM element as a canvas image
 */
async function captureElement(element: HTMLElement): Promise<HTMLCanvasElement> {
  return html2canvas(element, {
    scale: 2, // Higher quality
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#ffffff',
    logging: false,
    windowWidth: 1200, // Fixed width for consistent rendering
  });
}

/**
 * Adds a canvas image to the PDF, handling multi-page content
 */
function addImageToPDF(
  pdf: jsPDF, 
  canvas: HTMLCanvasElement, 
  startNewPage: boolean = true
): void {
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  
  const imgWidth = pageWidth - 20; // 10mm margin on each side
  const imgHeight = (canvas.height * imgWidth) / canvas.width;
  
  const imgData = canvas.toDataURL('image/jpeg', 0.95);
  
  if (startNewPage) {
    pdf.addPage();
  }
  
  // If image is taller than page, we need to split it
  if (imgHeight > pageHeight - 20) {
    let remainingHeight = imgHeight;
    let yOffset = 0;
    let isFirstPage = true;
    
    while (remainingHeight > 0) {
      if (!isFirstPage) {
        pdf.addPage();
      }
      
      const printHeight = Math.min(remainingHeight, pageHeight - 20);
      
      // Calculate the portion of the image to show
      const sourceY = (yOffset / imgHeight) * canvas.height;
      const sourceHeight = (printHeight / imgHeight) * canvas.height;
      
      // Create a temporary canvas for this portion
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = canvas.width;
      tempCanvas.height = sourceHeight;
      
      const ctx = tempCanvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(
          canvas, 
          0, sourceY, canvas.width, sourceHeight,
          0, 0, canvas.width, sourceHeight
        );
        
        const portionData = tempCanvas.toDataURL('image/jpeg', 0.95);
        pdf.addImage(portionData, 'JPEG', 10, 10, imgWidth, printHeight);
      }
      
      remainingHeight -= printHeight;
      yOffset += printHeight;
      isFirstPage = false;
    }
  } else {
    pdf.addImage(imgData, 'JPEG', 10, 10, imgWidth, imgHeight);
  }
}

/**
 * Adds a cover page to the PDF
 */
function addCoverPage(pdf: jsPDF): void {
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  
  // Background gradient simulation
  pdf.setFillColor(0, 80, 168); // Primary blue
  pdf.rect(0, 0, pageWidth, pageHeight / 3, 'F');
  
  // White section
  pdf.setFillColor(255, 255, 255);
  pdf.rect(0, pageHeight / 3, pageWidth, (pageHeight * 2) / 3, 'F');
  
  // Title
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(36);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Umzugscheck.ch', pageWidth / 2, 50, { align: 'center' });
  
  pdf.setFontSize(24);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Vision & Business Model', pageWidth / 2, 65, { align: 'center' });
  
  // Subtitle
  pdf.setTextColor(0, 80, 168);
  pdf.setFontSize(16);
  pdf.text('Interne Präsentation', pageWidth / 2, pageHeight / 3 + 30, { align: 'center' });
  
  // Content sections
  const sections = [
    '📹 10 Kunden-USPs («Magic»)',
    '💼 10 Investor-Säulen',
    '💰 Revenue Stacking: 553 CHF/Kunde',
    '🚀 Roadmap: Heute → 5 Jahre',
    '🤖 95% AI, 5% Human Operations',
  ];
  
  pdf.setTextColor(60, 60, 60);
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'normal');
  
  let yPos = pageHeight / 3 + 60;
  sections.forEach((section) => {
    pdf.text(section, pageWidth / 2, yPos, { align: 'center' });
    yPos += 15;
  });
  
  // Date
  const date = new Date().toLocaleDateString('de-CH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
  pdf.setTextColor(150, 150, 150);
  pdf.setFontSize(10);
  pdf.text(`Generiert am ${date}`, pageWidth / 2, pageHeight - 20, { align: 'center' });
  
  // Footer
  pdf.setTextColor(0, 80, 168);
  pdf.setFontSize(12);
  pdf.text('www.umzugscheck.ch', pageWidth / 2, pageHeight - 30, { align: 'center' });
}

/**
 * Main export function - generates and downloads the PDF
 */
export async function exportVisionToPDF(
  onProgress?: (progress: number, message: string) => void
): Promise<void> {
  try {
    onProgress?.(5, 'PDF wird vorbereitet...');
    
    // Create PDF in A4 format
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });
    
    // Add cover page
    onProgress?.(10, 'Cover wird erstellt...');
    addCoverPage(pdf);
    
    // Find and capture each section
    const sectionsToCapture = [
      'vision-customer-usps',
      'vision-investor-pillars', 
      'vision-family-summary',
    ];
    
    for (let i = 0; i < sectionsToCapture.length; i++) {
      const sectionId = sectionsToCapture[i];
      const element = document.getElementById(sectionId);
      
      const progress = 20 + (i * 25);
      onProgress?.(progress, `Sektion ${i + 1}/${sectionsToCapture.length} wird erfasst...`);
      
      if (element) {
        const canvas = await captureElement(element);
        addImageToPDF(pdf, canvas, true);
      }
    }
    
    onProgress?.(90, 'PDF wird finalisiert...');
    
    // Generate filename with date
    const dateStr = new Date().toISOString().split('T')[0];
    const filename = `umzugscheck-vision-${dateStr}.pdf`;
    
    // Download the PDF
    pdf.save(filename);
    
    onProgress?.(100, 'Download gestartet!');
    
  } catch (error) {
    console.error('PDF Export Error:', error);
    throw new Error('PDF konnte nicht erstellt werden. Bitte versuchen Sie es erneut.');
  }
}

/**
 * Alternative: Export as simple text-based PDF (faster, smaller file)
 */
export function exportVisionAsTextPDF(): void {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });
  
  addCoverPage(pdf);
  
  // Add Customer USPs as text
  pdf.addPage();
  pdf.setFontSize(20);
  pdf.setTextColor(0, 80, 168);
  pdf.setFont('helvetica', 'bold');
  pdf.text('10 Kunden-USPs', 10, 20);
  
  const customerUSPs = [
    { num: 1, title: 'Der «Magische Blick»', desc: 'AI Video-Analyse - Handy-Video → exakte Offerte' },
    { num: 2, title: 'Der «Sicherheits-Tresor»', desc: 'Treuhand-Zahlung - 100% Betrugsschutz' },
    { num: 3, title: 'Der «Bürokratie-Butler»', desc: 'Autopilot für Papierkram - Ein Klick = Alles erledigt' },
    { num: 4, title: 'Die «Alles-Glänzt»-Garantie', desc: 'Zertifizierte Endreinigung mit Garantie' },
    { num: 5, title: 'Der Entrümpelungs-Knopf', desc: 'Circular Economy - Weniger = Billiger' },
    { num: 6, title: 'Der «Fair-Preis-Wächter»', desc: 'Transparenter Marktplatz - 5 Offerten vergleichen' },
    { num: 7, title: 'Der «Neue-Heimat»-Guide', desc: 'Relocation Intelligence - Ab Tag 1 zuhause' },
    { num: 8, title: 'Versicherung, die zahlt', desc: 'Smart Insurance - Video = Beweis' },
    { num: 9, title: 'Immer erreichbar', desc: 'Omni-Channel Concierge - 0 Min Wartezeit' },
    { num: 10, title: 'Möbel-Taxi & Montage', desc: 'Handyman Service - Keinen Finger rühren' },
  ];
  
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  let yPos = 35;
  
  customerUSPs.forEach((usp) => {
    pdf.setTextColor(0, 80, 168);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`${usp.num}. ${usp.title}`, 10, yPos);
    
    pdf.setTextColor(60, 60, 60);
    pdf.setFont('helvetica', 'normal');
    pdf.text(usp.desc, 15, yPos + 5);
    
    yPos += 15;
  });
  
  // Add Investor Pillars
  pdf.addPage();
  pdf.setFontSize(20);
  pdf.setTextColor(0, 80, 168);
  pdf.setFont('helvetica', 'bold');
  pdf.text('10 Investor-Säulen', 10, 20);
  
  const investorPillars = [
    { num: 1, title: 'Computer Vision Asset', metric: 'CAC -80%', automation: '100%' },
    { num: 2, title: 'Fintech & Escrow', metric: 'Zero Leakage', automation: '95%' },
    { num: 3, title: 'Dynamic Pricing Engine', metric: '+10% Revenue', automation: '100%' },
    { num: 4, title: 'B2B / HR-Relocation Suite', metric: '10 Firmen = 500 Kunden', automation: '90%' },
    { num: 5, title: 'Bureaucracy API Layer', metric: '95% Marge', automation: '99%' },
    { num: 6, title: 'Partner Operating System', metric: '99 CHF MRR', automation: '90%' },
    { num: 7, title: 'Micro-Insurance', metric: '60% Marge', automation: '90%' },
    { num: 8, title: 'Circular Economy Hub', metric: 'Double Revenue', automation: '80%' },
    { num: 9, title: 'Relocation Data Intelligence', metric: '150 CHF/Lead', automation: '100%' },
    { num: 10, title: 'Lean Operations', metric: '>40% EBITDA', automation: '95%' },
  ];
  
  yPos = 35;
  
  investorPillars.forEach((pillar) => {
    pdf.setTextColor(0, 80, 168);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`${pillar.num}. ${pillar.title}`, 10, yPos);
    
    pdf.setTextColor(60, 60, 60);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Key Metric: ${pillar.metric} | KI-Grad: ${pillar.automation}`, 15, yPos + 5);
    
    yPos += 15;
  });
  
  // Add Revenue Stacking
  pdf.addPage();
  pdf.setFontSize(20);
  pdf.setTextColor(0, 80, 168);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Revenue Stacking', 10, 20);
  
  const revenues = [
    { label: 'Basis-Provision', value: '225 CHF' },
    { label: 'Escrow/Fintech', value: '30 CHF' },
    { label: 'Versicherung', value: '99 CHF' },
    { label: 'Bürokratie', value: '49 CHF' },
    { label: 'Lead-Verkauf', value: '100 CHF' },
    { label: 'Circular Economy', value: '50 CHF' },
  ];
  
  yPos = 40;
  pdf.setFontSize(12);
  
  revenues.forEach((rev) => {
    pdf.setTextColor(60, 60, 60);
    pdf.setFont('helvetica', 'normal');
    pdf.text(rev.label, 15, yPos);
    pdf.setFont('helvetica', 'bold');
    pdf.text(rev.value, 100, yPos);
    yPos += 10;
  });
  
  // Total
  yPos += 5;
  pdf.setDrawColor(0, 80, 168);
  pdf.line(10, yPos, 120, yPos);
  yPos += 10;
  
  pdf.setFontSize(14);
  pdf.setTextColor(0, 80, 168);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Total Einnahmen:', 15, yPos);
  pdf.text('553 CHF', 100, yPos);
  
  yPos += 10;
  pdf.setTextColor(255, 0, 0);
  pdf.text('Kosten pro Kunde:', 15, yPos);
  pdf.text('-50 CHF', 100, yPos);
  
  yPos += 15;
  pdf.setFontSize(18);
  pdf.setTextColor(0, 150, 0);
  pdf.text('= Gewinn pro Kunde:', 15, yPos);
  pdf.text('503 CHF (>90% Marge)', 100, yPos);
  
  // Generate filename and download
  const dateStr = new Date().toISOString().split('T')[0];
  pdf.save(`umzugscheck-vision-text-${dateStr}.pdf`);
}
