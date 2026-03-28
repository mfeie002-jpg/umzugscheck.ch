import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, CheckCircle, Gift, Bell } from "lucide-react";

export const ZuerichNewsletter = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <Card className="max-w-2xl mx-auto bg-gradient-to-r from-primary/5 to-accent/5 border-2 border-primary/20">
          <CardContent className="p-8 text-center">
            {submitted ? (
              <div className="py-4">
                <CheckCircle className="h-12 w-12 text-success mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Vielen Dank!</h3>
                <p className="text-muted-foreground">Sie erhalten in Kürze Ihren Rabattcode per E-Mail.</p>
              </div>
            ) : (
              <>
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Gift className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold mb-2">10% Rabatt für Zürcher Umzüge</h3>
                <p className="text-muted-foreground mb-6">
                  Abonnieren Sie unseren Newsletter und erhalten Sie exklusive Angebote für Umzüge in Zürich.
                </p>
                <form onSubmit={handleSubmit} className="flex gap-3 max-w-md mx-auto">
                  <div className="relative flex-1">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ihre@email.ch"
                      className="pl-10"
                      required
                    />
                  </div>
                  <Button type="submit">
                    <Bell className="h-4 w-4 mr-2" />
                    Anmelden
                  </Button>
                </form>
                <p className="text-xs text-muted-foreground mt-4">
                  Kein Spam. Jederzeit abmeldbar. Ihre Daten sind sicher.
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
