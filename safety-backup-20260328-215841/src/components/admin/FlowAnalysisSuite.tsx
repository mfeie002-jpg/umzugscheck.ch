import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Camera, Zap, BarChart3 } from 'lucide-react';
import { CalculatorFlowReview } from './CalculatorFlowReview';
import AutoFlowDashboard from './AutoFlowDashboard';

/**
 * FlowAnalysisSuite - Unified interface for all flow analysis tools
 * 
 * Combines:
 * 1. Manual Flow Review (CalculatorFlowReview) - Screenshots, HTML, ChatGPT export
 * 2. AutoFlow Dashboard - Automated AI analysis with scoring, issues, alerts
 */
const FlowAnalysisSuite: React.FC = () => {
  const [activeTab, setActiveTab] = useState('manual');

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="manual" className="flex items-center gap-2">
            <Camera className="h-4 w-4" />
            Manuell + ChatGPT
          </TabsTrigger>
          <TabsTrigger value="auto" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            AutoFlow AI
          </TabsTrigger>
        </TabsList>

        <TabsContent value="manual" className="mt-6">
          <CalculatorFlowReview />
        </TabsContent>

        <TabsContent value="auto" className="mt-6">
          <AutoFlowDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FlowAnalysisSuite;
