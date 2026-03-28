import { useState, useEffect } from "react";
import { Bell, Check, CheckCheck, Trash2, ExternalLink } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";
import { de } from "date-fns/locale";

interface Notification {
  id: string;
  type: 'new_lead' | 'review_submitted' | 'bid_update' | 'system';
  title: string;
  message: string;
  read: boolean;
  created_at: string;
  data?: any;
}

interface NotificationCenterProps {
  providerId: string;
}

export const NotificationCenter = ({ providerId }: NotificationCenterProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  useEffect(() => {
    fetchNotifications();
    
    // Subscribe to realtime notifications
    const channel = supabase
      .channel('provider-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'leads',
        },
        (payload) => {
          // Check if this lead is assigned to this provider
          const lead = payload.new as any;
          if (lead.assigned_provider_ids?.includes(providerId)) {
            const newNotification: Notification = {
              id: `lead-${lead.id}`,
              type: 'new_lead',
              title: 'Neue Anfrage erhalten',
              message: `Umzug von ${lead.from_city} nach ${lead.to_city}`,
              read: false,
              created_at: new Date().toISOString(),
              data: { leadId: lead.id }
            };
            setNotifications(prev => [newNotification, ...prev]);
            
            // Show browser notification
            showBrowserNotification(newNotification);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'reviews',
        },
        (payload) => {
          const review = payload.new as any;
          // You could add company_id check here
          const newNotification: Notification = {
            id: `review-${review.id}`,
            type: 'review_submitted',
            title: 'Neue Bewertung',
            message: `${review.rating}/5 Sterne - "${review.title}"`,
            read: false,
            created_at: new Date().toISOString(),
            data: { reviewId: review.id }
          };
          setNotifications(prev => [newNotification, ...prev]);
          showBrowserNotification(newNotification);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [providerId]);

  const fetchNotifications = async () => {
    try {
      // Fetch recent leads assigned to provider
      const { data: leads } = await supabase
        .from('leads')
        .select('id, from_city, to_city, created_at')
        .contains('assigned_provider_ids', [providerId])
        .order('created_at', { ascending: false })
        .limit(20);

      // Fetch recent reviews
      const { data: reviews } = await supabase
        .from('reviews')
        .select('id, title, rating, created_at, company_id')
        .order('created_at', { ascending: false })
        .limit(10);

      // Convert to notifications
      const leadNotifications: Notification[] = (leads || []).map(lead => ({
        id: `lead-${lead.id}`,
        type: 'new_lead' as const,
        title: 'Neue Anfrage',
        message: `Umzug von ${lead.from_city} nach ${lead.to_city}`,
        read: false, // Would track read status in DB
        created_at: lead.created_at,
        data: { leadId: lead.id }
      }));

      const reviewNotifications: Notification[] = (reviews || []).map(review => ({
        id: `review-${review.id}`,
        type: 'review_submitted' as const,
        title: 'Neue Bewertung',
        message: `${review.rating}/5 Sterne - "${review.title}"`,
        read: false,
        created_at: review.created_at,
        data: { reviewId: review.id }
      }));

      // Combine and sort by date
      const allNotifications = [...leadNotifications, ...reviewNotifications]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      setNotifications(allNotifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const showBrowserNotification = (notification: Notification) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico',
        tag: notification.id,
      });
    }
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        new Notification('Benachrichtigungen aktiviert', {
          body: 'Sie erhalten jetzt Push-Benachrichtigungen für neue Leads.',
          icon: '/favicon.ico',
        });
      }
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.read)
    : notifications;

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'new_lead':
        return '🚚';
      case 'review_submitted':
        return '⭐';
      case 'bid_update':
        return '💰';
      default:
        return '📢';
    }
  };

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'new_lead':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'review_submitted':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'bid_update':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/3" />
            <div className="h-20 bg-muted rounded" />
            <div className="h-20 bg-muted rounded" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with actions */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Bell className="h-6 w-6" />
                {unreadCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
                    {unreadCount}
                  </Badge>
                )}
              </div>
              <div>
                <CardTitle className="text-lg">Benachrichtigungen</CardTitle>
                <CardDescription>
                  {unreadCount > 0 ? `${unreadCount} ungelesen` : 'Alle gelesen'}
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {'Notification' in window && Notification.permission !== 'granted' && (
                <Button variant="outline" size="sm" onClick={requestNotificationPermission}>
                  <Bell className="h-4 w-4 mr-2" />
                  Push aktivieren
                </Button>
              )}
              {unreadCount > 0 && (
                <Button variant="outline" size="sm" onClick={markAllAsRead}>
                  <CheckCheck className="h-4 w-4 mr-2" />
                  Alle gelesen
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Notification Tabs */}
      <Tabs defaultValue="all" onValueChange={(v) => setFilter(v as 'all' | 'unread')}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="all">Alle ({notifications.length})</TabsTrigger>
          <TabsTrigger value="unread">Ungelesen ({unreadCount})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          <NotificationList 
            notifications={filteredNotifications}
            onMarkAsRead={markAsRead}
            onDelete={deleteNotification}
            getIcon={getNotificationIcon}
            getColor={getNotificationColor}
          />
        </TabsContent>
        <TabsContent value="unread" className="mt-4">
          <NotificationList 
            notifications={filteredNotifications}
            onMarkAsRead={markAsRead}
            onDelete={deleteNotification}
            getIcon={getNotificationIcon}
            getColor={getNotificationColor}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface NotificationListProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
  getIcon: (type: Notification['type']) => string;
  getColor: (type: Notification['type']) => string;
}

const NotificationList = ({ 
  notifications, 
  onMarkAsRead, 
  onDelete,
  getIcon,
  getColor 
}: NotificationListProps) => {
  if (notifications.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-muted-foreground">
          <Bell className="h-12 w-12 mx-auto mb-4 opacity-20" />
          <p>Keine Benachrichtigungen</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <ScrollArea className="h-[500px]">
      <div className="space-y-2">
        {notifications.map(notification => (
          <Card 
            key={notification.id}
            className={`transition-all ${!notification.read ? 'border-primary/50 bg-primary/5' : ''}`}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${getColor(notification.type)}`}>
                  <span className="text-lg">{getIcon(notification.type)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className={`font-medium text-sm ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {notification.title}
                    </h4>
                    {!notification.read && (
                      <Badge variant="secondary" className="text-xs">Neu</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {notification.message}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDistanceToNow(new Date(notification.created_at), { 
                      addSuffix: true, 
                      locale: de 
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  {!notification.read && (
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => onMarkAsRead(notification.id)}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  )}
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => onDelete(notification.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
};
