import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GitBranch, ArrowRight, Download, TrendingDown, TrendingUp } from "lucide-react";

interface FlowNode {
  page: string;
  visitors: number;
  exitRate: number;
  nextPages: { page: string; visitors: number }[];
}

const MOCK_FLOW_DATA: FlowNode[] = [
  {
    page: "Homepage",
    visitors: 10000,
    exitRate: 15,
    nextPages: [
      { page: "Preisrechner", visitors: 3500 },
      { page: "Firmen", visitors: 2800 },
      { page: "Umzugsofferten", visitors: 2200 },
    ]
  },
  {
    page: "Preisrechner",
    visitors: 3500,
    exitRate: 25,
    nextPages: [
      { page: "Umzugsofferten", visitors: 1800 },
      { page: "Firmen", visitors: 800 },
    ]
  },
  {
    page: "Umzugsofferten",
    visitors: 4000,
    exitRate: 35,
    nextPages: [
      { page: "Danke (Conversion)", visitors: 1400 },
      { page: "Homepage", visitors: 600 },
    ]
  },
  {
    page: "Firmen",
    visitors: 3600,
    exitRate: 30,
    nextPages: [
      { page: "Anbieter Detail", visitors: 2000 },
      { page: "Regionale Seite", visitors: 500 },
    ]
  },
];

export function UserFlowVisualization() {
  const [flowData] = useState<FlowNode[]>(MOCK_FLOW_DATA);

  const exportFlow = () => {
    const blob = new Blob([JSON.stringify({ userFlow: flowData, exported: new Date().toISOString() }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `user-flow-${Date.now()}.json`;
    a.click();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GitBranch className="h-5 w-5" />
          User Flow Visualization
        </CardTitle>
        <CardDescription>Visualisiere Benutzer-Navigation durch die Website</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-end mb-4">
          <Button variant="outline" size="sm" onClick={exportFlow}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>

        <div className="space-y-4 overflow-x-auto">
          {flowData.map((node, i) => (
            <div key={i} className="flex items-start gap-4">
              {/* Source Node */}
              <div className="w-48 flex-shrink-0 bg-primary/10 rounded-lg p-4 border-2 border-primary">
                <h4 className="font-semibold text-sm">{node.page}</h4>
                <p className="text-2xl font-bold">{node.visitors.toLocaleString()}</p>
                <div className="flex items-center gap-1 text-xs mt-2">
                  <TrendingDown className="h-3 w-3 text-red-500" />
                  <span className="text-red-600">{node.exitRate}% Exit</span>
                </div>
              </div>

              {/* Arrows and Next Pages */}
              <div className="flex-1 space-y-2">
                {node.nextPages.map((next, j) => {
                  const percentage = ((next.visitors / node.visitors) * 100).toFixed(1);
                  return (
                    <div key={j} className="flex items-center gap-3">
                      <div className="flex items-center text-muted-foreground">
                        <div 
                          className="h-0.5 bg-slate-300" 
                          style={{ width: `${Math.max(30, Number(percentage) * 2)}px` }}
                        />
                        <ArrowRight className="h-4 w-4 mx-1" />
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-white">
                          {next.page}
                        </Badge>
                        <span className="text-sm font-medium">{next.visitors.toLocaleString()}</span>
                        <span className="text-xs text-muted-foreground">({percentage}%)</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Conversion Summary */}
        <div className="mt-6 pt-4 border-t">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-sm text-muted-foreground">Eintritte</p>
              <p className="text-2xl font-bold">10,000</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Konversionen</p>
              <p className="text-2xl font-bold text-green-600">1,400</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Conversion Rate</p>
              <p className="text-2xl font-bold text-primary">14%</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
