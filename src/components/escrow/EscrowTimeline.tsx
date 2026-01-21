import { EscrowEvent } from "@/lib/escrow-service";
import { 
  Shield, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Banknote,
  FileCheck,
  XCircle,
  MessageSquare
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { de } from "date-fns/locale";

interface EscrowTimelineProps {
  events: EscrowEvent[];
}

const eventConfig: Record<string, { 
  label: string; 
  icon: React.ElementType;
  color: string;
}> = {
  created: { 
    label: 'Transaktion erstellt', 
    icon: Shield,
    color: 'text-blue-500'
  },
  status_changed: { 
    label: 'Status geändert', 
    icon: Clock,
    color: 'text-yellow-500'
  },
  customer_confirmed: { 
    label: 'Kunde hat bestätigt', 
    icon: CheckCircle,
    color: 'text-green-500'
  },
  provider_confirmed: { 
    label: 'Anbieter hat bestätigt', 
    icon: FileCheck,
    color: 'text-green-500'
  },
  funded: { 
    label: 'Zahlung eingegangen', 
    icon: Banknote,
    color: 'text-emerald-500'
  },
  released: { 
    label: 'Zahlung freigegeben', 
    icon: CheckCircle,
    color: 'text-green-600'
  },
  disputed: { 
    label: 'Streitfall eröffnet', 
    icon: AlertTriangle,
    color: 'text-red-500'
  },
  resolved: { 
    label: 'Streitfall gelöst', 
    icon: MessageSquare,
    color: 'text-blue-500'
  },
  refunded: { 
    label: 'Rückerstattung durchgeführt', 
    icon: XCircle,
    color: 'text-gray-500'
  },
  cancelled: { 
    label: 'Storniert', 
    icon: XCircle,
    color: 'text-gray-400'
  }
};

function getStatusLabel(from: string, to: string): string {
  const labels: Record<string, string> = {
    pending: 'Ausstehend',
    funded: 'Bezahlt',
    released: 'Freigegeben',
    disputed: 'Im Streitfall',
    refunded: 'Erstattet',
    cancelled: 'Storniert'
  };
  return `${labels[from] || from} → ${labels[to] || to}`;
}

export function EscrowTimeline({ events }: EscrowTimelineProps) {
  if (!events.length) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p>Keine Ereignisse vorhanden</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />

      <div className="space-y-4">
        {events.map((event, index) => {
          const config = eventConfig[event.event_type] || {
            label: event.event_type,
            icon: Clock,
            color: 'text-muted-foreground'
          };
          const EventIcon = config.icon;
          const eventData = event.event_data as Record<string, unknown>;

          return (
            <div key={event.id} className="relative pl-10">
              {/* Icon */}
              <div className={`absolute left-0 p-2 rounded-full bg-background border-2 border-border ${config.color}`}>
                <EventIcon className="h-4 w-4" />
              </div>

              {/* Content */}
              <div className="bg-muted/30 rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm">{config.label}</span>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(event.created_at), { addSuffix: true, locale: de })}
                  </span>
                </div>

                {/* Event-specific details */}
                {event.event_type === 'created' && eventData.amount && (
                  <p className="text-xs text-muted-foreground">
                    Betrag: CHF {Number(eventData.amount).toLocaleString('de-CH', { minimumFractionDigits: 2 })}
                    {eventData.customer && ` • Kunde: ${eventData.customer}`}
                  </p>
                )}

                {event.event_type === 'status_changed' && eventData.from && eventData.to && (
                  <p className="text-xs text-muted-foreground">
                    {getStatusLabel(String(eventData.from), String(eventData.to))}
                  </p>
                )}

                {event.event_type === 'customer_confirmed' && eventData.confirmed_at && (
                  <p className="text-xs text-muted-foreground">
                    Der Kunde hat die Durchführung des Services bestätigt
                  </p>
                )}

                {event.event_type === 'provider_confirmed' && eventData.confirmed_at && (
                  <p className="text-xs text-muted-foreground">
                    Der Anbieter hat die Durchführung des Services bestätigt
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
