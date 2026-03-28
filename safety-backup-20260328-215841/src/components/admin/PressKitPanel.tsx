import { memo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileText, Image, Download, Mail, Phone, Linkedin,
  Copy, ExternalLink, Check, Newspaper, Building2,
  MessageSquare, ChevronDown, ChevronUp, Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { cn } from '@/lib/utils';
import {
  COMPANY_BOILERPLATE,
  COMPANY_FACTS,
  KEY_DIFFERENTIATORS,
  PRESS_RELEASES,
  MEDIA_ASSETS,
  PRESS_CONTACTS,
  MEDIA_TARGETS,
  KEY_MESSAGES,
} from '@/lib/press-kit';
import { toast } from 'sonner';

const STATUS_COLORS = {
  ready: 'bg-success/10 text-success border-success/20',
  draft: 'bg-warning/10 text-warning border-warning/20',
  published: 'bg-primary/10 text-primary border-primary/20',
  confirmed: 'bg-success/10 text-success',
  pitched: 'bg-warning/10 text-warning',
  pending: 'bg-muted text-muted-foreground',
};

export const PressKitPanel = memo(function PressKitPanel() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success('In Zwischenablage kopiert!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Newspaper className="w-6 h-6 text-primary" />
            Press Kit & PR
          </h2>
          <p className="text-muted-foreground">
            Medienressourcen und Pressematerialien
          </p>
        </div>
        <Button className="gap-2">
          <Download className="w-4 h-4" />
          Komplettes Press Kit (ZIP)
        </Button>
      </div>

      {/* Quick Facts */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="font-semibold mb-4">Fakten auf einen Blick</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {COMPANY_FACTS.map((fact, idx) => (
            <motion.div
              key={fact.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="text-center p-3 rounded-lg bg-muted/50"
            >
              <div className="text-2xl mb-1">{fact.icon}</div>
              <div className="font-bold text-lg">{fact.value}</div>
              <div className="text-xs text-muted-foreground">{fact.label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      <Tabs defaultValue="releases" className="space-y-4">
        <TabsList>
          <TabsTrigger value="releases">Pressemitteilungen</TabsTrigger>
          <TabsTrigger value="assets">Medien-Assets</TabsTrigger>
          <TabsTrigger value="boilerplate">Über Uns</TabsTrigger>
          <TabsTrigger value="contact">Kontakt</TabsTrigger>
        </TabsList>

        {/* Press Releases */}
        <TabsContent value="releases" className="space-y-4">
          {PRESS_RELEASES.map((release, idx) => (
            <motion.div
              key={release.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-card border border-border rounded-xl p-6"
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={cn(STATUS_COLORS[release.status])}>
                      {release.status === 'ready' ? 'Bereit' : 
                       release.status === 'draft' ? 'Entwurf' : 'Veröffentlicht'}
                    </Badge>
                    <Badge variant="outline">{release.category}</Badge>
                  </div>
                  <h3 className="text-lg font-bold">{release.title}</h3>
                  <p className="text-muted-foreground">{release.subtitle}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(release.content, release.id)}
                  >
                    {copiedId === release.id ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <Accordion type="single" collapsible>
                <AccordionItem value="content" className="border-none">
                  <AccordionTrigger className="text-sm py-2">
                    Vollständiger Text anzeigen
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="prose prose-sm max-w-none mt-2 p-4 bg-muted/50 rounded-lg">
                      <pre className="whitespace-pre-wrap text-sm font-sans">
                        {release.content}
                      </pre>
                      <hr className="my-4" />
                      <p className="text-muted-foreground italic">
                        {release.boilerplate}
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </motion.div>
          ))}

          {/* Key Messages */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="font-semibold mb-4">Key Messages für Interviews</h3>
            <div className="space-y-3">
              {KEY_MESSAGES.map((msg, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
                >
                  <Badge variant="outline" className="mt-0.5">
                    {msg.topic}
                  </Badge>
                  <p className="text-sm flex-1">{msg.message}</p>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="flex-shrink-0"
                    onClick={() => copyToClipboard(msg.message, `msg-${idx}`)}
                  >
                    {copiedId === `msg-${idx}` ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Media Assets */}
        <TabsContent value="assets">
          <div className="grid md:grid-cols-2 gap-4">
            {MEDIA_ASSETS.map((asset, idx) => (
              <motion.div
                key={asset.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-card border border-border rounded-xl p-4"
              >
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center">
                    {asset.type === 'logo' && <Building2 className="w-8 h-8 text-primary" />}
                    {asset.type === 'screenshot' && <Image className="w-8 h-8 text-primary" />}
                    {asset.type === 'infographic' && <FileText className="w-8 h-8 text-primary" />}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold">{asset.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {asset.format}
                      </Badge>
                      {asset.dimensions && (
                        <span className="text-xs text-muted-foreground">
                          {asset.dimensions}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {asset.usage}
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Differentiators */}
          <div className="bg-card border border-border rounded-xl p-6 mt-6">
            <h3 className="font-semibold mb-4">Alleinstellungsmerkmale (Story Angles)</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {KEY_DIFFERENTIATORS.map((diff, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-lg bg-primary/5 border border-primary/20"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="w-4 h-4 text-primary" />
                    <h4 className="font-semibold">{diff.title}</h4>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {diff.description}
                  </p>
                  <Badge variant="outline" className="text-xs">
                    {diff.newsworthy}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Boilerplate */}
        <TabsContent value="boilerplate" className="space-y-4">
          <BoilerplateCard
            title="Kurzversion (1 Satz)"
            content={COMPANY_BOILERPLATE.short}
            onCopy={() => copyToClipboard(COMPANY_BOILERPLATE.short, 'bp-short')}
            copied={copiedId === 'bp-short'}
          />
          <BoilerplateCard
            title="Mittelversion (1 Absatz)"
            content={COMPANY_BOILERPLATE.medium}
            onCopy={() => copyToClipboard(COMPANY_BOILERPLATE.medium, 'bp-medium')}
            copied={copiedId === 'bp-medium'}
          />
          <BoilerplateCard
            title="Langversion (Vollständig)"
            content={COMPANY_BOILERPLATE.long}
            onCopy={() => copyToClipboard(COMPANY_BOILERPLATE.long, 'bp-long')}
            copied={copiedId === 'bp-long'}
          />
        </TabsContent>

        {/* Contact */}
        <TabsContent value="contact">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Press Contact */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="font-semibold mb-4">Pressekontakt</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{PRESS_CONTACTS.general.email}</p>
                    <p className="text-xs text-muted-foreground">
                      Antwort {PRESS_CONTACTS.general.response}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{PRESS_CONTACTS.general.phone}</p>
                    <p className="text-xs text-muted-foreground">Mo-Fr, 9-18 Uhr</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Linkedin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{PRESS_CONTACTS.social.linkedin}</p>
                    <p className="text-xs text-muted-foreground">Folgen Sie uns</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Interview Availability */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="font-semibold mb-4">Interview-Anfragen</h3>
              <p className="text-muted-foreground mb-4">
                {PRESS_CONTACTS.founder.name} steht für Interviews zur Verfügung.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {PRESS_CONTACTS.founder.topics.map(topic => (
                  <Badge key={topic} variant="outline">{topic}</Badge>
                ))}
              </div>
              <Button className="w-full gap-2">
                <MessageSquare className="w-4 h-4" />
                Interview anfragen
              </Button>
            </div>
          </div>

          {/* Media Targets */}
          <div className="bg-card border border-border rounded-xl p-6 mt-6">
            <h3 className="font-semibold mb-4">Medien-Outreach Status</h3>
            <div className="grid md:grid-cols-2 gap-3">
              {MEDIA_TARGETS.map((media, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <Newspaper className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{media.name}</p>
                      <p className="text-xs text-muted-foreground">{media.type}</p>
                    </div>
                  </div>
                  <Badge className={cn('text-xs', STATUS_COLORS[media.status as keyof typeof STATUS_COLORS])}>
                    {media.status === 'confirmed' ? 'Bestätigt' :
                     media.status === 'pitched' ? 'Gepitcht' : 'Ausstehend'}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
});

interface BoilerplateCardProps {
  title: string;
  content: string;
  onCopy: () => void;
  copied: boolean;
}

const BoilerplateCard = memo(function BoilerplateCard({
  title,
  content,
  onCopy,
  copied,
}: BoilerplateCardProps) {
  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">{title}</h3>
        <Button variant="outline" size="sm" onClick={onCopy}>
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
        </Button>
      </div>
      <p className="text-muted-foreground whitespace-pre-wrap">{content}</p>
    </div>
  );
});
