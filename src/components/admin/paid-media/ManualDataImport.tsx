/**
 * Manual Data Import for Paid Media
 * CSV/JSON import until API is configured
 */

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Upload, FileJson, Table2, Download } from 'lucide-react';

interface ManualDataImportProps {
  onImportComplete: () => void;
}

export function ManualDataImport({ onImportComplete }: ManualDataImportProps) {
  const [platform, setPlatform] = useState('google_ads');
  const [dataFormat, setDataFormat] = useState<'json' | 'csv'>('json');
  const [rawData, setRawData] = useState('');
  const [importing, setImporting] = useState(false);
  const { toast } = useToast();

  const exampleJSON = `[
  {
    "campaign_id": "123456789",
    "campaign_name": "Brand - Umzug Zürich",
    "campaign_type": "search",
    "date": "2026-01-27",
    "impressions": 1500,
    "clicks": 120,
    "cost_chf": 180.50,
    "conversions": 8,
    "conversion_value_chf": 720
  }
]`;

  const exampleCSV = `campaign_id,campaign_name,campaign_type,date,impressions,clicks,cost_chf,conversions,conversion_value_chf
123456789,Brand - Umzug Zürich,search,2026-01-27,1500,120,180.50,8,720
987654321,Generic - Umzugsfirma,search,2026-01-27,3200,85,255.00,4,360`;

  const parseCSV = (csv: string) => {
    const lines = csv.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    
    return lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim());
      const obj: Record<string, any> = {};
      headers.forEach((header, i) => {
        const value = values[i];
        // Convert numeric fields
        if (['impressions', 'clicks', 'conversions'].includes(header)) {
          obj[header] = parseInt(value) || 0;
        } else if (['cost_chf', 'conversion_value_chf', 'daily_budget'].includes(header)) {
          obj[header] = parseFloat(value) || 0;
        } else {
          obj[header] = value;
        }
      });
      return obj;
    });
  };

  const handleImport = async () => {
    if (!rawData.trim()) {
      toast({
        title: 'Keine Daten',
        description: 'Bitte fügen Sie Daten zum Importieren ein',
        variant: 'destructive',
      });
      return;
    }

    setImporting(true);
    try {
      let parsedData;
      
      if (dataFormat === 'json') {
        parsedData = JSON.parse(rawData);
      } else {
        parsedData = parseCSV(rawData);
      }

      if (!Array.isArray(parsedData) || parsedData.length === 0) {
        throw new Error('Daten müssen ein Array sein');
      }

      // Validate required fields
      for (const row of parsedData) {
        if (!row.campaign_id || !row.campaign_name || !row.date) {
          throw new Error('Jede Zeile braucht: campaign_id, campaign_name, date');
        }
      }

      // Call edge function
      const { data, error } = await supabase.functions.invoke('sync-paid-media', {
        body: { 
          platform, 
          action: 'manual',
          manual_data: parsedData 
        }
      });

      if (error) throw error;

      toast({
        title: 'Import erfolgreich',
        description: `${data.records_synced} Datensätze importiert`,
      });

      setRawData('');
      onImportComplete();

    } catch (error) {
      console.error('Import error:', error);
      toast({
        title: 'Import fehlgeschlagen',
        description: error instanceof Error ? error.message : 'Ungültiges Datenformat',
        variant: 'destructive',
      });
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Import Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Daten Import
          </CardTitle>
          <CardDescription>
            Importieren Sie Kampagnen-Daten manuell bis die API-Integration aktiv ist
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Plattform</label>
              <Select value={platform} onValueChange={setPlatform}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="google_ads">Google Ads</SelectItem>
                  <SelectItem value="meta_ads">Meta Ads</SelectItem>
                  <SelectItem value="microsoft_ads">Microsoft Ads</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Format</label>
              <Select value={dataFormat} onValueChange={(v) => setDataFormat(v as 'json' | 'csv')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="json">
                    <span className="flex items-center gap-2">
                      <FileJson className="h-4 w-4" /> JSON
                    </span>
                  </SelectItem>
                  <SelectItem value="csv">
                    <span className="flex items-center gap-2">
                      <Table2 className="h-4 w-4" /> CSV
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Daten</label>
            <Textarea
              placeholder={dataFormat === 'json' ? 'JSON Array einfügen...' : 'CSV Daten einfügen...'}
              value={rawData}
              onChange={(e) => setRawData(e.target.value)}
              className="min-h-[200px] font-mono text-sm"
            />
          </div>

          <Button onClick={handleImport} disabled={importing} className="w-full">
            <Upload className="h-4 w-4 mr-2" />
            {importing ? 'Importiere...' : 'Daten importieren'}
          </Button>
        </CardContent>
      </Card>

      {/* Example Format */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Beispiel-Format
          </CardTitle>
          <CardDescription>
            So sollten die Daten strukturiert sein
          </CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded-lg text-xs overflow-x-auto">
            {dataFormat === 'json' ? exampleJSON : exampleCSV}
          </pre>
          
          <div className="mt-4 space-y-2">
            <h4 className="font-medium text-sm">Pflichtfelder:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• <code>campaign_id</code> - Eindeutige Kampagnen-ID</li>
              <li>• <code>campaign_name</code> - Name der Kampagne</li>
              <li>• <code>date</code> - Datum (YYYY-MM-DD)</li>
            </ul>
            <h4 className="font-medium text-sm mt-4">Optionale Felder:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• <code>impressions</code>, <code>clicks</code>, <code>conversions</code></li>
              <li>• <code>cost_chf</code>, <code>conversion_value_chf</code></li>
              <li>• <code>campaign_type</code> (search, display, video)</li>
            </ul>
          </div>

          <Button 
            variant="outline" 
            className="w-full mt-4"
            onClick={() => setRawData(dataFormat === 'json' ? exampleJSON : exampleCSV)}
          >
            Beispiel einfügen
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
