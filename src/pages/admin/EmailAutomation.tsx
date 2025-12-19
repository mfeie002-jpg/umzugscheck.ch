import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { Mail, Clock, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { AdminLayout } from "@/components/admin/AdminLayout";

export default function EmailAutomation() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [pendingEmails, setPendingEmails] = useState<any[]>([]);
  const [sentEmails, setSentEmails] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch campaigns
      const { data: campaignsData } = await supabase
        .from('email_campaigns')
        .select('*')
        .order('created_at', { ascending: false });

      setCampaigns(campaignsData || []);

      // Fetch pending emails
      const { data: pendingData } = await supabase
        .from('email_queue')
        .select('*')
        .eq('status', 'pending')
        .order('scheduled_for', { ascending: true })
        .limit(50);

      setPendingEmails(pendingData || []);

      // Fetch recently sent emails
      const { data: sentData } = await supabase
        .from('email_queue')
        .select('*')
        .in('status', ['sent', 'failed'])
        .order('sent_at', { ascending: false })
        .limit(50);

      setSentEmails(sentData || []);

    } catch (error) {
      console.error('Error fetching email data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCampaignTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      welcome: 'bg-blue-100 text-blue-700',
      reminder: 'bg-yellow-100 text-yellow-700',
      follow_up: 'bg-green-100 text-green-700',
      review_request: 'bg-purple-100 text-purple-700'
    };
    return colors[type] || 'bg-gray-100 text-gray-700';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Email Automation</h1>
        <p className="text-muted-foreground">
          Verwalte automatisierte Email-Kampagnen und -Warteschlangen
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Aktive Kampagnen</p>
                <h3 className="text-2xl font-bold mt-2">
                  {campaigns.filter(c => c.is_active).length}
                </h3>
              </div>
              <Mail className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">In Warteschlange</p>
                <h3 className="text-2xl font-bold mt-2">{pendingEmails.length}</h3>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Gesendet (heute)</p>
                <h3 className="text-2xl font-bold mt-2">
                  {sentEmails.filter(e => 
                    e.sent_at && 
                    new Date(e.sent_at).toDateString() === new Date().toDateString()
                  ).length}
                </h3>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Fehlgeschlagen</p>
                <h3 className="text-2xl font-bold mt-2">
                  {sentEmails.filter(e => e.status === 'failed').length}
                </h3>
              </div>
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="campaigns" className="space-y-6">
        <TabsList>
          <TabsTrigger value="campaigns">Kampagnen</TabsTrigger>
          <TabsTrigger value="pending">Warteschlange</TabsTrigger>
          <TabsTrigger value="sent">Gesendet</TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Email Kampagnen</CardTitle>
                <Button>
                  <Mail className="mr-2 h-4 w-4" />
                  Neue Kampagne
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {campaigns.map((campaign) => (
                  <Card key={campaign.id} className="border">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-bold">{campaign.name}</h3>
                            <Badge className={getCampaignTypeColor(campaign.campaign_type)}>
                              {campaign.campaign_type}
                            </Badge>
                            {campaign.is_active ? (
                              <Badge className="bg-success text-success-foreground">Aktiv</Badge>
                            ) : (
                              <Badge variant="secondary">Inaktiv</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">
                            {campaign.subject}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>Trigger: {campaign.trigger_event}</span>
                            <span>•</span>
                            <span>Verzögerung: {campaign.trigger_delay_hours}h</span>
                            <span>•</span>
                            <span>Gesendet: {campaign.sent_count || 0}×</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Email Warteschlange</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pendingEmails.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    Keine ausstehenden Emails
                  </p>
                ) : (
                  pendingEmails.map((email) => (
                    <div key={email.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium">{email.recipient_email}</p>
                        <p className="text-sm text-muted-foreground">
                          {email.recipient_name}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            {format(new Date(email.scheduled_for), 'dd.MM.yyyy HH:mm', { locale: de })}
                          </p>
                          <p className="text-xs text-muted-foreground">Geplant</p>
                        </div>
                        <Clock className="h-5 w-5 text-yellow-500" />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gesendete Emails</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {sentEmails.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    Noch keine Emails gesendet
                  </p>
                ) : (
                  sentEmails.map((email) => (
                    <div key={email.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium">{email.recipient_email}</p>
                        <p className="text-sm text-muted-foreground">
                          {email.recipient_name}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        {email.status === 'sent' ? (
                          <>
                            <div className="text-right">
                              <p className="text-sm font-medium">
                                {email.sent_at ? format(new Date(email.sent_at), 'dd.MM.yyyy HH:mm', { locale: de }) : '-'}
                              </p>
                              <p className="text-xs text-muted-foreground">Gesendet</p>
                            </div>
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          </>
                        ) : (
                          <>
                            <div className="text-right">
                              <p className="text-sm font-medium text-red-500">Fehler</p>
                              <p className="text-xs text-muted-foreground">
                                {email.error_message || 'Unbekannter Fehler'}
                              </p>
                            </div>
                            <XCircle className="h-5 w-5 text-red-500" />
                          </>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
