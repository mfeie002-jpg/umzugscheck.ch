import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { FlaskConical, TrendingUp, Download, CheckCircle, XCircle, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface ABTest {
  id: string;
  name: string;
  status: string;
  variant_a_config: any;
  variant_b_config: any;
  variant_a_impressions: number | null;
  variant_b_impressions: number | null;
  variant_a_conversions: number | null;
  variant_b_conversions: number | null;
  started_at: string | null;
  ended_at: string | null;
}

export function ABTestResults() {
  const [tests, setTests] = useState<ABTest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTests();
  }, []);

  const loadTests = async () => {
    try {
      const { data, error } = await supabase
        .from('ab_tests')
        .select('*')
        .order('started_at', { ascending: false });

      if (error) throw error;
      setTests(data || []);
    } catch (error) {
      console.error('Error loading A/B tests:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportTests = () => {
    const blob = new Blob([JSON.stringify({ abTests: tests, exported: new Date().toISOString() }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ab-test-results-${Date.now()}.json`;
    a.click();
  };

  const getWinner = (test: ABTest) => {
    const aRate = (test.variant_a_conversions || 0) / (test.variant_a_impressions || 1);
    const bRate = (test.variant_b_conversions || 0) / (test.variant_b_impressions || 1);
    if (aRate > bRate * 1.1) return 'A';
    if (bRate > aRate * 1.1) return 'B';
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FlaskConical className="h-5 w-5" />
          A/B Test Results
        </CardTitle>
        <CardDescription>Auswertung laufender und abgeschlossener Tests</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-end mb-4">
          <Button variant="outline" size="sm" onClick={exportTests}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-8 text-muted-foreground">Lade Tests...</div>
        ) : tests.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Keine A/B Tests gefunden. Tests werden in der ab_tests Tabelle gespeichert.
          </div>
        ) : (
          <div className="space-y-4">
            {tests.map((test) => {
              const aRate = ((test.variant_a_conversions || 0) / (test.variant_a_impressions || 1) * 100).toFixed(2);
              const bRate = ((test.variant_b_conversions || 0) / (test.variant_b_impressions || 1) * 100).toFixed(2);
              const winner = getWinner(test);

              return (
                <div key={test.id} className="border rounded-lg p-4 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold">{test.name}</h4>
                      <p className="text-xs text-muted-foreground">
                        {test.started_at ? new Date(test.started_at).toLocaleDateString('de-CH') : 'Nicht gestartet'}
                        {test.ended_at && ` - ${new Date(test.ended_at).toLocaleDateString('de-CH')}`}
                      </p>
                    </div>
                    <Badge variant={
                      test.status === 'active' ? 'default' : 
                      test.status === 'completed' ? 'secondary' : 'outline'
                    }>
                      {test.status === 'active' ? <Clock className="h-3 w-3 mr-1" /> : 
                       test.status === 'completed' ? <CheckCircle className="h-3 w-3 mr-1" /> : null}
                      {test.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Variant A */}
                    <div className={`p-3 rounded-lg border-2 ${winner === 'A' ? 'border-green-500 bg-green-50' : 'border-slate-200'}`}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">Variante A</span>
                        {winner === 'A' && <Badge className="bg-green-500">Gewinner</Badge>}
                      </div>
                      <div className="text-2xl font-bold">{aRate}%</div>
                      <div className="text-xs text-muted-foreground">
                        {test.variant_a_conversions || 0} / {test.variant_a_impressions || 0} Konversionen
                      </div>
                      <Progress value={Number(aRate)} className="h-2 mt-2" />
                    </div>

                    {/* Variant B */}
                    <div className={`p-3 rounded-lg border-2 ${winner === 'B' ? 'border-green-500 bg-green-50' : 'border-slate-200'}`}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">Variante B</span>
                        {winner === 'B' && <Badge className="bg-green-500">Gewinner</Badge>}
                      </div>
                      <div className="text-2xl font-bold">{bRate}%</div>
                      <div className="text-xs text-muted-foreground">
                        {test.variant_b_conversions || 0} / {test.variant_b_impressions || 0} Konversionen
                      </div>
                      <Progress value={Number(bRate)} className="h-2 mt-2" />
                    </div>
                  </div>

                  {winner && (
                    <div className="bg-green-50 rounded p-3 flex items-center gap-2 text-sm text-green-700">
                      <TrendingUp className="h-4 w-4" />
                      Variante {winner} zeigt {Math.abs(Number(aRate) - Number(bRate)).toFixed(1)}% bessere Performance
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
