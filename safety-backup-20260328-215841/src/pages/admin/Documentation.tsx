/**
 * Documentation Browser Page
 * View all platform documentation, runbooks, and API docs
 */

import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  Book, Search, AlertTriangle, Code, FileText, 
  Server, Shield, Users, Zap
} from "lucide-react";
import { 
  RUNBOOKS, 
  API_ENDPOINTS, 
  OPERATIONAL_GUIDES,
  type Runbook,
  type ApiEndpoint,
  type OperationalGuide 
} from "@/lib/documentation";

const severityColors: Record<string, string> = {
  critical: "bg-destructive/10 text-destructive border-destructive/20",
  high: "bg-orange-500/10 text-orange-600 border-orange-200",
  medium: "bg-yellow-500/10 text-yellow-600 border-yellow-200",
  low: "bg-primary/10 text-primary border-primary/20"
};

const methodColors: Record<string, string> = {
  GET: "bg-green-500/10 text-green-600",
  POST: "bg-primary/10 text-primary",
  PUT: "bg-yellow-500/10 text-yellow-600",
  DELETE: "bg-destructive/10 text-destructive",
  PATCH: "bg-purple-500/10 text-purple-600"
};

export default function Documentation() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredRunbooks = RUNBOOKS.filter(r => 
    r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredApis = API_ENDPOINTS.filter(a =>
    a.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredGuides = OPERATIONAL_GUIDES.filter(g =>
    g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Book className="w-6 h-6 text-primary" />
              Dokumentation
            </h1>
            <p className="text-muted-foreground">
              Runbooks, API-Dokumentation und Betriebsanleitungen
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{RUNBOOKS.length} Runbooks</Badge>
            <Badge variant="outline">{API_ENDPOINTS.length} APIs</Badge>
            <Badge variant="outline">{OPERATIONAL_GUIDES.length} Guides</Badge>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Dokumentation durchsuchen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Tabs defaultValue="runbooks" className="space-y-4">
          <TabsList>
            <TabsTrigger value="runbooks" className="gap-2">
              <AlertTriangle className="w-4 h-4" />
              Incident Runbooks
            </TabsTrigger>
            <TabsTrigger value="api" className="gap-2">
              <Code className="w-4 h-4" />
              API Dokumentation
            </TabsTrigger>
            <TabsTrigger value="guides" className="gap-2">
              <FileText className="w-4 h-4" />
              Betriebsanleitungen
            </TabsTrigger>
          </TabsList>

          {/* Runbooks Tab */}
          <TabsContent value="runbooks" className="space-y-4">
            {filteredRunbooks.map((runbook) => (
              <RunbookCard key={runbook.id} runbook={runbook} />
            ))}
          </TabsContent>

          {/* API Documentation Tab */}
          <TabsContent value="api" className="space-y-4">
            {filteredApis.map((endpoint, index) => (
              <ApiEndpointCard key={index} endpoint={endpoint} />
            ))}
          </TabsContent>

          {/* Operational Guides Tab */}
          <TabsContent value="guides" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredGuides.map((guide) => (
                <GuideCard key={guide.id} guide={guide} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}

function RunbookCard({ runbook }: { runbook: Runbook }) {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold">{runbook.title}</h3>
            <Badge className={severityColors[runbook.severity]}>
              {runbook.severity.toUpperCase()}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{runbook.category}</p>
        </div>
        <Badge variant="outline">{runbook.lastUpdated}</Badge>
      </div>

      <p className="text-sm text-muted-foreground mb-3">{runbook.description}</p>

      <Accordion type="single" collapsible>
        {runbook.steps.map((step, i) => (
          <AccordionItem key={i} value={`step-${i}`}>
            <AccordionTrigger className="text-sm py-2">
              {step.order}. {step.title}
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 text-sm">
                <p className="text-muted-foreground">{step.description}</p>
                
                {step.commands && step.commands.length > 0 && (
                  <div className="mt-2">
                    <span className="text-xs font-medium text-muted-foreground">Befehle:</span>
                    <ul className="list-disc list-inside mt-1 space-y-1">
                      {step.commands.map((cmd, j) => (
                        <li key={j} className="text-xs">
                          <code className="bg-muted px-1 rounded">{cmd}</code>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {step.checkpoints && step.checkpoints.length > 0 && (
                  <div className="mt-2">
                    <span className="text-xs font-medium text-muted-foreground">Checkpoints:</span>
                    <ul className="list-disc list-inside mt-1 space-y-1">
                      {step.checkpoints.map((cp, j) => (
                        <li key={j} className="text-xs text-muted-foreground">{cp}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {step.rollback && (
                  <div className="mt-2 p-2 bg-destructive/5 rounded text-xs">
                    <strong>Rollback:</strong> {step.rollback}
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {runbook.contacts.length > 0 && (
        <div className="mt-3 pt-3 border-t">
          <span className="text-xs text-muted-foreground">Kontakte: </span>
          {runbook.contacts.map((contact, i) => (
            <Badge key={i} variant="secondary" className="text-xs mr-1">
              {contact}
            </Badge>
          ))}
        </div>
      )}
    </Card>
  );
}

function ApiEndpointCard({ endpoint }: { endpoint: ApiEndpoint }) {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 mb-2">
        <Badge className={methodColors[endpoint.method]}>
          {endpoint.method}
        </Badge>
        <code className="text-sm bg-muted px-2 py-1 rounded">
          {endpoint.path}
        </code>
        <Badge variant="outline" className="ml-auto text-xs">
          Auth: {endpoint.auth}
        </Badge>
      </div>
      
      <p className="text-sm text-muted-foreground mb-3">
        {endpoint.description}
      </p>

      {endpoint.parameters && endpoint.parameters.length > 0 && (
        <div className="mb-3">
          <span className="text-xs font-medium text-muted-foreground">Parameter:</span>
          <div className="flex flex-wrap gap-1 mt-1">
            {endpoint.parameters.map((param, i) => (
              <Badge key={i} variant="secondary" className="text-xs">
                {param.name}: {param.type}
                {param.required && <span className="text-destructive ml-1">*</span>}
              </Badge>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {endpoint.responses.map((response, i) => (
          <Badge 
            key={i} 
            variant="outline" 
            className={`text-xs ${response.status >= 400 ? 'border-destructive/50' : 'border-green-500/50'}`}
          >
            {response.status}: {response.description}
          </Badge>
        ))}
      </div>

      {endpoint.example && (
        <div className="mt-3 pt-3 border-t">
          <span className="text-xs font-medium text-muted-foreground">Beispiel Response:</span>
          <pre className="mt-1 p-2 bg-muted rounded text-xs overflow-x-auto">
            {endpoint.example.response}
          </pre>
        </div>
      )}
    </Card>
  );
}

function GuideCard({ guide }: { guide: OperationalGuide }) {
  const categoryIcons: Record<string, React.ElementType> = {
    admin: Shield,
    marketing: Zap,
    support: Users,
    development: Server
  };
  
  const IconComponent = categoryIcons[guide.category] || FileText;

  return (
    <Card className="p-4">
      <div className="flex items-start gap-3">
        <IconComponent className="w-5 h-5 text-primary mt-0.5" />
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold">{guide.title}</h3>
            <Badge variant="outline" className="text-xs capitalize">{guide.category}</Badge>
          </div>
          
          <Accordion type="single" collapsible>
            {guide.sections.map((section, i) => (
              <AccordionItem key={i} value={`section-${i}`}>
                <AccordionTrigger className="text-sm py-2">
                  {section.title}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>{section.content}</p>
                    
                    {section.tips && section.tips.length > 0 && (
                      <div className="mt-2">
                        <span className="text-xs font-medium">💡 Tipps:</span>
                        <ul className="list-disc list-inside mt-1 space-y-1">
                          {section.tips.map((tip, j) => (
                            <li key={j} className="text-xs">{tip}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {section.warnings && section.warnings.length > 0 && (
                      <div className="mt-2 p-2 bg-destructive/5 rounded">
                        <span className="text-xs font-medium">⚠️ Warnungen:</span>
                        <ul className="list-disc list-inside mt-1 space-y-1">
                          {section.warnings.map((warning, j) => (
                            <li key={j} className="text-xs">{warning}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </Card>
  );
}
