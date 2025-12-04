import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { 
  Zap, Wifi, Droplet, Flame, Phone, Tv, 
  CheckCircle, ExternalLink, Clock, AlertCircle
} from "lucide-react";

interface Utility {
  id: string;
  name: string;
  icon: React.ReactNode;
  type: 'electricity' | 'internet' | 'water' | 'gas' | 'phone' | 'tv';
  oldCancelled: boolean;
  newRegistered: boolean;
  deadline: string;
  tip: string;
}

const utilities: Utility[] = [
  {
    id: "1",
    name: "Strom",
    icon: <Zap className="h-5 w-5" />,
    type: "electricity",
    oldCancelled: false,
    newRegistered: false,
    deadline: "2 Wochen vor Umzug",
    tip: "Zählerstand am Umzugstag notieren"
  },
  {
    id: "2",
    name: "Internet & Telefon",
    icon: <Wifi className="h-5 w-5" />,
    type: "internet",
    oldCancelled: false,
    newRegistered: false,
    deadline: "3-4 Wochen vorher",
    tip: "Techniker-Termin frühzeitig buchen"
  },
  {
    id: "3",
    name: "Wasser",
    icon: <Droplet className="h-5 w-5" />,
    type: "water",
    oldCancelled: false,
    newRegistered: false,
    deadline: "1 Woche vorher",
    tip: "Oft über Gemeinde geregelt"
  },
  {
    id: "4",
    name: "Gas/Heizung",
    icon: <Flame className="h-5 w-5" />,
    type: "gas",
    oldCancelled: false,
    newRegistered: false,
    deadline: "2 Wochen vorher",
    tip: "Zählerstand dokumentieren"
  },
  {
    id: "5",
    name: "Mobilfunk",
    icon: <Phone className="h-5 w-5" />,
    type: "phone",
    oldCancelled: false,
    newRegistered: false,
    deadline: "Keine Eile",
    tip: "Adresse im Kundenkonto ändern"
  },
  {
    id: "6",
    name: "TV/Streaming",
    icon: <Tv className="h-5 w-5" />,
    type: "tv",
    oldCancelled: false,
    newRegistered: false,
    deadline: "1 Woche vorher",
    tip: "Serafe-Gebühren beachten"
  }
];

export const UtilityTransferGuide = () => {
  const [utilityList, setUtilityList] = useState<Utility[]>(utilities);

  const toggleOldCancelled = (id: string) => {
    setUtilityList(utilityList.map(u =>
      u.id === id ? { ...u, oldCancelled: !u.oldCancelled } : u
    ));
  };

  const toggleNewRegistered = (id: string) => {
    setUtilityList(utilityList.map(u =>
      u.id === id ? { ...u, newRegistered: !u.newRegistered } : u
    ));
  };

  const completedCount = utilityList.filter(u => u.oldCancelled && u.newRegistered).length;
  const progress = Math.round((completedCount / utilityList.length) * 100);

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Versorger ummelden
          </CardTitle>
          <Badge variant={progress === 100 ? "default" : "secondary"}>
            {completedCount}/{utilityList.length}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress */}
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-muted-foreground">
            {progress === 100 
              ? "Alle Versorger umgemeldet!" 
              : `Noch ${utilityList.length - completedCount} Versorger zu ummelden`}
          </p>
        </div>

        {/* Utility List */}
        <div className="space-y-3">
          {utilityList.map(utility => {
            const isComplete = utility.oldCancelled && utility.newRegistered;
            
            return (
              <div
                key={utility.id}
                className={`p-4 rounded-lg border transition-colors ${
                  isComplete 
                    ? 'border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/30' 
                    : 'border-border/50'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${
                    isComplete ? 'bg-green-100 text-green-600' : 'bg-muted'
                  }`}>
                    {utility.icon}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{utility.name}</h4>
                      {isComplete && (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <label className="flex items-center gap-2 p-2 rounded-lg bg-muted/50 cursor-pointer">
                        <Checkbox
                          checked={utility.oldCancelled}
                          onCheckedChange={() => toggleOldCancelled(utility.id)}
                        />
                        <span className="text-sm">Alte Adresse gekündigt</span>
                      </label>
                      <label className="flex items-center gap-2 p-2 rounded-lg bg-muted/50 cursor-pointer">
                        <Checkbox
                          checked={utility.newRegistered}
                          onCheckedChange={() => toggleNewRegistered(utility.id)}
                        />
                        <span className="text-sm">Neue Adresse angemeldet</span>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{utility.deadline}</span>
                      </div>
                      <div className="flex items-center gap-1 text-amber-600">
                        <AlertCircle className="h-3 w-3" />
                        <span>{utility.tip}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Info Box */}
        <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
          <h4 className="font-medium text-sm text-blue-700 dark:text-blue-400 mb-2">
            Tipps zur Ummeldung
          </h4>
          <ul className="text-xs text-blue-600 dark:text-blue-500 space-y-1">
            <li>• Zählerstände am Ein- und Auszugstag fotografieren</li>
            <li>• Kündigungsfristen der Verträge prüfen</li>
            <li>• Bei Umzug innerhalb des gleichen Versorgungsgebiets: Umzugsmeldung reicht oft</li>
            <li>• Internet-Techniker frühzeitig buchen (oft 2-3 Wochen Wartezeit)</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default UtilityTransferGuide;
