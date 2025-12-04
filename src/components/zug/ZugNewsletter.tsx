/**
 * Zug Newsletter Component
 * #101+: Newsletter signup with moving tips
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Gift, CheckCircle2, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export const ZugNewsletter = () => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
    }
  };

  const benefits = [
    "Exklusive Umzugstipps für den Kanton Zug",
    "Saisonale Rabattaktionen",
    "Neue Partnerfirmen in deiner Region",
  ];

  return (
    <section className="py-12 sm:py-16">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative bg-gradient-to-br from-primary via-primary/90 to-primary/80 rounded-2xl p-6 sm:p-10 overflow-hidden"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
          </div>

          <div className="relative grid lg:grid-cols-2 gap-8 items-center">
            {/* Content */}
            <div className="text-white">
              <Badge className="bg-white/20 text-white border-none mb-4">
                <Gift className="w-3 h-3 mr-1" />
                Gratis Umzugsguide
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                Umzugstipps direkt in deine Inbox
              </h2>
              <p className="text-white/80 mb-6">
                Erhalte unseren kostenlosen Umzugsratgeber für den Kanton Zug 
                und verpasse keine Sonderaktionen unserer Partnerfirmen.
              </p>

              <ul className="space-y-2">
                {benefits.map((benefit, index) => (
                  <motion.li
                    key={benefit}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-2 text-sm text-white/90"
                  >
                    <CheckCircle2 className="w-4 h-4 text-green-300 flex-shrink-0" />
                    {benefit}
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Form */}
            <div>
              {isSubscribed ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-xl p-6 text-center"
                >
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-green-500" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    Willkommen an Bord!
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Dein Umzugsguide ist unterwegs. Schau in deinem Posteingang nach!
                  </p>
                </motion.div>
              ) : (
                <motion.form
                  onSubmit={handleSubmit}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-xl p-6"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Mail className="w-5 h-5 text-primary" />
                    <span className="font-medium">Newsletter abonnieren</span>
                  </div>

                  <div className="space-y-3">
                    <Input
                      type="email"
                      placeholder="deine@email.ch"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="bg-muted/50"
                    />
                    <Button type="submit" className="w-full" size="lg">
                      <Sparkles className="w-4 h-4 mr-2" />
                      Gratis Guide erhalten
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>

                  <p className="text-xs text-muted-foreground text-center mt-4">
                    Kein Spam. Jederzeit abmeldbar. Datenschutz garantiert.
                  </p>
                </motion.form>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
