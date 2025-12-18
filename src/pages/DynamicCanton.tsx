import { useParams } from "react-router-dom";
import { CantonTemplate } from "@/components/canton/CantonTemplate";
import { getCantonConfig, isValidCanton } from "@/lib/cantonConfigMap";
import { Header } from "@/components/homepage/Header";
import { SimplifiedFooter } from "@/components/home/SimplifiedFooter";
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
  
  return (
    <>
      <Header />
      <CantonTemplate config={config} />
      <SimplifiedFooter />
    </>
  );
};

export default DynamicCanton;
