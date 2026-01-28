/**
 * AI Audit Dashboard
 * Main hub for all AI-powered site analysis tools
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Activity, Download, Sparkles, Users,
  Shield, Search, Palette, Zap
} from 'lucide-react';
import { SiteHealthDashboard } from './SiteHealthDashboard';
import { DeepResearchExporter } from './DeepResearchExporter';
import { LiveAIAnalysis } from './LiveAIAnalysis';
import { CompetitorComparison } from './CompetitorComparison';

const TABS = [
  {
    id: 'health',
    label: 'Site Health',
    icon: <Activity className="w-4 h-4" />,
    description: 'SEO, UX, Performance & Trust Audit',
    badge: '4 Module'
  },
  {
    id: 'export',
    label: 'Deep Research',
    icon: <Download className="w-4 h-4" />,
    description: 'Export für ChatGPT & Gemini',
    badge: 'Export'
  },
  {
    id: 'live',
    label: 'Live AI',
    icon: <Sparkles className="w-4 h-4" />,
    description: 'Echtzeit AI-Analyse',
    badge: 'Live'
  },
  {
    id: 'competitors',
    label: 'Wettbewerb',
    icon: <Users className="w-4 h-4" />,
    description: 'MOVU, Sirelo Vergleich',
    badge: '4 Konkurrenten'
  }
];

export const AIAuditDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('health');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Shield className="w-6 h-6 text-primary" />
            AI Audit System
          </h1>
          <p className="text-muted-foreground mt-1">
            Komplette Site-Analyse mit AI-Power
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Search className="w-3 h-3" /> SEO
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <Palette className="w-3 h-3" /> UX
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <Zap className="w-3 h-3" /> Performance
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <Shield className="w-3 h-3" /> Trust
          </Badge>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">SEO Score</div>
            <div className="text-2xl font-bold text-blue-500">78%</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">UX Score</div>
            <div className="text-2xl font-bold text-purple-500">82%</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">Performance</div>
            <div className="text-2xl font-bold text-amber-500">68%</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">Trust Score</div>
            <div className="text-2xl font-bold text-green-500">85%</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          {TABS.map((tab) => (
            <TabsTrigger 
              key={tab.id} 
              value={tab.id}
              className="flex items-center gap-2"
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="health" className="mt-6">
          <SiteHealthDashboard />
        </TabsContent>

        <TabsContent value="export" className="mt-6">
          <DeepResearchExporter />
        </TabsContent>

        <TabsContent value="live" className="mt-6">
          <LiveAIAnalysis />
        </TabsContent>

        <TabsContent value="competitors" className="mt-6">
          <CompetitorComparison />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIAuditDashboard;
