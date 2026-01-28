/**
 * Partner Network Manager Dashboard
 * Internal operations console for managing mover partners
 */

import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Users, Plus } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  PartnerKPICards,
  PartnerDirectory,
  PartnerOnboarding,
  CantonCoveragePanel,
  DistributionSettingsPanel,
  DisputeCenter,
  MysteryShop,
  WeeklyChecklist,
} from '@/components/internal/partners';
import type {
  Partner,
  MarketplaceKPIs,
  Dispute,
  MysteryShopResult,
  CantonCoverage,
  DistributionSettings,
} from '@/components/internal/partners';

// Mock data
const MOCK_KPIS_7D: MarketplaceKPIs = {
  period: '7d',
  totalLeadsGenerated: 48,
  leadsSold: 41,
  fillRate: 85.4,
  avgResaleRate: 1.8,
  avgRevenuePerLead: 52,
  avgMarginPerLead: 12,
  disputeRate: 2.4,
  activePartners: 12,
  partnerChurn: 1,
};

const MOCK_KPIS_30D: MarketplaceKPIs = {
  period: '30d',
  totalLeadsGenerated: 186,
  leadsSold: 152,
  fillRate: 81.7,
  avgResaleRate: 1.6,
  avgRevenuePerLead: 48,
  avgMarginPerLead: 10,
  disputeRate: 3.2,
  activePartners: 14,
  partnerChurn: 2,
};

const MOCK_PARTNERS: Partner[] = [
  {
    id: '1',
    name: 'Züri-Move GmbH',
    canton: 'Zürich',
    capacityStatus: 'open',
    services: ['moving', 'packing'],
    priceTier: 'premium',
    acceptanceRate: 78,
    avgResponseMinutes: 12,
    closeRateEstimate: 28,
    disputeRate: 1.5,
    avgRevenuePerLead: 65,
    partnerROI: 7.2,
    contractModel: 'cpl',
    cplPrice: 45,
    commissionPercent: null,
    maxLeadsPerWeek: 25,
    minRoomRequirement: 2,
    status: 'active',
    notes: 'Top performer',
    createdAt: new Date('2024-06-01'),
  },
  {
    id: '2',
    name: 'Aargau Express',
    canton: 'Aargau',
    capacityStatus: 'limited',
    services: ['moving', 'cleaning', 'storage'],
    priceTier: 'standard',
    acceptanceRate: 62,
    avgResponseMinutes: 25,
    closeRateEstimate: 22,
    disputeRate: 4.2,
    avgRevenuePerLead: 42,
    partnerROI: 5.8,
    contractModel: 'hybrid',
    cplPrice: 30,
    commissionPercent: 10,
    maxLeadsPerWeek: 15,
    minRoomRequirement: 2.5,
    status: 'active',
    notes: '',
    createdAt: new Date('2024-08-15'),
  },
  {
    id: '3',
    name: 'Budget Umzüge CH',
    canton: 'Zürich',
    capacityStatus: 'open',
    services: ['moving'],
    priceTier: 'budget',
    acceptanceRate: 91,
    avgResponseMinutes: 8,
    closeRateEstimate: 15,
    disputeRate: 8.5,
    avgRevenuePerLead: 28,
    partnerROI: 4.2,
    contractModel: 'cpl',
    cplPrice: 25,
    commissionPercent: null,
    maxLeadsPerWeek: 50,
    minRoomRequirement: 1,
    status: 'probation',
    notes: 'High dispute rate - monitoring',
    createdAt: new Date('2024-11-01'),
  },
  {
    id: '4',
    name: 'Zug Premium Movers',
    canton: 'Zug',
    capacityStatus: 'full',
    services: ['moving', 'packing', 'cleaning', 'storage'],
    priceTier: 'premium',
    acceptanceRate: 45,
    avgResponseMinutes: 45,
    closeRateEstimate: 35,
    disputeRate: 0.8,
    avgRevenuePerLead: 85,
    partnerROI: 9.1,
    contractModel: 'commission',
    cplPrice: null,
    commissionPercent: 18,
    maxLeadsPerWeek: 10,
    minRoomRequirement: 3,
    status: 'active',
    notes: 'High quality, low volume',
    createdAt: new Date('2024-03-01'),
  },
];

