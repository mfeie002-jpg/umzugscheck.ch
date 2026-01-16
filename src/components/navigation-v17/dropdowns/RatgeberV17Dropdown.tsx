/**
 * Ratgeber Dropdown V17
 * "Die Autorität / SEO" - Fragen beantworten, bevor sie gestellt werden
 */

import { 
  FileText, 
  FileSignature, 
  PiggyBank, 
  Download, 
  FileDown, 
  ClipboardCheck,
  ArrowRight,
  BookOpen,
  Lightbulb,
  HelpCircle
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DropdownWrapper } from "@/components/navigation/DropdownWrapper";
import { DropdownLink } from "@/components/navigation/DropdownLink";
import { DropdownSection } from "@/components/navigation/DropdownSection";
import { DropdownCTACard } from "@/components/navigation/DropdownCTACard";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface DropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

const DOWNLOADS = [
  { 
    title: "Kündigungsvorlage (Word)", 
    icon: FileDown, 
    href: "/ratgeber/kuendigungsschreiben" 
  },
  { 
    title: "Übergabeprotokoll (PDF)", 
    icon: ClipboardCheck, 
    href: "/ratgeber/uebergabeprotokoll" 
  },
];

export const RatgeberV17Dropdown = ({ isOpen, onClose }: DropdownProps) => {
  return (
    <DropdownWrapper isOpen={isOpen} onClose={onClose}>
      <div className="container mx-auto px-4 lg:px-6 py-6 lg:py-8">
        <div className="grid grid-cols-12 gap-6 lg:gap-8">
          
          {/* Left Column: Top-Themen */}
          <div className="col-span-12 md:col-span-4">
            <DropdownSection title="Top-Themen" subtitle="Die wichtigsten Fragen">
              <div className="space-y-1">
                <DropdownLink
                  to="/ratgeber/wohnungsuebergabe"
                  icon={FileText}
                  title="Wohnungsübergabe & Protokoll"
                  description="Was Sie bei der Übergabe beachten müssen."
                  onClick={onClose}
                  featured
                />
                <DropdownLink
                  to="/ratgeber/kuendigungsschreiben"
                  icon={FileSignature}
                  title="Kündigung & Ummeldung"
                  description="Vorlagen und Fristen im Überblick."
                  onClick={onClose}
                />
                <DropdownLink
                  to="/ratgeber/umzugskosten-senken"
                  icon={PiggyBank}
                  title="Spartipps"
                  description="So senken Sie Ihre Umzugskosten."
                  onClick={onClose}
                />
              </div>
            </DropdownSection>
            
            {/* All Articles Link */}
            <Link 
              to="/ratgeber" 
              onClick={onClose}
              className="flex items-center gap-2 mt-4 text-sm font-semibold text-primary hover:underline"
            >
              <BookOpen className="w-4 h-4" />
              Alle Ratgeber-Artikel
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Middle Column: Downloads */}
          <div className="col-span-12 md:col-span-4">
            <DropdownSection title="Downloads" subtitle="Gratis Vorlagen">
              <div className="space-y-2">
                {DOWNLOADS.map((download, idx) => (
                  <motion.div
                    key={download.href}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + idx * 0.05 }}
                  >
                    <Link
                      to={download.href}
                      onClick={onClose}
                      className={cn(
                        "group flex items-center gap-3 p-4 rounded-xl transition-all",
                        "bg-gradient-to-r from-primary/5 to-transparent",
                        "hover:from-primary/10 hover:to-primary/5",
                        "border border-primary/10 hover:border-primary/20",
                        "active:scale-[0.98]"
                      )}
                    >
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center group-hover:from-primary/30 group-hover:to-primary/20 transition-all">
                        <download.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <span className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                          {download.title}
                        </span>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Download className="w-3 h-3 text-emerald-500" />
                          <span className="text-[10px] text-emerald-600 font-medium">Gratis Download</span>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                    </Link>
                  </motion.div>
                ))}
              </div>
              
              {/* Quick Tips */}
              <motion.div 
                className="mt-5 p-4 rounded-xl bg-gradient-to-br from-amber-500/10 to-amber-500/5 border border-amber-500/15"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
              >
                <div className="flex items-start gap-3">
                  <Lightbulb className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm text-foreground mb-1">Profi-Tipp</h4>
                    <p className="text-xs text-muted-foreground">
                      Kündigen Sie Ihre Wohnung mindestens 3 Monate vor dem Umzugstermin.
                    </p>
                  </div>
                </div>
              </motion.div>
            </DropdownSection>
          </div>

          {/* Right Column: CTA Card */}
          <div className="col-span-12 md:col-span-4">
            <motion.div
              className="relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br from-primary/[0.08] via-primary/[0.05] to-emerald-500/[0.05] border border-primary/15 shadow-lg shadow-primary/5"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.15 }}
            >
              {/* Decorative */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-primary/20 to-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center mb-4 shadow-lg shadow-primary/25">
                  <HelpCircle className="w-6 h-6 text-primary-foreground" />
                </div>
                
                <h4 className="font-bold text-lg text-foreground mb-2">Keine Lust zu lesen?</h4>
                <p className="text-sm text-muted-foreground mb-5">
                  Lassen Sie die Profis Ihren Umzug organisieren – von A bis Z.
                </p>
                
                <Button 
                  asChild 
                  className="group w-full h-12 bg-gradient-to-r from-primary via-primary to-primary/90 hover:from-primary/90 hover:via-primary hover:to-primary text-primary-foreground font-bold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all"
                >
                  <Link to="/umzugsofferten" onClick={onClose}>
                    Anfrage starten
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </DropdownWrapper>
  );
};
