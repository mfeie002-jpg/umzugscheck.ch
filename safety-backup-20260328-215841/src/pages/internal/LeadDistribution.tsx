/**
 * Lead Distribution & Auction Engine Dashboard
 * Internal control panel for lead routing
 */

import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Network } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DistributionModeSelector,
  LeadInbox,
  FeierabendGate,
  PartnerOffering,
  PremiumAuction,
  QualityProtection,
  OutcomeLog,
  PricingRules,
  DistributionChecklist,
} from '@/components/internal/distribution';
import type {
  DistributionMode,
  IncomingLead,
  PartnerBid,
  AuctionConfig,
  OutcomeRecord,
  PricingRule,
  OfferConfig,
} from '@/components/internal/distribution';

// Mock data
const MOCK_LEADS: IncomingLead[] = [
  {
    id: 'lead-001',
    timestamp: new Date(),
    channel: 'google',
    rooms: 4.5,
    distanceKm: 25,
    services: ['packing', 'montage'],
    moveDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    score: 72,
    tier: 1,
    estimatedValueCHF: 2800,
    status: 'new',
    fromPLZ: '8001',
    toPLZ: '8032',
    canton: 'Zürich',
  },
  {
    id: 'lead-002',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    channel: 'meta',
    rooms: 3,
    distanceKm: 45,
    services: ['packing'],
    moveDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    score: 55,
    tier: 2,
    estimatedValueCHF: 1800,
    status: 'new',
    fromPLZ: '8400',
    toPLZ: '8600',
    canton: 'Zürich',
  },
  {
    id: 'lead-003',
    timestamp: new Date(Date.now() - 45 * 60 * 1000),
    channel: 'organic',
    rooms: 2,
    distanceKm: 10,
    services: [],
    moveDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    score: 28,
    tier: 3,
    estimatedValueCHF: 650,
    status: 'new',
    fromPLZ: '8005',
    toPLZ: '8008',
    canton: 'Zürich',
  },
  {
    id: 'lead-004',
    timestamp: new Date(Date.now() - 60 * 60 * 1000),
    channel: 'google',
    rooms: 5,
    distanceKm: 80,
    services: ['packing', 'cleaning'],
    moveDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
    score: 85,
    tier: 1,
    estimatedValueCHF: 4200,
    status: 'offered',
    canton: 'Aargau',
  },
  {
    id: 'lead-005',
    timestamp: new Date(Date.now() - 90 * 60 * 1000),
    channel: 'referral',
    rooms: 3.5,
    distanceKm: 35,
    services: ['montage'],
    moveDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    score: 48,
    tier: 2,
    estimatedValueCHF: 1500,
    status: 'sold',
    canton: 'Zug',
  },
];

const MOCK_BIDS: PartnerBid[] = [
  { partnerId: 'p1', partnerName: 'Züri-Move GmbH', bidAmountCHF: 55, responseMinutes: 8, acceptanceProbability: 0.78, disputeRiskScore: 0.5, finalScore: 0 },
  { partnerId: 'p2', partnerName: 'Swiss Premium Movers', bidAmountCHF: 62, responseMinutes: 12, acceptanceProbability: 0.85, disputeRiskScore: 0.3, finalScore: 0 },
  { partnerId: 'p3', partnerName: 'Aargau Express', bidAmountCHF: 48, responseMinutes: 5, acceptanceProbability: 0.62, disputeRiskScore: 1.2, finalScore: 0 },
  { partnerId: 'p4', partnerName: 'Zug Premium', bidAmountCHF: 70, responseMinutes: 25, acceptanceProbability: 0.90, disputeRiskScore: 0.2, finalScore: 0 },
];

const MOCK_OUTCOMES: OutcomeRecord[] = [
  {
    id: 'o1',
    leadId: 'lead-100',
    tier: 1,
    routeResult: 'feierabend',
    partnersOffered: [],
    winningPartner: 'Feierabendumzug',
    winningPrice: null,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    notes: 'Kapazität verfügbar',
  },
  {
    id: 'o2',
    leadId: 'lead-101',
    tier: 2,
    routeResult: 'sold_to_partner',
    partnersOffered: ['Züri-Move', 'Aargau Express', 'Budget CH'],
    winningPartner: 'Züri-Move GmbH',
    winningPrice: 45,
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
    notes: '',
  },
  {
    id: 'o3',
    leadId: 'lead-102',
    tier: 3,
    routeResult: 'budget_partner',
    partnersOffered: ['Budget Umzüge'],
    winningPartner: 'Budget Umzüge CH',
    winningPrice: 15,
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    notes: 'Flat rate',
  },
  {
    id: 'o4',
    leadId: 'lead-103',
    tier: 1,
    routeResult: 'sold_to_partner',
    partnersOffered: ['Züri-Move', 'Swiss Premium', 'Zug Premium'],
    winningPartner: 'Zug Premium',
    winningPrice: 68,
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
    notes: 'Premium Auction Winner',
  },
];

