/**
 * WhatsApp Live-Demo QR-Code Section
 * For investor pitch: scan QR → chat with AI Sales Agent live
 */

import { QRCodeSVG } from "qrcode.react";
import { MessageCircle, Bot, Zap, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

const WHATSAPP_URL = "https://wa.me/41446880404?text=Hallo%2C%20ich%20m%C3%B6chte%20eine%20R%C3%A4umung%20anfragen.";

const features = [
  { icon: Bot, text: "OpenClaw AI antwortet sofort — 24/7" },
  { icon: MessageCircle, text: "WhatsApp Business Katalog mit allen Services" },
  { icon: Zap, text: "Automatische Offerten-Erstellung im Chat" },
  { icon: CheckCircle2, text: "Gründer segnet nur noch ab — 95% autonom" },
];

export function WhatsAppDemoSection() {
  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-green-500/5 via-transparent to-transparent pointer-events-none" />
      
      <div className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <Badge variant="outline" className="mb-4 border-green-500/50 text-green-600 bg-green-500/10">
            <MessageCircle className="w-3 h-3 mr-1" />
            LIVE BEWEIS
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Testen Sie unseren KI-Sales-Agent — jetzt.
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Scannen Sie den QR-Code und schreiben Sie auf WhatsApp. 
            Erleben Sie live, wie OpenClaw AI den gesamten Kundenprozess autonom übernimmt.
          </p>
        </motion.div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-12 max-w-4xl mx-auto">
          {/* QR Code */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex-shrink-0"
          >
            <div className="bg-white p-6 rounded-2xl shadow-xl border-2 border-green-500/20 relative">
              <div className="absolute -top-3 -right-3 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                LIVE
              </div>
              <QRCodeSVG
                value={WHATSAPP_URL}
                size={200}
                level="H"
                includeMargin
                fgColor="#075E54"
                bgColor="#ffffff"
              />
              <p className="text-center text-sm text-muted-foreground mt-2 font-medium">
                WhatsApp scannen
              </p>
            </div>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="space-y-4"
          >
            <h3 className="text-xl font-semibold text-foreground mb-4">
              Was passiert, wenn Sie schreiben:
            </h3>
            {features.map((f, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0">
                  <f.icon className="w-5 h-5 text-green-600" />
                </div>
                <span className="text-foreground/90">{f.text}</span>
              </div>
            ))}
            
            <div className="mt-6 p-4 rounded-xl bg-green-500/5 border border-green-500/20">
              <p className="text-sm text-muted-foreground italic">
                💡 <strong>Pitch-Tipp:</strong> Schreiben Sie einfach «Ich möchte eine 3-Zimmer-Wohnung räumen lassen» 
                und beobachten Sie, wie die KI sofort den Lead qualifiziert.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
