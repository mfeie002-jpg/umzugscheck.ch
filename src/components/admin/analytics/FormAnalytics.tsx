import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { FileInput, TrendingUp, AlertTriangle, Download } from "lucide-react";

interface FormMetric {
  formName: string;
  page: string;
  starts: number;
  completions: number;
  abandonments: number;
  avgTime: string;
  dropoffField: string;
}

const MOCK_FORM_DATA: FormMetric[] = [
  { formName: "Umzugs-Offerte", page: "/umzugsofferten", starts: 2450, completions: 890, abandonments: 1560, avgTime: "2:34", dropoffField: "PLZ (Von)" },
  { formName: "Preisrechner", page: "/preisrechner", starts: 3200, completions: 1850, abandonments: 1350, avgTime: "1:45", dropoffField: "Zimmeranzahl" },
  { formName: "Kontaktformular", page: "/kontakt", starts: 450, completions: 380, abandonments: 70, avgTime: "0:48", dropoffField: "Nachricht" },
  { formName: "Newsletter", page: "/ratgeber", starts: 320, completions: 290, abandonments: 30, avgTime: "0:15", dropoffField: "-" },
];

export function FormAnalytics() {
  const [formData] = useState<FormMetric[]>(MOCK_FORM_DATA);

  const exportData = () => {
    const blob = new Blob([JSON.stringify({ formAnalytics: formData, exported: new Date().toISOString() }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `form-analytics-${Date.now()}.json`;
    a.click();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileInput className="h-5 w-5" />
          Form Analytics
        </CardTitle>
        <CardDescription>Analysiere Formular-Completion-Rates und Abbruchpunkte</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-end mb-4">
          <Button variant="outline" size="sm" onClick={exportData}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
        <div className="space-y-4">
          {formData.map((form, i) => {
            const completionRate = (form.completions / form.starts) * 100;
            return (
              <div key={i} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold">{form.formName}</h4>
                    <p className="text-sm text-muted-foreground">{form.page}</p>
                  </div>
                  <Badge variant={completionRate > 50 ? "default" : completionRate > 30 ? "secondary" : "destructive"}>
                    {completionRate.toFixed(1)}% Completion
                  </Badge>
                </div>
                <Progress value={completionRate} />
                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Starts</p>
                    <p className="font-semibold">{form.starts.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Abgeschlossen</p>
                    <p className="font-semibold text-green-600">{form.completions.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Abgebrochen</p>
                    <p className="font-semibold text-red-600">{form.abandonments.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Durchschn. Zeit</p>
                    <p className="font-semibold">{form.avgTime}</p>
                  </div>
                </div>
                {form.dropoffField !== "-" && (
                  <div className="flex items-center gap-2 text-sm bg-yellow-50 rounded p-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <span className="text-yellow-700">Häufigster Abbruch bei: <strong>{form.dropoffField}</strong></span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
