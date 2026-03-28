/**
 * Offer Check Page
 * User pastes competitor quote → AI analyzes hidden costs
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, AlertTriangle, CheckCircle, Search, Phone, MessageCircle, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { GoldenNavigation } from "@/components/golden/navigation/GoldenNavigation";

interface AnalysisResult {
  totalAmount: number;
  hiddenCosts: string[];
  warnings: string[];
  positives: string[];
  fairnessScore: number;
}

const OfferCheck = () => {
  const [offerText, setOfferText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const analyzeOffer = async () => {
    if (!offerText.trim()) {
      toast.error("Bitte fügen Sie den Offerten-Text ein");
      return;
    }

    setIsAnalyzing(true);
    
    try {
      // Extract CHF amounts using regex
      const chfMatches = offerText.match(/CHF\s*([\d',\.]+)|(\d+['']?\d*)\s*CHF/gi);
      const amounts = chfMatches?.map(m => {
        const num = m.replace(/[^0-9.,]/g, '').replace(/'/g, '');
        return parseFloat(num);
      }).filter(n => !isNaN(n)) || [];
      
      const totalAmount = amounts.length > 0 ? Math.max(...amounts) : 0;
      
      // Detect potential issues
      const hiddenCosts: string[] = [];
      const warnings: string[] = [];
      const positives: string[] = [];
      
      const textLower = offerText.toLowerCase();
      
      // Check for hidden costs
      if (textLower.includes("stunde") || textLower.includes("/h")) {
        warnings.push("⚠️ Stundenbasierte Abrechnung - Endpreis kann variieren!");
      }
      if (textLower.includes("zuschlag") || textLower.includes("aufpreis")) {
        hiddenCosts.push("💰 Zuschläge/Aufpreise erwähnt");
      }
      if (textLower.includes("anfahrt") || textLower.includes("fahrkosten")) {
        hiddenCosts.push("🚗 Fahrkosten können extra berechnet werden");
      }
      if (!textLower.includes("versicherung")) {
        warnings.push("⚠️ Keine Versicherung erwähnt");
      }
      if (!textLower.includes("festpreis") && !textLower.includes("pauschal")) {
        warnings.push("⚠️ Kein Festpreis garantiert");
      }
      if (textLower.includes("exkl") || textLower.includes("exklusive") || textLower.includes("zzgl")) {
        hiddenCosts.push("💰 'Exklusive' Posten - Zusatzkosten möglich");
      }
      if (textLower.includes("montage") && textLower.includes("extra")) {
        hiddenCosts.push("🔧 Montage/Demontage extra berechnet");
      }
      
      // Check for positives
      if (textLower.includes("festpreis") || textLower.includes("pauschal")) {
        positives.push("✅ Festpreis-Garantie");
      }
      if (textLower.includes("versicherung") || textLower.includes("versichert")) {
        positives.push("✅ Versicherung enthalten");
      }
      if (textLower.includes("inkl") && textLower.includes("material")) {
        positives.push("✅ Verpackungsmaterial inklusive");
      }
      if (textLower.includes("garantie")) {
        positives.push("✅ Garantie erwähnt");
      }
      
      // Calculate fairness score
      let fairnessScore = 70;
      fairnessScore -= hiddenCosts.length * 10;
      fairnessScore -= warnings.length * 5;
      fairnessScore += positives.length * 10;
      fairnessScore = Math.max(20, Math.min(100, fairnessScore));
      
      const analysisResult: AnalysisResult = {
        totalAmount,
        hiddenCosts,
        warnings,
        positives,
        fairnessScore
      };
      
      setResult(analysisResult);
      
      // Save to database - use type assertion for new table
      await (supabase.from("offer_check_requests" as any) as any).insert({
        offer_text: offerText,
        offer_amount: totalAmount,
        detected_issues: { hiddenCosts, warnings, positives },
        analysis_result: analysisResult,
        status: "analyzed"
      });
      
      toast.success("Analyse abgeschlossen!");
    } catch (error) {
      console.error("Analysis error:", error);
      toast.error("Analyse fehlgeschlagen");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="min-h-screen bg-background">
      <GoldenNavigation />
      
      <main className="container mx-auto px-4 py-8 pt-24">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <Badge className="mb-4 bg-primary/10 text-primary">
            <Shield className="w-4 h-4 mr-2" />
            Kostenloser Offerten-Check
          </Badge>
          <h1 className="text-3xl md:text-4xl font-black text-foreground mb-4">
            Offerte analysieren
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Fügen Sie eine Umzugs-Offerte ein – unsere KI erkennt versteckte Kosten und unfaire Klauseln.
          </p>
        </motion.div>
        
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          {/* Input */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                Offerten-Text einfügen
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Fügen Sie hier den kompletten Offerten-Text ein (Copy & Paste aus E-Mail oder PDF)..."
                value={offerText}
                onChange={(e) => setOfferText(e.target.value)}
                className="min-h-[300px] font-mono text-sm"
              />
              <Button 
                onClick={analyzeOffer}
                disabled={isAnalyzing || !offerText.trim()}
                className="w-full"
                size="lg"
              >
                {isAnalyzing ? (
                  <>
                    <Sparkles className="w-5 h-5 mr-2 animate-spin" />
                    Wird analysiert...
                  </>
                ) : (
                  <>
                    <Shield className="w-5 h-5 mr-2" />
                    Offerte prüfen
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
          
          {/* Results */}
          <Card className={result ? "border-primary/50" : ""}>
            <CardHeader>
              <CardTitle>Analyse-Ergebnis</CardTitle>
            </CardHeader>
            <CardContent>
              {result ? (
                <div className="space-y-6">
                  {/* Score */}
                  <div className="text-center p-4 rounded-xl bg-muted/50">
                    <p className="text-sm text-muted-foreground mb-2">Fairness-Score</p>
                    <p className={`text-5xl font-black ${getScoreColor(result.fairnessScore)}`}>
                      {result.fairnessScore}%
                    </p>
                    {result.totalAmount > 0 && (
                      <p className="text-lg font-bold mt-2">
                        Erkannter Betrag: CHF {result.totalAmount.toLocaleString()}
                      </p>
                    )}
                  </div>
                  
                  {/* Issues */}
                  {result.hiddenCosts.length > 0 && (
                    <div>
                      <h4 className="font-bold text-red-600 mb-2 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        Versteckte Kosten erkannt
                      </h4>
                      <ul className="space-y-1">
                        {result.hiddenCosts.map((cost, i) => (
                          <li key={i} className="text-sm text-red-700 bg-red-50 p-2 rounded">
                            {cost}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {result.warnings.length > 0 && (
                    <div>
                      <h4 className="font-bold text-yellow-600 mb-2">Warnungen</h4>
                      <ul className="space-y-1">
                        {result.warnings.map((warning, i) => (
                          <li key={i} className="text-sm text-yellow-700 bg-yellow-50 p-2 rounded">
                            {warning}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {result.positives.length > 0 && (
                    <div>
                      <h4 className="font-bold text-green-600 mb-2 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Positiv
                      </h4>
                      <ul className="space-y-1">
                        {result.positives.map((pos, i) => (
                          <li key={i} className="text-sm text-green-700 bg-green-50 p-2 rounded">
                            {pos}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {/* CTA */}
                  <div className="pt-4 border-t space-y-3">
                    <p className="text-sm text-muted-foreground text-center">
                      Unsicher? Wir helfen kostenlos:
                    </p>
                    <div className="flex gap-2">
                      <Button asChild variant="outline" className="flex-1">
                        <a href="tel:+41772258672">
                          <Phone className="w-4 h-4 mr-2" />
                          Anrufen
                        </a>
                      </Button>
                      <Button asChild variant="outline" className="flex-1">
                        <a href="https://wa.me/41772258672?text=Ich%20habe%20eine%20Frage%20zu%20meiner%20Offerte" target="_blank">
                          <MessageCircle className="w-4 h-4 mr-2" />
                          WhatsApp
                        </a>
                      </Button>
                    </div>
                    <Button asChild className="w-full">
                      <Link to="/managed">
                        <ArrowRight className="w-4 h-4 mr-2" />
                        Zum Managed Service
                      </Link>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Shield className="w-16 h-16 mx-auto mb-4 opacity-20" />
                  <p>Fügen Sie eine Offerte ein und klicken Sie auf "Offerte prüfen"</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default OfferCheck;
