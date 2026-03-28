import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, ArrowRight, CheckCircle, Gift, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from("newsletter_subscribers")
        .insert({ email, source: "homepage" });

      if (error) {
        if (error.code === "23505") {
          toast.info("Sie sind bereits für unseren Newsletter angemeldet.");
        } else {
          throw error;
        }
      } else {
        setIsSubmitted(true);
        toast.success("Vielen Dank! Sie erhalten bald unsere Tipps.");
        setEmail("");
        setTimeout(() => setIsSubmitted(false), 3000);
      }
    } catch (error) {
      console.error("Newsletter subscription error:", error);
      toast.error("Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-12 md:py-16 bg-primary/5">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center"
        >
          <div className="inline-flex items-center gap-2 bg-secondary/10 text-secondary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Gift className="w-4 h-4" />
            Gratis Umzugs-Checkliste
          </div>
          
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Umzugstipps direkt in Ihr Postfach
          </h2>
          <p className="text-muted-foreground mb-6">
            Erhalten Sie unsere besten Tipps, Checklisten und exklusive Angebote für Ihren Umzug.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <div className="relative flex-1">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="email"
                placeholder="Ihre E-Mail-Adresse"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 h-12 rounded-xl"
                required
                disabled={isSubmitting}
              />
            </div>
            <Button
              type="submit"
              className="h-12 px-6 rounded-xl bg-secondary hover:bg-secondary/90"
              disabled={isSubmitting || isSubmitted}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Wird gesendet...
                </>
              ) : isSubmitted ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Gesendet
                </>
              ) : (
                <>
                  Anmelden
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </form>

          <p className="text-xs text-muted-foreground mt-4">
            Kein Spam. Jederzeit abmeldbar. Datenschutz garantiert.
          </p>
        </motion.div>
      </div>
    </section>
  );
};
