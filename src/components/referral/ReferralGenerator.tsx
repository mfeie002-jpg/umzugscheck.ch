import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Copy, Check, Share2, Users, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ReferralGeneratorProps {
  variant?: 'full' | 'compact' | 'inline';
  rewardAmount?: number;
}

export function ReferralGenerator({ variant = 'full', rewardAmount = 50 }: ReferralGeneratorProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState({ total: 0, earned: 0 });
  const { toast } = useToast();

  const generateCode = async () => {
    if (!email) {
      toast({ title: 'Bitte E-Mail eingeben', variant: 'destructive' });
      return;
    }

    setIsLoading(true);
    try {
      // Check if user already has a code
      const { data: existing } = await supabase
        .from('referrals')
        .select('referral_code, total_referrals, total_earned_chf')
        .eq('referrer_email', email)
        .single();

      if (existing) {
        setReferralCode(existing.referral_code);
        setStats({ 
          total: existing.total_referrals || 0, 
          earned: Number(existing.total_earned_chf) || 0 
        });
        toast({ title: 'Dein bestehender Code wurde geladen!' });
      } else {
        // Generate new code
        const { data: codeData } = await supabase.rpc('generate_referral_code');
        const newCode = codeData || `UMZ-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

        const { error } = await supabase.from('referrals').insert({
          referrer_email: email,
          referrer_name: name || null,
          referral_code: newCode,
        });

        if (error) throw error;

        setReferralCode(newCode);
        toast({ title: 'Dein Empfehlungscode wurde erstellt! 🎉' });
      }
    } catch (error) {
      console.error('Error generating referral code:', error);
      toast({ title: 'Fehler beim Erstellen', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const copyLink = () => {
    const link = `${window.location.origin}/?ref=${referralCode}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({ title: 'Link kopiert!' });
  };

  const shareLink = async () => {
    const link = `${window.location.origin}/?ref=${referralCode}`;
    const text = `Spare bei deinem Umzug! Nutze meinen Empfehlungslink und erhalte die besten Offerten: ${link}`;
    
    if (navigator.share) {
      await navigator.share({ title: 'Umzugscheck.ch Empfehlung', text, url: link });
    } else {
      copyLink();
    }
  };

  if (variant === 'inline') {
    return (
      <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border border-primary/20">
        <Gift className="h-8 w-8 text-primary flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm">Empfehle uns weiter</p>
          <p className="text-xs text-muted-foreground">CHF {rewardAmount} pro erfolgreiche Empfehlung</p>
        </div>
        <Button size="sm" variant="default" onClick={() => window.location.href = '/empfehlen'}>
          Jetzt starten
        </Button>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardContent className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-full bg-primary/10">
              <Gift className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h4 className="font-semibold">CHF {rewardAmount} verdienen</h4>
              <p className="text-xs text-muted-foreground">Pro erfolgreiche Empfehlung</p>
            </div>
          </div>
          
          {!referralCode ? (
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Deine E-Mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-9"
              />
              <Button onClick={generateCode} disabled={isLoading} className="w-full h-9" size="sm">
                {isLoading ? 'Wird erstellt...' : 'Code generieren'}
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <code className="flex-1 px-3 py-2 bg-muted rounded text-center font-mono font-bold">
                  {referralCode}
                </code>
                <Button size="icon" variant="outline" onClick={copyLink} className="h-9 w-9">
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <Button onClick={shareLink} variant="outline" className="w-full h-9" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Teilen
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // Full variant
  return (
    <Card className="overflow-hidden border-2 border-primary/20">
      <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-full bg-white/20">
            <Gift className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Empfehlen & Verdienen</h2>
            <p className="opacity-90">CHF {rewardAmount} für jede erfolgreiche Empfehlung</p>
          </div>
          <Badge className="ml-auto bg-white/20 hover:bg-white/30 text-white border-0">
            NEU
          </Badge>
        </div>
      </div>

      <CardContent className="p-6">
        <AnimatePresence mode="wait">
          {!referralCode ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">1.</div>
                  <p className="text-sm text-muted-foreground">Code generieren</p>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">2.</div>
                  <p className="text-sm text-muted-foreground">Link teilen</p>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">3.</div>
                  <p className="text-sm text-muted-foreground">CHF {rewardAmount} erhalten</p>
                </div>
              </div>

              <div className="space-y-3">
                <Input
                  type="text"
                  placeholder="Dein Name (optional)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <Input
                  type="email"
                  placeholder="Deine E-Mail-Adresse"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Button 
                  onClick={generateCode} 
                  disabled={isLoading} 
                  className="w-full"
                  size="lg"
                >
                  {isLoading ? 'Wird erstellt...' : 'Meinen Empfehlungscode generieren'}
                </Button>
              </div>

              <p className="text-xs text-muted-foreground text-center">
                Mit der Registrierung akzeptierst du unsere Empfehlungsbedingungen.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.2 }}
                  className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4"
                >
                  <Check className="h-8 w-8" />
                </motion.div>
                <h3 className="text-xl font-bold">Dein Empfehlungscode ist bereit!</h3>
              </div>

              <div className="bg-muted/50 rounded-xl p-6 text-center">
                <p className="text-sm text-muted-foreground mb-2">Dein persönlicher Code</p>
                <div className="text-3xl font-mono font-bold text-primary mb-4">
                  {referralCode}
                </div>
                <div className="flex gap-2 justify-center">
                  <Button onClick={copyLink} variant={copied ? 'default' : 'outline'}>
                    {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                    {copied ? 'Kopiert!' : 'Link kopieren'}
                  </Button>
                  <Button onClick={shareLink}>
                    <Share2 className="h-4 w-4 mr-2" />
                    Teilen
                  </Button>
                </div>
              </div>

              {stats.total > 0 && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted/30 rounded-lg p-4 text-center">
                    <Users className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
                    <div className="text-2xl font-bold">{stats.total}</div>
                    <p className="text-xs text-muted-foreground">Empfehlungen</p>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-4 text-center">
                    <Wallet className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
                    <div className="text-2xl font-bold">CHF {stats.earned}</div>
                    <p className="text-xs text-muted-foreground">Verdient</p>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
