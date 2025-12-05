import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Gift, CheckCircle, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const NewsletterSignup = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert({ email, source: 'homepage_widget' });

      if (error) {
        if (error.code === '23505') {
          toast({
            title: "Bereits angemeldet",
            description: "Diese E-Mail-Adresse ist bereits registriert.",
          });
        } else {
          throw error;
        }
      } else {
        setIsSubscribed(true);
        toast({
          title: "Erfolgreich angemeldet!",
          description: "Sie erhalten in Kürze unseren Newsletter.",
        });
      }
    } catch (error) {
      toast({
        title: "Fehler",
        description: "Die Anmeldung ist fehlgeschlagen. Bitte versuchen Sie es erneut.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-2xl p-6 md:p-8 border border-primary/20">
      <AnimatePresence mode="wait">
        {!isSubscribed ? (
          <motion.div
            key="form"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 bg-primary/10 rounded-xl">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-lg">Newsletter</h3>
                  <Badge className="bg-green-500">
                    <Gift className="h-3 w-3 mr-1" />
                    Gratis Checkliste
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Erhalten Sie Umzugstipps, exklusive Angebote und unsere kostenlose Umzugs-Checkliste.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                type="email"
                placeholder="Ihre E-Mail-Adresse"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1"
                required
              />
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <Sparkles className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    Anmelden
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </>
                )}
              </Button>
            </form>

            <p className="text-xs text-muted-foreground mt-3">
              Kein Spam. Jederzeit abmeldbar. Ihre Daten sind bei uns sicher.
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-4"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/10 rounded-full mb-4">
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
            <h3 className="font-bold text-lg mb-2">Vielen Dank!</h3>
            <p className="text-muted-foreground">
              Sie haben sich erfolgreich angemeldet. Ihre Checkliste wird in Kürze per E-Mail gesendet.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
