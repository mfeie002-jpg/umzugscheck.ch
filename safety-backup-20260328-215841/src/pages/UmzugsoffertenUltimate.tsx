/**
 * UmzugsoffertenUltimate - Dynamic Ultimate Flow Page
 * 
 * Loads Ultimate Flow configurations from the database and renders them.
 * URL format: /umzugsofferten-ultimate-{flow_id}-{timestamp}
 */

import { useParams, Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Helmet } from 'react-helmet';
import { PageLoadingFallback } from '@/components/ui/loading-fallback';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { 
  HowItWorksSection,
  WhyUsSection,
  TrustAndSecuritySection,
  TestimonialsSection,
  FAQSection,
  BottomFinalCTA,
  BottomStickyCTA,
  PageEnhancements,
} from '@/components/offerten-v2';
import { UltimateFlowRenderer } from '@/components/ultimate-flow/UltimateFlowRenderer';

interface UltimateFlowData {
  id: string;
  flow_id: string;
  variant_name: string;
  variant_label: string;
  status: string;
  result_json: {
    ultimateFlow?: {
      name: string;
      description: string;
      flowCode: string;
      expectedScore: number;
      expectedConversionLift: string;
      keyFeatures: Array<{
        feature: string;
        impact: string;
        implementation: string;
        sourceFlow: string;
      }>;
      steps: Array<{
        number: number;
        name: string;
        features: string[];
        sourceElements: string[];
        archetypeValue: Record<string, string>;
      }>;
    };
    successMetrics?: {
      targetScore: number;
      conversionGoal: string;
      kpis: Array<{
        metric: string;
        current: string;
        target: string;
      }>;
    };
    implementationPlan?: Record<string, {
      name: string;
      duration: string;
      tasks: string[];
    }>;
  };
}

const UmzugsoffertenUltimate = () => {
  const { flowId } = useParams<{ flowId: string }>();
  
  // Extract the actual flow_id from the URL (format: ultimate-{flow_id}-{timestamp})
  const extractedFlowId = flowId?.replace(/^ultimate-/, '').replace(/-\d+$/, '') || '';
  
  const { data: ultimateFlow, isLoading, error } = useQuery({
    queryKey: ['ultimate-flow', extractedFlowId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('flow_feedback_variants')
        .select('*')
        .eq('flow_id', extractedFlowId.startsWith('ultimate-') ? extractedFlowId : `ultimate-${extractedFlowId}`)
        .single();
      
      if (error) {
        // Try with just the flow_id
        const { data: altData, error: altError } = await supabase
          .from('flow_feedback_variants')
          .select('*')
          .ilike('flow_id', `%${extractedFlowId}%`)
          .limit(1)
          .single();
        
        if (altError) throw altError;
        return altData as UltimateFlowData;
      }
      
      return data as UltimateFlowData;
    },
    enabled: !!extractedFlowId,
  });

  if (isLoading) {
    return <PageLoadingFallback />;
  }

  if (error || !ultimateFlow?.result_json?.ultimateFlow) {
    console.error('[UmzugsoffertenUltimate] Flow not found:', extractedFlowId, error);
    return <Navigate to="/umzugsofferten" replace />;
  }

  const flow = ultimateFlow.result_json.ultimateFlow;
  const metrics = ultimateFlow.result_json.successMetrics;

  return (
    <div className="min-h-screen bg-background">
      <PageEnhancements />
      <Helmet>
        <title>{flow.name} | Umzugscheck.ch</title>
        <meta name="description" content={flow.description} />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <main id="main-content">
        <div className="container mx-auto px-4 sm:px-6 pt-3 sm:pt-4 max-w-6xl">
          <h1 className="sr-only">{flow.name}</h1>
          <Breadcrumbs items={[
            { label: "Umzugsofferten", href: "/umzugsofferten" },
            { label: flow.name }
          ]} />
        </div>

        <section className="container mx-auto px-4 sm:px-6 max-w-6xl pt-4 sm:pt-6 pb-8">
          <UltimateFlowRenderer 
            flow={flow}
            metrics={metrics}
            flowId={ultimateFlow.flow_id}
          />
        </section>

        <HowItWorksSection />
        <WhyUsSection />
        <TrustAndSecuritySection />
        <TestimonialsSection />
        <FAQSection />
        <BottomFinalCTA />
      </main>

      <BottomStickyCTA />
    </div>
  );
};

export default UmzugsoffertenUltimate;
