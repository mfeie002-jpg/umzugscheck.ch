import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, CheckCircle, Gift } from "lucide-react";
import { toast } from "sonner";

interface CantonNewsletterProps {
  cantonName: string;
}

export const CantonNewsletter = ({ cantonName }: CantonNewsletterProps) => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      toast.success("Erfolgreich angemeldet!");
    }
  };

  if (subscribed) {
    return (
      <Card className="bg-success/5 border-success/20">
        <CardContent className="p-6 text-center">
          <CheckCircle className="h-12 w-12 mx-auto mb-3 text-success" />
          <h3 className="font-semibold mb-2">Willkommen!</h3>
          <p className="text-sm text-muted-foreground">Sie erhalten bald unsere {cantonName}er Umzugstipps</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Mail className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">{cantonName}er Umzugstipps</h3>
            <p className="text-xs text-muted-foreground">Exklusive Rabatte & Infos</p>
          </div>
        </div>
        <div className="flex items-center gap-2 mb-4 text-sm">
          <Gift className="h-4 w-4 text-accent" />
          <span className="font-medium">10% Rabatt-Code bei Anmeldung</span>
        </div>
        <form onSubmit={handleSubscribe} className="space-y-3">
          <Input 
            type="email" 
            placeholder="ihre@email.ch" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            required 
            className="bg-background" 
          />
          <Button type="submit" className="w-full bg-primary">Anmelden</Button>
        </form>
        <p className="text-xs text-muted-foreground mt-3 text-center">Kein Spam. Jederzeit abmelden.</p>
      </CardContent>
    </Card>
  );
};