const MOCK_CANTONS: CantonCoverage[] = [
  { canton: 'Zürich', cantonCode: 'ZH', targetMin: 5, targetMax: 7, currentActive: 6, isOverLimit: false },
  { canton: 'Zug', cantonCode: 'ZG', targetMin: 2, targetMax: 3, currentActive: 2, isOverLimit: false },
  { canton: 'Aargau', cantonCode: 'AG', targetMin: 2, targetMax: 3, currentActive: 4, isOverLimit: true },
  { canton: 'Schwyz', cantonCode: 'SZ', targetMin: 1, targetMax: 2, currentActive: 1, isOverLimit: false },
  { canton: 'Luzern', cantonCode: 'LU', targetMin: 2, targetMax: 3, currentActive: 2, isOverLimit: false },
  { canton: 'Bern', cantonCode: 'BE', targetMin: 3, targetMax: 5, currentActive: 3, isOverLimit: false },
];

const MOCK_DISPUTES: Dispute[] = [
  {
    id: 'd1',
    leadId: 'lead-abc123',
    partnerId: '3',
    partnerName: 'Budget Umzüge CH',
    issueType: 'bad_phone',
    refundRequested: true,
    outcome: 'pending',
    notes: '',
    createdAt: new Date('2025-01-25'),
  },
  {
    id: 'd2',
    leadId: 'lead-def456',
    partnerId: '2',
    partnerName: 'Aargau Express',
    issueType: 'customer_unreachable',
    refundRequested: true,
    outcome: 'refund_approved',
    notes: 'Kunde hatte Nummer geändert',
    createdAt: new Date('2025-01-22'),
  },
  {
    id: 'd3',
    leadId: 'lead-ghi789',
    partnerId: '3',
    partnerName: 'Budget Umzüge CH',
    issueType: 'disintermediation',
    refundRequested: false,
    outcome: 'partner_warned',
    notes: 'Partner bot Rabatt für Direktbuchung an',
    createdAt: new Date('2025-01-20'),
  },
];

const MOCK_MYSTERY_RESULTS: MysteryShopResult[] = [
  { id: 'm1', date: new Date('2025-01-26'), partnerId: '1', partnerName: 'Züri-Move GmbH', result: 'clean', notes: 'Professionelle Beratung' },
  { id: 'm2', date: new Date('2025-01-24'), partnerId: '3', partnerName: 'Budget Umzüge CH', result: 'leakage', notes: 'Versuchte Direktbuchung anzubieten' },
  { id: 'm3', date: new Date('2025-01-22'), partnerId: '2', partnerName: 'Aargau Express', result: 'unprofessional', notes: 'Lange Wartezeit, unfreundlich' },
  { id: 'm4', date: new Date('2025-01-20'), partnerId: '4', partnerName: 'Zug Premium Movers', result: 'clean', notes: 'Exzellenter Service' },
];

