import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface InvestorPasswordGateProps {
  children: React.ReactNode;
}

// Simple hash function for client-side comparison
const simpleHash = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString(36);
};

// Pre-computed hash for "FeierabendInvestor2024"
const VALID_PASSWORD_HASH = simpleHash("FeierabendInvestor2024");
const SESSION_KEY = 'investor_dashboard_access';

export const InvestorPasswordGate = ({ children }: InvestorPasswordGateProps) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem(SESSION_KEY) === 'granted';
  });
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLocked) {
      toast({
        title: "Zugang gesperrt",
        description: "Bitte warten Sie 30 Sekunden und versuchen Sie es erneut.",
        variant: "destructive",
      });
      return;
    }

    if (simpleHash(password) === VALID_PASSWORD_HASH) {
      sessionStorage.setItem(SESSION_KEY, 'granted');
      setIsAuthenticated(true);
      toast({
        title: "Zugang gewährt",
        description: "Willkommen zum Investor Dashboard.",
      });
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      
      if (newAttempts >= 3) {
        setIsLocked(true);
        setTimeout(() => {
          setIsLocked(false);
          setAttempts(0);
        }, 30000);
        toast({
          title: "Zu viele Versuche",
          description: "Zugang für 30 Sekunden gesperrt.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Falsches Passwort",
          description: `${3 - newAttempts} Versuche verbleibend.`,
          variant: "destructive",
        });
      }
      setPassword('');
    }
  };

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-alpine/10 rounded-full flex items-center justify-center">
            <ShieldCheck className="h-8 w-8 text-alpine" />
          </div>
          <CardTitle className="text-2xl font-display">Investor Dashboard</CardTitle>
          <CardDescription>
            Dieser Bereich ist passwortgeschützt. Bitte geben Sie das Zugangskennwort ein.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Passwort eingeben"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10"
                disabled={isLocked}
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={!password.trim() || isLocked}
            >
              {isLocked ? 'Gesperrt...' : 'Zugang anfordern'}
            </Button>
          </form>
          
          <p className="text-xs text-muted-foreground text-center mt-6">
            Für Zugangsdaten kontaktieren Sie bitte das Feierabend Umzüge Team.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default InvestorPasswordGate;
