import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Mail, Plus, Edit, Trash2, Eye, Send, Copy, Settings } from 'lucide-react';
import { toast } from 'sonner';

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  trigger: string;
  isActive: boolean;
  category: 'lead' | 'provider' | 'notification' | 'marketing';
  variables: string[];
}

const defaultTemplates: EmailTemplate[] = [
  {
    id: '1',
    name: 'Neue Lead-Benachrichtigung',
    subject: 'Neue Umzugsanfrage von {{customer_name}}',
    body: `Sehr geehrte/r {{provider_name}},

Sie haben eine neue Umzugsanfrage erhalten:

Kunde: {{customer_name}}
E-Mail: {{customer_email}}
Von: {{from_city}} ({{from_postal}})
Nach: {{to_city}} ({{to_postal}})
Umzugsdatum: {{move_date}}
Geschätzter Preis: {{estimated_price}}

Bitte kontaktieren Sie den Kunden zeitnah.

Mit freundlichen Grüßen,
Ihr Umzugscheck.ch Team`,
    trigger: 'new_lead',
    isActive: true,
    category: 'lead',
    variables: ['provider_name', 'customer_name', 'customer_email', 'from_city', 'from_postal', 'to_city', 'to_postal', 'move_date', 'estimated_price']
  },
  {
    id: '2',
    name: 'Willkommens-E-Mail Provider',
    subject: 'Willkommen bei Umzugscheck.ch, {{company_name}}!',
    body: `Sehr geehrte/r {{contact_name}},

Herzlich willkommen bei Umzugscheck.ch!

Ihr Firmenprofil für {{company_name}} wurde erfolgreich erstellt. Unser Team wird Ihr Profil in Kürze prüfen und freischalten.

Was Sie als nächstes tun können:
1. Vervollständigen Sie Ihr Firmenprofil
2. Laden Sie Ihr Logo hoch
3. Fügen Sie Ihre Dienstleistungen hinzu

Bei Fragen stehen wir Ihnen gerne zur Verfügung.

Mit freundlichen Grüßen,
Ihr Umzugscheck.ch Team`,
    trigger: 'provider_signup',
    isActive: true,
    category: 'provider',
    variables: ['company_name', 'contact_name']
  },
  {
    id: '3',
    name: 'Lead-Bestätigung Kunde',
    subject: 'Ihre Umzugsanfrage wurde übermittelt',
    body: `Sehr geehrte/r {{customer_name}},

Vielen Dank für Ihre Anfrage über Umzugscheck.ch!

Ihre Anfrage wurde an {{provider_count}} ausgewählte Umzugsfirmen weitergeleitet. Sie werden in Kürze Angebote erhalten.

Ihre Umzugsdetails:
Von: {{from_address}}
Nach: {{to_address}}
Umzugsdatum: {{move_date}}
Geschätzter Preis: {{price_range}}

Bei Fragen können Sie uns jederzeit kontaktieren.

Mit freundlichen Grüßen,
Ihr Umzugscheck.ch Team`,
    trigger: 'lead_confirmation',
    isActive: true,
    category: 'lead',
    variables: ['customer_name', 'provider_count', 'from_address', 'to_address', 'move_date', 'price_range']
  },
  {
    id: '4',
    name: 'Provider Verifiziert',
    subject: 'Ihr Profil wurde freigeschaltet!',
    body: `Sehr geehrte/r {{contact_name}},

Gute Neuigkeiten! Ihr Firmenprofil für {{company_name}} wurde geprüft und freigeschaltet.

Sie können ab sofort:
✓ Leads empfangen
✓ Auf Anfragen antworten
✓ Im Marktplatz bieten

Loggen Sie sich jetzt ein und starten Sie durch!

Mit freundlichen Grüßen,
Ihr Umzugscheck.ch Team`,
    trigger: 'provider_verified',
    isActive: true,
    category: 'provider',
    variables: ['contact_name', 'company_name']
  }
];

