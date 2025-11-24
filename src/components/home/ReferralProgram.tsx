import { useState } from "react";
import { motion } from "framer-motion";
import { Gift, Users, TrendingUp, Copy, Check, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const benefits = [
  {
    icon: Gift,
    title: "CHF 50 für jeden Freund",
    description: "Sie und Ihr Freund erhalten je CHF 50 Rabatt",
  },
  {
    icon: Users,
    title: "Unbegrenzte Empfehlungen",
    description: "Empfehlen Sie so viele Freunde wie Sie möchten",
  },
  {
    icon: TrendingUp,
    title: "Bonus-Stufen",
    description: "Ab 5 Empfehlungen: Premium-Status + Extra-Vorteile",
  },
];

export const ReferralProgram = () => {
  const [email, setEmail] = useState("");
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  
  const referralCode = "UMZUG2025";
  const referralLink = `https://umzugscheck.ch?ref=${referralCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast({
      title: "Link kopiert!",
      description: "Teilen Sie den Link mit Ihren Freunden",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Umzugscheck.ch - Spare CHF 50!",
          text: "Erhalte CHF 50 Rabatt auf deinen Umzug mit meinem Empfehlungscode!",
          url: referralLink,
        });
      } catch (error) {
        console.log("Share cancelled");
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Einladung verschickt!",
      description: `Eine E-Mail wurde an ${email} gesendet`,
    });
    setEmail("");
  };

  return (
    <section className="py-16 md:py-20 bg-gradient-to-br from-primary/10 via-accent/5 to-primary/5">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Gift className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Freunde einladen & sparen
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Empfehlen Sie uns weiter und erhalten Sie CHF 50 für jeden erfolgreichen Umzug
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto">
          {/* Benefits */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="text-center h-full border-2 border-primary/20 hover:border-primary/40 transition-colors">
                    <CardContent className="p-6">
                      <div className="w-14 h-14 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Icon className="w-7 h-7 text-primary" />
                      </div>
                      <h3 className="font-bold text-foreground mb-2">
                        {benefit.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {benefit.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Referral Link */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <Card className="shadow-xl border-2 border-primary/30">
              <CardContent className="p-8">
                <div className="space-y-6">
                  {/* Share Link */}
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-3">
                      Ihr persönlicher Empfehlungslink
                    </label>
                    <div className="flex gap-2">
                      <Input
                        value={referralLink}
                        readOnly
                        className="flex-1 font-mono text-sm"
                      />
                      <Button
                        onClick={handleCopy}
                        variant="outline"
                        className="flex-shrink-0"
                      >
                        {copied ? (
                          <>
                            <Check className="w-4 h-4 mr-2" />
                            Kopiert
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 mr-2" />
                            Kopieren
                          </>
                        )}
                      </Button>
                      {navigator.share && (
                        <Button
                          onClick={handleShare}
                          variant="outline"
                          className="flex-shrink-0"
                        >
                          <Share2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Email Invite */}
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-3">
                      Oder per E-Mail einladen
                    </label>
                    <form onSubmit={handleSubmit} className="flex gap-2">
                      <Input
                        type="email"
                        placeholder="freund@beispiel.ch"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="flex-1"
                      />
                      <Button type="submit" className="flex-shrink-0">
                        Einladen
                      </Button>
                    </form>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 pt-6 border-t">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary">0</p>
                      <p className="text-xs text-muted-foreground">Einladungen</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary">0</p>
                      <p className="text-xs text-muted-foreground">Erfolge</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary">CHF 0</p>
                      <p className="text-xs text-muted-foreground">Verdient</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Terms */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-xs text-muted-foreground mt-6"
          >
            * Rabatt wird nach erfolgreichem Umzug gutgeschrieben. AGB anwendbar.
          </motion.p>
        </div>
      </div>
    </section>
  );
};
