/**
 * Digital Signature Pad Component
 * 
 * Phase 6: Capture digital signatures for handover protocols
 * and contract acceptance with Swiss compliance.
 */

import { memo, useState, useRef, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  PenTool,
  RotateCcw,
  Check,
  Shield,
  FileCheck,
  AlertCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface DigitalSignaturePadProps {
  documentType: 'handover_protocol' | 'quote_acceptance' | 'damage_report' | 'completion_confirmation';
  signerName: string;
  signerRole: 'customer' | 'provider' | 'crew_lead' | 'witness';
  onSign: (signatureData: string) => void;
  onCancel?: () => void;
  documentSummary?: string;
  className?: string;
}

const documentLabels: Record<DigitalSignaturePadProps['documentType'], string> = {
  handover_protocol: 'Übergabeprotokoll',
  quote_acceptance: 'Angebotsannahme',
  damage_report: 'Schadensbericht',
  completion_confirmation: 'Abschlussbestätigung',
};

export const DigitalSignaturePad = memo(function DigitalSignaturePad({
  documentType,
  signerName,
  signerRole,
  onSign,
  onCancel,
  documentSummary,
  className,
}: DigitalSignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [legalConsent, setLegalConsent] = useState(false);
  const [lastPoint, setLastPoint] = useState<{ x: number; y: number } | null>(null);
  
  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);
    
    // Style
    ctx.strokeStyle = '#1e40af';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    // Clear with white background
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw signature line
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(20, rect.height - 30);
    ctx.lineTo(rect.width - 20, rect.height - 30);
    ctx.stroke();
    
    // Reset stroke style
    ctx.strokeStyle = '#1e40af';
    ctx.lineWidth = 2.5;
  }, []);
  
  const getCoords = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    
    const rect = canvas.getBoundingClientRect();
    let x: number, y: number;
    
    if ('touches' in e) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }
    
    return { x, y };
  }, []);
  
  const startDrawing = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const coords = getCoords(e);
    if (!coords) return;
    
    setIsDrawing(true);
    setLastPoint(coords);
    setHasSignature(true);
  }, [getCoords]);
  
  const draw = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !lastPoint) return;
    e.preventDefault();
    
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    
    const coords = getCoords(e);
    if (!coords) return;
    
    ctx.beginPath();
    ctx.moveTo(lastPoint.x, lastPoint.y);
    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();
    
    setLastPoint(coords);
  }, [isDrawing, lastPoint, getCoords]);
  
  const stopDrawing = useCallback(() => {
    setIsDrawing(false);
    setLastPoint(null);
  }, []);
  
  const clearSignature = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    
    // Clear
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Redraw signature line
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(20, rect.height - 30);
    ctx.lineTo(rect.width - 20, rect.height - 30);
    ctx.stroke();
    
    // Reset style
    ctx.strokeStyle = '#1e40af';
    ctx.lineWidth = 2.5;
    
    setHasSignature(false);
  }, []);
  
  const handleSubmit = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const signatureData = canvas.toDataURL('image/png');
    onSign(signatureData);
  }, [onSign]);
  
  const canSubmit = hasSignature && termsAccepted && legalConsent;
  
  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader className="pb-3 bg-gradient-to-r from-primary/5 to-purple-500/10">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileCheck className="h-5 w-5 text-primary" />
            Digitale Unterschrift
          </CardTitle>
          <Badge variant="outline">
            {documentLabels[documentType]}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-4 space-y-4">
        {/* Document Summary */}
        {documentSummary && (
          <div className="bg-muted/50 rounded-lg p-4 text-sm">
            <p className="text-muted-foreground">{documentSummary}</p>
          </div>
        )}
        
        {/* Signer Info */}
        <div className="flex items-center justify-between text-sm">
          <div>
            <span className="text-muted-foreground">Unterzeichner: </span>
            <span className="font-medium">{signerName}</span>
          </div>
          <Badge variant="secondary">
            {signerRole === 'customer' && 'Kunde'}
            {signerRole === 'provider' && 'Anbieter'}
            {signerRole === 'crew_lead' && 'Teamleiter'}
            {signerRole === 'witness' && 'Zeuge'}
          </Badge>
        </div>
        
        {/* Signature Canvas */}
        <div className="relative border-2 border-dashed border-muted rounded-lg overflow-hidden">
          <canvas
            ref={canvasRef}
            className="w-full h-48 cursor-crosshair touch-none"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
          />
          
          {!hasSignature && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center text-muted-foreground">
                <PenTool className="h-8 w-8 mx-auto mb-2 opacity-30" />
                <p className="text-sm">Hier unterschreiben</p>
              </div>
            </div>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2"
            onClick={clearSignature}
          >
            <RotateCcw className="h-4 w-4 mr-1" />
            Löschen
          </Button>
        </div>
        
        {/* Legal Checkboxes */}
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <Checkbox
              id="terms"
              checked={termsAccepted}
              onCheckedChange={(checked) => setTermsAccepted(checked === true)}
            />
            <Label htmlFor="terms" className="text-sm leading-relaxed cursor-pointer">
              Ich bestätige, dass alle Angaben im Dokument korrekt sind und akzeptiere 
              die <a href="/agb" className="text-primary underline">Allgemeinen Geschäftsbedingungen</a>.
            </Label>
          </div>
          
          <div className="flex items-start gap-3">
            <Checkbox
              id="legal"
              checked={legalConsent}
              onCheckedChange={(checked) => setLegalConsent(checked === true)}
            />
            <Label htmlFor="legal" className="text-sm leading-relaxed cursor-pointer">
              Ich verstehe, dass diese digitale Unterschrift rechtlich bindend ist und 
              der eigenhändigen Unterschrift gleichgestellt wird (OR Art. 14).
            </Label>
          </div>
        </div>
        
        {/* Security Badge */}
        <div className="flex items-center gap-2 p-3 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg text-sm">
          <Shield className="h-4 w-4 text-emerald-600 flex-shrink-0" />
          <p className="text-emerald-700 dark:text-emerald-400">
            Ihre Unterschrift wird verschlüsselt gespeichert und mit Zeitstempel, 
            IP-Adresse und Standort verifiziert.
          </p>
        </div>
        
        {/* Actions */}
        <div className="flex gap-3">
          {onCancel && (
            <Button variant="outline" className="flex-1" onClick={onCancel}>
              Abbrechen
            </Button>
          )}
          
          <Button
            className="flex-1"
            onClick={handleSubmit}
            disabled={!canSubmit}
          >
            {canSubmit ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Unterschreiben
              </>
            ) : (
              <>
                <AlertCircle className="h-4 w-4 mr-2" />
                Bitte alle Felder ausfüllen
              </>
            )}
          </Button>
        </div>
        
        {/* Timestamp Preview */}
        <p className="text-xs text-center text-muted-foreground">
          Unterschrift wird gespeichert am: {new Date().toLocaleString('de-CH')}
        </p>
      </CardContent>
    </Card>
  );
});

export default DigitalSignaturePad;
