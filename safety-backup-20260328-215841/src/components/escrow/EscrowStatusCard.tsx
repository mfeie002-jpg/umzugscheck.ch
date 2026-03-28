import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Shield, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  XCircle,
  Banknote,
  FileCheck,
  ArrowRight
} from "lucide-react";
import { EscrowTransaction } from "@/lib/escrow-service";
import { formatDistanceToNow } from "date-fns";
import { de } from "date-fns/locale";

interface EscrowStatusCardProps {
  transaction: EscrowTransaction;
  userRole: 'customer' | 'provider';
  onConfirmService?: () => void;
  onOpenDispute?: () => void;
  isLoading?: boolean;
}

const statusConfig: Record<string, { 
  label: string; 
  color: string; 
  icon: React.ElementType;
  progress: number;
}> = {
  pending: { 
    label: 'Zahlung ausstehend', 
    color: 'bg-yellow-500', 
    icon: Clock,
    progress: 20
  },
  funded: { 
    label: 'Bezahlt - In Treuhand', 
    color: 'bg-blue-500', 
    icon: Shield,
    progress: 50
  },
  released: { 
    label: 'Abgeschlossen', 
    color: 'bg-green-500', 
    icon: CheckCircle,
    progress: 100
  },
  disputed: { 
    label: 'Im Streitfall', 
    color: 'bg-red-500', 
    icon: AlertTriangle,
    progress: 50
  },
  refunded: { 
    label: 'Erstattet', 
    color: 'bg-gray-500', 
    icon: XCircle,
    progress: 100
  },
  cancelled: { 
    label: 'Storniert', 
    color: 'bg-gray-400', 
    icon: XCircle,
    progress: 0
  }
};

export function EscrowStatusCard({ 
  transaction, 
  userRole,
  onConfirmService,
  onOpenDispute,
  isLoading 
}: EscrowStatusCardProps) {
  const config = statusConfig[transaction.status] || statusConfig.pending;
  const StatusIcon = config.icon;

  const canConfirm = transaction.status === 'funded' && (
    (userRole === 'customer' && !transaction.customer_confirmed) ||
    (userRole === 'provider' && !transaction.provider_confirmed)
  );

  const canDispute = transaction.status === 'funded' && userRole === 'customer';

  return (
    <Card className="overflow-hidden">
      <div className={`h-2 ${config.color}`} />
      
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Treuhand-Zahlung
          </CardTitle>
          <Badge variant="outline" className="flex items-center gap-1">
            <StatusIcon className="h-3 w-3" />
            {config.label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progress Indicator */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Fortschritt</span>
            <span>{config.progress}%</span>
          </div>
          <Progress value={config.progress} className="h-2" />
        </div>

        {/* Amount Display */}
        <div className="bg-muted/50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Gesamtbetrag</p>
              <p className="text-2xl font-bold">
                CHF {transaction.total_amount.toLocaleString('de-CH', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <Banknote className="h-8 w-8 text-muted-foreground" />
          </div>
          
          {userRole === 'provider' && (
            <div className="mt-2 pt-2 border-t border-border">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Ihr Anteil (nach Gebühren)</span>
                <span className="font-medium">
                  CHF {transaction.provider_payout.toLocaleString('de-CH', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Service Details */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Service</span>
            <span>{transaction.service_type || 'Umzug'}</span>
          </div>
          {transaction.service_date && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Datum</span>
              <span>{new Date(transaction.service_date).toLocaleDateString('de-CH')}</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Erstellt</span>
            <span>{formatDistanceToNow(new Date(transaction.created_at), { addSuffix: true, locale: de })}</span>
          </div>
        </div>

        {/* Confirmation Status */}
        {transaction.status === 'funded' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 space-y-2">
            <p className="text-sm font-medium text-blue-800">Bestätigungsstatus</p>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                {transaction.customer_confirmed ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <Clock className="h-4 w-4 text-yellow-600" />
                )}
                <span className="text-sm">Kunde</span>
              </div>
              <div className="flex items-center gap-2">
                {transaction.provider_confirmed ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <Clock className="h-4 w-4 text-yellow-600" />
                )}
                <span className="text-sm">Anbieter</span>
              </div>
            </div>
            <p className="text-xs text-blue-600">
              Sobald beide Parteien bestätigen, wird die Zahlung freigegeben.
            </p>
          </div>
        )}

        {/* Action Buttons */}
        {(canConfirm || canDispute) && (
          <div className="flex gap-2 pt-2">
            {canConfirm && (
              <Button 
                onClick={onConfirmService} 
                disabled={isLoading}
                className="flex-1"
              >
                <FileCheck className="h-4 w-4 mr-2" />
                Service bestätigen
              </Button>
            )}
            {canDispute && (
              <Button 
                variant="outline" 
                onClick={onOpenDispute}
                disabled={isLoading}
                className="text-destructive border-destructive hover:bg-destructive/10"
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                Problem melden
              </Button>
            )}
          </div>
        )}

        {/* Completed State */}
        {transaction.status === 'released' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <div>
              <p className="text-sm font-medium text-green-800">Transaktion abgeschlossen</p>
              <p className="text-xs text-green-600">
                Die Zahlung wurde erfolgreich an den Anbieter überwiesen.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
