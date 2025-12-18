import { CantonTemplate } from "@/components/canton/CantonTemplate";
import { stgallenConfig } from "@/config/cantonConfigs";
import { Header } from "@/components/homepage/Header";
import { SimplifiedFooter } from "@/components/home/SimplifiedFooter";

export const StGallenNew = () => {
  return (
    <>
      <Header />
      <CantonTemplate config={stgallenConfig} />
      <SimplifiedFooter />
    </>
  );
};

export default StGallenNew;
