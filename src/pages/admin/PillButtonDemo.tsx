import React from "react";
import { PillButton } from "@/components/ui/pill-button";
import { 
  FlaskConical, 
  Star, 
  Rocket, 
  Download, 
  Upload,
  Zap,
  Crown,
  Check,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Shield
} from "lucide-react";

/**
 * Pill Button Demo Page
 * 
 * Showcases all variants and sizes of the PillButton component.
 */
const PillButtonDemo = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">
            Pill Button Komponenten
          </h1>
          <p className="text-muted-foreground text-lg">
            Schöne, moderne Pill-Buttons nach dem Vorbild-Design
          </p>
        </div>

        {/* Main Demo - Like the reference */}
        <section className="bg-white rounded-2xl p-8 shadow-lg space-y-6">
          <h2 className="text-xl font-semibold text-foreground">
            Vorbild-Stil (SP V1)
          </h2>
          <div className="flex flex-wrap gap-4 items-center">
            <PillButton 
              icon={FlaskConical} 
              label="SP V1" 
              variant="blue" 
              size="lg"
            />
            <PillButton 
              icon={FlaskConical} 
              label="SP V2" 
              variant="blue" 
            />
            <PillButton 
              icon={FlaskConical} 
              label="SP V3" 
              variant="blue" 
              size="sm"
            />
          </div>
        </section>

        {/* Variants */}
        <section className="bg-white rounded-2xl p-8 shadow-lg space-y-6">
          <h2 className="text-xl font-semibold text-foreground">
            Alle Varianten
          </h2>
          <div className="flex flex-wrap gap-4 items-center">
            <PillButton icon={Zap} label="Blue" variant="blue" />
            <PillButton icon={Star} label="Red" variant="red" />
            <PillButton icon={Check} label="Green" variant="green" />
            <PillButton icon={Crown} label="Gold" variant="gold" />
            <PillButton icon={Shield} label="Muted" variant="muted" />
            <PillButton icon={Rocket} label="Outline" variant="outline" />
            <PillButton icon={Sparkles} label="Dark" variant="dark" />
          </div>
        </section>

        {/* Sizes */}
        <section className="bg-white rounded-2xl p-8 shadow-lg space-y-6">
          <h2 className="text-xl font-semibold text-foreground">
            Größen
          </h2>
          <div className="flex flex-wrap gap-4 items-end">
            <PillButton icon={ArrowRight} label="Small" variant="blue" size="sm" />
            <PillButton icon={ArrowRight} label="Default" variant="blue" size="default" />
            <PillButton icon={ArrowRight} label="Large" variant="blue" size="lg" />
            <PillButton icon={ArrowRight} label="Extra Large" variant="blue" size="xl" />
          </div>
        </section>

        {/* Icon Styles */}
        <section className="bg-white rounded-2xl p-8 shadow-lg space-y-6">
          <h2 className="text-xl font-semibold text-foreground">
            Icon-Stile
          </h2>
          <div className="flex flex-wrap gap-4 items-center">
            <PillButton 
              icon={Star} 
              label="Contrast (Default)" 
              variant="blue" 
              iconStyle="contrast" 
            />
            <PillButton 
              icon={Star} 
              label="Transparent" 
              variant="blue" 
              iconStyle="transparent" 
            />
            <PillButton 
              icon={Star} 
              label="Subtle" 
              variant="blue" 
              iconStyle="default" 
            />
          </div>
        </section>

        {/* With Badges */}
        <section className="bg-white rounded-2xl p-8 shadow-lg space-y-6">
          <h2 className="text-xl font-semibold text-foreground">
            Mit Badge
          </h2>
          <div className="flex flex-wrap gap-4 items-center">
            <PillButton icon={Download} label="Downloads" variant="blue" badge={5} />
            <PillButton icon={Upload} label="Uploads" variant="green" badge={12} />
            <PillButton icon={TrendingUp} label="Updates" variant="red" badge={99} />
            <PillButton icon={Sparkles} label="Neu" variant="gold" badge={150} />
          </div>
        </section>

        {/* Use Cases */}
        <section className="bg-white rounded-2xl p-8 shadow-lg space-y-6">
          <h2 className="text-xl font-semibold text-foreground">
            Anwendungsbeispiele
          </h2>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-3">
              <PillButton icon={FlaskConical} label="Flow Analyzer" variant="blue" size="lg" />
              <PillButton icon={Rocket} label="Version Wählen" variant="outline" size="lg" />
            </div>
            <div className="flex flex-wrap gap-3">
              <PillButton icon={Check} label="Aktiv" variant="green" />
              <PillButton icon={Star} label="Premium" variant="gold" />
              <PillButton icon={Shield} label="Verifiziert" variant="blue" />
            </div>
            <div className="flex flex-wrap gap-3">
              <PillButton icon={Download} label="ZIP Export" variant="dark" size="lg" />
              <PillButton icon={Download} label="CSV Export" variant="muted" size="lg" />
            </div>
          </div>
        </section>

        {/* Dark Background Demo */}
        <section className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-8 shadow-lg space-y-6">
          <h2 className="text-xl font-semibold text-white">
            Auf dunklem Hintergrund
          </h2>
          <div className="flex flex-wrap gap-4 items-center">
            <PillButton icon={FlaskConical} label="SP V1" variant="blue" />
            <PillButton icon={Star} label="Premium" variant="gold" />
            <PillButton icon={Check} label="Aktiv" variant="green" />
            <PillButton icon={Sparkles} label="Neu" variant="red" />
          </div>
        </section>
      </div>
    </div>
  );
};

export default PillButtonDemo;
