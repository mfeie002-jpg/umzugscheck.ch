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
    /* Issue #22, #30 - Full height layout without mobile nav overlap */
    <div className="min-h-[100dvh] bg-background flex flex-col">
      <Helmet>
        <title>Umzugsofferten Chat V2.e | Umzugscheck.ch</title>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="description" content="Erhalten Sie Umzugsofferten in einem persönlichen Chat - schnell, einfach und kostenlos." />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </Helmet>

      {/* Issue #1, #30 - Simpler breadcrumb that doesn't truncate */}
      <div className="container mx-auto px-3 sm:px-4 md:px-6 max-w-3xl py-2 sm:py-3 flex-shrink-0">
        <Breadcrumbs items={[{ label: "Chat Offerten" }]} />
      </div>

      {/* Issue #22 - Content ends above any mobile bars with proper padding */}
      <section className="container mx-auto px-2 sm:px-4 md:px-6 max-w-3xl flex-1 pb-2 sm:pb-4">
        <ChatFunnelV2e />
      </section>
    </div>
  );
};

export default UmzugsoffertenV2e;
