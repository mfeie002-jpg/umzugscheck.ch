/**
 * Bureaucracy Status Card Component
 * Displays the status of bureaucracy request and individual services
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Loader2,
  FileText,
  ExternalLink
} from 'lucide-react';
import { 
  BureaucracyService, 
  BureaucracyStatus,
  BUREAUCRACY_SERVICES,
  formatServiceStatus 
} from '@/lib/behoerden-api';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

interface BureaucracyStatusCardProps {
  status: BureaucracyStatus;
}

export function BureaucracyStatusCard({ status }: BureaucracyStatusCardProps) {
  const progressPercentage = (status.completedCount / status.totalCount) * 100;
  
  const getOverallStatusBadge = () => {
    switch (status.overallStatus) {
      case 'pending':
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Ausstehend</Badge>;
      case 'in_progress':
        return <Badge variant="default"><Loader2 className="h-3 w-3 mr-1 animate-spin" />In Bearbeitung</Badge>;
      case 'completed':
        return <Badge className="bg-emerald-500"><CheckCircle2 className="h-3 w-3 mr-1" />Abgeschlossen</Badge>;
      case 'partially_completed':
        return <Badge variant="destructive"><AlertCircle className="h-3 w-3 mr-1" />Teilweise abgeschlossen</Badge>;
    }
  };

  const getServiceIcon = (service: BureaucracyService) => {
    switch (service.status) {
      case 'completed':
        return <CheckCircle2 className="h-5 w-5 text-emerald-500" />;
      case 'processing':
        return <Loader2 className="h-5 w-5 text-primary animate-spin" />;
      case 'failed':
        return <AlertCircle className="h-5 w-5 text-destructive" />;
      default:
        return <Clock className="h-5 w-5 text-muted-foreground" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Bürokratie-Status</CardTitle>
              <p className="text-sm text-muted-foreground">
                Antrag #{status.requestId.slice(0, 8)}
              </p>
            </div>
          </div>
          {getOverallStatusBadge()}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Progress Overview */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>{status.completedCount} von {status.totalCount} erledigt</span>
            <span className="font-medium">{Math.round(progressPercentage)}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
          <p className="text-xs text-muted-foreground">
            Geschätzte Fertigstellung: {format(new Date(status.estimatedCompletionDate), 'dd. MMMM yyyy', { locale: de })}
          </p>
        </div>

        {/* Service List */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Services</h4>
          <div className="space-y-2">
            {status.services.map((service) => {
              const config = BUREAUCRACY_SERVICES[service.type as keyof typeof BUREAUCRACY_SERVICES];
              const statusInfo = formatServiceStatus(service.status);
              
              return (
                <div 
                  key={service.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                >
                  {getServiceIcon(service)}
                  
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">
                      {config?.name || service.type}
                    </div>
                    {service.referenceNumber && (
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        Ref: {service.referenceNumber}
                        <ExternalLink className="h-3 w-3" />
                      </div>
                    )}
                    {service.errorMessage && (
                      <div className="text-xs text-destructive">
                        {service.errorMessage}
                      </div>
                    )}
                  </div>
                  
                  <div className="text-right shrink-0">
                    <span className={`text-xs font-medium ${statusInfo.color}`}>
                      {statusInfo.icon} {statusInfo.label}
                    </span>
                    {service.completedAt && (
                      <div className="text-xs text-muted-foreground">
                        {format(new Date(service.completedAt), 'dd.MM.yyyy', { locale: de })}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Events */}
        {status.timeline.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-sm">Letzte Aktivitäten</h4>
            <div className="space-y-2">
              {status.timeline.slice(0, 5).map((event) => (
                <div 
                  key={event.id}
                  className="flex items-start gap-3 text-sm"
                >
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
                  <div className="flex-1">
                    <p>{event.message}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(event.timestamp), 'dd.MM.yyyy HH:mm', { locale: de })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default BureaucracyStatusCard;
