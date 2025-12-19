import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Video, Play, Clock, Monitor, Smartphone, Globe, Download, ExternalLink } from "lucide-react";

interface SessionRecord {
  id: string;
  date: string;
  duration: string;
  pages: number;
  device: 'desktop' | 'mobile' | 'tablet';
  country: string;
  conversionPath: string[];
  converted: boolean;
}

const MOCK_SESSIONS: SessionRecord[] = [
  { id: "s1", date: "2024-01-15 14:32", duration: "4:23", pages: 6, device: "desktop", country: "CH", conversionPath: ["Homepage", "Preisrechner", "Offerten", "Danke"], converted: true },
  { id: "s2", date: "2024-01-15 14:28", duration: "1:45", pages: 3, device: "mobile", country: "CH", conversionPath: ["Homepage", "Firmen", "Exit"], converted: false },
  { id: "s3", date: "2024-01-15 14:15", duration: "6:12", pages: 8, device: "desktop", country: "DE", conversionPath: ["Ratgeber", "Kosten", "Preisrechner", "Offerten"], converted: true },
  { id: "s4", date: "2024-01-15 13:58", duration: "0:45", pages: 2, device: "mobile", country: "CH", conversionPath: ["Homepage", "Exit"], converted: false },
  { id: "s5", date: "2024-01-15 13:42", duration: "3:18", pages: 5, device: "tablet", country: "AT", conversionPath: ["Firmen", "Zürich", "Anbieter Details", "Kontakt"], converted: true },
];

export function SessionRecordings() {
  const [sessions] = useState<SessionRecord[]>(MOCK_SESSIONS);
  const [filter, setFilter] = useState<string>("all");

  const filteredSessions = filter === "all" ? sessions : 
    filter === "converted" ? sessions.filter(s => s.converted) :
    sessions.filter(s => !s.converted);

  const exportSessions = () => {
    const blob = new Blob([JSON.stringify({ sessions: filteredSessions, exported: new Date().toISOString() }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `session-recordings-${Date.now()}.json`;
    a.click();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Video className="h-5 w-5" />
          Session Recordings
        </CardTitle>
        <CardDescription>Benutzer-Sessions nachvollziehen (Hotjar Integration)</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle Sessions</SelectItem>
              <SelectItem value="converted">Konvertiert</SelectItem>
              <SelectItem value="bounced">Abgebrochen</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={exportSessions}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>

        <div className="space-y-3">
          {filteredSessions.map((session) => (
            <div key={session.id} className="border rounded-lg p-4 hover:bg-slate-50 transition-colors">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  {session.device === 'desktop' ? <Monitor className="h-4 w-4 text-slate-500" /> :
                   session.device === 'mobile' ? <Smartphone className="h-4 w-4 text-slate-500" /> :
                   <Monitor className="h-4 w-4 text-slate-500" />}
                  <div>
                    <p className="font-medium text-sm">{session.date}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Globe className="h-3 w-3" /> {session.country}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={session.converted ? "default" : "secondary"}>
                    {session.converted ? "Konvertiert" : "Abgebrochen"}
                  </Badge>
                  <Button size="sm" variant="ghost">
                    <Play className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-6 text-sm text-muted-foreground mb-3">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {session.duration}
                </span>
                <span>{session.pages} Seiten</span>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {session.conversionPath.map((page, i) => (
                  <div key={i} className="flex items-center">
                    <Badge variant="outline" className="whitespace-nowrap text-xs">
                      {page}
                    </Badge>
                    {i < session.conversionPath.length - 1 && (
                      <span className="mx-1 text-slate-400">→</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t text-center">
          <Button variant="link" className="text-sm">
            <ExternalLink className="h-4 w-4 mr-2" />
            Alle Sessions in Hotjar ansehen
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
