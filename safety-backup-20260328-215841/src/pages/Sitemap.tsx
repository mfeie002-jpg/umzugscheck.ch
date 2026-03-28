import { useEffect, useState } from 'react';
import { generateSitemapXML, getTotalUrls } from '@/lib/sitemap-generator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText, Building2, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const Sitemap = () => {
  const [sitemapXML, setSitemapXML] = useState('');
  const [totalUrls, setTotalUrls] = useState(0);
  const [companyCount, setCompanyCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSitemap = async () => {
      setIsLoading(true);
      
      // Fetch company slugs from DB
      const { data: companies } = await supabase
        .from('companies')
        .select('slug')
        .not('slug', 'is', null);
      
      const slugs = companies?.map(c => c.slug).filter(Boolean) as string[] || [];
      setCompanyCount(slugs.length);
      
      const xml = generateSitemapXML(slugs);
      setSitemapXML(xml);
      setTotalUrls(getTotalUrls(slugs));
      setIsLoading(false);
    };
    
    loadSitemap();
  }, []);

  const downloadSitemap = () => {
    const blob = new Blob([sitemapXML], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sitemap.xml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">XML Sitemap Generator</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Automatisch generierte Sitemap für Suchmaschinen
        </p>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Sitemap Übersicht
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Gesamte URLs</p>
                <p className="text-3xl font-bold text-primary">{totalUrls}</p>
              </div>
              
              <div className="grid md:grid-cols-5 gap-4 pt-4 border-t">
                <div>
                  <p className="text-sm font-medium mb-1">Hauptseiten</p>
                  <p className="text-2xl font-bold">17</p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Kanton-Seiten</p>
                  <p className="text-2xl font-bold">26</p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Stadt-Seiten</p>
                  <p className="text-2xl font-bold">14</p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Service-Seiten</p>
                  <p className="text-2xl font-bold">8</p>
                </div>
                <div className="bg-primary/5 rounded-lg p-2 -m-2">
                  <p className="text-sm font-medium mb-1 flex items-center gap-1">
                    <Building2 className="h-3 w-3" />
                    Firmen-Profile
                  </p>
                  <p className="text-2xl font-bold text-primary">{companyCount}</p>
                </div>
              </div>

              <div className="pt-4">
                <p className="text-sm font-medium mb-1">Stadt + Service Kombinationen</p>
                <p className="text-2xl font-bold">112</p>
                <p className="text-xs text-muted-foreground mt-1">14 Städte × 8 Services</p>
              </div>

              <div className="pt-4 border-t">
                <p className="text-sm font-medium mb-1">Gesamt-Struktur</p>
                <p className="text-xs text-muted-foreground">
                  17 Hauptseiten + 26 Kantone + 14 Städte + 8 Services + 112 Kombinationen + {companyCount} Firmen
                </p>
              </div>

              <Button onClick={downloadSitemap} className="w-full mt-6">
                <Download className="mr-2 h-4 w-4" />
                Sitemap.xml herunterladen
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>XML Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs max-h-96">
              {sitemapXML}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Sitemap;
