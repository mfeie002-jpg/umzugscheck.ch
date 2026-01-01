/**
 * Ultimate Swiss Flow Page
 * 
 * Best of 31 variants combined
 * Target Score: 98/100
 * Flow-Code: ultimate-ch-v1
 */

import { Helmet } from "react-helmet";
import { UltimateSwissFlow } from "@/components/ultimate-flow";

const UmzugsoffertenUltimateCH = () => (
  <>
    <Helmet>
      <title>Umzugsofferten vergleichen | Kostenlos & Unverbindlich | Umzugscheck.ch</title>
      <meta name="robots" content="noindex, nofollow" />
      <meta 
        name="description" 
        content="Vergleichen Sie kostenlos bis zu 5 Offerten von geprüften Schweizer Umzugsfirmen. Schnell, einfach und unverbindlich." 
      />
      <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    </Helmet>
    <UltimateSwissFlow />
  </>
);

export default UmzugsoffertenUltimateCH;