export const EmailTemplateEditor = () => {
  const [templates, setTemplates] = useState<EmailTemplate[]>(defaultTemplates);
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<EmailTemplate | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const triggerOptions = [
    { value: 'new_lead', label: 'Neuer Lead' },
    { value: 'lead_confirmation', label: 'Lead-Bestätigung' },
    { value: 'provider_signup', label: 'Provider Registrierung' },
    { value: 'provider_verified', label: 'Provider Verifiziert' },
    { value: 'provider_rejected', label: 'Provider Abgelehnt' },
    { value: 'lead_reminder', label: 'Lead-Erinnerung' },
    { value: 'review_request', label: 'Bewertungsanfrage' },
    { value: 'payment_received', label: 'Zahlung eingegangen' },
    { value: 'subscription_expiring', label: 'Abo läuft ab' },
  ];

  const handleSaveTemplate = () => {
    if (!editingTemplate) return;

    if (editingTemplate.id) {
      setTemplates(prev => prev.map(t => t.id === editingTemplate.id ? editingTemplate : t));
      toast.success('Template aktualisiert');
    } else {
      setTemplates(prev => [...prev, { ...editingTemplate, id: Date.now().toString() }]);
      toast.success('Template erstellt');
    }
    setIsDialogOpen(false);
    setEditingTemplate(null);
  };

  const handleDeleteTemplate = (id: string) => {
    setTemplates(prev => prev.filter(t => t.id !== id));
    toast.success('Template gelöscht');
  };

  const toggleTemplateActive = (id: string) => {
    setTemplates(prev => prev.map(t => 
      t.id === id ? { ...t, isActive: !t.isActive } : t
    ));
  };

  const filteredTemplates = activeCategory === 'all' 
    ? templates 
    : templates.filter(t => t.category === activeCategory);

  const renderPreview = (template: EmailTemplate) => {
    let body = template.body;
    template.variables.forEach(v => {
      body = body.replace(new RegExp(`{{${v}}}`, 'g'), `[${v}]`);
    });
    return body;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              E-Mail Templates
            </CardTitle>
            <CardDescription>Verwalten Sie automatische E-Mail-Benachrichtigungen</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingTemplate({
                id: '',
                name: '',
                subject: '',
                body: '',
                trigger: 'new_lead',
                isActive: true,
                category: 'lead',
                variables: []
              })}>
                <Plus className="h-4 w-4 mr-2" />
                Neues Template
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingTemplate?.id ? 'Template bearbeiten' : 'Neues Template'}</DialogTitle>
                <DialogDescription>Erstellen oder bearbeiten Sie E-Mail-Templates</DialogDescription>
              </DialogHeader>
              {editingTemplate && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Template Name</Label>
                      <Input 
                        value={editingTemplate.name}
                        onChange={e => setEditingTemplate({...editingTemplate, name: e.target.value})}
                        placeholder="z.B. Neue Lead-Benachrichtigung"
                      />
                    </div>
                    <div>
                      <Label>Kategorie</Label>
                      <Select 
                        value={editingTemplate.category}
                        onValueChange={v => setEditingTemplate({...editingTemplate, category: v as any})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="lead">Lead</SelectItem>
                          <SelectItem value="provider">Provider</SelectItem>
                          <SelectItem value="notification">Benachrichtigung</SelectItem>
                          <SelectItem value="marketing">Marketing</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label>Auslöser</Label>
                    <Select 
                      value={editingTemplate.trigger}
                      onValueChange={v => setEditingTemplate({...editingTemplate, trigger: v})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {triggerOptions.map(opt => (
                          <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Betreff</Label>
                    <Input 
                      value={editingTemplate.subject}
                      onChange={e => setEditingTemplate({...editingTemplate, subject: e.target.value})}
                      placeholder="E-Mail Betreff"
                    />
                  </div>

                  <div>
                    <Label>Inhalt</Label>
                    <Textarea 
                      value={editingTemplate.body}
                      onChange={e => setEditingTemplate({...editingTemplate, body: e.target.value})}
                      placeholder="E-Mail Inhalt..."
                      rows={12}
                      className="font-mono text-sm"
                    />
                  </div>

                  <div className="bg-muted p-3 rounded-lg">
                    <p className="text-sm font-medium mb-2">Verfügbare Variablen:</p>
                    <div className="flex flex-wrap gap-2">
                      {['customer_name', 'customer_email', 'provider_name', 'company_name', 'contact_name', 'from_city', 'to_city', 'move_date', 'price_range', 'estimated_price'].map(v => (
                        <Badge 
                          key={v} 
                          variant="outline" 
                          className="cursor-pointer hover:bg-primary/10"
                          onClick={() => {
                            const textarea = document.querySelector('textarea');
                            if (textarea) {
                              const start = textarea.selectionStart;
                              const end = textarea.selectionEnd;
                              const text = editingTemplate.body;
                              const newText = text.substring(0, start) + `{{${v}}}` + text.substring(end);
                              setEditingTemplate({...editingTemplate, body: newText});
                            }
                          }}
                        >
                          {`{{${v}}}`}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Abbrechen
                    </Button>
                    <Button onClick={handleSaveTemplate}>
                      Speichern
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeCategory} onValueChange={setActiveCategory}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">Alle</TabsTrigger>
            <TabsTrigger value="lead">Lead</TabsTrigger>
            <TabsTrigger value="provider">Provider</TabsTrigger>
            <TabsTrigger value="notification">Benachrichtigungen</TabsTrigger>
            <TabsTrigger value="marketing">Marketing</TabsTrigger>
          </TabsList>

          <div className="space-y-3">
            {filteredTemplates.map(template => (
              <div 
                key={template.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <Switch 
                    checked={template.isActive}
                    onCheckedChange={() => toggleTemplateActive(template.id)}
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{template.name}</span>
                      <Badge variant={template.isActive ? 'default' : 'secondary'}>
                        {template.isActive ? 'Aktiv' : 'Inaktiv'}
                      </Badge>
                      <Badge variant="outline">{template.category}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Auslöser: {triggerOptions.find(t => t.value === template.trigger)?.label}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      setPreviewTemplate(template);
                      setPreviewOpen(true);
                    }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      setEditingTemplate(template);
                      setIsDialogOpen(true);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleDeleteTemplate(template.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Tabs>

        {/* Preview Dialog */}
        <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>E-Mail Vorschau</DialogTitle>
              <DialogDescription>{previewTemplate?.name}</DialogDescription>
            </DialogHeader>
            {previewTemplate && (
              <div className="space-y-4">
                <div className="p-4 border rounded-lg bg-muted/30">
                  <p className="text-sm text-muted-foreground mb-1">Betreff:</p>
                  <p className="font-medium">{previewTemplate.subject}</p>
                </div>
                <div className="p-4 border rounded-lg bg-white">
                  <pre className="whitespace-pre-wrap text-sm font-sans">
                    {renderPreview(previewTemplate)}
                  </pre>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setPreviewOpen(false)}>
                    Schließen
                  </Button>
                  <Button>
                    <Send className="h-4 w-4 mr-2" />
                    Test senden
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};
