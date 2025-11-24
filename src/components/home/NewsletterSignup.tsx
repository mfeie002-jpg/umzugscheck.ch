import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Send, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export const NewsletterSignup = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate newsletter signup
    console.log("Newsletter signup:", email);
    
    setIsSubmitted(true);
    toast({
      title: "Erfolgreich angemeldet!",
      description: "Vielen Dank für Ihre Anmeldung. Wir senden Ihnen in Kürze nützliche Umzugs-Tipps.",
    });
    
    setEmail("");
    
    // Reset after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
    }, 3000);
  };

  return (
    <section className="py-16 md:py-20 bg-gradient-to-br from-primary/10 to-accent/5">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Card className="max-w-4xl mx-auto bg-gradient-to-r from-card to-card/95 border-2 border-primary/20 shadow-xl">
            <CardContent className="p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                {/* Left side - Content */}
                <div>
                  <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                    <Mail className="w-7 h-7 text-primary" />
                  </div>
                  
                  <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
                    Bleiben Sie informiert
                  </h3>
                  
                  <p className="text-muted-foreground mb-4">
                    Erhalten Sie exklusive Umzugs-Tipps, Checklisten und Sonderangebote 
                    direkt in Ihr Postfach.
                  </p>
                  
                  <ul className="space-y-2 text-sm">
                    {[
                      "Monatliche Umzugs-Tipps & Tricks",
                      "Exklusive Rabattaktionen",
                      "Kostenlose Checklisten & Guides",
                      "Keine Spam-Mails, versprochen!",
                    ].map((benefit) => (
                      <li key={benefit} className="flex items-center gap-2 text-foreground">
                        <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Right side - Form */}
                <div>
                  {!isSubmitted ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <Input
                          type="email"
                          placeholder="ihre.email@beispiel.ch"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="h-12 text-base"
                        />
                      </div>
                      
                      <Button
                        type="submit"
                        size="lg"
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                      >
                        Jetzt anmelden
                        <Send className="w-5 h-5 ml-2" />
                      </Button>
                      
                      <p className="text-xs text-muted-foreground text-center">
                        Mit der Anmeldung akzeptieren Sie unsere{" "}
                        <a href="/datenschutz" className="text-primary hover:underline">
                          Datenschutzbestimmungen
                        </a>
                      </p>
                    </form>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-8"
                    >
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                        <CheckCircle className="w-10 h-10 text-green-600" />
                      </div>
                      <h4 className="text-xl font-bold text-foreground mb-2">
                        Erfolgreich angemeldet!
                      </h4>
                      <p className="text-muted-foreground">
                        Prüfen Sie Ihr E-Mail-Postfach.
                      </p>
                    </motion.div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};
