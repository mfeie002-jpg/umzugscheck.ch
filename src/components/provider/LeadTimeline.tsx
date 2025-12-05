import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Eye, 
  MessageSquare, 
  Send, 
  CheckCircle, 
  XCircle,
  Clock,
  DollarSign,
  Star
} from 'lucide-react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

interface TimelineEvent {
  id: string;
  type: 'created' | 'viewed' | 'contacted' | 'quoted' | 'converted' | 'lost' | 'reviewed';
  timestamp: Date;
  description: string;
  metadata?: Record<string, any>;
}

interface LeadTimelineProps {
  leadId: string;
  events?: TimelineEvent[];
}

const defaultEvents: TimelineEvent[] = [
  {
    id: '1',
    type: 'created',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
    description: 'Lead erstellt',
    metadata: { source: 'Umzugsrechner' },
  },
  {
    id: '2',
    type: 'viewed',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6),
    description: 'Lead angesehen',
  },
  {
    id: '3',
    type: 'contacted',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
    description: 'Kunde kontaktiert',
    metadata: { method: 'E-Mail' },
  },
  {
    id: '4',
    type: 'quoted',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4),
    description: 'Angebot gesendet',
    metadata: { price: 1450 },
  },
  {
    id: '5',
    type: 'converted',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    description: 'Auftrag bestätigt',
    metadata: { finalPrice: 1450 },
  },
  {
    id: '6',
    type: 'reviewed',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12),
    description: 'Bewertung erhalten',
    metadata: { rating: 5 },
  },
];

const eventConfig: Record<string, { icon: typeof FileText; color: string; bgColor: string }> = {
  created: { icon: FileText, color: 'text-blue-600', bgColor: 'bg-blue-100' },
  viewed: { icon: Eye, color: 'text-gray-600', bgColor: 'bg-gray-100' },
  contacted: { icon: MessageSquare, color: 'text-purple-600', bgColor: 'bg-purple-100' },
  quoted: { icon: Send, color: 'text-orange-600', bgColor: 'bg-orange-100' },
  converted: { icon: CheckCircle, color: 'text-green-600', bgColor: 'bg-green-100' },
  lost: { icon: XCircle, color: 'text-red-600', bgColor: 'bg-red-100' },
  reviewed: { icon: Star, color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
};

export const LeadTimeline = ({ leadId, events = defaultEvents }: LeadTimelineProps) => {
  const sortedEvents = [...events].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  const getTimeDiff = (date: Date): string => {
    const diff = Date.now() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `vor ${minutes} Min.`;
    if (hours < 24) return `vor ${hours} Std.`;
    return `vor ${days} Tagen`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Lead-Verlauf
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-border" />

          <div className="space-y-6">
            {sortedEvents.map((event, index) => {
              const config = eventConfig[event.type];
              const Icon = config.icon;

              return (
                <div key={event.id} className="relative flex gap-4">
                  {/* Icon */}
                  <div className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full ${config.bgColor}`}>
                    <Icon className={`h-5 w-5 ${config.color}`} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 pt-1.5">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{event.description}</p>
                      <span className="text-sm text-muted-foreground">
                        {getTimeDiff(event.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {format(event.timestamp, 'dd. MMMM yyyy, HH:mm', { locale: de })}
                    </p>

                    {/* Metadata badges */}
                    {event.metadata && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {event.metadata.source && (
                          <Badge variant="secondary">Quelle: {event.metadata.source}</Badge>
                        )}
                        {event.metadata.method && (
                          <Badge variant="secondary">Via {event.metadata.method}</Badge>
                        )}
                        {event.metadata.price && (
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <DollarSign className="h-3 w-3" />
                            {event.metadata.price} CHF
                          </Badge>
                        )}
                        {event.metadata.finalPrice && (
                          <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
                            <CheckCircle className="h-3 w-3" />
                            {event.metadata.finalPrice} CHF
                          </Badge>
                        )}
                        {event.metadata.rating && (
                          <Badge className="bg-yellow-100 text-yellow-800 flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-500" />
                            {event.metadata.rating}/5
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
