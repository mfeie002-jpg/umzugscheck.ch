/**
 * Zug Contact Section Component
 * #53-58: Contact options with live chat indicator
 */

import { motion } from "framer-motion";
import { 
  Phone, Mail, MessageCircle, Clock, 
  MapPin, Send, CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export const ZugContactSection = () => {
  return (
    <section className="py-12 sm:py-16 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Badge variant="outline" className="mb-4">
              <MessageCircle className="w-3 h-3 mr-1" />
              Kontakt
            </Badge>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
              Fragen zum Umzug im Kanton Zug?
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground mb-8">
              Unser Team hilft dir gerne weiter – persönlich und unverbindlich.
            </p>

            {/* Contact Methods */}
            <div className="space-y-4 mb-8">
              <motion.a
                href="tel:+41445001234"
                whileHover={{ x: 5 }}
                className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors group"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Telefon</p>
                  <p className="text-sm text-muted-foreground">+41 44 500 12 34</p>
                </div>
                <Badge variant="secondary" className="ml-auto">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
                  Jetzt erreichbar
                </Badge>
              </motion.a>

              <motion.a
                href="mailto:info@umzugscheck.ch"
                whileHover={{ x: 5 }}
                className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors group"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">E-Mail</p>
                  <p className="text-sm text-muted-foreground">info@umzugscheck.ch</p>
                </div>
              </motion.a>

              <motion.div
                whileHover={{ x: 5 }}
                className="flex items-center gap-4 p-4 rounded-xl bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-green-700 dark:text-green-400">Live Chat</p>
                  <p className="text-sm text-green-600/70 dark:text-green-500/70">Durchschnittliche Antwortzeit: 2 Min.</p>
                </div>
                <Badge className="ml-auto bg-green-500 text-white">
                  Online
                </Badge>
              </motion.div>
            </div>

            {/* Office Hours */}
            <div className="bg-muted/30 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-4 h-4 text-primary" />
                <span className="font-medium text-sm">Öffnungszeiten</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="text-muted-foreground">Mo – Fr</span>
                <span>08:00 – 18:00</span>
                <span className="text-muted-foreground">Sa</span>
                <span>09:00 – 14:00</span>
                <span className="text-muted-foreground">So</span>
                <span className="text-muted-foreground">Geschlossen</span>
              </div>
            </div>
          </motion.div>

          {/* Quick Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-background rounded-2xl p-6 sm:p-8 shadow-lg border border-border/50"
          >
            <h3 className="text-xl font-bold mb-2">Schnellanfrage</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Wir melden uns innerhalb von 24 Stunden bei dir.
            </p>

            <form className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Name</label>
                  <Input placeholder="Dein Name" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">E-Mail</label>
                  <Input type="email" placeholder="deine@email.ch" />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Telefon (optional)</label>
                <Input type="tel" placeholder="+41 79 123 45 67" />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Deine Frage</label>
                <Textarea 
                  placeholder="Beschreibe kurz dein Anliegen..."
                  rows={4}
                />
              </div>

              <Button type="submit" className="w-full" size="lg">
                <Send className="w-4 h-4 mr-2" />
                Nachricht senden
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                <CheckCircle2 className="w-3 h-3 inline mr-1" />
                Deine Daten werden vertraulich behandelt
              </p>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
