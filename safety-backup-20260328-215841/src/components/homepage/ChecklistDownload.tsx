/**
 * Checklist Download Component
 * PDF download with email gate for lead generation
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { FileDown, Mail, CheckCircle2, Shield, ArrowRight, Sparkles, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface ChecklistDownloadProps {
  variant?: "inline" | "modal" | "card";
  className?: string;
}

export const ChecklistDownload = ({ variant = "card", className = "" }: ChecklistDownloadProps) => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const checklistItems = [
    "3 Monate vorher: Kündigung, neue Wohnung",
    "1 Monat vorher: Adressänderungen, Versicherungen",
    "1 Woche vorher: Packen, Helfer organisieren",
    "Am Umzugstag: Übergabe, Zähler ablesen",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || isSubmitting) return;

    setIsSubmitting(true);

    try {
      // Save to newsletter subscribers for lead gen
      const { error } = await supabase
        .from("newsletter_subscribers")
        .upsert({ 
          email, 
          source: "checklist_download",
          is_active: true 
        }, { 
          onConflict: "email" 
        });

      if (error && error.code !== "23505") {
        throw error;
      }

      setIsSuccess(true);
      toast.success("Checkliste wird heruntergeladen!");
      
      // Trigger PDF download
      setTimeout(() => {
        const link = document.createElement("a");
        link.href = "/documents/schweizer-umzugs-checkliste.pdf";
        link.download = "Schweizer-Umzugs-Checkliste-2025.pdf";
        link.click();
      }, 500);

    } catch (error) {
      console.error("Error saving email:", error);
      toast.error("Fehler beim Speichern. Bitte versuchen Sie es erneut.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const FormContent = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="email"
            placeholder="ihre@email.ch"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="pl-10 h-12 rounded-xl"
          />
        </div>
      </div>
      <Button 
        type="submit" 
        className="w-full h-12 rounded-xl"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            <Download className="w-4 h-4 mr-2" />
            Gratis herunterladen
          </>
        )}
      </Button>
      <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-1">
        <Shield className="w-3 h-3" />
        Kein Spam. Ihre Daten bleiben in der Schweiz.
      </p>
    </form>
  );

  const SuccessContent = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-4"
    >
      <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
        <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
      </div>
      <h4 className="text-lg font-bold mb-2">Download gestartet!</h4>
      <p className="text-sm text-muted-foreground">
        Ihre Checkliste wird heruntergeladen. Prüfen Sie auch Ihren Posteingang für weitere Tipps.
      </p>
    </motion.div>
  );

  if (variant === "modal") {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className={`gap-2 ${className}`}>
            <FileDown className="w-4 h-4" />
            Gratis Checkliste
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Schweizer Umzugs-Checkliste 2025
            </DialogTitle>
          </DialogHeader>
          
          {isSuccess ? <SuccessContent /> : (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Die ultimative Checkliste für Ihren stressfreien Umzug in der Schweiz:
              </p>
              <ul className="space-y-2">
                {checklistItems.map((item, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <FormContent />
            </div>
          )}
        </DialogContent>
      </Dialog>
    );
  }

  if (variant === "inline") {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        {isSuccess ? (
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-sm">Checkliste heruntergeladen!</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-2 w-full max-w-md">
            <Input
              type="email"
              placeholder="ihre@email.ch"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 h-10"
            />
            <Button type="submit" size="sm" disabled={isSubmitting}>
              <Download className="w-4 h-4" />
            </Button>
          </form>
        )}
      </div>
    );
  }

  // Card variant (default)
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`bg-gradient-to-br from-primary/5 via-background to-secondary/5 rounded-2xl border border-border p-6 ${className}`}
    >
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
          <FileDown className="w-7 h-7 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-lg mb-1">
            Gratis Umzugs-Checkliste 2025
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Alle wichtigen Schritte, Behördengänge und Fristen für Ihren Umzug in der Schweiz.
          </p>
          
          {isSuccess ? <SuccessContent /> : (
            <>
              <ul className="space-y-1.5 mb-4">
                {checklistItems.map((item, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
              <FormContent />
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};
