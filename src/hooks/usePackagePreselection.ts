import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

/**
 * Hook to detect package preselection based on URL parameters
 * Can be used to preselect "Komfort" for pricing-related ads
 */
export function usePackagePreselection() {
  const [searchParams] = useSearchParams();

  return useMemo(() => {
    const utmTerm = searchParams.get("utm_term")?.toLowerCase() || "";
    const utmCampaign = searchParams.get("utm_campaign")?.toLowerCase() || "";

    if (utmTerm.includes("preis") || utmTerm.includes("kosten") || utmCampaign.includes("pricing")) {
      return "komfort";
    }

    if (utmTerm.includes("premium") || utmCampaign.includes("premium")) {
      return "premium";
    }

    return undefined;
  }, [searchParams]);
}
