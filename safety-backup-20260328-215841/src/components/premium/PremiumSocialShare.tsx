import { motion } from "framer-motion";
import { Share2, Facebook, Twitter, Linkedin, Mail, Link2, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const PremiumSocialShare = () => {
  const shareUrl = "https://umzugscheck.ch";
  const shareText = "Ich habe mit Umzugscheck.ch CHF 500 bei meinem Umzug gespart! Probier es auch aus:";

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    toast.success("Link kopiert!");
  };

  const shareButtons = [
    { icon: Facebook, label: "Facebook", color: "bg-[#1877f2] hover:bg-[#1877f2]/90", href: `https://facebook.com/sharer/sharer.php?u=${shareUrl}` },
    { icon: Twitter, label: "Twitter", color: "bg-[#1da1f2] hover:bg-[#1da1f2]/90", href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${shareUrl}` },
    { icon: Linkedin, label: "LinkedIn", color: "bg-[#0077b5] hover:bg-[#0077b5]/90", href: `https://linkedin.com/sharing/share-offsite/?url=${shareUrl}` },
    { icon: Mail, label: "E-Mail", color: "bg-muted-foreground hover:bg-muted-foreground/90", href: `mailto:?subject=Umzugscheck.ch - Umzugsfirmen vergleichen&body=${encodeURIComponent(shareText + " " + shareUrl)}` },
  ];

  return (
    <section className="py-8 md:py-12 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.4 }}
          className="max-w-2xl mx-auto text-center"
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Gift className="w-4 h-4" />
            Freunde werben
          </div>

          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Teilen & CHF 50 erhalten
          </h2>
          <p className="text-muted-foreground mb-8">
            Empfehlen Sie uns weiter und erhalten Sie CHF 50 Gutschrift auf Ihren nächsten Umzug
          </p>

          <div className="flex flex-wrap justify-center gap-3 mb-6">
            {shareButtons.map((button) => (
              <Button
                key={button.label}
                asChild
                className={`${button.color} text-white`}
              >
                <a href={button.href} target="_blank" rel="noopener noreferrer">
                  <button.icon className="w-4 h-4 mr-2" />
                  {button.label}
                </a>
              </Button>
            ))}
          </div>

          <Button variant="outline" onClick={copyLink} className="gap-2">
            <Link2 className="w-4 h-4" />
            Link kopieren
          </Button>
        </motion.div>
      </div>
    </section>
  );
};
