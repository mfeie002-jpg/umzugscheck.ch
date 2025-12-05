import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  Copy, 
  Gift, 
  TrendingUp,
  CheckCircle,
  Clock,
  DollarSign,
  Share2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Referral {
  id: string;
  referredName: string;
  referredEmail: string;
  status: 'pending' | 'registered' | 'converted';
  reward: number;
  createdAt: Date;
  convertedAt?: Date;
}

const mockReferrals: Referral[] = [
  {
    id: '1',
    referredName: 'Stefan Weber',
    referredEmail: 'stefan@example.com',
    status: 'converted',
    reward: 100,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
    convertedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15),
  },
  {
    id: '2',
    referredName: 'Lisa Meyer',
    referredEmail: 'lisa@example.com',
    status: 'registered',
    reward: 100,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
  },
  {
    id: '3',
    referredName: 'Thomas Huber',
    referredEmail: 'thomas@example.com',
    status: 'pending',
    reward: 100,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
  },
];

export const ReferralTracking = () => {
  const { toast } = useToast();
  const [referrals] = useState<Referral[]>(mockReferrals);
  const referralCode = 'UMZUG-PRO-2024';
  const referralLink = `https://umzugscheck.ch/register?ref=${referralCode}`;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Kopiert!',
      description: `${label} wurde in die Zwischenablage kopiert.`,
    });
  };

  const stats = {
    totalReferrals: referrals.length,
    converted: referrals.filter(r => r.status === 'converted').length,
    pending: referrals.filter(r => r.status === 'pending').length,
    totalEarnings: referrals.filter(r => r.status === 'converted').reduce((sum, r) => sum + r.reward, 0),
    pendingEarnings: referrals.filter(r => r.status !== 'converted').reduce((sum, r) => sum + r.reward, 0),
  };

  const conversionRate = stats.totalReferrals > 0 
    ? Math.round((stats.converted / stats.totalReferrals) * 100) 
    : 0;

  const getStatusBadge = (status: Referral['status']) => {
    switch (status) {
      case 'converted':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Konvertiert</Badge>;
      case 'registered':
        return <Badge className="bg-blue-100 text-blue-800"><Users className="h-3 w-3 mr-1" />Registriert</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 mr-1" />Ausstehend</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              <span className="text-sm text-muted-foreground">Empfehlungen</span>
            </div>
            <p className="text-2xl font-bold mt-2">{stats.totalReferrals}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <span className="text-sm text-muted-foreground">Konversionsrate</span>
            </div>
            <p className="text-2xl font-bold mt-2">{conversionRate}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-emerald-600" />
              <span className="text-sm text-muted-foreground">Verdient</span>
            </div>
            <p className="text-2xl font-bold mt-2">CHF {stats.totalEarnings}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Gift className="h-5 w-5 text-purple-600" />
              <span className="text-sm text-muted-foreground">Ausstehend</span>
            </div>
            <p className="text-2xl font-bold mt-2">CHF {stats.pendingEarnings}</p>
          </CardContent>
        </Card>
      </div>

      {/* Referral Link */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Ihr Empfehlungslink
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground mb-2">
              Teilen Sie diesen Link und verdienen Sie CHF 100 für jeden neuen Partner!
            </p>
            <div className="flex gap-2">
              <Input value={referralLink} readOnly className="flex-1" />
              <Button onClick={() => copyToClipboard(referralLink, 'Link')}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Ihr Code:</p>
              <div className="flex items-center gap-2">
                <code className="text-lg font-mono font-bold">{referralCode}</code>
                <Button variant="ghost" size="icon" onClick={() => copyToClipboard(referralCode, 'Code')}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Progress to next reward */}
          <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">Bonus-Level</span>
              <Badge variant="secondary">3/5 Empfehlungen</Badge>
            </div>
            <Progress value={60} className="h-2 mb-2" />
            <p className="text-sm text-muted-foreground">
              Noch 2 Empfehlungen bis zum nächsten Bonus (CHF 50 extra)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Referral List */}
      <Card>
        <CardHeader>
          <CardTitle>Empfehlungsverlauf</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {referrals.map(referral => (
              <div key={referral.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">{referral.referredName}</p>
                  <p className="text-sm text-muted-foreground">{referral.referredEmail}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Empfohlen am {referral.createdAt.toLocaleDateString('de-CH')}
                  </p>
                </div>
                <div className="text-right">
                  {getStatusBadge(referral.status)}
                  <p className={`text-lg font-bold mt-2 ${referral.status === 'converted' ? 'text-green-600' : 'text-muted-foreground'}`}>
                    {referral.status === 'converted' ? '+' : ''}CHF {referral.reward}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
