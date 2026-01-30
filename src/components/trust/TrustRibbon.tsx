/**
 * TrustRibbon – Local trust bar for Feierabend Umzüge
 * Focused on Versicherungen, Verbände, Register, Payment & Rating.
 * Mobile-first: 2-column grid, static (kein Slider).
 */

import { memo } from "react";
import { ShieldCheck, BadgeCheck, CheckCircle, Star, Banknote } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type TrustItem = {
  title: string;
  subtitle: string;
  logo: string;
};

const ITEMS: TrustItem[] = [
  { title: "Versicherung", subtitle: "Bis CHF 5 Mio. versichert", logo: "Die Mobiliar" },
  { title: "Verband", subtitle: "Offizielles Mitglied", logo: "ASTAG" },
  { title: "Register", subtitle: "Zürich · CHE-123...", logo: "Handelsregister" },
  { title: "Bewertung", subtitle: "4.9 ★ (150+ Kunden)", logo: "Google" },
];

const Logo = ({ name }: { name: string }) => {
  const base = "flex items-center justify-center h-12 md:h-14 px-3 rounded-lg border bg-white filter grayscale hover:grayscale-0 transition-all shadow-sm";
  switch (name) {
    case "Die Mobiliar":
      return <div className={cn(base, "text-[#E2001A] font-black text-sm md:text-base")}>die Mobiliar</div>;
    case "ASTAG":
      return <div className={cn(base, "text-[#0050A8] font-bold text-sm md:text-base")}>ASTAG</div>;
    case "Handelsregister":
      return (
        <div className={cn(base, "gap-2 text-sm md:text-base text-slate-900")}>
          <span className="h-3 w-3 rounded-full bg-red-600" />
          <span>Zefix / HR</span>
        </div>
      );
    case "Google":
      return (
        <div className={cn(base, "gap-1 text-sm md:text-base text-slate-900")}>
          <span className="font-semibold">Google</span>
          <div className="flex items-center gap-0.5 text-amber-500">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            ))}
          </div>
        </div>
      );
    default:
      return <div className={cn(base, "text-sm md:text-base font-semibold")}>{name}</div>;
  }
};

interface TrustRibbonProps {
  className?: string;
}

export const TrustRibbon = memo(function TrustRibbon({ className = "" }: TrustRibbonProps) {
  return (
    <section className={cn("py-6 md:py-10 bg-[#f8f9fa]", className)}>
      <div className="container mx-auto px-3 md:px-4">
        <div className="text-center mb-4 md:mb-6">
          <p className="text-[11px] md:text-xs font-medium text-slate-600">
            Schweizer Qualität &amp; Sicherheit garantiert durch:
          </p>
        </div>

        <motion.div
          className="grid grid-cols-2 gap-3 md:gap-4 md:flex md:flex-wrap md:justify-between"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {ITEMS.map((item, idx) => (
            <motion.div
              key={item.title}
              className="bg-white/90 rounded-xl border border-slate-200 p-3 md:p-4 shadow-sm hover:shadow-md transition-all"
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
            >
              <div className="flex items-center gap-2 mb-2 text-slate-900">
                {item.title === "Versicherung" && <ShieldCheck className="w-4 h-4 text-primary" />}
                {item.title === "Verband" && <BadgeCheck className="w-4 h-4 text-primary" />}
                {item.title === "Register" && <CheckCircle className="w-4 h-4 text-primary" />}
                {item.title === "Bewertung" && <Star className="w-4 h-4 text-amber-500 fill-amber-400" />}
                <span className="text-sm font-semibold">{item.title}</span>
              </div>
              <Logo name={item.logo} />
              <p className="mt-2 text-[11px] md:text-xs text-slate-600">{item.subtitle}</p>
            </motion.div>
          ))}

          {/* TWINT single row */}
          <motion.div
            className="col-span-2 w-full bg-white/90 rounded-xl border border-slate-200 p-3 md:p-4 shadow-sm hover:shadow-md transition-all md:max-w-xs"
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.25 }}
          >
            <div className="flex items-center gap-2 mb-2 text-slate-900">
              <Banknote className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold">Zahlung</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center h-12 md:h-14 px-3 rounded-lg border bg-white filter grayscale hover:grayscale-0 transition-all shadow-sm text-sm md:text-base font-semibold">
                  TWINT
                </div>
                <div className="hidden md:block h-12 w-px bg-slate-200" />
              </div>
              <span className="text-[11px] md:text-xs text-slate-600">Bequem bezahlen</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
});
