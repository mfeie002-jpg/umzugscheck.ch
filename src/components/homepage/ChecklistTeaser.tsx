/**
 * Checklist Teaser - Lead Magnet
 * 
 * Purpose: Capture "browsers" who aren't ready to request offers yet
 * Value exchange: Email for useful PDF checklist
 * 
 * Placement: Before FAQ section
 */

import { memo, useState } from "react";
import { motion } from "framer-motion";
import { 
  FileText, 
  Download, 
  CheckCircle2, 
  Mail,
  ArrowRight,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const checklistItems = [
  "8 Wochen vor dem Umzug – erste Schritte",
  "Kündigungsfristen & Behördengänge",
  "Packmaterial-Checkliste (mit Mengen)",
  "Umzugstag: Stunde-für-Stunde Plan",
  "Nach dem Umzug: Was nicht vergessen",
];

export const ChecklistTeaser = memo(function ChecklistTeaser() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsSubmitting(true);
    
    // Simulate API call - replace with actual lead capture
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSubmitted(true);
    setIsSubmitting(false);
    
    toast({
      title: "Checkliste wird gesendet!",
      description: "Sie erhalten die PDF in wenigen Minuten per E-Mail.",
    });
  };

  return (
    <section className="py-12 md:py-16 bg-gradient-to-br from-primary/5 via-background to-primary/5">
      <div className="container max-w-4xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-2xl overflow-hidden border border-primary/20 
                     bg-card shadow-lg"
        >
          {/* Decorative corner */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl 
                          from-primary/10 to-transparent rounded-bl-full" />
          
          <div className="relative p-6 md:p-10">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              
              {/* Left: Content */}
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full 
                                bg-primary/10 text-primary text-xs font-medium mb-4">
                  <Sparkles className="w-3.5 h-3.5" />
                  Gratis Download
                </div>
                
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
                  Schweizer Umzugs-Checkliste
                </h2>
                <p className="text-muted-foreground mb-6">
                  Vergessen Sie nichts beim Umzug. Unsere 5-Seiten PDF mit allen 
                  wichtigen Schritten, Fristen und Tipps.
                </p>
                
                {/* Checklist Preview */}
                <ul className="space-y-2 mb-6">
                  {checklistItems.map((item, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-2 text-sm"
                    >
                      <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
              
              {/* Right: Form or Success */}
              <div className="relative">
                {!isSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="bg-muted/50 rounded-xl p-6 border border-border/50"
                  >
                    {/* PDF Preview Icon */}
                    <div className="flex justify-center mb-4">
                      <div className="w-16 h-20 rounded-lg bg-primary/10 border-2 border-primary/20 
                                      flex flex-col items-center justify-center">
                        <FileText className="w-8 h-8 text-primary" />
                        <span className="text-[9px] font-bold text-primary mt-1">PDF</span>
                      </div>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="space-y-3">
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          type="email"
                          placeholder="ihre@email.ch"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-10 h-12"
                          required
                        />
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full h-12 text-base font-semibold"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          "Wird gesendet..."
                        ) : (
                          <>
                            <Download className="w-4 h-4 mr-2" />
                            Gratis Checkliste erhalten
                          </>
                        )}
                      </Button>
                      <p className="text-[10px] text-center text-muted-foreground">
                        Kein Spam. Nur die Checkliste + gelegentlich Tipps.
                      </p>
                    </form>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-emerald-50 dark:bg-emerald-950/30 rounded-xl p-8 
                               border border-emerald-200 dark:border-emerald-800 text-center"
                  >
                    <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/50 
                                    flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">
                      Checkliste unterwegs!
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Prüfen Sie Ihr E-Mail-Postfach (auch Spam-Ordner).
                    </p>
                    <Button variant="outline" size="sm" asChild>
                      <a href="/umzugsofferten">
                        Jetzt Offerten vergleichen
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </a>
                    </Button>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
});

export default ChecklistTeaser;
