import { useState } from "react";
import { motion } from "framer-motion";
import { Bell, TrendingDown, Mail, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export const PremiumPriceAlert = () => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = () => {
    if (!email) {
      toast.error("Bitte geben Sie Ihre E-Mail-Adresse ein");
      return;
    }
    setIsSubscribed(true);
    toast.success("Preis-Alarm aktiviert!");
  };

  return (
    <section className="py-8 md:py-12 bg-gradient-to-r from-primary/5 via-background to-accent/5">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.4 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-card rounded-3xl p-8 shadow-xl border relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
            
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 md:gap-8">
              <div className="flex-shrink-0 hidden sm:block">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-primary/10 rounded-2xl flex items-center justify-center">
                  <Bell className="w-8 h-8 md:w-10 md:h-10 text-primary" />
                </div>
              </div>

              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                  <TrendingDown className="w-5 h-5 text-green-500" />
                  <span className="text-sm font-medium text-green-600">Bis zu 40% sparen</span>
                </div>
                <h3 className="text-2xl font-bold mb-2">Preis-Alarm aktivieren</h3>
                <p className="text-muted-foreground">
                  Erhalten Sie sofort eine Benachrichtigung, wenn Umzugspreise in Ihrer Region sinken.
                </p>
              </div>

              <div className="w-full md:w-auto">
                {isSubscribed ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex items-center gap-2 text-green-600 bg-green-50 px-6 py-3 rounded-xl"
                  >
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">Alarm aktiviert!</span>
                  </motion.div>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        type="email"
                        placeholder="Ihre E-Mail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 w-full sm:w-64"
                      />
                    </div>
                    <Button onClick={handleSubscribe} className="whitespace-nowrap">
                      Alarm aktivieren
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
