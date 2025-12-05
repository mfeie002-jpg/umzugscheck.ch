import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  CheckCircle, 
  Clock, 
  Award, 
  Star,
  FileCheck,
  Building,
  Users,
  Truck,
  Lock
} from 'lucide-react';

interface VerificationItem {
  id: string;
  name: string;
  description: string;
  status: 'verified' | 'pending' | 'not_started' | 'expired';
  icon: typeof Shield;
  expiresAt?: Date;
  verifiedAt?: Date;
}

const verificationItems: VerificationItem[] = [
  {
    id: 'business',
    name: 'Handelsregister',
    description: 'Offizieller Eintrag im Schweizer Handelsregister',
    status: 'verified',
    icon: Building,
    verifiedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90),
  },
  {
    id: 'insurance',
    name: 'Versicherungsnachweis',
    description: 'Betriebshaftpflicht- und Transportversicherung',
    status: 'verified',
    icon: Shield,
    verifiedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 335),
  },
  {
    id: 'reviews',
    name: 'Bewertungs-Champion',
    description: 'Mindestens 50 Bewertungen mit Ø 4.5+ Sternen',
    status: 'verified',
    icon: Star,
    verifiedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15),
  },
  {
    id: 'id_check',
    name: 'Identitätsprüfung',
    description: 'Verifizierte Geschäftsidentität',
    status: 'pending',
    icon: FileCheck,
  },
  {
    id: 'fleet',
    name: 'Fuhrpark-Zertifizierung',
    description: 'Nachweis über eigene Fahrzeugflotte',
    status: 'not_started',
    icon: Truck,
  },
  {
    id: 'team',
    name: 'Team-Verifizierung',
    description: 'Verifizierte festangestellte Mitarbeiter',
    status: 'not_started',
    icon: Users,
  },
];

export const VerificationBadgeSystem = () => {
  const verifiedCount = verificationItems.filter(item => item.status === 'verified').length;
  const totalCount = verificationItems.length;
  const verificationProgress = Math.round((verifiedCount / totalCount) * 100);

  const getStatusBadge = (status: VerificationItem['status']) => {
    switch (status) {
      case 'verified':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Verifiziert</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 mr-1" />In Prüfung</Badge>;
      case 'expired':
        return <Badge variant="destructive">Abgelaufen</Badge>;
      case 'not_started':
        return <Badge variant="secondary">Nicht gestartet</Badge>;
    }
  };

  const getTrustLevel = () => {
    if (verificationProgress >= 80) return { level: 'Premium Partner', color: 'text-purple-600', bg: 'bg-purple-100' };
    if (verificationProgress >= 60) return { level: 'Verifizierter Partner', color: 'text-green-600', bg: 'bg-green-100' };
    if (verificationProgress >= 40) return { level: 'Basis Partner', color: 'text-blue-600', bg: 'bg-blue-100' };
    return { level: 'Starter', color: 'text-gray-600', bg: 'bg-gray-100' };
  };

  const trustLevel = getTrustLevel();

  return (
    <div className="space-y-6">
      {/* Trust Level Overview */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-lg ${trustLevel.bg}`}>
                <Award className={`h-8 w-8 ${trustLevel.color}`} />
              </div>
              <div>
                <h3 className="font-bold text-lg">{trustLevel.level}</h3>
                <p className="text-sm text-muted-foreground">
                  {verifiedCount} von {totalCount} Verifizierungen abgeschlossen
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold">{verificationProgress}%</p>
              <p className="text-sm text-muted-foreground">Vertrauenslevel</p>
            </div>
          </div>
          <Progress value={verificationProgress} className="h-3" />
          
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <p className="text-sm">
              <span className="font-medium">Tipp:</span> Vervollständigen Sie alle Verifizierungen um als 
              "Premium Partner" angezeigt zu werden und mehr Leads zu erhalten.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Verification Items */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Verifizierungs-Badges
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {verificationItems.map(item => {
            const Icon = item.icon;
            const isVerified = item.status === 'verified';
            
            return (
              <div
                key={item.id}
                className={`p-4 border rounded-lg ${isVerified ? 'bg-green-50/50' : ''}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${isVerified ? 'bg-green-100' : 'bg-muted'}`}>
                      <Icon className={`h-5 w-5 ${isVerified ? 'text-green-600' : 'text-muted-foreground'}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{item.name}</span>
                        {getStatusBadge(item.status)}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                      {item.verifiedAt && (
                        <p className="text-xs text-muted-foreground mt-2">
                          Verifiziert am {item.verifiedAt.toLocaleDateString('de-CH')}
                          {item.expiresAt && (
                            <> • Gültig bis {item.expiresAt.toLocaleDateString('de-CH')}</>
                          )}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {item.status === 'not_started' && (
                    <Button size="sm">
                      Starten
                    </Button>
                  )}
                  {item.status === 'pending' && (
                    <Button size="sm" variant="outline" disabled>
                      <Clock className="h-4 w-4 mr-1" />
                      Prüfung läuft
                    </Button>
                  )}
                  {item.status === 'verified' && item.expiresAt && (
                    <Button size="sm" variant="outline">
                      Erneuern
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Benefits */}
      <Card>
        <CardHeader>
          <CardTitle>Vorteile der Verifizierung</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
              <Lock className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Mehr Vertrauen</p>
                <p className="text-sm text-muted-foreground">
                  Verifizierte Partner erhalten 40% mehr Anfragen
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
              <Star className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Bessere Platzierung</p>
                <p className="text-sm text-muted-foreground">
                  Höhere Position in den Suchergebnissen
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
              <Award className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Premium Badge</p>
                <p className="text-sm text-muted-foreground">
                  Sichtbares Qualitätssiegel auf Ihrem Profil
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
              <Users className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Exklusive Leads</p>
                <p className="text-sm text-muted-foreground">
                  Zugang zu Premium-Leads nur für verifizierte Partner
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
