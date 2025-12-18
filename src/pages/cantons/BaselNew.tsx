import { CantonTemplate } from "@/components/canton/CantonTemplate";
import { baselConfig } from "@/config/cantonConfigs";
import { Header } from "@/components/homepage/Header";
import { SimplifiedFooter } from "@/components/home/SimplifiedFooter";

export const BaselNew = () => {
  return (
    <>
      <Header />
      <CantonTemplate config={baselConfig} />
      <SimplifiedFooter />
    </>
  );
};

export default BaselNew;
