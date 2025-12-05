import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Award, Shield, CheckCircle2, Star, Upload, Plus, Trash2, FileText, Calendar } from 'lucide-react';
import { toast } from 'sonner';

interface Certificate {
  id: string;
  name: string;
  issuer: string;
  validUntil?: string;
  verified: boolean;
  documentUrl?: string;
  icon: string;
}

interface Props {
  providerId: string;
}

export const CertificateBadges = ({ providerId }: Props) => {
  const [certificates, setCertificates] = useState<Certificate[]>([
    {
      id: '1',
      name: 'Transportversicherung',
      issuer: 'Allianz Suisse',
      validUntil: '2025-12-31',
      verified: true,
      icon: 'shield',
    },
    {
      id: '2',
      name: 'Betriebshaftpflicht',
      issuer: 'Zurich Versicherung',
      validUntil: '2024-06-30',
      verified: true,
      icon: 'shield',
    },
    {
      id: '3',
      name: 'ISO 9001:2015',
      issuer: 'TÜV SÜD',
      validUntil: '2026-03-15',
      verified: true,
      icon: 'award',
    },
    {
      id: '4',
      name: 'ASTAG Mitglied',
      issuer: 'ASTAG',
      verified: true,
      icon: 'star',
    },
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newCert, setNewCert] = useState({
    name: '',
    issuer: '',
    validUntil: '',
  });

  const availableBadges = [
    { name: 'Eco-Zertifiziert', icon: '🌿', description: 'Umweltfreundliche Praktiken' },
    { name: 'Top-Bewertet', icon: '⭐', description: '4.5+ Sterne Durchschnitt' },
    { name: 'Express-Service', icon: '⚡', description: 'Same-Day Verfügbarkeit' },
    { name: 'Familienbetrieb', icon: '👨‍👩‍👧‍👦', description: 'Familiengeführtes Unternehmen' },
    { name: 'Seit 10+ Jahren', icon: '🏆', description: 'Langjährige Erfahrung' },
    { name: 'Kundensieger', icon: '🥇', description: 'Ausgezeichneter Service' },
  ];

  const handleAddCertificate = () => {
    if (!newCert.name || !newCert.issuer) {
      toast.error('Name und Aussteller sind erforderlich');
      return;
    }

    setCertificates(prev => [...prev, {
      ...newCert,
      id: Date.now().toString(),
      verified: false,
      icon: 'award',
    }]);

    setNewCert({ name: '', issuer: '', validUntil: '' });
    setIsAddDialogOpen(false);
    toast.success('Zertifikat hinzugefügt - wird überprüft');
  };

  const removeCertificate = (id: string) => {
    setCertificates(prev => prev.filter(c => c.id !== id));
    toast.success('Zertifikat entfernt');
  };

  const getIcon = (icon: string) => {
    switch (icon) {
      case 'shield': return <Shield className="h-5 w-5" />;
      case 'award': return <Award className="h-5 w-5" />;
      case 'star': return <Star className="h-5 w-5" />;
      default: return <CheckCircle2 className="h-5 w-5" />;
    }
  };

  const isExpiringSoon = (date?: string) => {
    if (!date) return false;
    const expiryDate = new Date(date);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 90 && daysUntilExpiry > 0;
  };

  const isExpired = (date?: string) => {
    if (!date) return false;
    return new Date(date) < new Date();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Zertifikate & Badges
            </CardTitle>
            <CardDescription>Ihre Qualifikationen und Auszeichnungen</CardDescription>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Zertifikat hinzufügen
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Neues Zertifikat</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Name des Zertifikats</Label>
                  <Input 
                    value={newCert.name}
                    onChange={e => setNewCert(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="z.B. ISO 9001:2015"
                  />
                </div>
                <div>
                  <Label>Aussteller</Label>
                  <Input 
                    value={newCert.issuer}
                    onChange={e => setNewCert(prev => ({ ...prev, issuer: e.target.value }))}
                    placeholder="z.B. TÜV SÜD"
                  />
                </div>
                <div>
                  <Label>Gültig bis (optional)</Label>
                  <Input 
                    type="date"
                    value={newCert.validUntil}
                    onChange={e => setNewCert(prev => ({ ...prev, validUntil: e.target.value }))}
                  />
                </div>
                <div>
                  <Label>Dokument hochladen (optional)</Label>
                  <div className="mt-2 border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors">
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      PDF oder Bild hier ablegen oder klicken
                    </p>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Abbrechen
                  </Button>
                  <Button onClick={handleAddCertificate}>
                    Hinzufügen
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Active Certificates */}
        <div>
          <h4 className="font-medium mb-3">Aktive Zertifikate</h4>
          <div className="space-y-3">
            {certificates.map(cert => (
              <div 
                key={cert.id}
                className={`flex items-center justify-between p-4 border rounded-lg ${
                  isExpired(cert.validUntil) ? 'bg-red-50 border-red-200' :
                  isExpiringSoon(cert.validUntil) ? 'bg-yellow-50 border-yellow-200' :
                  'bg-background'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg ${cert.verified ? 'bg-green-100 text-green-700' : 'bg-muted text-muted-foreground'}`}>
                    {getIcon(cert.icon)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{cert.name}</span>
                      {cert.verified && (
                        <Badge className="bg-green-100 text-green-700">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Verifiziert
                        </Badge>
                      )}
                      {!cert.verified && (
                        <Badge variant="secondary">Wird geprüft</Badge>
                      )}
                      {isExpired(cert.validUntil) && (
                        <Badge variant="destructive">Abgelaufen</Badge>
                      )}
                      {isExpiringSoon(cert.validUntil) && (
                        <Badge className="bg-yellow-100 text-yellow-700">Läuft bald ab</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {cert.issuer}
                      {cert.validUntil && (
                        <span className="ml-2">
                          • Gültig bis: {new Date(cert.validUntil).toLocaleDateString('de-CH')}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {cert.documentUrl && (
                    <Button variant="ghost" size="sm">
                      <FileText className="h-4 w-4" />
                    </Button>
                  )}
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => removeCertificate(cert.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Available Badges */}
        <div>
          <h4 className="font-medium mb-3">Verfügbare Badges</h4>
          <p className="text-sm text-muted-foreground mb-4">
            Diese Badges können Sie freischalten, wenn Sie die Kriterien erfüllen
          </p>
          <div className="grid md:grid-cols-2 gap-3">
            {availableBadges.map(badge => (
              <div 
                key={badge.name}
                className="flex items-center gap-3 p-3 border rounded-lg bg-muted/30"
              >
                <span className="text-2xl">{badge.icon}</span>
                <div>
                  <p className="font-medium text-sm">{badge.name}</p>
                  <p className="text-xs text-muted-foreground">{badge.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trust Score */}
        <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-blue-800">Vertrauens-Score</h4>
              <p className="text-sm text-blue-600">
                Basierend auf {certificates.filter(c => c.verified).length} verifizierten Zertifikaten
              </p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-blue-700">
                {Math.min(100, 50 + certificates.filter(c => c.verified).length * 12)}%
              </p>
              <Badge className="bg-blue-100 text-blue-700">Hoch</Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
