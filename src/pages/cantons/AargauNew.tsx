import { CantonTemplate } from "@/components/canton/CantonTemplate";
import { aargauConfig } from "@/config/cantonConfigs";
import { Header } from "@/components/homepage/Header";
import { SimplifiedFooter } from "@/components/home/SimplifiedFooter";

export const AargauNew = () => {
  return (
    <>
      <Header />
      <CantonTemplate config={aargauConfig} />
      <SimplifiedFooter />
    </>
  );
};

export default AargauNew;
