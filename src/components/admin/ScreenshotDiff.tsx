import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { GitCompare, Loader2, Calendar, ArrowLeftRight, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface ArchiveSnapshot {
  timestamp: string;
  date: Date;
  files: string[];
}

interface DiffPair {
  url: string;
  pathname: string;
  before: string;
  after: string;
}

export function ScreenshotDiff() {
  const [loading, setLoading] = useState(false);
  const [snapshots, setSnapshots] = useState<ArchiveSnapshot[]>([]);
  const [beforeSnapshot, setBeforeSnapshot] = useState<string>("");
  const [afterSnapshot, setAfterSnapshot] = useState<string>("");
  const [diffPairs, setDiffPairs] = useState<DiffPair[]>([]);
  const [sliderValue, setSliderValue] = useState([50]);

  useEffect(() => {
    loadSnapshots();
  }, []);

  const loadSnapshots = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.storage
        .from('screenshots-archive')
        .list('', { limit: 1000 });

      if (error) throw error;

      // Group by timestamp folder
      const timestampFolders = new Set<string>();
      for (const item of data || []) {
        if (item.id === null) {
          // This is a folder
          timestampFolders.add(item.name);
        }
      }

      // Get files for each folder
      const snapshotList: ArchiveSnapshot[] = [];
      for (const folder of timestampFolders) {
        const { data: folderFiles } = await supabase.storage
          .from('screenshots-archive')
          .list(folder, { limit: 100 });

        if (folderFiles && folderFiles.length > 0) {
          const date = parseTimestamp(folder);
          snapshotList.push({
            timestamp: folder,
            date,
            files: folderFiles.map(f => `${folder}/${f.name}`),
          });
        }
      }

      // Sort by date descending
      snapshotList.sort((a, b) => b.date.getTime() - a.date.getTime());
      setSnapshots(snapshotList);

      // Auto-select first two
      if (snapshotList.length >= 2) {
        setAfterSnapshot(snapshotList[0].timestamp);
        setBeforeSnapshot(snapshotList[1].timestamp);
      }

      toast.success(`${snapshotList.length} Snapshots geladen`);
    } catch (error) {
      console.error('Error loading snapshots:', error);
      toast.error('Fehler beim Laden der Snapshots');
    } finally {
      setLoading(false);
    }
  };

  const parseTimestamp = (folder: string): Date => {
    try {
      // Format: 2025-01-15T10-30-00-000Z
      const normalized = folder
        .replace(/-(\d{2})-(\d{2})-(\d{3})Z$/, ':$1:$2.$3Z')
        .replace(/T(\d{2})-/, 'T$1:');
      return new Date(normalized);
    } catch {
      return new Date();
    }
  };

  const comparePeriods = async () => {
    if (!beforeSnapshot || !afterSnapshot) {
      toast.error("Bitte wähle zwei Zeitpunkte");
      return;
    }

    setLoading(true);
    try {
      const before = snapshots.find(s => s.timestamp === beforeSnapshot);
      const after = snapshots.find(s => s.timestamp === afterSnapshot);

      if (!before || !after) {
        toast.error("Snapshots nicht gefunden");
        return;
      }

      // Match files by URL/pathname
      const pairs: DiffPair[] = [];
      
      for (const beforeFile of before.files) {
        if (!beforeFile.endsWith('.png')) continue;
        
        const pathname = extractPathname(beforeFile);
        const afterFile = after.files.find(f => 
          f.endsWith('.png') && extractPathname(f) === pathname
        );

        if (afterFile) {
          const { data: beforeUrl } = supabase.storage
            .from('screenshots-archive')
            .getPublicUrl(beforeFile);
          
          const { data: afterUrl } = supabase.storage
            .from('screenshots-archive')
            .getPublicUrl(afterFile);

          pairs.push({
            url: pathname,
            pathname,
            before: beforeUrl.publicUrl,
            after: afterUrl.publicUrl,
          });
        }
      }

      setDiffPairs(pairs);
      toast.success(`${pairs.length} Vergleiche gefunden`);
    } catch (error) {
      console.error('Comparison error:', error);
      toast.error('Fehler beim Vergleichen');
    } finally {
      setLoading(false);
    }
  };

  const extractPathname = (filepath: string): string => {
    const filename = filepath.split('/').pop() || '';
    return filename.replace(/^\d+_/, '').replace('.png', '').replace('.html', '');
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('de-CH', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GitCompare className="h-5 w-5" />
          Screenshot Diff (Woche-zu-Woche)
        </CardTitle>
        <CardDescription>
          Vergleiche Screenshots aus verschiedenen Zeiträumen um Änderungen zu erkennen
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Snapshot Selectors */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Vorher (älter)
            </Label>
            <Select value={beforeSnapshot} onValueChange={setBeforeSnapshot}>
              <SelectTrigger>
                <SelectValue placeholder="Zeitpunkt wählen" />
              </SelectTrigger>
              <SelectContent>
                {snapshots.map((s) => (
                  <SelectItem key={s.timestamp} value={s.timestamp}>
                    {formatDate(s.date)} ({s.files.filter(f => f.endsWith('.png')).length} Screenshots)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Nachher (neuer)
            </Label>
            <Select value={afterSnapshot} onValueChange={setAfterSnapshot}>
              <SelectTrigger>
                <SelectValue placeholder="Zeitpunkt wählen" />
              </SelectTrigger>
              <SelectContent>
                {snapshots.map((s) => (
                  <SelectItem key={s.timestamp} value={s.timestamp}>
                    {formatDate(s.date)} ({s.files.filter(f => f.endsWith('.png')).length} Screenshots)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Compare Button */}
        <Button 
          onClick={comparePeriods} 
          disabled={loading || !beforeSnapshot || !afterSnapshot}
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Vergleiche...
            </>
          ) : (
            <>
              <ArrowLeftRight className="h-4 w-4 mr-2" />
              Vergleichen
            </>
          )}
        </Button>

        {/* Diff Results */}
        {diffPairs.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Label>{diffPairs.length} Seiten zum Vergleich</Label>
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">Vorher</span>
                <Slider
                  value={sliderValue}
                  onValueChange={setSliderValue}
                  max={100}
                  step={1}
                  className="w-32"
                />
                <span className="text-sm text-muted-foreground">Nachher</span>
              </div>
            </div>

            <div className="grid gap-6">
              {diffPairs.map((pair, index) => (
                <div key={index} className="border rounded-lg overflow-hidden">
                  <div className="bg-muted p-3 flex items-center justify-between">
                    <Badge variant="outline">{pair.pathname || 'index'}</Badge>
                    <div className="flex gap-2 text-xs text-muted-foreground">
                      <span className="text-red-500">Vorher</span>
                      <span>|</span>
                      <span className="text-green-500">Nachher</span>
                    </div>
                  </div>
                  
                  {/* Comparison View */}
                  <div className="relative aspect-video overflow-hidden">
                    {/* Before Image (left side based on slider) */}
                    <div 
                      className="absolute inset-0 overflow-hidden"
                      style={{ width: `${sliderValue[0]}%` }}
                    >
                      <img 
                        src={pair.before} 
                        alt="Before"
                        className="w-full h-full object-cover object-top"
                        style={{ 
                          width: `${100 / (sliderValue[0] / 100)}%`,
                          maxWidth: 'none'
                        }}
                      />
                      <div className="absolute top-2 left-2">
                        <Badge variant="destructive" className="text-xs">Vorher</Badge>
                      </div>
                    </div>

                    {/* After Image (full, shown where before doesn't cover) */}
                    <img 
                      src={pair.after} 
                      alt="After"
                      className="w-full h-full object-cover object-top"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge className="text-xs bg-green-500">Nachher</Badge>
                    </div>

                    {/* Slider Line */}
                    <div 
                      className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg"
                      style={{ left: `${sliderValue[0]}%` }}
                    >
                      <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-white shadow-lg flex items-center justify-center">
                        <ArrowLeftRight className="h-3 w-3" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && snapshots.length < 2 && (
          <div className="text-center py-8 text-muted-foreground">
            <GitCompare className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Mindestens 2 archivierte Snapshots benötigt</p>
            <p className="text-sm">Archiviere Screenshots über die Screenshot Machine</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
