/**
 * Competitor Intelligence Panel
 * Searchable database of competitors
 */

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ExternalLink, Search, Phone, FileText, Building2, MessageSquare } from 'lucide-react';

interface Competitor {
  id: string;
  name: string;
  region: string;
  positioning: string;
  ctaStrategy: 'phone' | 'form' | 'both';
  pricingAnchors?: string;
  trustProof?: string;
  hoursWhatsApp?: string;
  notes?: string;
  sourceUrl: string;
  type: 'mover' | 'portal' | 'relocation';
}

const COMPETITORS: Competitor[] = [
  // Premium Movers
  { id: '1', name: 'Swiss Transporte', region: 'Zürich city', positioning: 'Premium full-service, 27 years', ctaStrategy: 'both', trustProof: 'Blick Top Service 2024', hoursWhatsApp: 'Phone visible', notes: 'Strong brand', sourceUrl: 'https://swisstransport.ch', type: 'mover' },
  { id: '2', name: 'Weber Umzüge', region: 'Zürich/CH-wide', positioning: 'Einfach. Besser. Umziehen.', ctaStrategy: 'form', trustProof: 'References page', hoursWhatsApp: 'Standard hours', notes: 'Clean UX, form-focused', sourceUrl: 'https://weberumzuege.ch', type: 'mover' },
  { id: '3', name: 'Top Umzüge AG', region: 'Zürich', positioning: 'Nr. 1 Partner premium', ctaStrategy: 'both', pricingAnchors: 'Zimmer-based form', trustProof: 'Long-standing brand', hoursWhatsApp: 'Form prominent', notes: 'Good mobile UX', sourceUrl: 'https://topumzuege.ch', type: 'mover' },
  { id: '4', name: 'Express Umzüge', region: 'Zürich', positioning: 'Full-service, fair prices', ctaStrategy: 'both', trustProof: '4.9 Google', hoursWhatsApp: '044 620 07 98', notes: 'Aggressive form popup', sourceUrl: 'https://expressumzuege.ch', type: 'mover' },
  { id: '5', name: 'Helvetic Umzüge GmbH', region: 'Zürich', positioning: 'Ihre Umzugsfirma', ctaStrategy: 'form', pricingAnchors: 'Step form', hoursWhatsApp: '043 931 57 13', notes: 'Multi-step form', sourceUrl: 'https://helveticumzuege.ch', type: 'mover' },
  { id: '6', name: 'Royal Umzug', region: 'Zürich/CH', positioning: 'Fachgerecht & Preiswert', ctaStrategy: 'form', hoursWhatsApp: '043 433 80 87', notes: 'Clean premium design', sourceUrl: 'https://royal-umzug.ch', type: 'mover' },
  { id: '7', name: 'Umzug Team', region: 'Zürich & Umgebung', positioning: 'Fixpreis & Ausführungsgarantie', ctaStrategy: 'both', pricingAnchors: 'Fixpreisgarantie', trustProof: '4.9 Google (153 reviews)', hoursWhatsApp: 'Termin vereinbaren', notes: 'Trust: Fixpreis promise', sourceUrl: 'https://umzugteam.ch', type: 'mover' },
  { id: '8', name: 'Zügelzentrum GmbH', region: 'Zürich/CH', positioning: 'Partner für stressfreie Umzüge', ctaStrategy: 'form', hoursWhatsApp: 'Standard', notes: 'Mid-market', sourceUrl: 'https://zuegelzentrum.ch', type: 'mover' },
  { id: '9', name: 'Alexander Keller AG', region: 'Zürich', positioning: 'Professioneller Umzugsservice', ctaStrategy: 'form', trustProof: 'Corporate clients', hoursWhatsApp: 'Phone focus', notes: 'More B2B', sourceUrl: 'https://alexanderkeller.ch', type: 'mover' },
  { id: '10', name: 'Umzugsservice Zürich GmbH', region: 'Zürich/Goldküste', positioning: 'Regional specialist', ctaStrategy: 'phone', pricingAnchors: 'Individual offer 24h', trustProof: 'Extensive reviews', hoursWhatsApp: '044 741 64 64', notes: 'Strong Goldküste', sourceUrl: 'https://umzugsservice-zh.ch', type: 'mover' },
  { id: '11', name: 'Kantonal Umzüge', region: 'Zürich', positioning: 'Umziehen geniessen', ctaStrategy: 'both', trustProof: '4.5 Trustpilot (188 reviews)', hoursWhatsApp: 'Standard', notes: 'Good review profile', sourceUrl: 'https://kantonalumzuege.ch', type: 'mover' },
  { id: '12', name: 'Helvetia Transporte AG', region: 'CH-wide/Goldküste', positioning: 'Umzugskosten transparent', ctaStrategy: 'both', pricingAnchors: 'Price tables on site', trustProof: 'Social presence', hoursWhatsApp: '0041 43 537 80 48', notes: 'Content marketing', sourceUrl: 'https://helvetiatransporte.ch', type: 'mover' },
  { id: '13', name: 'Primus Umzüge', region: 'Goldküste/Meilen', positioning: 'Zürichsee specialist', ctaStrategy: 'form', trustProof: 'Goldküste expertise', hoursWhatsApp: 'Standard', notes: 'Niche Goldküste', sourceUrl: 'https://primusumzuege.ch', type: 'mover' },
  { id: '14', name: 'Limmat-Zürich Umzug', region: 'Zürich/Meilen', positioning: 'Professionalität & Qualität', ctaStrategy: 'form', trustProof: 'Local testimonials', hoursWhatsApp: 'Standard', notes: 'Good local SEO', sourceUrl: 'https://limmat-zuerich-umzug.ch', type: 'mover' },
  { id: '15', name: 'Easy Umzüge & Transport', region: 'Zürich/Central CH', positioning: 'Office relocation specialist', ctaStrategy: 'form', trustProof: 'Office clients', hoursWhatsApp: 'Standard', notes: 'B2B focus', sourceUrl: 'https://easyumzuege.ch', type: 'mover' },
  { id: '16', name: 'AXA Umzug', region: 'Zug', positioning: 'Fair & transparent', ctaStrategy: 'form', pricingAnchors: 'Service packages', trustProof: 'AXA brand halo', hoursWhatsApp: 'Kostenfreie Offerte', notes: 'Zug market leader', sourceUrl: 'https://axaumzug.ch', type: 'mover' },
  { id: '17', name: 'Meisterumzug Zug', region: 'Zug', positioning: 'Kompetent & nah', ctaStrategy: 'both', pricingAnchors: '0800 number', trustProof: 'Free number trust', hoursWhatsApp: '0800 212 211', notes: 'Free hotline', sourceUrl: 'https://meisterumzug-zug.ch', type: 'mover' },
  { id: '18', name: 'SwissLogistik', region: 'Zug', positioning: '5 Vorteile positioning', ctaStrategy: 'form', pricingAnchors: 'Price tables', trustProof: 'Service guarantee', hoursWhatsApp: 'Standard', notes: 'Transparent pricing', sourceUrl: 'https://swisslogistik.ch', type: 'mover' },
  { id: '19', name: 'Umzugsexpress', region: 'Zug', positioning: 'Räumung & Entsorgung', ctaStrategy: 'phone', pricingAnchors: 'Festpreis', trustProof: '5-star claims', hoursWhatsApp: 'Standard', notes: 'Disposal focus', sourceUrl: 'https://umzugsexpress.ch', type: 'mover' },
  { id: '20', name: 'Profi Umzugsfirma', region: 'Zug', positioning: 'Standard service', ctaStrategy: 'form', hoursWhatsApp: 'Standard', notes: 'Generic', sourceUrl: 'https://profiumzugsfirma.ch', type: 'mover' },
  
  // Portals
  { id: '21', name: 'Movu.ch', region: 'CH-wide', positioning: 'Lead aggregator', ctaStrategy: 'form', trustProof: 'eKomi rating', notes: 'Market leader, owned by SMG', sourceUrl: 'https://movu.ch', type: 'portal' },
  { id: '22', name: 'Comparis.ch', region: 'CH-wide', positioning: 'Aggregator (via topmovers)', ctaStrategy: 'form', trustProof: 'Swiss institution', notes: 'Massive organic traffic', sourceUrl: 'https://comparis.ch', type: 'portal' },
  { id: '23', name: 'Umzugsvergleich Schweiz', region: 'CH-wide', positioning: 'Lead gen', ctaStrategy: 'form', hoursWhatsApp: 'Mo-Fr 07:00-17:00', notes: 'Dietikon-based', sourceUrl: 'https://umzugsvergleichschweiz.ch', type: 'portal' },
  { id: '24', name: 'Moving24.ch', region: 'CH-wide', positioning: 'Comparison', ctaStrategy: 'form', trustProof: 'Review focus', notes: 'Review aggregation', sourceUrl: 'https://moving24.ch', type: 'portal' },
  { id: '25', name: 'Umzugsbewertung.ch', region: 'CH-wide', positioning: 'Review/directory', ctaStrategy: 'form', trustProof: 'Extensive reviews', notes: 'Valuable for SEO', sourceUrl: 'https://umzugsbewertung.ch', type: 'portal' },
  
  // Relocation Agencies
  { id: '26', name: 'Prime Relocation', region: 'CH-wide', positioning: 'Expat full-service', ctaStrategy: 'form', notes: 'Corporate contracts', sourceUrl: 'https://primerelocation.ch', type: 'relocation' },
  { id: '27', name: 'Swiss Expat Realtor', region: 'Zürich/Zug/Basel', positioning: 'Free consultation', ctaStrategy: 'form', notes: 'Former expats', sourceUrl: 'https://swissexpatrealtor.com', type: 'relocation' },
  { id: '28', name: 'Crane-Relocation', region: 'Zug/Zürich', positioning: 'Tailored service', ctaStrategy: 'form', notes: 'Discreet/premium', sourceUrl: 'https://crane-relocation.ch', type: 'relocation' },
  { id: '29', name: 'AM Relocation', region: 'Zürich/Oberland', positioning: 'Boutique service', ctaStrategy: 'form', notes: 'First-class service', sourceUrl: 'https://am-relocation.ch', type: 'relocation' },
  { id: '30', name: 'Zürich Relocation', region: 'Zürich', positioning: 'Smooth moves', ctaStrategy: 'form', notes: 'Seamless transition', sourceUrl: 'https://zuerich-relocation.ch', type: 'relocation' },
];

