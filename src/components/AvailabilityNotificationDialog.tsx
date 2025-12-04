import { useState } from "react";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { CalendarIcon, Bell, Mail, Loader2, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface AvailabilityNotificationDialogProps {
  companyName?: string;
  canton?: string;
  triggerButton?: React.ReactNode;
}

const AvailabilityNotificationDialog = ({
  companyName,
  canton,
  triggerButton,
}: AvailabilityNotificationDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [preferredDate, setPreferredDate] = useState<Date>();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "E-Mail erforderlich",
        description: "Bitte geben Sie Ihre E-Mail-Adresse ein.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("availability-notification", {
        body: {
          email,
          companyName: companyName || "",
          preferredDate: preferredDate ? format(preferredDate, "dd.MM.yyyy") : "",
          canton: canton || "",
          notificationType: "subscribe",
        },
      });

      if (error) throw error;

      setIsSuccess(true);
      toast({
        title: "Benachrichtigung aktiviert!",
        description: "Sie erhalten eine E-Mail, sobald passende Firmen verfügbar sind.",
      });

      // Reset after showing success
      setTimeout(() => {
        setIsOpen(false);
        setIsSuccess(false);
        setEmail("");
        setPreferredDate(undefined);
      }, 2000);
    } catch (error: any) {
      console.error("Error subscribing to notifications:", error);
      toast({
        title: "Fehler",
        description: "Die Benachrichtigung konnte nicht aktiviert werden. Bitte versuchen Sie es erneut.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {triggerButton || (
          <Button variant="outline" size="sm" className="gap-2">
            <Bell className="w-4 h-4" />
            Benachrichtigen
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" />
            Verfügbarkeitsbenachrichtigung
          </DialogTitle>
          <DialogDescription>
            Erhalten Sie eine E-Mail, sobald {companyName ? `${companyName}` : "passende Umzugsfirmen"} für Ihr Wunschdatum verfügbar {companyName ? "ist" : "sind"}.
          </DialogDescription>
        </DialogHeader>

        {isSuccess ? (
          <div className="py-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Erfolgreich angemeldet!</h3>
            <p className="text-muted-foreground text-sm">
              Wir benachrichtigen Sie per E-Mail.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                E-Mail-Adresse
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="ihre@email.ch"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4" />
                Wunschdatum (optional)
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal h-11",
                      !preferredDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {preferredDate ? (
                      format(preferredDate, "PPP", { locale: de })
                    ) : (
                      <span>Datum auswählen</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={preferredDate}
                    onSelect={setPreferredDate}
                    disabled={(date) => date < new Date()}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {(companyName || canton) && (
              <div className="p-3 bg-muted/50 rounded-lg text-sm">
                <p className="text-muted-foreground">
                  Sie werden benachrichtigt für:
                </p>
                {companyName && (
                  <p className="font-medium mt-1">{companyName}</p>
                )}
                {canton && (
                  <p className="text-muted-foreground">Kanton: {canton}</p>
                )}
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-11 bg-primary hover:bg-primary-dark"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Wird aktiviert...
                </>
              ) : (
                <>
                  <Bell className="w-4 h-4 mr-2" />
                  Benachrichtigung aktivieren
                </>
              )}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              Sie können die Benachrichtigung jederzeit abbestellen.
            </p>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AvailabilityNotificationDialog;
