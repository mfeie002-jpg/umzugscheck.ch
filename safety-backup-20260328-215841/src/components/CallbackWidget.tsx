import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, X, Clock, ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { trackConversion } from "@/lib/conversionTracker";

const CallbackWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  // Track form start on first input
  useEffect(() => {
    if (!hasStarted && phone.length > 0) {
      setHasStarted(true);
      trackConversion('form_start', { form: 'callback_widget' });
    }
  }, [phone, hasStarted]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 10) {
      toast({
        title: "Ungültige Telefonnummer",
        description: "Bitte geben Sie eine gültige Telefonnummer ein.",
        variant: "destructive",
      });
      return;
    }
    setSubmitted(true);
    
    // Track form completion
    trackConversion('form_complete', { form: 'callback_widget' });
    
    toast({
      title: "Rückruf angefordert!",
      description: "Wir rufen Sie innerhalb von 30 Minuten zurück.",
    });
  };

  return (
    <>
      {/* Trigger Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 left-4 z-40 hidden lg:flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-hero text-primary-foreground shadow-strong hover:opacity-90 transition-opacity"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1 }}
        whileHover={{ scale: 1.05 }}
      >
        <Phone className="h-5 w-5" />
        <span className="font-medium">Rückruf</span>
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-[380px] z-50 bg-card rounded-2xl shadow-strong border border-border overflow-hidden"
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
            >
              <div className="bg-gradient-hero text-primary-foreground p-5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-display font-bold text-lg">Rückruf anfordern</h3>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 rounded-full hover:bg-white/20 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="flex items-center gap-2 text-sm opacity-90">
                  <Clock className="h-4 w-4" />
                  <span>Wir rufen Sie innerhalb von 30 Min. zurück</span>
                </div>
              </div>

              <div className="p-5">
                {submitted ? (
                  <motion.div
                    className="text-center py-6"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <div className="w-16 h-16 rounded-full bg-forest/10 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="h-8 w-8 text-forest" />
                    </div>
                    <h4 className="font-bold text-lg mb-2">Vielen Dank!</h4>
                    <p className="text-muted-foreground text-sm">
                      Wir rufen Sie in Kürze zurück.
                    </p>
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={() => setIsOpen(false)}
                    >
                      Schliessen
                    </Button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Ihre Telefonnummer
                      </label>
                      <Input
                        type="tel"
                        placeholder="+41 76 568 13 02"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="h-12"
                      />
                    </div>
                    <Button type="submit" className="w-full h-12 bg-gradient-hero">
                      Rückruf anfordern
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                    <p className="text-xs text-muted-foreground text-center">
                      Kostenlos und unverbindlich. Wir rufen Sie schnellstmöglich zurück.
                    </p>
                  </form>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default CallbackWidget;
