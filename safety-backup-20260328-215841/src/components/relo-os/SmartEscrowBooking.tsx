/**
 * Phase 5: Smart Escrow Booking
 * 
 * Secure payment flow with escrow protection.
 * Funds are held by the platform until move completion.
 */

import { useState, memo } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  Lock,
  CreditCard,
  CheckCircle,
  Clock,
  AlertCircle,
  Loader2,
  ArrowRight,
  BadgeCheck,
  Wallet,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

export interface EscrowBookingData {
  escrowId: string;
  totalAmount: number;
  platformFee: number;
  providerPayout: number;
  status: 'pending' | 'funded' | 'in_progress' | 'completed' | 'disputed' | 'released';
  fundedAt?: string;
  releasedAt?: string;
}

export interface SmartEscrowBookingProps {
  providerId: string;
  providerName: string;
  totalPrice: number;
  moveDate: string;
  serviceTier: string;
  onConfirmBooking: () => Promise<EscrowBookingData>;
  onPaymentComplete?: (escrowData: EscrowBookingData) => void;
  className?: string;
}

const ESCROW_STEPS = [
  { id: 'review', label: 'Überprüfen', icon: CheckCircle },
  { id: 'payment', label: 'Zahlung', icon: CreditCard },
  { id: 'escrow', label: 'Treuhand', icon: Shield },
  { id: 'confirmed', label: 'Bestätigt', icon: BadgeCheck },
];

const PROTECTION_FEATURES = [
  { icon: Shield, text: '100% Käuferschutz' },
  { icon: Lock, text: 'Sichere Treuhandzahlung' },
  { icon: Clock, text: 'Auszahlung nach Abschluss' },
  { icon: BadgeCheck, text: 'Qualitätsgarantie' },
];

export const SmartEscrowBooking = memo(function SmartEscrowBooking({
  providerId,
  providerName,
  totalPrice,
  moveDate,
  serviceTier,
  onConfirmBooking,
  onPaymentComplete,
  className,
}: SmartEscrowBookingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [escrowData, setEscrowData] = useState<EscrowBookingData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const platformFee = Math.round(totalPrice * 0.05); // 5% platform fee
  const providerPayout = totalPrice - platformFee;

  const handleConfirmBooking = async () => {
    setIsProcessing(true);
    setError(null);
    setCurrentStep(1);

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setCurrentStep(2);

      // Create escrow
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const data = await onConfirmBooking();
      setEscrowData(data);
      
      setCurrentStep(3);
      onPaymentComplete?.(data);
    } catch (err) {
      setError('Buchung fehlgeschlagen. Bitte versuchen Sie es erneut.');
      setCurrentStep(0);
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCHF = (amount: number) =>
    `CHF ${amount.toLocaleString('de-CH', { minimumFractionDigits: 0 })}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={className}
    >
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Phase 5: Smart Escrow Booking
              </CardTitle>
              <CardDescription>
                Sichere Treuhandzahlung mit 100% Käuferschutz
              </CardDescription>
            </div>
            <Badge className="bg-emerald-500">
              <Lock className="h-3 w-3 mr-1" />
              SSL Secured
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Progress Steps */}
          <div className="relative">
            <div className="flex justify-between">
              {ESCROW_STEPS.map((step, index) => {
                const Icon = step.icon;
                const isActive = index === currentStep;
                const isCompleted = index < currentStep;

                return (
                  <div
                    key={step.id}
                    className={cn(
                      'flex flex-col items-center z-10',
                      isCompleted && 'text-emerald-600',
                      isActive && 'text-primary',
                      !isActive && !isCompleted && 'text-muted-foreground'
                    )}
                  >
                    <div
                      className={cn(
                        'w-10 h-10 rounded-full flex items-center justify-center border-2 bg-background',
                        isCompleted && 'border-emerald-500 bg-emerald-500 text-white',
                        isActive && 'border-primary bg-primary/10',
                        !isActive && !isCompleted && 'border-muted'
                      )}
                    >
                      {isProcessing && isActive ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <Icon className="h-5 w-5" />
                      )}
                    </div>
                    <span className="text-xs mt-1 font-medium">{step.label}</span>
                  </div>
                );
              })}
            </div>
            {/* Progress Line */}
            <div className="absolute top-5 left-0 right-0 h-0.5 bg-muted -z-0">
              <div
                className="h-full bg-emerald-500 transition-all duration-500"
                style={{ width: `${(currentStep / (ESCROW_STEPS.length - 1)) * 100}%` }}
              />
            </div>
          </div>

          <Separator />

          {/* Booking Summary */}
          <div className="space-y-4">
            <h4 className="font-semibold">Buchungsübersicht</h4>
            
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="p-3 bg-muted/50 rounded-lg">
                <span className="text-muted-foreground">Anbieter</span>
                <p className="font-medium">{providerName}</p>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg">
                <span className="text-muted-foreground">Service-Tier</span>
                <p className="font-medium capitalize">{serviceTier}</p>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg">
                <span className="text-muted-foreground">Umzugsdatum</span>
                <p className="font-medium">
                  {new Date(moveDate).toLocaleDateString('de-CH', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg">
                <span className="text-muted-foreground">Status</span>
                <p className="font-medium flex items-center gap-1">
                  {escrowData ? (
                    <>
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                      Gebucht
                    </>
                  ) : (
                    'Ausstehend'
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="p-4 border rounded-lg bg-card">
            <h4 className="font-semibold mb-3">Preisaufstellung</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Umzugskosten</span>
                <span>{formatCHF(totalPrice - platformFee)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Plattformgebühr (5%)</span>
                <span>{formatCHF(platformFee)}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-bold text-lg">
                <span>Gesamtbetrag</span>
                <span className="text-primary">{formatCHF(totalPrice)}</span>
              </div>
            </div>
          </div>

          {/* Protection Features */}
          <div className="grid grid-cols-2 gap-2">
            {PROTECTION_FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.text}
                  className="flex items-center gap-2 p-2 bg-emerald-500/10 rounded-lg text-sm"
                >
                  <Icon className="h-4 w-4 text-emerald-600" />
                  <span className="text-emerald-700 font-medium">{feature.text}</span>
                </div>
              );
            })}
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-lg">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Action Button */}
          {currentStep < 3 ? (
            <Button
              size="lg"
              className="w-full"
              onClick={handleConfirmBooking}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Wird verarbeitet...
                </>
              ) : (
                <>
                  <Wallet className="h-4 w-4 mr-2" />
                  {formatCHF(totalPrice)} sicher bezahlen
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          ) : (
            <div className="p-4 bg-emerald-500/10 rounded-lg text-center">
              <CheckCircle className="h-12 w-12 text-emerald-500 mx-auto mb-2" />
              <h4 className="font-bold text-lg text-emerald-700">Buchung bestätigt!</h4>
              <p className="text-sm text-emerald-600">
                Die Zahlung ist in der Treuhand gesichert. Sie erhalten eine Bestätigung per E-Mail.
              </p>
              {escrowData && (
                <Badge variant="outline" className="mt-2">
                  Escrow ID: {escrowData.escrowId}
                </Badge>
              )}
            </div>
          )}

          {/* Legal Note */}
          <p className="text-xs text-muted-foreground text-center">
            Die Zahlung wird erst nach erfolgreichem Abschluss des Umzugs an den Anbieter freigegeben.
            Bei Problemen kontaktieren Sie unseren Support.
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
});

export default SmartEscrowBooking;
