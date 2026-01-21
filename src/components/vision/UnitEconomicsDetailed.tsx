/**
 * Unit Economics Detailed Component
 * Clear breakdown of the 10 revenue streams adding up to 553 CHF
 */

import { memo } from "react";
import { motion } from "framer-motion";
import { 
  TrendingUp, DollarSign, Minus, Equal, 
  HelpCircle, CheckCircle2, ArrowRight, Sparkles
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// All 10 revenue streams with their contribution
const revenueBreakdown = [
  { name: "Basis-Provision", amount: 225, color: "bg-blue-500", description: "15% Take-Rate vom Umzug (Ø 1'500 CHF)" },
  { name: "Affiliate (Telco/Energie)", amount: 100, color: "bg-green-500", description: "Internet, Strom, Gas Wechsel-Provisionen" },
  { name: "Versicherung", amount: 99, color: "bg-purple-500", description: "Micro-Insurance mit 60% Marge" },
  { name: "Circular Economy", amount: 50, color: "bg-amber-500", description: "Entrümpelung + Weiterverkauf" },
  { name: "Bürokratie-Autopilot", amount: 49, color: "bg-cyan-500", description: "Ummeldungs-Service (98% Marge)" },
  { name: "Escrow/Treuhand", amount: 30, color: "bg-indigo-500", description: "1.5% Fee + Float-Zinsen" },
];

// Costs breakdown
const costsBreakdown = [
  { name: "CAC (Kundenakquise)", amount: 35, description: "SEO + Google Ads anteilig" },
  { name: "Server/Infrastruktur", amount: 5, description: "Cloud Hosting pro Kunde" },
  { name: "Support (anteilig)", amount: 5, description: "5% brauchen menschliche Hilfe" },
  { name: "Zahlungsgebühren", amount: 5, description: "Stripe/Kreditkarte ~0.3%" },
];

export const UnitEconomicsDetailed = memo(() => {
  const totalRevenue = revenueBreakdown.reduce((sum, item) => sum + item.amount, 0);
  const totalCosts = costsBreakdown.reduce((sum, item) => sum + item.amount, 0);
  const profit = totalRevenue - totalCosts;
  const margin = Math.round((profit / totalRevenue) * 100);

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        {/* Header with clarification */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20">
            <TrendingUp className="w-3 h-3 mr-1" />
            Unit Economics pro Kunde
          </Badge>
          <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4">
            Wie sich 553 CHF pro Kunde zusammensetzen
          </h2>
          
          {/* Clarification Box */}
          <div className="max-w-2xl mx-auto bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mt-6">
            <div className="flex items-start gap-3">
              <HelpCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-left text-sm">
                <p className="font-bold text-blue-800 dark:text-blue-300 mb-1">
                  Warum "10 Einnahmequellen" und "6 Umsatzströme"?
                </p>
                <p className="text-blue-700 dark:text-blue-400">
                  <strong>10 Einnahmequellen</strong> = Alle möglichen Revenue Streams (inkl. B2B, Partner SaaS, etc.).<br/>
                  <strong>6 Umsatzströme</strong> = Was ein <em>typischer Privatkunde</em> nutzt und generiert.
                  <br/><br/>
                  Die 553 CHF sind der Durchschnitt bei Privatkunden. Mit B2B/Enterprise-Kunden steigt der Wert deutlich höher.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
        
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            
            {/* LEFT: Revenue Breakdown */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card className="p-6 h-full">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">Umsatz pro Kunde</h3>
                    <p className="text-xs text-muted-foreground">6 Umsatzströme bei Privatkunden</p>
                  </div>
                </div>
                
                {/* Stacked Bar Visualization */}
                <div className="mb-6">
                  <div className="h-8 rounded-full overflow-hidden flex">
                    {revenueBreakdown.map((item, idx) => (
                      <TooltipProvider key={idx}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div 
                              className={`${item.color} h-full transition-all hover:opacity-80 cursor-pointer`}
                              style={{ width: `${(item.amount / totalRevenue) * 100}%` }}
                            />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="font-bold">{item.name}</p>
                            <p className="text-xs">{item.amount} CHF ({Math.round((item.amount / totalRevenue) * 100)}%)</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ))}
                  </div>
                </div>
                
                {/* Line items */}
                <div className="space-y-3">
                  {revenueBreakdown.map((item, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.05 }}
                      className="flex items-center justify-between py-2 border-b border-border last:border-0"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${item.color}`} />
                        <div>
                          <p className="font-medium text-foreground text-sm">{item.name}</p>
                          <p className="text-xs text-muted-foreground">{item.description}</p>
                        </div>
                      </div>
                      <span className="font-bold text-green-600 dark:text-green-400">
                        +{item.amount} CHF
                      </span>
                    </motion.div>
                  ))}
                </div>
                
                {/* Total */}
                <div className="mt-4 pt-4 border-t-2 border-green-200 dark:border-green-800 flex items-center justify-between">
                  <span className="font-bold text-foreground">Total Umsatz</span>
                  <span className="text-2xl font-black text-green-600 dark:text-green-400">
                    {totalRevenue} CHF
                  </span>
                </div>
              </Card>
            </motion.div>
            
            {/* RIGHT: Costs + Profit */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              {/* Costs */}
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/50 flex items-center justify-center">
                    <Minus className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">Kosten pro Kunde</h3>
                    <p className="text-xs text-muted-foreground">Fast alles automatisiert</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {costsBreakdown.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between py-1.5">
                      <div>
                        <p className="text-sm font-medium text-foreground">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.description}</p>
                      </div>
                      <span className="font-medium text-red-600 dark:text-red-400">
                        -{item.amount} CHF
                      </span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-3 pt-3 border-t flex items-center justify-between">
                  <span className="font-bold text-foreground">Total Kosten</span>
                  <span className="text-xl font-bold text-red-600 dark:text-red-400">
                    -{totalCosts} CHF
                  </span>
                </div>
              </Card>
              
              {/* Profit Calculation */}
              <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/40 dark:to-emerald-950/40 border-2 border-green-200 dark:border-green-800">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center">
                    <Equal className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-green-800 dark:text-green-300">Gewinn pro Kunde</h3>
                    <p className="text-xs text-green-600 dark:text-green-400">Die Unit Economics</p>
                  </div>
                </div>
                
                {/* Calculation */}
                <div className="bg-white dark:bg-black/30 rounded-xl p-4 mb-4">
                  <div className="flex items-center justify-center gap-3 text-lg">
                    <span className="text-green-600 font-bold">{totalRevenue}</span>
                    <Minus className="w-4 h-4 text-muted-foreground" />
                    <span className="text-red-600 font-bold">{totalCosts}</span>
                    <Equal className="w-4 h-4 text-muted-foreground" />
                    <span className="text-2xl font-black text-green-700 dark:text-green-400">{profit} CHF</span>
                  </div>
                </div>
                
                {/* Margin Badge */}
                <div className="flex items-center justify-center gap-4">
                  <Badge className="bg-green-500 text-white text-lg py-1.5 px-4">
                    <Sparkles className="w-4 h-4 mr-1" />
                    {margin}% Marge
                  </Badge>
                </div>
                
                {/* Comparison */}
                <div className="mt-4 pt-4 border-t border-green-200 dark:border-green-700">
                  <p className="text-sm text-center text-green-700 dark:text-green-400">
                    <strong>Klassischer Vermittler:</strong> ~20 CHF Gewinn/Kunde<br/>
                    <strong>Wir:</strong> ~{profit} CHF = <span className="font-black">{Math.round(profit / 20)}× mehr</span>
                  </p>
                </div>
              </Card>
            </motion.div>
          </div>
          
          {/* Bottom: Why 90%+ Margin */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-8"
          >
            <Card className="p-6 bg-slate-900 text-white">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-2">Warum ist 90%+ Marge möglich?</h4>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    <strong className="text-white">Normale Firmen</strong> haben 10-30% Marge, weil sie viele Mitarbeiter brauchen.<br/><br/>
                    <strong className="text-white">Wir</strong> haben {'>'} 90% weil:
                  </p>
                  <ul className="mt-3 space-y-2 text-sm text-slate-300">
                    <li className="flex items-center gap-2">
                      <ArrowRight className="w-4 h-4 text-primary flex-shrink-0" />
                      <span><strong className="text-white">95% KI-Automatisierung</strong> – Fast keine manuellen Prozesse</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <ArrowRight className="w-4 h-4 text-primary flex-shrink-0" />
                      <span><strong className="text-white">10 Revenue Streams</strong> – Mehr verdienen pro Kunde als nur Provision</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <ArrowRight className="w-4 h-4 text-primary flex-shrink-0" />
                      <span><strong className="text-white">SEO-First</strong> – Niedrige Akquisekosten durch organischen Traffic</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <ArrowRight className="w-4 h-4 text-primary flex-shrink-0" />
                      <span><strong className="text-white">3-5 Mitarbeiter</strong> reichen für 10'000+ Kunden/Jahr</span>
                    </li>
                  </ul>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
});

UnitEconomicsDetailed.displayName = 'UnitEconomicsDetailed';
