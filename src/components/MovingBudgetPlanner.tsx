import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Wallet, TrendingUp, TrendingDown, PiggyBank, 
  AlertCircle, CheckCircle, Calculator, PieChart
} from "lucide-react";

interface BudgetCategory {
  id: string;
  name: string;
  budgeted: number;
  spent: number;
  icon: string;
}

export const MovingBudgetPlanner = () => {
  const [totalBudget, setTotalBudget] = useState(3000);
  const [categories, setCategories] = useState<BudgetCategory[]>([
    { id: "moving", name: "Umzugsfirma", budgeted: 1500, spent: 0, icon: "🚚" },
    { id: "cleaning", name: "Reinigung", budgeted: 500, spent: 0, icon: "🧹" },
    { id: "materials", name: "Verpackungsmaterial", budgeted: 200, spent: 0, icon: "📦" },
    { id: "deposits", name: "Kautionen/Depots", budgeted: 500, spent: 0, icon: "🔑" },
    { id: "furniture", name: "Neue Möbel", budgeted: 200, spent: 0, icon: "🛋️" },
    { id: "misc", name: "Sonstiges", budgeted: 100, spent: 0, icon: "📋" },
  ]);

  const updateBudgeted = (id: string, value: number) => {
    setCategories(categories.map(c =>
      c.id === id ? { ...c, budgeted: value } : c
    ));
  };

  const updateSpent = (id: string, value: number) => {
    setCategories(categories.map(c =>
      c.id === id ? { ...c, spent: value } : c
    ));
  };

  const totalBudgeted = categories.reduce((sum, c) => sum + c.budgeted, 0);
  const totalSpent = categories.reduce((sum, c) => sum + c.spent, 0);
  const remaining = totalBudget - totalSpent;
  const budgetUsage = Math.round((totalSpent / totalBudget) * 100);

  const getBudgetStatus = () => {
    if (totalBudgeted > totalBudget) return { status: 'over', message: 'Budget überschritten' };
    if (totalBudgeted === totalBudget) return { status: 'exact', message: 'Budget vollständig verplant' };
    return { status: 'under', message: `CHF ${totalBudget - totalBudgeted} nicht verplant` };
  };

  const budgetStatus = getBudgetStatus();

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Wallet className="h-5 w-5 text-primary" />
          Umzugsbudget Planer
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Total Budget */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Gesamtbudget</Label>
            <span className="text-2xl font-bold text-primary">
              CHF {totalBudget.toLocaleString()}
            </span>
          </div>
          <Slider
            value={[totalBudget]}
            onValueChange={([value]) => setTotalBudget(value)}
            min={1000}
            max={10000}
            step={100}
          />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>CHF 1'000</span>
            <span>CHF 10'000</span>
          </div>
        </div>

        {/* Budget Overview */}
        <div className="grid grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
          <div className="text-center">
            <div className="text-xl font-bold text-primary">
              CHF {totalBudgeted.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">Geplant</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-green-600">
              CHF {totalSpent.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">Ausgegeben</div>
          </div>
          <div className="text-center">
            <div className={`text-xl font-bold ${remaining >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
              CHF {remaining.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">Übrig</div>
          </div>
        </div>

        {/* Budget Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Budgetverbrauch</span>
            <span className={`font-medium ${
              budgetUsage > 90 ? 'text-red-600' : budgetUsage > 70 ? 'text-yellow-600' : 'text-green-600'
            }`}>
              {budgetUsage}%
            </span>
          </div>
          <Progress value={budgetUsage} className="h-3" />
        </div>

        {/* Status Alert */}
        <div className={`flex items-center gap-2 p-3 rounded-lg ${
          budgetStatus.status === 'over' 
            ? 'bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400'
            : budgetStatus.status === 'exact'
            ? 'bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400'
            : 'bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400'
        }`}>
          {budgetStatus.status === 'over' ? (
            <AlertCircle className="h-4 w-4" />
          ) : (
            <CheckCircle className="h-4 w-4" />
          )}
          <span className="text-sm">{budgetStatus.message}</span>
        </div>

        {/* Category Breakdown */}
        <div className="space-y-4">
          <h4 className="font-medium text-sm">Kategorien</h4>
          {categories.map(category => {
            const percentage = Math.round((category.spent / category.budgeted) * 100) || 0;
            const isOverBudget = category.spent > category.budgeted;
            
            return (
              <div key={category.id} className="p-4 border border-border/50 rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{category.icon}</span>
                    <span className="font-medium">{category.name}</span>
                  </div>
                  <Badge variant={isOverBudget ? "destructive" : "secondary"}>
                    {percentage}%
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-xs">Budget</Label>
                    <Input
                      type="number"
                      value={category.budgeted}
                      onChange={(e) => updateBudgeted(category.id, Number(e.target.value))}
                      className="h-8"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Ausgegeben</Label>
                    <Input
                      type="number"
                      value={category.spent}
                      onChange={(e) => updateSpent(category.id, Number(e.target.value))}
                      className="h-8"
                    />
                  </div>
                </div>
                
                <Progress 
                  value={Math.min(percentage, 100)} 
                  className={`h-2 ${isOverBudget ? '[&>div]:bg-red-500' : ''}`}
                />
              </div>
            );
          })}
        </div>

        {/* Tips */}
        <div className="p-4 bg-green-50 dark:bg-green-950/30 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <PiggyBank className="h-5 w-5 text-green-600" />
            <span className="font-medium text-sm text-green-700 dark:text-green-400">
              Spartipps
            </span>
          </div>
          <ul className="text-xs text-green-600 dark:text-green-500 space-y-1">
            <li>• Umzug in der Wochenmitte ist günstiger</li>
            <li>• Kartons bei Supermärkten kostenlos abholen</li>
            <li>• Helfer aus dem Freundeskreis einplanen</li>
            <li>• Nicht mehr benötigte Möbel vorher verkaufen</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default MovingBudgetPlanner;
