import { useParams } from "react-router-dom";
import { CantonTemplate } from "@/components/canton/CantonTemplate";
import { getCantonConfig, isValidCanton } from "@/lib/cantonConfigMap";
import NotFound from "./NotFound";

const DynamicCanton = () => {
  const { canton } = useParams<{ canton: string }>();
  
  if (!canton || !isValidCanton(canton)) {
    return <NotFound />;
  }
  
  const config = getCantonConfig(canton);
  
  if (!config) {
    return <NotFound />;
  }
  
  return <CantonTemplate config={config} />;
};

export default DynamicCanton;
