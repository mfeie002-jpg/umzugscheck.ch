import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Gift, Copy, Share2, CheckCircle2, Users, Coins } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const ReferralProgram = () => {
  const [referralCode] = useState('FEIER' + Math.random().toString(36).substring(2, 7).toUpperCase());
  const [copied, setCopied] = useState(false);
  const [referrals] = useState([
    { name: 'Max M.', status: 'pending', reward: 50 },
    { name: 'Anna S.', status: 'completed', reward: 50 },
  ]);

  const totalEarned = referrals.filter(r => r.status === 'completed').reduce((acc, r) => acc + r.reward, 0);
  const pendingRewards = referrals.filter(r => r.status === 'pending').reduce((acc, r) => acc + r.reward, 0);

  const copyCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({ title: 'Code kopiert!', description: 'Teilen Sie ihn mit Freunden und Familie.' });
  };

  const shareCode = async () => {
    const shareData = {
      title: 'Feierabend Umzüge Empfehlung',
      text: `Erhalte CHF 50 Rabatt auf deinen Umzug mit meinem Empfehlungscode: ${referralCode}`,
      url: `https://feierabend-umzuege.ch/?ref=${referralCode}`
    };
    
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        copyCode();
      }
    } else {
      copyCode();
    }
  };

  return (
    <Card className="overflow-hidden border-primary/20">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-alpine/10 pb-4">
        <CardTitle className="flex items-center gap-2">
          <Gift className="w-5 h-5 text-primary" />
          Freunde werben
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Empfehlen Sie uns weiter und erhalten Sie CHF 50 Rabatt pro Empfehlung!
        </p>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-muted/50 text-center">
            <div className="text-2xl font-bold text-primary">CHF {totalEarned}</div>
            <div className="text-xs text-muted-foreground">Verdient</div>
          </div>
          <div className="p-4 rounded-lg bg-muted/50 text-center">
            <div className="text-2xl font-bold text-warning">CHF {pendingRewards}</div>
            <div className="text-xs text-muted-foreground">Ausstehend</div>
          </div>
        </div>

        {/* Referral Code */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Ihr Empfehlungscode</label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input 
                value={referralCode} 
                readOnly 
                className="font-mono text-lg tracking-wider pr-10"
              />
              <AnimatePresence>
                {copied && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <Button variant="outline" size="icon" onClick={copyCode}>
              <Copy className="w-4 h-4" />
            </Button>
            <Button onClick={shareCode}>
              <Share2 className="w-4 h-4 mr-2" />
              Teilen
            </Button>
          </div>
        </div>

        {/* How it works */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm">So funktioniert's:</h4>
          <div className="grid gap-3">
            {[
              { icon: Share2, text: 'Teilen Sie Ihren Code mit Freunden' },
              { icon: Users, text: 'Ihr Freund bucht einen Umzug' },
              { icon: Coins, text: 'Sie beide erhalten CHF 50 Rabatt' }
            ].map((step, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <step.icon className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm">{step.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Referrals List */}
        {referrals.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Ihre Empfehlungen</h4>
            <div className="space-y-2">
              {referrals.map((ref, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <span className="text-sm">{ref.name}</span>
                  <Badge variant={ref.status === 'completed' ? 'default' : 'secondary'}>
                    {ref.status === 'completed' ? `+CHF ${ref.reward}` : 'Ausstehend'}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReferralProgram;
