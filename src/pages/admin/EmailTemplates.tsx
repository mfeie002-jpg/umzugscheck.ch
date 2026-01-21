/**
 * Email Templates Preview Page
 * Preview and test all email templates with live variable injection
 */

import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Mail, Eye, Send, RefreshCw, Copy, CheckCircle2,
  User, Building, FileText, Bell
} from "lucide-react";
import { 
  EMAIL_TEMPLATES, 
  renderEmailTemplate,
  type EmailTemplate 
} from "@/lib/email-templates";
import { toast } from "sonner";

const templateCategories = {
  lead: {
    label: "Kunden",
    icon: User,
  },
  provider: {
    label: "Anbieter",
    icon: Building,
  },
  system: {
    label: "System",
    icon: Bell,
  },
  marketing: {
    label: "Marketing",
    icon: Mail,
  }
};

// Sample variables for each template
const sampleVariables: Record<string, Record<string, string>> = {
  'lead-welcome': {
    customer_name: "Max Mustermann",
    move_date: "15. März 2025",
    from_city: "Zürich",
    to_city: "Basel",
    estimated_price_min: "2'450",
    estimated_price_max: "3'200",
    offers_count: "5"
  },
  'lead-reminder': {
    customer_name: "Anna Schmidt",
    offers_received: "4",
    best_offer_price: "2'100",
    days_until_move: "14"
  },
  'lead-abandoned': {
    customer_name: "Peter Weber",
    from_city: "Bern",
    to_city: "Genf",
    resume_url: "https://umzugscheck.ch/resume/abc123"
  },
  'lead-tips': {
    customer_name: "Sarah Müller",
    days_until_move: "21"
  },
  'provider-new-lead': {
    provider_name: "Blitz Umzüge AG",
    from_city: "Zürich",
    to_city: "Basel",
    from_postal: "8001",
    to_postal: "4001",
    move_date: "15. März 2025",
    volume: "35",
    services: "Privatumzug, Verpackung",
    lead_id: "lead-123",
    estimated_value: "2'800"
  },
  'provider-reminder': {
    provider_name: "Swiss Moving GmbH",
    from_city: "Luzern",
    to_city: "Bern",
    hours_since_lead: "6",
    lead_id: "lead-456",
    competing_offers: "3"
  },
  'post-move-thank-you': {
    customer_name: "Maria Bernasconi",
    new_city: "St. Gallen",
    provider_name: "Express Transporte AG"
  },
  'post-move-review': {
    customer_name: "Tom Fischer",
    provider_name: "Züri-Umzug AG",
    review_url: "https://umzugscheck.ch/bewertung/xyz"
  },
  'referral-invite': {
    referrer_name: "Lisa Meier",
    referral_code: "LISA25",
    bonus_amount: "50",
    signup_url: "https://umzugscheck.ch/ref/LISA25"
  },
  'system-alert': {
    alert_type: "Kritischer Fehler",
    affected_service: "Lead-Matching",
    timestamp: "21.01.2025 14:32",
    alert_message: "Datenbank-Verbindung unterbrochen",
    action_url: "https://umzugscheck.ch/admin/monitoring"
  }
};

