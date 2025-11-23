import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QuickCalculator } from "@/components/calculator/QuickCalculator";
import { AdvancedCalculator } from "@/components/calculator/AdvancedCalculator";
import { AICalculator } from "@/components/calculator/AICalculator";
import { Calculator as CalculatorIcon, Wrench, Sparkles } from "lucide-react";

const Calculator = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 bg-gradient-light">
        {/* Header */}
        <section className="py-12 md:py-16 gradient-hero text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="mb-4">Umzugskosten berechnen</h1>
              <p className="text-lg md:text-xl text-white/90">
                Wählen Sie Ihren Rechner – von schnell bis präzise. 
                Erhalten Sie sofort eine Kostenschätzung.
              </p>
            </div>
          </div>
        </section>

        {/* Calculator Tabs */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <Tabs defaultValue="quick" className="w-full">
                <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 h-auto gap-2 md:gap-4 bg-white p-2 rounded-xl shadow-medium">
                  <TabsTrigger 
                    value="quick" 
                    className="flex flex-col md:flex-row items-center gap-2 py-4 data-[state=active]:bg-primary data-[state=active]:text-white"
                  >
                    <CalculatorIcon className="w-5 h-5" />
                    <div className="text-center md:text-left">
                      <div className="font-semibold">Schnell-Rechner</div>
                      <div className="text-xs opacity-70">60 Sekunden</div>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="advanced"
                    className="flex flex-col md:flex-row items-center gap-2 py-4 data-[state=active]:bg-primary data-[state=active]:text-white"
                  >
                    <Wrench className="w-5 h-5" />
                    <div className="text-center md:text-left">
                      <div className="font-semibold">Detailliert</div>
                      <div className="text-xs opacity-70">Präzise Kalkulation</div>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="ai"
                    className="flex flex-col md:flex-row items-center gap-2 py-4 data-[state=active]:bg-accent data-[state=active]:text-white"
                  >
                    <Sparkles className="w-5 h-5" />
                    <div className="text-center md:text-left">
                      <div className="font-semibold">KI-Rechner</div>
                      <div className="text-xs opacity-70">Mit Foto/Video</div>
                    </div>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="quick" className="mt-8">
                  <QuickCalculator />
                </TabsContent>

                <TabsContent value="advanced" className="mt-8">
                  <AdvancedCalculator />
                </TabsContent>

                <TabsContent value="ai" className="mt-8">
                  <AICalculator />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Calculator;
