import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { FlaskConical, Play, Pause, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface ABTest {
  id: string;
  name: string;
  description: string;
  variant_a_config: any;
  variant_b_config: any;
  variant_a_impressions: number;
  variant_b_impressions: number;
  variant_a_conversions: number;
  variant_b_conversions: number;
  status: string;
  started_at: string;
  ended_at: string | null;
}

interface ABTestManagerProps {
  currentFeatured: any[];
  currentOrganic: any[];
}

export function ABTestManager({ currentFeatured, currentOrganic }: ABTestManagerProps) {
  const [tests, setTests] = useState<ABTest[]>([]);
  const [loading, setLoading] = useState(false);
  const [testName, setTestName] = useState("");
  const [description, setDescription] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    try {
      const { data, error } = await supabase
        .from("ab_tests")
        .select("*")
        .order("started_at", { ascending: false });

      if (error) throw error;
      if (data) setTests(data);
    } catch (error) {
      console.error("Error fetching AB tests:", error);
    }
  };

  const createTest = async () => {
    if (!testName || !description) {
      toast({
        title: "Fehlende Angaben",
        description: "Bitte Name und Beschreibung angeben",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      
      // Variant A: Current configuration
      const variantA = {
        featured: currentFeatured.map((c, i) => ({ id: c.id, position: i + 1 })),
        organic: currentOrganic.map((c, i) => ({ id: c.id, position: i + 1 })),
      };

      // Variant B: Shuffled configuration (for testing purposes)
      const shuffledFeatured = [...currentFeatured].sort(() => Math.random() - 0.5);
      const shuffledOrganic = [...currentOrganic].sort(() => Math.random() - 0.5);
      
      const variantB = {
        featured: shuffledFeatured.map((c, i) => ({ id: c.id, position: i + 1 })),
        organic: shuffledOrganic.map((c, i) => ({ id: c.id, position: i + 1 })),
      };

      const { error } = await supabase
        .from("ab_tests")
        .insert({
          name: testName,
          description,
          variant_a_config: variantA,
          variant_b_config: variantB,
          status: "active",
        });

      if (error) throw error;

      toast({
        title: "Test erstellt",
        description: "A/B-Test wurde gestartet",
      });

      setTestName("");
      setDescription("");
      fetchTests();
    } catch (error) {
      console.error("Error creating AB test:", error);
      toast({
        title: "Fehler",
        description: "Test konnte nicht erstellt werden",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleTestStatus = async (testId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === "active" ? "paused" : "active";
      const { error } = await supabase
        .from("ab_tests")
        .update({ 
          status: newStatus,
          ended_at: newStatus === "paused" ? new Date().toISOString() : null
        })
        .eq("id", testId);

      if (error) throw error;

      toast({
        title: "Status aktualisiert",
        description: `Test wurde ${newStatus === "active" ? "gestartet" : "pausiert"}`,
      });

      fetchTests();
    } catch (error) {
      console.error("Error toggling test status:", error);
      toast({
        title: "Fehler",
        description: "Status konnte nicht geändert werden",
        variant: "destructive",
      });
    }
  };

  const calculateConversionRate = (conversions: number, impressions: number): string => {
    if (impressions === 0) return "0.00";
    return ((conversions / impressions) * 100).toFixed(2);
  };

  const getWinner = (test: ABTest) => {
    const rateA = parseFloat(calculateConversionRate(test.variant_a_conversions, test.variant_a_impressions));
    const rateB = parseFloat(calculateConversionRate(test.variant_b_conversions, test.variant_b_impressions));
    
    if (rateA > rateB) return "A";
    if (rateB > rateA) return "B";
    return "Tie";
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <FlaskConical className="w-5 h-5" />
          Neuen A/B-Test erstellen
        </h3>

        <div className="space-y-4">
          <div>
            <Label htmlFor="test-name">Test-Name</Label>
            <Input
              id="test-name"
              placeholder="z.B. Featured Position Test Q1 2025"
              value={testName}
              onChange={(e) => setTestName(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="test-description">Beschreibung</Label>
            <Textarea
              id="test-description"
              placeholder="Was möchten Sie testen?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <Button onClick={createTest} disabled={loading}>
            <FlaskConical className="w-4 h-4 mr-2" />
            Test starten
          </Button>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Aktive & vergangene Tests</h3>

        {tests.length === 0 ? (
          <p className="text-sm text-muted-foreground">Keine Tests vorhanden</p>
        ) : (
          <div className="space-y-4">
            {tests.map((test) => {
              const winner = getWinner(test);
              return (
                <div key={test.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-semibold flex items-center gap-2">
                        {test.name}
                        <Badge variant={test.status === "active" ? "default" : "secondary"}>
                          {test.status}
                        </Badge>
                        {winner !== "Tie" && test.status !== "active" && (
                          <Badge variant="outline" className="flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            Gewinner: Variante {winner}
                          </Badge>
                        )}
                      </h4>
                      <p className="text-sm text-muted-foreground">{test.description}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleTestStatus(test.id, test.status)}
                    >
                      {test.status === "active" ? (
                        <>
                          <Pause className="w-4 h-4 mr-2" />
                          Pausieren
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 mr-2" />
                          Starten
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="border rounded p-3">
                      <h5 className="font-semibold text-sm mb-2">Variante A (Original)</h5>
                      <div className="space-y-2">
                        <div>
                          <p className="text-xs text-muted-foreground">Impressionen</p>
                          <p className="text-xl font-bold">{test.variant_a_impressions}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Conversions</p>
                          <p className="text-xl font-bold">{test.variant_a_conversions}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Conversion Rate</p>
                          <p className="text-xl font-bold">
                            {calculateConversionRate(test.variant_a_conversions, test.variant_a_impressions)}%
                          </p>
                        </div>
                        <Progress 
                          value={parseFloat(calculateConversionRate(test.variant_a_conversions, test.variant_a_impressions))} 
                        />
                      </div>
                    </div>

                    <div className="border rounded p-3">
                      <h5 className="font-semibold text-sm mb-2">Variante B (Test)</h5>
                      <div className="space-y-2">
                        <div>
                          <p className="text-xs text-muted-foreground">Impressionen</p>
                          <p className="text-xl font-bold">{test.variant_b_impressions}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Conversions</p>
                          <p className="text-xl font-bold">{test.variant_b_conversions}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Conversion Rate</p>
                          <p className="text-xl font-bold">
                            {calculateConversionRate(test.variant_b_conversions, test.variant_b_impressions)}%
                          </p>
                        </div>
                        <Progress 
                          value={parseFloat(calculateConversionRate(test.variant_b_conversions, test.variant_b_impressions))} 
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