export default function EmailTemplates() {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(EMAIL_TEMPLATES[0]?.id || 'lead-welcome');
  const [variables, setVariables] = useState<Record<string, string>>(sampleVariables['lead-welcome'] || {});
  const [viewMode, setViewMode] = useState<'html' | 'text'>('html');
  const [copied, setCopied] = useState(false);

  const selectedTemplate = EMAIL_TEMPLATES.find(t => t.id === selectedTemplateId);
  
  const rendered = selectedTemplate 
    ? renderEmailTemplate(selectedTemplate, variables) 
    : { html: '', text: '', subject: '' };

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplateId(templateId);
    setVariables(sampleVariables[templateId] || {});
  };

  const handleVariableChange = (key: string, value: string) => {
    setVariables(prev => ({ ...prev, [key]: value }));
  };

  const handleCopyHtml = () => {
    navigator.clipboard.writeText(rendered.html);
    setCopied(true);
    toast.success("HTML kopiert!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendTest = () => {
    toast.info("Test-E-Mail wird gesendet...", {
      description: "In der Produktion würde eine echte E-Mail versendet werden."
    });
  };

  // Group templates by category
  const templatesByCategory = EMAIL_TEMPLATES.reduce((acc, template) => {
    if (!acc[template.category]) {
      acc[template.category] = [];
    }
    acc[template.category].push(template);
    return acc;
  }, {} as Record<string, EmailTemplate[]>);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Mail className="w-6 h-6 text-primary" />
              E-Mail Templates
            </h1>
            <p className="text-muted-foreground">
              Vorschau und Test aller automatisierten E-Mail-Vorlagen
            </p>
          </div>
          <Badge variant="outline" className="text-sm">
            {EMAIL_TEMPLATES.length} Templates
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Template Selection */}
          <Card className="p-4">
            <h2 className="font-semibold mb-4 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Templates auswählen
            </h2>
            
            <div className="space-y-4">
              {Object.entries(templateCategories).map(([key, category]) => {
                const templates = templatesByCategory[key] || [];
                if (templates.length === 0) return null;
                
                return (
                  <div key={key}>
                    <div className="flex items-center gap-2 mb-2 text-sm font-medium text-muted-foreground">
                      <category.icon className="w-4 h-4" />
                      {category.label}
                    </div>
                    <div className="space-y-1">
                      {templates.map(template => (
                        <button
                          key={template.id}
                          onClick={() => handleTemplateChange(template.id)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                            selectedTemplateId === template.id
                              ? 'bg-primary text-primary-foreground'
                              : 'hover:bg-muted'
                          }`}
                        >
                          {template.name}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Variables Editor */}
          <Card className="p-4">
            <h2 className="font-semibold mb-4 flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              Variablen bearbeiten
            </h2>
            
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-3">
                {Object.entries(variables).map(([key, value]) => (
                  <div key={key}>
                    <Label className="text-xs text-muted-foreground">
                      {`{{${key}}}`}
                    </Label>
                    <Input
                      value={value}
                      onChange={(e) => handleVariableChange(key, e.target.value)}
                      className="mt-1"
                    />
                  </div>
                ))}
              </div>
            </ScrollArea>
          </Card>

          {/* Preview */}
          <Card className="p-4 lg:col-span-1">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Vorschau
              </h2>
              <div className="flex gap-2">
                <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'html' | 'text')}>
                  <TabsList className="h-8">
                    <TabsTrigger value="html" className="text-xs">HTML</TabsTrigger>
                    <TabsTrigger value="text" className="text-xs">Text</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>

            {/* Subject */}
            <div className="mb-4 p-3 bg-muted rounded-lg">
              <span className="text-xs text-muted-foreground">Betreff:</span>
              <p className="font-medium">{rendered.subject}</p>
            </div>

            {/* Body Preview */}
            <ScrollArea className="h-[300px] border rounded-lg">
              {viewMode === 'html' ? (
                <div 
                  className="p-4"
                  dangerouslySetInnerHTML={{ __html: rendered.html }}
                />
              ) : (
                <pre className="p-4 text-sm whitespace-pre-wrap font-mono">
                  {rendered.text}
                </pre>
              )}
            </ScrollArea>

            {/* Actions */}
            <div className="flex gap-2 mt-4">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={handleCopyHtml}
              >
                {copied ? <CheckCircle2 className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
                {copied ? 'Kopiert!' : 'HTML kopieren'}
              </Button>
              <Button 
                className="flex-1"
                onClick={handleSendTest}
              >
                <Send className="w-4 h-4 mr-1" />
                Test senden
              </Button>
            </div>
          </Card>
        </div>

        {/* Template Info */}
        {selectedTemplate && (
          <Card className="p-4">
            <div className="flex items-center gap-4">
              <Bell className="w-8 h-8 text-primary/60" />
              <div>
                <h3 className="font-semibold">{selectedTemplate.name}</h3>
                <p className="text-sm text-muted-foreground">
                  Kategorie: <code className="bg-muted px-1 rounded">{selectedTemplate.category}</code>
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}