export default function PartnerNetwork() {
  const [partners, setPartners] = useState<Partner[]>(MOCK_PARTNERS);
  const [disputes, setDisputes] = useState<Dispute[]>(MOCK_DISPUTES);
  const [mysteryResults] = useState<MysteryShopResult[]>(MOCK_MYSTERY_RESULTS);
  const [sampleRate, setSampleRate] = useState(10);
  const [distributionSettings, setDistributionSettings] = useState<DistributionSettings>({
    tier2MaxPartners: 3,
    tier3FlatPrice: 15,
    distributionMode: 'round_robin',
  });
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  const handleAddPartner = (newPartner: Omit<Partner, 'id' | 'createdAt' | 'acceptanceRate' | 'avgResponseMinutes' | 'closeRateEstimate' | 'disputeRate' | 'avgRevenuePerLead' | 'partnerROI'>) => {
    const partner: Partner = {
      ...newPartner,
      id: `p-${Date.now()}`,
      createdAt: new Date(),
      acceptanceRate: 0,
      avgResponseMinutes: 0,
      closeRateEstimate: null,
      disputeRate: 0,
      avgRevenuePerLead: 0,
      partnerROI: null,
    };
    setPartners(prev => [...prev, partner]);
    setIsAddDialogOpen(false);
  };
  
  const handlePausePartner = (partnerId: string) => {
    setPartners(prev => prev.map(p => 
      p.id === partnerId ? { ...p, status: 'paused' as const } : p
    ));
  };
  
  const handleBanPartner = (partnerId: string) => {
    setPartners(prev => prev.map(p => 
      p.id === partnerId ? { ...p, status: 'banned' as const } : p
    ));
  };
  
  const handleUpdateDispute = (disputeId: string, outcome: Dispute['outcome']) => {
    setDisputes(prev => prev.map(d => 
      d.id === disputeId ? { ...d, outcome } : d
    ));
  };
  
  const platformDisputeRate = MOCK_KPIS_7D.disputeRate;
  
  return (
    <>
      <Helmet>
        <title>Partner Network Manager | Internal</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-card sticky top-0 z-10">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                  <Users className="h-6 w-6 text-primary" />
                  Partner Network Manager
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Umzugscheck.ch • Operations Console
                </p>
              </div>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Partner hinzufügen
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Neuen Partner aufnehmen</DialogTitle>
                  </DialogHeader>
                  <PartnerOnboarding onSave={handleAddPartner} />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </header>
        
        <main className="container mx-auto px-6 py-6 space-y-6">
          
          {/* Section 1: KPIs */}
          <PartnerKPICards kpis7d={MOCK_KPIS_7D} kpis30d={MOCK_KPIS_30D} />
          
          {/* Tabs for main sections */}
          <Tabs defaultValue="directory" className="space-y-6">
            <TabsList className="grid w-full max-w-2xl grid-cols-5">
              <TabsTrigger value="directory">Partner</TabsTrigger>
              <TabsTrigger value="distribution">Verteilung</TabsTrigger>
              <TabsTrigger value="disputes">Disputes</TabsTrigger>
              <TabsTrigger value="mystery">Mystery Shop</TabsTrigger>
              <TabsTrigger value="operations">Operations</TabsTrigger>
            </TabsList>
            
            {/* Partner Directory */}
            <TabsContent value="directory" className="space-y-6">
              <PartnerDirectory
                partners={partners}
                onEdit={(partner) => console.log('Edit', partner)}
                onPause={handlePausePartner}
                onBan={handleBanPartner}
              />
            </TabsContent>
            
            {/* Distribution Settings */}
            <TabsContent value="distribution" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                <DistributionSettingsPanel
                  settings={distributionSettings}
                  onUpdate={setDistributionSettings}
                />
                <CantonCoveragePanel cantons={MOCK_CANTONS} />
              </div>
            </TabsContent>
            
            {/* Disputes */}
            <TabsContent value="disputes">
              <DisputeCenter
                disputes={disputes}
                platformDisputeRate={platformDisputeRate}
                onUpdateOutcome={handleUpdateDispute}
              />
            </TabsContent>
            
            {/* Mystery Shop */}
            <TabsContent value="mystery">
              <MysteryShop
                results={mysteryResults}
                sampleRate={sampleRate}
                onSampleRateChange={setSampleRate}
              />
            </TabsContent>
            
            {/* Operations */}
            <TabsContent value="operations">
              <div className="grid lg:grid-cols-2 gap-6">
                <WeeklyChecklist />
                <CantonCoveragePanel cantons={MOCK_CANTONS} />
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </>
  );
}
