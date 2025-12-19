import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { 
  FolderArchive, 
  Download, 
  ExternalLink, 
  Loader2, 
  RefreshCw, 
  Trash2, 
  Image as ImageIcon,
  Code,
  FileJson,
  Calendar,
  Eye
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { saveAs } from "file-saver";

interface ArchivedItem {
  name: string;
  id: string;
  created_at: string;
  metadata: {
    size?: number;
    mimetype?: string;
  };
  publicUrl: string;
}

interface ArchiveGroup {
  timestamp: string;
  date: Date;
  items: ArchivedItem[];
  screenshots: ArchivedItem[];
  htmlFiles: ArchivedItem[];
  metaFiles: ArchivedItem[];
}

export function ScreenshotArchive() {
  const [loading, setLoading] = useState(false);
  const [archives, setArchives] = useState<ArchiveGroup[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedHtml, setSelectedHtml] = useState<{ url: string; content: string } | null>(null);

  const loadArchives = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.storage
        .from('screenshots-archive')
        .list('', {
          limit: 1000,
          sortBy: { column: 'created_at', order: 'desc' }
        });

      if (error) throw error;

      // Group files by timestamp folder
      const groups: Record<string, ArchivedItem[]> = {};
      
      for (const file of data || []) {
        // Get the timestamp folder from the path
        const parts = file.name.split('/');
        if (parts.length < 1) continue;
        
        const timestamp = parts[0];
        if (!groups[timestamp]) {
          groups[timestamp] = [];
        }

        const { data: urlData } = supabase.storage
          .from('screenshots-archive')
          .getPublicUrl(file.name);

        groups[timestamp].push({
          ...file,
          publicUrl: urlData.publicUrl
        });
      }

      // Also check subdirectories
      for (const folder of data || []) {
        if (folder.id === null) {
          // This is a folder, list its contents
          const { data: folderContents } = await supabase.storage
            .from('screenshots-archive')
            .list(folder.name, { limit: 100 });

          if (folderContents) {
            if (!groups[folder.name]) {
              groups[folder.name] = [];
            }

            for (const file of folderContents) {
              const fullPath = `${folder.name}/${file.name}`;
              const { data: urlData } = supabase.storage
                .from('screenshots-archive')
                .getPublicUrl(fullPath);

              groups[folder.name].push({
                ...file,
                name: fullPath,
                publicUrl: urlData.publicUrl
              });
            }
          }
        }
      }

      // Convert to array and categorize
      const archiveGroups: ArchiveGroup[] = Object.entries(groups)
        .filter(([_, items]) => items.length > 0)
        .map(([timestamp, items]) => {
          const date = new Date(timestamp.replace(/-/g, (m, i) => i < 10 ? '-' : i < 13 ? 'T' : ':').replace(/-(\d{3})Z/, '.$1Z'));
          
          return {
            timestamp,
            date: isNaN(date.getTime()) ? new Date() : date,
            items,
            screenshots: items.filter(i => i.name.endsWith('.png') || i.name.endsWith('.jpg')),
            htmlFiles: items.filter(i => i.name.endsWith('.html')),
            metaFiles: items.filter(i => i.name.endsWith('.json'))
          };
        })
        .sort((a, b) => b.date.getTime() - a.date.getTime());

      setArchives(archiveGroups);
      toast.success(`${archiveGroups.length} Archive geladen`);
    } catch (error) {
      console.error('Error loading archives:', error);
      toast.error('Fehler beim Laden der Archive');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadArchives();
  }, []);

  const downloadFile = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      saveAs(blob, filename);
      toast.success('Download gestartet');
    } catch (error) {
      console.error('Download error:', error);
      window.open(url, '_blank');
    }
  };

  const viewHtmlContent = async (item: ArchivedItem) => {
    try {
      const response = await fetch(item.publicUrl);
      const content = await response.text();
      setSelectedHtml({ url: item.name, content });
    } catch (error) {
      console.error('Error loading HTML:', error);
      toast.error('Fehler beim Laden des HTML');
    }
  };

  const deleteArchive = async (timestamp: string) => {
    if (!confirm(`Archiv vom ${timestamp} wirklich löschen?`)) return;

    try {
      const archive = archives.find(a => a.timestamp === timestamp);
      if (!archive) return;

      const filesToDelete = archive.items.map(i => i.name);
      
      const { error } = await supabase.storage
        .from('screenshots-archive')
        .remove(filesToDelete);

      if (error) throw error;

      setArchives(prev => prev.filter(a => a.timestamp !== timestamp));
      toast.success('Archiv gelöscht');
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Fehler beim Löschen');
    }
  };

  const formatBytes = (bytes?: number) => {
    if (!bytes) return 'N/A';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FolderArchive className="h-5 w-5" />
                Screenshot-Archiv
              </CardTitle>
              <CardDescription>
                Gespeicherte Screenshots und HTML-Dateien aus Supabase Storage
              </CardDescription>
            </div>
            <Button 
              variant="outline" 
              onClick={loadArchives}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Aktualisieren
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {archives.length === 0 && !loading ? (
            <div className="text-center py-12 text-muted-foreground">
              <FolderArchive className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Keine archivierten Screenshots gefunden</p>
              <p className="text-sm">Archiviere Screenshots über die Screenshot Machine</p>
            </div>
          ) : (
            <div className="space-y-4">
              {archives.map((archive) => (
                <div key={archive.timestamp} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">
                        {archive.date.toLocaleDateString('de-CH', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                      <Badge variant="secondary">
                        {archive.screenshots.length} Screenshots
                      </Badge>
                      <Badge variant="outline">
                        {archive.htmlFiles.length} HTML
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteArchive(archive.timestamp)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Screenshots Grid */}
                  {archive.screenshots.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 mt-3">
                      {archive.screenshots.slice(0, 12).map((item) => (
                        <div 
                          key={item.id || item.name}
                          className="aspect-video bg-muted rounded overflow-hidden relative group cursor-pointer"
                          onClick={() => setSelectedImage(item.publicUrl)}
                        >
                          <img 
                            src={item.publicUrl} 
                            alt={item.name}
                            className="w-full h-full object-cover object-top"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                            <Button size="icon" variant="secondary" className="h-7 w-7">
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button 
                              size="icon" 
                              variant="secondary" 
                              className="h-7 w-7"
                              onClick={(e) => {
                                e.stopPropagation();
                                downloadFile(item.publicUrl, item.name.split('/').pop() || 'screenshot.png');
                              }}
                            >
                              <Download className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                      {archive.screenshots.length > 12 && (
                        <div className="aspect-video bg-muted rounded flex items-center justify-center text-muted-foreground">
                          +{archive.screenshots.length - 12} mehr
                        </div>
                      )}
                    </div>
                  )}

                  {/* HTML Files */}
                  {archive.htmlFiles.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {archive.htmlFiles.slice(0, 8).map((item) => (
                        <Button
                          key={item.id || item.name}
                          variant="outline"
                          size="sm"
                          onClick={() => viewHtmlContent(item)}
                        >
                          <Code className="h-3 w-3 mr-1" />
                          {item.name.split('/').pop()?.replace('.html', '').substring(0, 20)}...
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Image Preview Modal */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0">
          <DialogHeader className="p-4 pb-0">
            <DialogTitle>Screenshot-Vorschau</DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[calc(90vh-80px)]">
            <div className="p-4">
              {selectedImage && (
                <img 
                  src={selectedImage} 
                  alt="Screenshot" 
                  className="w-full h-auto rounded-lg border"
                />
              )}
            </div>
          </ScrollArea>
          <div className="p-4 border-t flex gap-2 justify-end">
            <Button variant="outline" onClick={() => selectedImage && window.open(selectedImage, '_blank')}>
              <ExternalLink className="h-4 w-4 mr-1" />
              Neuer Tab
            </Button>
            <Button onClick={() => selectedImage && downloadFile(selectedImage, 'screenshot.png')}>
              <Download className="h-4 w-4 mr-1" />
              Download
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* HTML Preview Modal */}
      <Dialog open={!!selectedHtml} onOpenChange={() => setSelectedHtml(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              HTML-Quellcode
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[calc(90vh-120px)] border rounded">
            <pre className="p-4 text-xs font-mono whitespace-pre-wrap break-all">
              {selectedHtml?.content}
            </pre>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}