const TYPE_CONFIG = {
  mover: { label: 'Mover', color: 'bg-blue-500/20 text-blue-700', icon: Building2 },
  portal: { label: 'Portal', color: 'bg-purple-500/20 text-purple-700', icon: FileText },
  relocation: { label: 'Relocation', color: 'bg-green-500/20 text-green-700', icon: MessageSquare },
};

const CTA_CONFIG = {
  phone: { label: 'Phone', icon: Phone },
  form: { label: 'Form', icon: FileText },
  both: { label: 'Both', icon: Phone },
};

export function CompetitorIntelPanel() {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [regionFilter, setRegionFilter] = useState<string>('all');

  const filteredCompetitors = COMPETITORS.filter(comp => {
    if (typeFilter !== 'all' && comp.type !== typeFilter) return false;
    if (regionFilter !== 'all' && !comp.region.toLowerCase().includes(regionFilter.toLowerCase())) return false;
    if (!searchQuery) return true;
    
    const q = searchQuery.toLowerCase();
    return (
      comp.name.toLowerCase().includes(q) ||
      comp.positioning.toLowerCase().includes(q) ||
      comp.region.toLowerCase().includes(q)
    );
  });

  const uniqueRegions = [...new Set(COMPETITORS.map(c => {
    if (c.region.includes('Zürich')) return 'Zürich';
    if (c.region.includes('Zug')) return 'Zug';
    if (c.region.includes('CH-wide')) return 'CH-wide';
    return 'Other';
  }))];

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Competitor suchen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-[140px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="mover">Movers</SelectItem>
            <SelectItem value="portal">Portals</SelectItem>
            <SelectItem value="relocation">Relocation</SelectItem>
          </SelectContent>
        </Select>
        <Select value={regionFilter} onValueChange={setRegionFilter}>
          <SelectTrigger className="w-full sm:w-[140px]">
            <SelectValue placeholder="Region" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Regions</SelectItem>
            {uniqueRegions.map(r => (
              <SelectItem key={r} value={r}>{r}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Stats */}
      <div className="flex gap-2 flex-wrap">
        <Badge variant="outline">{filteredCompetitors.length} results</Badge>
        <Badge className={TYPE_CONFIG.mover.color}>
          {COMPETITORS.filter(c => c.type === 'mover').length} Movers
        </Badge>
        <Badge className={TYPE_CONFIG.portal.color}>
          {COMPETITORS.filter(c => c.type === 'portal').length} Portals
        </Badge>
        <Badge className={TYPE_CONFIG.relocation.color}>
          {COMPETITORS.filter(c => c.type === 'relocation').length} Relocation
        </Badge>
      </div>

      {/* Table */}
      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Region</TableHead>
                <TableHead>Positioning</TableHead>
                <TableHead>CTA</TableHead>
                <TableHead>Trust</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCompetitors.map(comp => {
                const typeConfig = TYPE_CONFIG[comp.type];
                const CtaIcon = CTA_CONFIG[comp.ctaStrategy].icon;
                return (
                  <TableRow key={comp.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge className={typeConfig.color} variant="outline">
                          {typeConfig.label}
                        </Badge>
                        <span className="font-medium">{comp.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {comp.region}
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        <p className="text-sm line-clamp-2">{comp.positioning}</p>
                        {comp.notes && (
                          <p className="text-xs text-muted-foreground">{comp.notes}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <CtaIcon className="h-4 w-4 text-muted-foreground" />
                        <span className="text-xs">{CTA_CONFIG[comp.ctaStrategy].label}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {comp.trustProof && (
                        <span className="text-xs text-muted-foreground line-clamp-1">
                          {comp.trustProof}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" asChild>
                        <a href={comp.sourceUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Last Updated */}
      <p className="text-xs text-muted-foreground text-right">
        Last updated: January 2026
      </p>
    </div>
  );
}