const MOCK_PRICING: PricingRule[] = [
  { partnerId: 'p1', partnerName: 'Züri-Move GmbH', contractType: 'cpl', cplPrice: 45, commissionPercent: null },
  { partnerId: 'p2', partnerName: 'Swiss Premium Movers', contractType: 'commission', cplPrice: null, commissionPercent: 18 },
  { partnerId: 'p3', partnerName: 'Aargau Express', contractType: 'hybrid', cplPrice: 30, commissionPercent: 10 },
  { partnerId: 'p4', partnerName: 'Zug Premium', contractType: 'commission', cplPrice: null, commissionPercent: 20 },
  { partnerId: 'p5', partnerName: 'Budget Umzüge CH', contractType: 'cpl', cplPrice: 15, commissionPercent: null },
];

export default function LeadDistribution() {
  const [mode, setMode] = useState<DistributionMode>('round_robin');
  const [selectedLead, setSelectedLead] = useState<IncomingLead | null>(null);
  const [capacityAvailable, setCapacityAvailable] = useState(true);
  const [auctionConfig, setAuctionConfig] = useState<AuctionConfig>({
    reservePriceCHF: 40,
    durationMinutes: 30,
    eligiblePartnerIds: ['p1', 'p2', 'p4'],
    qualityMinimum: true,
  });
  
  const handleSelectLead = (lead: IncomingLead) => {
    setSelectedLead(lead);
  };
  
  const handleSendOffer = (config: OfferConfig) => {
    console.log('Sending offer:', config);
    // In real implementation, this would update lead status and notify partners
  };
  
  const handleSelectWinner = (partnerId: string) => {
    console.log('Winner selected:', partnerId);
    // In real implementation, this would finalize the auction
  };
  
  const qualityMetrics = {
    avgBidRate: 1.2,
    platformDisputeRate: 2.8,
    excludedPartners: [
      { name: 'Budget Umzüge CH', reason: 'Dispute >15%' },
    ],
  };
  
  return (
    <>
      <Helmet>
        <title>Lead Distribution Engine | Internal</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-card sticky top-0 z-10">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                  <Network className="h-6 w-6 text-primary" />
                  Lead Distribution & Auction Engine
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Cherries & Chaff • Routing Control
                </p>
              </div>
            </div>
          </div>
        </header>
        
        <main className="container mx-auto px-6 py-6 space-y-6">
          
          {/* Section 1: Mode Selector */}
          <DistributionModeSelector mode={mode} onModeChange={setMode} />
          
          {/* Main Tabs */}
          <Tabs defaultValue="routing" className="space-y-6">
            <TabsList className="grid w-full max-w-2xl grid-cols-4">
              <TabsTrigger value="routing">Routing</TabsTrigger>
              <TabsTrigger value="auction">Auction</TabsTrigger>
              <TabsTrigger value="log">Outcome Log</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            
            {/* Routing Tab */}
            <TabsContent value="routing" className="space-y-6">
              {/* Lead Inbox */}
              <LeadInbox 
                leads={MOCK_LEADS} 
                onSelectLead={handleSelectLead}
                selectedLeadId={selectedLead?.id || null}
              />
              
              {/* Routing Controls */}
              <div className="grid lg:grid-cols-2 gap-6">
                <FeierabendGate
                  capacityAvailable={capacityAvailable}
                  onCapacityChange={setCapacityAvailable}
                  selectedLead={selectedLead}
                />
                <PartnerOffering
                  selectedLead={selectedLead}
                  onSendOffer={handleSendOffer}
                />
              </div>
            </TabsContent>
            
            {/* Auction Tab */}
            <TabsContent value="auction" className="space-y-6">
              <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <PremiumAuction
                    selectedLead={selectedLead}
                    bids={MOCK_BIDS}
                    config={auctionConfig}
                    onConfigChange={setAuctionConfig}
                    onSelectWinner={handleSelectWinner}
                  />
                </div>
                <QualityProtection metrics={qualityMetrics} />
              </div>
            </TabsContent>
            
            {/* Outcome Log Tab */}
            <TabsContent value="log">
              <OutcomeLog records={MOCK_OUTCOMES} />
            </TabsContent>
            
            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                <PricingRules rules={MOCK_PRICING} />
                <DistributionChecklist />
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </>
  );
}
