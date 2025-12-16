import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Clock, Gift, X } from "lucide-react";
import { toast } from "sonner";

interface ExitIntentPopupProps {
  formData?: {
    fromLocation?: string;
    toLocation?: string;
    rooms?: string;
  };
}

export const ExitIntentPopup = ({ formData }: ExitIntentPopupProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);

  useEffect(() => {
    // Check if already shown in this session
    const alreadyShown = sessionStorage.getItem("exitIntentShown");
    if (alreadyShown) return;

    const handleMouseLeave = (e: MouseEvent) => {
      // Only trigger when mouse leaves from top of viewport
      if (e.clientY <= 0 && !hasTriggered) {
        setIsOpen(true);
        setHasTriggered(true);
        sessionStorage.setItem("exitIntentShown", "true");
      }
    };

    // Also trigger on back button attempt (mobile)
    const handlePopState = () => {
      if (!hasTriggered) {
        setIsOpen(true);
        setHasTriggered(true);
        sessionStorage.setItem("exitIntentShown", "true");
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("popstate", handlePopState);

    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [hasTriggered]);

  const handleSaveProgress = async () => {
    if (!email) {
      toast.error("Bitte geben Sie Ihre E-Mail-Adresse ein");
      return;
    }

    setIsSubmitting(true);

    try {
      // Save progress to localStorage with email
      const progressData = {
        email,
        formData,
        savedAt: new Date().toISOString(),
      };
      localStorage.setItem("uc_saved_progress", JSON.stringify(progressData));

      toast.success("Fortschritt gespeichert!", {
        description: "Wir senden Ihnen einen Link zum Weitermachen.",
      });
      setIsOpen(false);
    } catch (error) {
      toast.error("Fehler beim Speichern");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Clock className="h-8 w-8 text-primary" />
            </div>
          </div>
          <DialogTitle className="text-center text-xl">
            Warten Sie – Ihren Fortschritt speichern?
          </DialogTitle>
          <DialogDescription className="text-center">
            Speichern Sie Ihre Eingaben und erhalten Sie später einen Link zum Weitermachen per E-Mail.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Show current progress summary */}
          {formData && (formData.fromLocation || formData.toLocation) && (
            <div className="bg-muted/50 rounded-lg p-3 text-sm">
              <p className="font-medium mb-1">Ihr bisheriger Fortschritt:</p>
              <div className="text-muted-foreground space-y-1">
                {formData.fromLocation && <p>Von: {formData.fromLocation}</p>}
                {formData.toLocation && <p>Nach: {formData.toLocation}</p>}
                {formData.rooms && <p>Zimmer: {formData.rooms}</p>}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="email"
                placeholder="ihre@email.ch"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Button 
            onClick={handleSaveProgress} 
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Wird gespeichert..." : "Fortschritt speichern"}
          </Button>

          {/* Bonus incentive */}
          <div className="flex items-center gap-2 justify-center text-sm text-muted-foreground">
            <Gift className="h-4 w-4 text-primary" />
            <span>Bonus: 5% Rabatt bei Abschluss innerhalb 48h</span>
          </div>

          <button
            onClick={() => setIsOpen(false)}
            className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Nein danke, ich möchte die Seite verlassen
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
