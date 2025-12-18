import { CantonTemplate } from "@/components/canton/CantonTemplate";
import { luzernConfig } from "@/config/cantonConfigs";
import { Header } from "@/components/homepage/Header";
import { SimplifiedFooter } from "@/components/home/SimplifiedFooter";

export const LuzernNew = () => {
  return (
    <>
      <Header />
      <CantonTemplate config={luzernConfig} />
      <SimplifiedFooter />
    </>
  );
};

export default LuzernNew;
