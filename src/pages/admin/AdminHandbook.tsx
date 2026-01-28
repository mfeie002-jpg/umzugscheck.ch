/**
 * Admin Handbook Page
 * Interactive documentation for all admin sections
 */

import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Search, 
  BookOpen, 
  ExternalLink, 
  ArrowRight, 
  AlertTriangle,
  Zap,
  Target,
  Brain,
  Route,
  FlaskConical,
  BarChart3,
  Truck,
  Building2,
  CreditCard,
  Mail,
  Rocket,
  Wrench
} from 'lucide-react';
import { 
  HANDBOOK_DATA, 
  KILL_SWITCHES, 
  QUICK_LINKS, 
  searchHandbook,
  type HandbookSection 
} from '@/lib/admin-handbook-data';

const CATEGORY_ICONS: Record<string, any> = {
  'command-centers': Target,
  'ai-automation': Brain,
  'lead-distribution': Route,
  'testing': FlaskConical,
  'analytics': BarChart3,
  'relo-os': Truck,
  'companies': Building2,
  'billing': CreditCard,
  'email': Mail,
  'launch': Rocket,
  'tools': Wrench,
};

export default function AdminHandbook() {
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return null;
    return searchHandbook(searchQuery);
  }, [searchQuery]);

  const renderSection = (section: HandbookSection) => (
    <Card key={section.id} className="group hover:border-primary/50 transition-colors">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <CardTitle className="text-lg flex items-center gap-2 flex-wrap">
              {section.title}
              {section.badge && (
                <Badge variant={section.highlight ? 'default' : 'secondary'} className="text-xs">
                  {section.badge}
                </Badge>
              )}
              {section.external && (
                <ExternalLink className="h-3 w-3 text-muted-foreground" />
              )}
            </CardTitle>
            <CardDescription className="mt-1">{section.description}</CardDescription>
          </div>
          <Button asChild size="sm" variant="ghost" className="shrink-0">
            <Link to={section.route}>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1">Features:</p>
            <ul className="text-sm space-y-1">
              {section.features.slice(0, 4).map((feature, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="pt-2 border-t">
            <p className="text-xs">
              <span className="font-medium text-muted-foreground">Wann nutzen: </span>
              <span className="text-foreground">{section.whenToUse}</span>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-primary" />
            Admin Handbuch
          </h1>
          <p className="text-muted-foreground mt-2">
            Komplette Dokumentation aller Admin-Funktionen mit Suchfunktion
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Suchen... (z.B. 'Lead', 'A/B Test', 'Finance')"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12 text-lg"
          />
        </div>

        {/* Quick Links */}
        <div className="mb-8">
          <h2 className="text-sm font-medium text-muted-foreground mb-3">Schnellzugriff</h2>
          <div className="flex flex-wrap gap-2">
            {QUICK_LINKS.map((link) => (
              <Button key={link.route} asChild variant="outline" size="sm">
                <Link to={link.route} className="gap-2">
                  <Zap className="h-3 w-3" />
                  {link.action}
                </Link>
              </Button>
            ))}
          </div>
        </div>

        {/* Search Results or Categories */}
        {filteredData ? (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">
              {filteredData.length} Ergebnis{filteredData.length !== 1 ? 'se' : ''} für "{searchQuery}"
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {filteredData.map(renderSection)}
            </div>
            {filteredData.length === 0 && (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">Keine Ergebnisse gefunden</p>
                <Button 
                  variant="ghost" 
                  className="mt-2"
                  onClick={() => setSearchQuery('')}
                >
                  Suche zurücksetzen
                </Button>
              </Card>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Kill Switches Warning */}
            <Card className="border-destructive/50 bg-destructive/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2 text-destructive">
                  <AlertTriangle className="h-5 w-5" />
                  Kill-Switches (Automatische Stopps)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {KILL_SWITCHES.map((ks, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <Badge variant="destructive" className="shrink-0">{ks.action}</Badge>
                      <span className="text-muted-foreground">{ks.condition}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Categories */}
            <Accordion type="multiple" defaultValue={['command-centers', 'ai-automation']} className="space-y-4">
              {HANDBOOK_DATA.map((category) => {
                const IconComponent = CATEGORY_ICONS[category.id] || BookOpen;
                return (
                  <AccordionItem key={category.id} value={category.id} className="border rounded-lg px-4">
                    <AccordionTrigger className="hover:no-underline py-4">
                      <div className="flex items-center gap-3">
                        <IconComponent className="h-5 w-5 text-primary" />
                        <span className="text-lg font-semibold">{category.title}</span>
                        <Badge variant="outline" className="ml-2">
                          {category.sections.length}
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-2 pb-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        {category.sections.map(renderSection)}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
