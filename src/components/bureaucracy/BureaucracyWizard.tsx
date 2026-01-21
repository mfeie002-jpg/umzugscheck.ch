/**
 * Bureaucracy Wizard Component
 * Multi-step form for automated address change and utility transfers
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { 
  FileText, 
  Zap, 
  Wifi, 
  Home, 
  Mail, 
  Car, 
  Building, 
  Heart,
  Briefcase,
  Check,
  ArrowRight,
  Loader2,
  Shield
} from 'lucide-react';
import {
  BUREAUCRACY_SERVICES,
  BureaucracyServiceType,
  calculateBureaucracyFee,
  estimateCompletionDays,
  getRecommendedServices
} from '@/lib/behoerden-api';

interface BureaucracyWizardProps {
  moveDetails?: {
    fromCity: string;
    toCity: string;
    fromCanton: string;
    toCanton: string;
    moveDate: string;
  };
  onComplete?: (selectedServices: BureaucracyServiceType[]) => void;
}

const SERVICE_ICONS: Record<BureaucracyServiceType, React.ReactNode> = {
  municipality_registration: <Home className="h-5 w-5" />,
  municipality_deregistration: <Home className="h-5 w-5" />,
  post_redirect: <Mail className="h-5 w-5" />,
  electricity_transfer: <Zap className="h-5 w-5" />,
  gas_transfer: <Zap className="h-5 w-5" />,
  internet_transfer: <Wifi className="h-5 w-5" />,
  tv_license: <FileText className="h-5 w-5" />,
  car_registration: <Car className="h-5 w-5" />,
  health_insurance_update: <Heart className="h-5 w-5" />,
  bank_address_update: <Building className="h-5 w-5" />,
  employer_notification: <Briefcase className="h-5 w-5" />
};

export function BureaucracyWizard({ moveDetails, onComplete }: BureaucracyWizardProps) {
  const [selectedServices, setSelectedServices] = useState<BureaucracyServiceType[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const sameCanton = moveDetails?.fromCanton === moveDetails?.toCanton;
  const recommended = getRecommendedServices({
    sameCanton,
    hasVehicle: true,
    isRenting: true
  });

  const toggleService = (service: BureaucracyServiceType) => {
    setSelectedServices(prev => 
      prev.includes(service) 
        ? prev.filter(s => s !== service)
        : [...prev, service]
    );
  };

  const selectRecommended = () => {
    setSelectedServices(recommended);
  };

  const fees = calculateBureaucracyFee(selectedServices);
  const estimatedDays = estimateCompletionDays(selectedServices);
  const automatedCount = selectedServices.filter(
    s => BUREAUCRACY_SERVICES[s]?.automated
  ).length;

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // API call would go here
      await new Promise(resolve => setTimeout(resolve, 1500));
      onComplete?.(selectedServices);
    } finally {
      setIsSubmitting(false);
    }
  };

  const serviceTypes = Object.entries(BUREAUCRACY_SERVICES) as [BureaucracyServiceType, typeof BUREAUCRACY_SERVICES[BureaucracyServiceType]][];

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-primary/10">
            <FileText className="h-6 w-6 text-primary" />
          </div>
          <div>
            <CardTitle className="flex items-center gap-2">
              Bürokratie-Autopilot
              <Badge variant="secondary" className="ml-2">
                <Shield className="h-3 w-3 mr-1" />
                Automatisiert
              </Badge>
            </CardTitle>
            <CardDescription>
              Wählen Sie die Services, die wir für Sie erledigen sollen
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6 space-y-6">
        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={selectRecommended}
          >
            <Check className="h-4 w-4 mr-1" />
            Empfohlene auswählen ({recommended.length})
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setSelectedServices([])}
          >
            Alle abwählen
          </Button>
        </div>

        {/* Service Grid */}
        <div className="grid gap-3">
          {serviceTypes.map(([type, config]) => {
            const isSelected = selectedServices.includes(type);
            const isRecommended = recommended.includes(type);
            
            return (
              <div
                key={type}
                className={`
                  flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all
                  ${isSelected 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-primary/50'
                  }
                `}
                onClick={() => toggleService(type)}
              >
                <Checkbox 
                  checked={isSelected}
                  onCheckedChange={() => toggleService(type)}
                />
                
                <div className={`p-2 rounded-lg ${isSelected ? 'bg-primary/10' : 'bg-muted'}`}>
                  {SERVICE_ICONS[type]}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{config.name}</span>
                    {isRecommended && (
                      <Badge variant="outline" className="text-xs">
                        Empfohlen
                      </Badge>
                    )}
                    {config.automated && (
                      <Badge variant="secondary" className="text-xs">
                        Auto
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {config.description}
                  </p>
                </div>
                
                <div className="text-right shrink-0">
                  <div className="text-sm font-medium">
                    {config.fee > 0 ? `CHF ${config.fee}` : 'Kostenlos'}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    ~{config.estimatedDays} Tage
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        {selectedServices.length > 0 && (
          <div className="bg-muted/50 rounded-xl p-4 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                {selectedServices.length} Services ausgewählt
              </span>
              <span className="text-sm text-muted-foreground">
                {automatedCount} automatisiert
              </span>
            </div>
            
            <Progress value={(automatedCount / selectedServices.length) * 100} />
            
            <div className="grid grid-cols-3 gap-4 pt-2">
              <div>
                <div className="text-2xl font-bold text-primary">
                  CHF {fees.total}
                </div>
                <div className="text-xs text-muted-foreground">
                  Gesamtkosten
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold">
                  ~{estimatedDays}
                </div>
                <div className="text-xs text-muted-foreground">
                  Tage
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-emerald-600">
                  {Math.round((automatedCount / selectedServices.length) * 100)}%
                </div>
                <div className="text-xs text-muted-foreground">
                  Automatisiert
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CTA */}
        <Button 
          className="w-full" 
          size="lg"
          disabled={selectedServices.length === 0 || isSubmitting}
          onClick={handleSubmit}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Wird verarbeitet...
            </>
          ) : (
            <>
              Autopilot starten
              <ArrowRight className="h-4 w-4 ml-2" />
            </>
          )}
        </Button>

        <p className="text-xs text-center text-muted-foreground">
          Mit dem Start bestätigen Sie die Beauftragung der ausgewählten Services.
          Sie können den Fortschritt jederzeit in Ihrem Dashboard verfolgen.
        </p>
      </CardContent>
    </Card>
  );
}

export default BureaucracyWizard;
