import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Phone, Calculator, MessageCircle, X, Send, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useFlowPath } from "@/hooks/useUnifiedAB";

export const ZuerichQuickActions = () => {
  const flowPath = useFlowPath();
  const [showCallback, setShowCallback] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setShowCallback(false);
      setSubmitted(false);
      setPhone("");
      setName("");
    }, 2000);
  };

  return (
    <>
      <div className="fixed right-4 bottom-24 z-40 flex flex-col gap-3">
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          <Button
            size="icon"
            className="h-12 w-12 rounded-full shadow-lg bg-success hover:bg-success/90"
            onClick={() => setShowCallback(true)}
          >
            <Phone className="h-5 w-5" />
          </Button>
        </motion.div>

        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          <Link to={flowPath}>
            <Button size="icon" className="h-12 w-12 rounded-full shadow-lg bg-primary hover:bg-primary/90">
              <Calculator className="h-5 w-5" />
            </Button>
          </Link>
        </motion.div>

        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          <Link to="/kontakt">
            <Button size="icon" className="h-12 w-12 rounded-full shadow-lg bg-accent hover:bg-accent/90">
              <MessageCircle className="h-5 w-5" />
            </Button>
          </Link>
        </motion.div>
      </div>

      <AnimatePresence>
        {showCallback && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowCallback(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Card className="w-full max-w-md">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Rückruf anfordern</h3>
                    <Button variant="ghost" size="icon" onClick={() => setShowCallback(false)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  {submitted ? (
                    <div className="text-center py-8">
                      <CheckCircle className="h-12 w-12 text-success mx-auto mb-4" />
                      <p className="font-medium">Vielen Dank!</p>
                      <p className="text-sm text-muted-foreground">Wir rufen Sie in Kürze zurück.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Ihr Name"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Telefonnummer</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+41 79 123 45 67"
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full">
                        <Send className="h-4 w-4 mr-2" />
                        Rückruf anfordern
                      </Button>
                      <p className="text-xs text-center text-muted-foreground">
                        Wir melden uns innerhalb von 2 Stunden
                      </p>
                    </form>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
