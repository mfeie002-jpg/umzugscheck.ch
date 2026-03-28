import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Bell, Mail, MessageSquare, Volume2, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface NotificationPreference {
  emailNewLeads: boolean;
  emailNewReviews: boolean;
  emailDigest: boolean;
  digestFrequency: 'daily' | 'weekly';
  pushNewLeads: boolean;
  pushNewReviews: boolean;
  pushMessages: boolean;
  soundEnabled: boolean;
  quietHoursEnabled: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
}

const defaultPreferences: NotificationPreference = {
  emailNewLeads: true,
  emailNewReviews: true,
  emailDigest: true,
  digestFrequency: 'daily',
  pushNewLeads: true,
  pushNewReviews: true,
  pushMessages: true,
  soundEnabled: true,
  quietHoursEnabled: false,
  quietHoursStart: '22:00',
  quietHoursEnd: '08:00',
};

export const NotificationPreferences = () => {
  const { toast } = useToast();
  const [preferences, setPreferences] = useState<NotificationPreference>(defaultPreferences);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('notificationPreferences');
    if (saved) {
      setPreferences(JSON.parse(saved));
    }
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    localStorage.setItem('notificationPreferences', JSON.stringify(preferences));
    
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: 'Einstellungen gespeichert',
        description: 'Ihre Benachrichtigungseinstellungen wurden aktualisiert.',
      });
    }, 500);
  };

  const updatePreference = <K extends keyof NotificationPreference>(
    key: K,
    value: NotificationPreference[K]
  ) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            E-Mail Benachrichtigungen
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="emailNewLeads">Neue Leads per E-Mail</Label>
            <Switch
              id="emailNewLeads"
              checked={preferences.emailNewLeads}
              onCheckedChange={(checked) => updatePreference('emailNewLeads', checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="emailNewReviews">Neue Bewertungen per E-Mail</Label>
            <Switch
              id="emailNewReviews"
              checked={preferences.emailNewReviews}
              onCheckedChange={(checked) => updatePreference('emailNewReviews', checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="emailDigest">E-Mail Zusammenfassung</Label>
            <Switch
              id="emailDigest"
              checked={preferences.emailDigest}
              onCheckedChange={(checked) => updatePreference('emailDigest', checked)}
            />
          </div>
          {preferences.emailDigest && (
            <div className="flex items-center justify-between pl-4">
              <Label>Häufigkeit</Label>
              <Select
                value={preferences.digestFrequency}
                onValueChange={(value: 'daily' | 'weekly') => updatePreference('digestFrequency', value)}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Täglich</SelectItem>
                  <SelectItem value="weekly">Wöchentlich</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Push-Benachrichtigungen
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="pushNewLeads">Neue Leads</Label>
            <Switch
              id="pushNewLeads"
              checked={preferences.pushNewLeads}
              onCheckedChange={(checked) => updatePreference('pushNewLeads', checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="pushNewReviews">Neue Bewertungen</Label>
            <Switch
              id="pushNewReviews"
              checked={preferences.pushNewReviews}
              onCheckedChange={(checked) => updatePreference('pushNewReviews', checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="pushMessages">Nachrichten</Label>
            <Switch
              id="pushMessages"
              checked={preferences.pushMessages}
              onCheckedChange={(checked) => updatePreference('pushMessages', checked)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Volume2 className="h-5 w-5" />
            Sound & Ruhezeiten
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="soundEnabled">Benachrichtigungston</Label>
            <Switch
              id="soundEnabled"
              checked={preferences.soundEnabled}
              onCheckedChange={(checked) => updatePreference('soundEnabled', checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="quietHoursEnabled">Ruhezeiten aktivieren</Label>
            <Switch
              id="quietHoursEnabled"
              checked={preferences.quietHoursEnabled}
              onCheckedChange={(checked) => updatePreference('quietHoursEnabled', checked)}
            />
          </div>
          {preferences.quietHoursEnabled && (
            <div className="flex items-center gap-4 pl-4">
              <div className="flex items-center gap-2">
                <Label>Von</Label>
                <input
                  type="time"
                  value={preferences.quietHoursStart}
                  onChange={(e) => updatePreference('quietHoursStart', e.target.value)}
                  className="px-2 py-1 border rounded"
                />
              </div>
              <div className="flex items-center gap-2">
                <Label>Bis</Label>
                <input
                  type="time"
                  value={preferences.quietHoursEnd}
                  onChange={(e) => updatePreference('quietHoursEnd', e.target.value)}
                  className="px-2 py-1 border rounded"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Button onClick={handleSave} disabled={isSaving} className="w-full">
        {isSaving ? 'Speichern...' : 'Einstellungen speichern'}
      </Button>
    </div>
  );
};
