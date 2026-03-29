/**
 * AlreadyLiveSection — "Bereits live & startklar" proof block
 */
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import {
  MessageCircle, ImageIcon, Bot, BarChart3, CheckCircle2,
} from "lucide-react";
import { FunnelFlowDiagram, PlatformFlywheel } from "./InvestorInfographics";

const proofCards = [
  {
    icon: MessageCircle,
    title: "WhatsApp Business eingerichtet",
    desc: "Katalog, Bilder, Beschreibungen und Auswahl sind live.",
    color: "text-green-500",
    bg: "bg-green-500/10",
  },
  {
    icon: Bot,
    title: "KI-Kommunikation läuft bereits",
    desc: "Die KI kann Kundeninteraktion und Vorqualifikation übernehmen.",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: ImageIcon,
    title: "OpenClaw verarbeitet Anfragen",
    desc: "Die operative Mitte ist bereits automatisierbar.",
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    icon: BarChart3,
    title: "60 Funnel-Varianten dokumentiert",
    desc: "Es gibt bereits eine breite Test- und Optimierungsbasis.",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
];

export function AlreadyLiveSection() {
  return (
    <section className="py-16 md:py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <Badge className="mb-4 bg-green-500/10 text-green-600 border-green-500/20">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
            Kein Pitch-Deck — echte Realität
          </Badge>
          <h2 className="text-3xl md:text-4xl font-black text-foreground mb-3">
            Bereits live & startklar
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Das hier ist kein PowerPoint. Diese Systeme laufen heute.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {proofCards.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="rounded-2xl border border-border bg-card p-6 flex gap-4 items-start hover:shadow-lg transition-shadow"
            >
              <div className={`${card.bg} w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0`}>
                <card.icon className={`w-6 h-6 ${card.color}`} />
              </div>
              <div>
                <h3 className="font-bold text-foreground mb-1">{card.title}</h3>
                <p className="text-sm text-muted-foreground">{card.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
