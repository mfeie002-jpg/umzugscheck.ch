import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Package, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Truck,
  Gift
} from 'lucide-react';
import { 
  PackingServiceType,
  PACKING_SERVICE_OPTIONS,
  PACKING_VS_MOVING_EXPLAINER,
  calculatePackingEstimate
} from '@/lib/packing-service';

interface PackingServiceSelectorProps {
  volumeM3?: number;
  onSelect?: (serviceType: PackingServiceType) => void;
  selectedService?: PackingServiceType;
}

export function PackingServiceSelector({ 
  volumeM3 = 25,
  onSelect,
  selectedService
}: PackingServiceSelectorProps) {
  const [expandedService, setExpandedService] = useState<PackingServiceType | null>(null);
  const [showExplainer, setShowExplainer] = useState(true);

  const handleSelect = (serviceType: PackingServiceType) => {
    onSelect?.(serviceType);
  };

  const toggleExpand = (serviceType: PackingServiceType) => {
    setExpandedService(prev => prev === serviceType ? null : serviceType);
  };

  return (
    <div className="space-y-6">
      {/* Critical Explainer: Moving ≠ Packing */}
      {showExplainer && (
        <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-primary" />
                {PACKING_VS_MOVING_EXPLAINER.title}
              </span>
              <Badge variant="outline" className="text-primary border-primary">
                {PACKING_VS_MOVING_EXPLAINER.subtitle}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {PACKING_VS_MOVING_EXPLAINER.points.map((point, idx) => (
                <div 
                  key={idx}
                  className={`p-4 rounded-lg ${point.included ? 'bg-secondary/50' : 'bg-muted'}`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{point.icon}</span>
                    <span className="font-medium">{point.title}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {point.description}
                  </p>
                  {point.included ? (
                    <Badge variant="secondary" className="text-xs">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Im Umzug enthalten
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-xs text-primary">
                      {point.note}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowExplainer(false)}
              className="w-full text-muted-foreground"
            >
              Verstanden
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Service Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            Verpackungsservice wählen
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {PACKING_SERVICE_OPTIONS.map(service => {
            const estimate = calculatePackingEstimate(volumeM3, service.id);
            const isSelected = selectedService === service.id;
            const isExpanded = expandedService === service.id;
            
            return (
              <div
                key={service.id}
                className={`border rounded-lg transition-all ${
                  isSelected 
                    ? 'border-primary ring-2 ring-primary/20' 
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div 
                  className="p-4 cursor-pointer"
                  onClick={() => handleSelect(service.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{service.nameDe}</h3>
                        {service.recommended && (
                          <Badge className="bg-primary text-primary-foreground text-xs">
                            <Sparkles className="h-3 w-3 mr-1" />
                            Empfohlen
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {service.descriptionDe}
                      </p>
                    </div>
                    
                    <div className="text-right ml-4">
                      {service.id === 'diy' ? (
                        <p className="text-lg font-bold text-muted-foreground">CHF 0</p>
                      ) : (
                        <>
                          <p className="text-lg font-bold">
                            CHF {estimate.totalCost.toLocaleString()}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            ca. {estimate.estimatedHours}h
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                  
                  {/* Quick Benefits */}
                  {service.id !== 'diy' && (
                    <div className="flex gap-4 mt-3">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{estimate.savings.timeHours}h gespart</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Gift className="h-4 w-4" />
                        <span>Material inkl.</span>
                      </div>
                    </div>
                  )}

                  {/* Expand Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2 w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleExpand(service.id);
                    }}
                  >
                    {isExpanded ? (
                      <>Details verbergen <ChevronUp className="ml-1 h-4 w-4" /></>
                    ) : (
                      <>Details anzeigen <ChevronDown className="ml-1 h-4 w-4" /></>
                    )}
                  </Button>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-4 pb-4 border-t pt-4 bg-muted/30">
                    <h4 className="font-medium mb-2">Inklusive:</h4>
                    <ul className="space-y-1">
                      {service.includesDe.map((item, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    
                    {service.id !== 'diy' && (
                      <div className="mt-4 p-3 bg-background rounded-lg">
                        <p className="text-sm font-medium mb-1">Preisberechnung:</p>
                        <p className="text-sm text-muted-foreground">
                          {volumeM3} m³ × CHF {service.pricePerHour}/h ≈ CHF {estimate.laborCost}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Selection Summary */}
      {selectedService && selectedService !== 'diy' && (
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">
                  {PACKING_SERVICE_OPTIONS.find(s => s.id === selectedService)?.nameDe}
                </p>
                <p className="text-sm text-muted-foreground">
                  Wird zum Umzug hinzugefügt
                </p>
              </div>
              <Button>
                <Truck className="mr-2 h-4 w-4" />
                Weiter zur Buchung
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default PackingServiceSelector;
