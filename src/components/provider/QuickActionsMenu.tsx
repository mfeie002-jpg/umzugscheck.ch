import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { 
  Zap, Plus, Calendar, FileText, MessageSquare, Settings, 
  Bell, CreditCard, BarChart2, Users, Upload, Download,
  Clock, Star, TrendingUp, Shield
} from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  providerId: string;
}

export const QuickActionsMenu = ({ providerId }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const quickActions = [
    {
      icon: <Calendar className="h-4 w-4" />,
      label: 'Verfügbarkeit aktualisieren',
      action: () => {
        toast.success('Kalender geöffnet');
      },
      color: 'text-blue-600',
    },
    {
      icon: <FileText className="h-4 w-4" />,
      label: 'Neue Offerte erstellen',
      action: () => {
        toast.success('Offerten-Editor geöffnet');
      },
      color: 'text-green-600',
    },
    {
      icon: <MessageSquare className="h-4 w-4" />,
      label: 'Lead kontaktieren',
      action: () => {
        toast.success('Kontaktformular geöffnet');
      },
      color: 'text-purple-600',
    },
    {
      icon: <Upload className="h-4 w-4" />,
      label: 'Logo/Bilder hochladen',
      action: () => {
        toast.success('Upload-Dialog geöffnet');
      },
      color: 'text-orange-600',
    },
    {
      icon: <CreditCard className="h-4 w-4" />,
      label: 'Budget aufladen',
      action: () => {
        toast.success('Zahlungsseite geöffnet');
      },
      color: 'text-emerald-600',
    },
    {
      icon: <BarChart2 className="h-4 w-4" />,
      label: 'Statistiken exportieren',
      action: () => {
        toast.success('Export gestartet');
      },
      color: 'text-indigo-600',
    },
  ];

  const statusActions = [
    {
      icon: <Clock className="h-4 w-4" />,
      label: 'Status: Verfügbar',
      description: 'Aktuell für neue Leads aktiv',
      isActive: true,
    },
    {
      icon: <Bell className="h-4 w-4" />,
      label: 'Benachrichtigungen: An',
      description: 'E-Mail & Push aktiviert',
      isActive: true,
    },
    {
      icon: <Shield className="h-4 w-4" />,
      label: 'Profil: Verifiziert',
      description: 'Alle Prüfungen bestanden',
      isActive: true,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Zap className="h-5 w-5" />
          Schnellaktionen
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Quick Action Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              className="h-auto py-3 flex flex-col items-center gap-2"
              onClick={action.action}
            >
              <span className={action.color}>{action.icon}</span>
              <span className="text-xs text-center">{action.label}</span>
            </Button>
          ))}
        </div>

        {/* Status Overview */}
        <div className="pt-4 border-t">
          <h4 className="text-sm font-medium mb-3">Status</h4>
          <div className="space-y-2">
            {statusActions.map((status, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-2 rounded-lg bg-muted/50"
              >
                <div className="flex items-center gap-2">
                  <span className={status.isActive ? 'text-green-600' : 'text-muted-foreground'}>
                    {status.icon}
                  </span>
                  <div>
                    <p className="text-sm font-medium">{status.label}</p>
                    <p className="text-xs text-muted-foreground">{status.description}</p>
                  </div>
                </div>
                <div className={`w-2 h-2 rounded-full ${status.isActive ? 'bg-green-500' : 'bg-muted'}`} />
              </div>
            ))}
          </div>
        </div>

        {/* More Actions */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Weitere Aktionen
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem>
              <Settings className="h-4 w-4 mr-2" />
              Profileinstellungen
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Users className="h-4 w-4 mr-2" />
              Team verwalten
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Star className="h-4 w-4 mr-2" />
              Bewertungen anfordern
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Download className="h-4 w-4 mr-2" />
              Daten exportieren
            </DropdownMenuItem>
            <DropdownMenuItem>
              <TrendingUp className="h-4 w-4 mr-2" />
              Performance-Bericht
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardContent>
    </Card>
  );
};
