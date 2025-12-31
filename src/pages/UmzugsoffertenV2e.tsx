/**
 * /umzugsofferten-v2e - Chat-Based Conversational Funnel
 * 
 * Experimental: Full chat interface for moving quotes
 * - Conversational UX instead of form steps
 * - All V1 features (services, companies, prices) integrated
 * - Feels like talking to a real consultant
 */

import { Helmet } from "react-helmet";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ChatFunnelV2e } from "@/components/funnel-v2e";

const UmzugsoffertenV2e = () => {
  return (
    <div className="min-h-[100dvh] bg-background">
      <Helmet>
        <title>Umzugsofferten Chat V2.e | Umzugscheck.ch</title>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="description" content="Erhalten Sie Umzugsofferten in einem persönlichen Chat - schnell, einfach und kostenlos." />
      </Helmet>

      <div className="container mx-auto px-2 sm:px-4 md:px-6 max-w-3xl py-2 sm:py-4">
        <Breadcrumbs items={[{ label: "V2.e Chat Funnel (Experimental)" }]} />
      </div>

      <section className="container mx-auto px-2 sm:px-4 md:px-6 max-w-3xl pt-1 sm:pt-2 pb-4 sm:pb-8">
        <ChatFunnelV2e />
      </section>
    </div>
  );
};

export default UmzugsoffertenV2e;
