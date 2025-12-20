import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Mail, MessageSquare, Clock, CheckCircle2, 
  Send, Calendar, Star, Bell, Zap
} from "lucide-react";

interface AutomationStep {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  timing: string;
  status: 'pending' | 'sent' | 'scheduled';
  sentAt?: string;
}

interface PostSubmitAutomationProps {
  leadId?: string;
  email?: string;
  name?: string;
}

export const PostSubmitAutomation = ({ leadId, email, name }: PostSubmitAutomationProps) => {
  const [automationSteps, setAutomationSteps] = useState<AutomationStep[]>([
    {
      id: 'confirmation',
      name: 'Bestätigungs-E-Mail',
      description: 'Zusammenfassung der Anfrage mit allen Details',
      icon: Mail,
      timing: 'Sofort',
      status: 'sent',
      sentAt: new Date().toISOString(),
    },
    {
      id: 'checklist',
      name: 'Umzugs-Checkliste',
      description: 'Personalisierte Checkliste zum Vorbereiten',
      icon: CheckCircle2,
      timing: 'Nach 1 Stunde',
      status: 'scheduled',
    },
    {
      id: 'reminder_24h',
      name: 'Erinnerung: Offerten prüfen',
      description: 'Falls noch keine Firma kontaktiert wurde',
      icon: Bell,
      timing: 'Nach 24 Stunden',
      status: 'pending',
    },
    {
      id: 'reminder_48h',
      name: 'Zweite Erinnerung',
      description: 'Sanfte Erinnerung mit zusätzlichen Tipps',
      icon: Clock,
      timing: 'Nach 48 Stunden',
      status: 'pending',
    },
    {
      id: 'review_request',
      name: 'Bewertungsanfrage',
      description: 'Nach erfolgreichem Umzug um Bewertung bitten',
      icon: Star,
      timing: 'Nach Umzugsdatum',
      status: 'pending',
    },
  ]);

  const completedSteps = automationSteps.filter(s => s.status === 'sent').length;
  const progress = (completedSteps / automationSteps.length) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          Automatische Kommunikation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-muted-foreground">
            {completedSteps} von {automationSteps.length} E-Mails gesendet
          </span>
          <Progress value={progress} className="w-32 h-2" />
        </div>

        <div className="space-y-4">
          {automationSteps.map((step, index) => (
            <div 
              key={step.id}
              className={`flex items-start gap-4 p-4 rounded-lg border ${
                step.status === 'sent' ? 'bg-green-50/50 border-green-200 dark:bg-green-950/20' :
                step.status === 'scheduled' ? 'bg-blue-50/50 border-blue-200 dark:bg-blue-950/20' :
                'bg-muted/30'
              }`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                step.status === 'sent' ? 'bg-green-100 text-green-600' :
                step.status === 'scheduled' ? 'bg-blue-100 text-blue-600' :
                'bg-muted text-muted-foreground'
              }`}>
                <step.icon className="h-5 w-5" />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium">{step.name}</span>
                  <Badge variant={
                    step.status === 'sent' ? 'default' :
                    step.status === 'scheduled' ? 'secondary' :
                    'outline'
                  } className="text-xs">
                    {step.status === 'sent' ? 'Gesendet' :
                     step.status === 'scheduled' ? 'Geplant' : 
                     'Ausstehend'}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{step.description}</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {step.timing}
                  </span>
                  {step.sentAt && (
                    <span className="flex items-center gap-1">
                      <Send className="h-3 w-3" />
                      {new Date(step.sentAt).toLocaleString('de-CH')}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t">
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            E-Mail-Vorschau: Bestätigung
          </h4>
          <div className="bg-muted/50 rounded-lg p-4 text-sm space-y-2">
            <p><strong>Betreff:</strong> Ihre Umzugsanfrage bei Umzugscheck.ch</p>
            <p><strong>An:</strong> {email || 'kunde@beispiel.ch'}</p>
            <hr className="my-3" />
            <p>Guten Tag {name || 'Max'},</p>
            <p>Vielen Dank für Ihre Anfrage! Wir haben Ihre Umzugsdetails erhalten und arbeiten daran, die besten Angebote für Sie zu finden.</p>
            <p><strong>Was passiert als Nächstes?</strong></p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Sie erhalten innerhalb von 24-48 Stunden bis zu 5 Offerten</li>
              <li>Vergleichen Sie Preise, Bewertungen und Services</li>
              <li>Wählen Sie die beste Firma für Ihren Umzug</li>
            </ul>
            <p>Bei Fragen stehen wir Ihnen jederzeit zur Verfügung.</p>
            <p>Freundliche Grüsse,<br />Ihr Umzugscheck.ch Team</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PostSubmitAutomation;
