import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Download, FileSpreadsheet, FileText, Filter, Calendar, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export const LeadExport = () => {
  const [exportFormat, setExportFormat] = useState('csv');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [selectedStatus, setSelectedStatus] = useState<string[]>(['new', 'contacted', 'converted']);
  const [selectedFields, setSelectedFields] = useState<string[]>([
    'name', 'email', 'phone', 'from_city', 'to_city', 'move_date', 'status', 'created_at'
  ]);
  const [isExporting, setIsExporting] = useState(false);

  const availableFields = [
    { id: 'name', label: 'Name' },
    { id: 'email', label: 'E-Mail' },
    { id: 'phone', label: 'Telefon' },
    { id: 'from_postal', label: 'Von PLZ' },
    { id: 'from_city', label: 'Von Ort' },
    { id: 'to_postal', label: 'Nach PLZ' },
    { id: 'to_city', label: 'Nach Ort' },
    { id: 'move_date', label: 'Umzugsdatum' },
    { id: 'status', label: 'Status' },
    { id: 'calculator_type', label: 'Rechner-Typ' },
    { id: 'created_at', label: 'Erstellt am' },
    { id: 'comments', label: 'Kommentare' },
  ];

  const statusOptions = [
    { id: 'new', label: 'Neu' },
    { id: 'contacted', label: 'Kontaktiert' },
    { id: 'quoted', label: 'Offerte gesendet' },
    { id: 'converted', label: 'Konvertiert' },
    { id: 'lost', label: 'Verloren' },
  ];

  const toggleField = (fieldId: string) => {
    setSelectedFields(prev => 
      prev.includes(fieldId) 
        ? prev.filter(f => f !== fieldId)
        : [...prev, fieldId]
    );
  };

  const toggleStatus = (statusId: string) => {
    setSelectedStatus(prev => 
      prev.includes(statusId) 
        ? prev.filter(s => s !== statusId)
        : [...prev, statusId]
    );
  };

  const handleExport = async () => {
    if (selectedFields.length === 0) {
      toast.error('Bitte wählen Sie mindestens ein Feld aus');
      return;
    }

    setIsExporting(true);

    try {
      let query = supabase.from('leads').select(selectedFields.join(','));

      if (selectedStatus.length > 0) {
        query = query.in('status', selectedStatus);
      }

      if (dateRange.start) {
        query = query.gte('created_at', dateRange.start);
      }
      if (dateRange.end) {
        query = query.lte('created_at', dateRange.end);
      }

      const { data, error } = await query;

      if (error) throw error;

      if (!data || data.length === 0) {
        toast.error('Keine Daten zum Exportieren gefunden');
        return;
      }

      let content: string;
      let filename: string;
      let mimeType: string;

      if (exportFormat === 'csv') {
        const headers = selectedFields.map(f => 
          availableFields.find(af => af.id === f)?.label || f
        ).join(',');
        const rows = data.map(row => 
          selectedFields.map(f => {
            const value = (row as any)[f];
            if (typeof value === 'string' && value.includes(',')) {
              return `"${value}"`;
            }
            return value ?? '';
          }).join(',')
        );
        content = [headers, ...rows].join('\n');
        filename = `leads_export_${new Date().toISOString().split('T')[0]}.csv`;
        mimeType = 'text/csv';
      } else {
        content = JSON.stringify(data, null, 2);
        filename = `leads_export_${new Date().toISOString().split('T')[0]}.json`;
        mimeType = 'application/json';
      }

      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success(`${data.length} Leads exportiert`);
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Export fehlgeschlagen');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          Lead-Export
        </CardTitle>
        <CardDescription>Exportieren Sie Lead-Daten in verschiedenen Formaten</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Format Selection */}
        <div>
          <Label className="mb-3 block">Export-Format</Label>
          <div className="flex gap-4">
            <Button
              variant={exportFormat === 'csv' ? 'default' : 'outline'}
              onClick={() => setExportFormat('csv')}
              className="flex-1"
            >
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              CSV (Excel)
            </Button>
            <Button
              variant={exportFormat === 'json' ? 'default' : 'outline'}
              onClick={() => setExportFormat('json')}
              className="flex-1"
            >
              <FileText className="h-4 w-4 mr-2" />
              JSON
            </Button>
          </div>
        </div>

        {/* Date Range */}
        <div>
          <Label className="mb-3 block flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Zeitraum
          </Label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs text-muted-foreground">Von</Label>
              <Input 
                type="date"
                value={dateRange.start}
                onChange={e => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Bis</Label>
              <Input 
                type="date"
                value={dateRange.end}
                onChange={e => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              />
            </div>
          </div>
        </div>

        {/* Status Filter */}
        <div>
          <Label className="mb-3 block flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Status
          </Label>
          <div className="flex flex-wrap gap-2">
            {statusOptions.map(status => (
              <Badge
                key={status.id}
                variant={selectedStatus.includes(status.id) ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => toggleStatus(status.id)}
              >
                {selectedStatus.includes(status.id) && (
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                )}
                {status.label}
              </Badge>
            ))}
          </div>
        </div>

        {/* Field Selection */}
        <div>
          <Label className="mb-3 block">Felder auswählen</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {availableFields.map(field => (
              <div 
                key={field.id}
                className="flex items-center space-x-2"
              >
                <Checkbox 
                  id={field.id}
                  checked={selectedFields.includes(field.id)}
                  onCheckedChange={() => toggleField(field.id)}
                />
                <label 
                  htmlFor={field.id}
                  className="text-sm cursor-pointer"
                >
                  {field.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setSelectedFields(availableFields.map(f => f.id))}
          >
            Alle auswählen
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setSelectedFields(['name', 'email', 'phone', 'from_city', 'to_city'])}
          >
            Nur Kontaktdaten
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setSelectedFields([])}
          >
            Keine
          </Button>
        </div>

        {/* Export Button */}
        <Button 
          className="w-full"
          onClick={handleExport}
          disabled={isExporting || selectedFields.length === 0}
        >
          {isExporting ? (
            <>Exportiert...</>
          ) : (
            <>
              <Download className="h-4 w-4 mr-2" />
              {selectedFields.length} Felder exportieren
            </>
          )}
        </Button>

        {/* Info */}
        <p className="text-sm text-muted-foreground text-center">
          Die exportierten Daten enthalten nur die ausgewählten Felder und Status
        </p>
      </CardContent>
    </Card>
  );
};
