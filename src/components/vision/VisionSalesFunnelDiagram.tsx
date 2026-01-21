/**
 * VisionSalesFunnelDiagram - Complete Sales Funnel Visualization
 * 
 * Shows the customer journey from discovery to revenue generation
 * with all touchpoints and monetization streams mapped out.
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, Search, Calculator, FileText, Users, CreditCard, 
  Phone, Star, ArrowRight, ArrowDown, DollarSign, 
  Shield, Package, Truck, Home, CheckCircle2, Sparkles,
  TrendingUp, Zap, Clock, Heart
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface VisionSalesFunnelDiagramProps {
  language?: 'de' | 'it' | 'bg';
}

// Customer persona definition
const CUSTOMER_PERSONA = {
  de: {
    title: "Der Umziehende",
    subtitle: "Schweizer Durchschnittskunde",
    traits: ["Gestresst", "Zeitmangel", "Unsicher bei Preisen", "Will Vergleichen"],
    painPoints: ["Keine Ahnung was fair kostet", "Angst vor versteckten Kosten", "Zu viele Anbieter"],
  },
  it: {
    title: "Il Traslocatore",
    subtitle: "Cliente medio svizzero",
    traits: ["Stressato", "Poco tempo", "Incerto sui prezzi", "Vuole confrontare"],
    painPoints: ["Non sa cosa costa", "Paura dei costi nascosti", "Troppi fornitori"],
  },
  bg: {
    title: "Преместващият се",
    subtitle: "Среден швейцарски клиент",
    traits: ["Стресиран", "Липса на време", "Несигурен за цени", "Иска да сравни"],
    painPoints: ["Не знае цени", "Страх от скрити разходи", "Твърде много доставчици"],
  }
};

// Entry channels
const ENTRY_CHANNELS = {
  de: [
    { icon: Search, label: "Google Suche", sublabel: "SEO + Ads", percentage: 45 },
    { icon: Users, label: "Empfehlung", sublabel: "Word of Mouth", percentage: 25 },
    { icon: FileText, label: "Content/Blog", sublabel: "Ratgeber", percentage: 20 },
    { icon: Star, label: "Direktzugriff", sublabel: "Brand", percentage: 10 },
  ],
  it: [
    { icon: Search, label: "Ricerca Google", sublabel: "SEO + Ads", percentage: 45 },
    { icon: Users, label: "Raccomandazione", sublabel: "Passaparola", percentage: 25 },
    { icon: FileText, label: "Contenuti/Blog", sublabel: "Guide", percentage: 20 },
    { icon: Star, label: "Accesso diretto", sublabel: "Brand", percentage: 10 },
  ],
  bg: [
    { icon: Search, label: "Google търсене", sublabel: "SEO + Ads", percentage: 45 },
    { icon: Users, label: "Препоръка", sublabel: "От уста на уста", percentage: 25 },
    { icon: FileText, label: "Съдържание/Блог", sublabel: "Съвети", percentage: 20 },
    { icon: Star, label: "Директен достъп", sublabel: "Марка", percentage: 10 },
  ]
};

// Funnel stages
const FUNNEL_STAGES = {
  de: [
    {
      id: "awareness",
      label: "Awareness",
      description: "Kunde sucht Infos",
      color: "bg-blue-500",
      conversion: "100%",
      touchpoints: ["Homepage", "Ratgeber", "Preisrechner-Teaser"],
    },
    {
      id: "interest",
      label: "Interest",
      description: "Nutzt Rechner/Tools",
      color: "bg-cyan-500",
      conversion: "65%",
      touchpoints: ["Umzugsrechner", "Kostencheck", "Firmenvergleich"],
    },
    {
      id: "decision",
      label: "Decision",
      description: "Offerten anfordern",
      color: "bg-emerald-500",
      conversion: "35%",
      touchpoints: ["Offerten-Formular", "Firmenauswahl", "Kontaktaufnahme"],
    },
    {
      id: "action",
      label: "Action",
      description: "Lead wird Kunde",
      color: "bg-amber-500",
      conversion: "12%",
      touchpoints: ["Buchung", "Escrow-Zahlung", "Terminbestätigung"],
    },
    {
      id: "loyalty",
      label: "Loyalty",
      description: "Zusatzservices",
      color: "bg-rose-500",
      conversion: "8%",
      touchpoints: ["Reinigung", "Versicherung", "Telko-Wechsel"],
    },
  ],
  it: [
    {
      id: "awareness",
      label: "Consapevolezza",
      description: "Cliente cerca info",
      color: "bg-blue-500",
      conversion: "100%",
      touchpoints: ["Homepage", "Guide", "Calcolatore"],
    },
    {
      id: "interest",
      label: "Interesse",
      description: "Usa strumenti",
      color: "bg-cyan-500",
      conversion: "65%",
      touchpoints: ["Calcolatore", "Confronto prezzi", "Confronto aziende"],
    },
    {
      id: "decision",
      label: "Decisione",
      description: "Richiede preventivi",
      color: "bg-emerald-500",
      conversion: "35%",
      touchpoints: ["Modulo preventivi", "Selezione azienda", "Contatto"],
    },
    {
      id: "action",
      label: "Azione",
      description: "Lead diventa cliente",
      color: "bg-amber-500",
      conversion: "12%",
      touchpoints: ["Prenotazione", "Pagamento Escrow", "Conferma"],
    },
    {
      id: "loyalty",
      label: "Fedeltà",
      description: "Servizi aggiuntivi",
      color: "bg-rose-500",
      conversion: "8%",
      touchpoints: ["Pulizia", "Assicurazione", "Cambio Telco"],
    },
  ],
  bg: [
    {
      id: "awareness",
      label: "Осведоменост",
      description: "Клиент търси инфо",
      color: "bg-blue-500",
      conversion: "100%",
      touchpoints: ["Начална страница", "Съвети", "Калкулатор"],
    },
    {
      id: "interest",
      label: "Интерес",
      description: "Използва инструменти",
      color: "bg-cyan-500",
      conversion: "65%",
      touchpoints: ["Калкулатор", "Проверка на цени", "Сравнение"],
    },
    {
      id: "decision",
      label: "Решение",
      description: "Иска оферти",
      color: "bg-emerald-500",
      conversion: "35%",
      touchpoints: ["Формуляр за оферти", "Избор на фирма", "Контакт"],
    },
    {
      id: "action",
      label: "Действие",
      description: "Лийд става клиент",
      color: "bg-amber-500",
      conversion: "12%",
      touchpoints: ["Резервация", "Escrow плащане", "Потвърждение"],
    },
    {
      id: "loyalty",
      label: "Лоялност",
      description: "Допълнителни услуги",
      color: "bg-rose-500",
      conversion: "8%",
      touchpoints: ["Почистване", "Застраховка", "Смяна на телеком"],
    },
  ]
};

// Revenue streams with amounts
const REVENUE_STREAMS = {
  de: [
    { id: "commission", label: "Umzugs-Kommission", amount: 225, stage: "action", icon: Truck },
    { id: "escrow", label: "Escrow-Gebühr", amount: 30, stage: "action", icon: Shield },
    { id: "insurance", label: "Micro-Insurance", amount: 99, stage: "decision", icon: Package },
    { id: "bureaucracy", label: "Bürokratie-Abo", amount: 49, stage: "loyalty", icon: FileText },
    { id: "telco", label: "Telco-Lead", amount: 100, stage: "loyalty", icon: Phone },
    { id: "circular", label: "Circular Economy", amount: 50, stage: "loyalty", icon: Heart },
  ],
  it: [
    { id: "commission", label: "Commissione Trasloco", amount: 225, stage: "action", icon: Truck },
    { id: "escrow", label: "Tassa Escrow", amount: 30, stage: "action", icon: Shield },
    { id: "insurance", label: "Micro-Assicurazione", amount: 99, stage: "decision", icon: Package },
    { id: "bureaucracy", label: "Abbonamento Burocrazia", amount: 49, stage: "loyalty", icon: FileText },
    { id: "telco", label: "Lead Telco", amount: 100, stage: "loyalty", icon: Phone },
    { id: "circular", label: "Economia Circolare", amount: 50, stage: "loyalty", icon: Heart },
  ],
  bg: [
    { id: "commission", label: "Комисионна преместване", amount: 225, stage: "action", icon: Truck },
    { id: "escrow", label: "Escrow такса", amount: 30, stage: "action", icon: Shield },
    { id: "insurance", label: "Микро-застраховка", amount: 99, stage: "decision", icon: Package },
    { id: "bureaucracy", label: "Абонамент бюрокрация", amount: 49, stage: "loyalty", icon: FileText },
    { id: "telco", label: "Телко лийд", amount: 100, stage: "loyalty", icon: Phone },
    { id: "circular", label: "Кръгова икономика", amount: 50, stage: "loyalty", icon: Heart },
  ]
};

const TRANSLATIONS = {
  de: {
    title: "Sales Funnel & Revenue Map",
    subtitle: "Wie aus Besuchern zahlende Kunden werden",
    customerJourney: "Customer Journey",
    entryChannels: "Traffic-Quellen",
    revenueStreams: "Einnahmequellen",
    totalRevenue: "Gesamt pro Kunde",
    conversionRate: "Conversion Rate",
    touchpoints: "Touchpoints",
    persona: "Unsere Zielgruppe",
  },
  it: {
    title: "Sales Funnel & Mappa Ricavi",
    subtitle: "Come i visitatori diventano clienti paganti",
    customerJourney: "Percorso Cliente",
    entryChannels: "Fonti di Traffico",
    revenueStreams: "Fonti di Ricavo",
    totalRevenue: "Totale per cliente",
    conversionRate: "Tasso di Conversione",
    touchpoints: "Punti di Contatto",
    persona: "Il nostro target",
  },
  bg: {
    title: "Sales Funnel & Карта на приходите",
    subtitle: "Как посетителите стават плащащи клиенти",
    customerJourney: "Пътуване на клиента",
    entryChannels: "Източници на трафик",
    revenueStreams: "Източници на приходи",
    totalRevenue: "Общо на клиент",
    conversionRate: "Процент на конверсия",
    touchpoints: "Точки на контакт",
    persona: "Нашата целева група",
  }
};

export const VisionSalesFunnelDiagram = ({ language = 'de' }: VisionSalesFunnelDiagramProps) => {
  const [activeStage, setActiveStage] = useState<string | null>(null);
  const t = TRANSLATIONS[language];
  const persona = CUSTOMER_PERSONA[language];
  const channels = ENTRY_CHANNELS[language];
  const stages = FUNNEL_STAGES[language];
  const revenues = REVENUE_STREAMS[language];

  const totalRevenue = revenues.reduce((sum, r) => sum + r.amount, 0);

  return (
    <section className="py-12 md:py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 px-4 py-1">
            <TrendingUp className="w-4 h-4 mr-2" />
            {t.customerJourney}
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t.title}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t.subtitle}</p>
        </div>

        {/* Customer Persona Card */}
        <Card className="mb-12 max-w-3xl mx-auto bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-start gap-6">
              <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                <User className="w-10 h-10 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-1">{persona.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">{persona.subtitle}</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {persona.traits.map((trait, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      {trait}
                    </Badge>
                  ))}
                </div>
                <div className="text-sm text-muted-foreground">
                  <strong>Pain Points:</strong> {persona.painPoints.join(" • ")}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Entry Channels */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-center mb-6">{t.entryChannels}</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {channels.map((channel, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="text-center p-4 hover:shadow-lg transition-shadow">
                  <channel.icon className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <div className="font-medium text-sm">{channel.label}</div>
                  <div className="text-xs text-muted-foreground">{channel.sublabel}</div>
                  <div className="mt-2 text-lg font-bold text-primary">{channel.percentage}%</div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Arrow Down */}
        <div className="flex justify-center my-6">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ArrowDown className="w-8 h-8 text-primary" />
          </motion.div>
        </div>

        {/* Funnel Visualization */}
        <div className="max-w-5xl mx-auto mb-12">
          <div className="relative">
            {stages.map((stage, index) => {
              const width = 100 - (index * 15);
              const isActive = activeStage === stage.id;
              const stageRevenues = revenues.filter(r => r.stage === stage.id);
              
              return (
                <motion.div
                  key={stage.id}
                  initial={{ opacity: 0, scaleX: 0.8 }}
                  whileInView={{ opacity: 1, scaleX: 1 }}
                  transition={{ delay: index * 0.15 }}
                  viewport={{ once: true }}
                  className="relative mb-2"
                  style={{ width: `${width}%`, margin: '0 auto' }}
                  onMouseEnter={() => setActiveStage(stage.id)}
                  onMouseLeave={() => setActiveStage(null)}
                >
                  <div 
                    className={cn(
                      "rounded-lg p-4 md:p-6 transition-all duration-300 cursor-pointer",
                      stage.color,
                      isActive ? "scale-[1.02] shadow-xl" : "hover:scale-[1.01]"
                    )}
                  >
                    <div className="flex items-center justify-between text-white">
                      <div>
                        <div className="font-bold text-lg md:text-xl">{stage.label}</div>
                        <div className="text-sm opacity-90">{stage.description}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl md:text-3xl font-bold">{stage.conversion}</div>
                        <div className="text-xs opacity-75">{t.conversionRate}</div>
                      </div>
                    </div>
                    
                    {/* Expanded content on hover */}
                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-4 pt-4 border-t border-white/20"
                        >
                          <div className="text-white/90 text-sm mb-2">{t.touchpoints}:</div>
                          <div className="flex flex-wrap gap-2">
                            {stage.touchpoints.map((tp, i) => (
                              <Badge key={i} variant="secondary" className="bg-white/20 text-white border-0">
                                {tp}
                              </Badge>
                            ))}
                          </div>
                          
                          {stageRevenues.length > 0 && (
                            <div className="mt-4">
                              <div className="text-white/90 text-sm mb-2">{t.revenueStreams}:</div>
                              <div className="flex flex-wrap gap-2">
                                {stageRevenues.map((rev, i) => (
                                  <Badge key={i} className="bg-card text-foreground border">
                                    <rev.icon className="w-3 h-3 mr-1" />
                                    {rev.label}: CHF {rev.amount}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Revenue Summary */}
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gradient-to-r from-primary/10 to-primary/20 border-primary/30">
            <CardContent className="p-6 md:p-8">
              <div className="text-center mb-6">
                <DollarSign className="w-12 h-12 mx-auto text-primary mb-2" />
                <h3 className="text-2xl font-bold">{t.revenueStreams}</h3>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                {revenues.map((rev, i) => (
                  <motion.div
                    key={rev.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-card rounded-lg p-4 shadow-sm border"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <rev.icon className="w-5 h-5 text-primary" />
                      <span className="text-sm font-medium">{rev.label}</span>
                    </div>
                    <div className="text-2xl font-bold text-primary">
                      CHF {rev.amount}
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <div className="text-center p-6 bg-primary rounded-xl text-primary-foreground">
                <div className="text-sm opacity-90 mb-1">{t.totalRevenue}</div>
                <div className="text-4xl md:text-5xl font-bold">
                  CHF {totalRevenue}
                </div>
                <div className="mt-2 flex items-center justify-center gap-2 text-sm">
                  <Sparkles className="w-4 h-4" />
                  <span>Revenue Stacking Effect</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Flywheel Effect */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary">
            <Zap className="w-5 h-5" />
            <span className="font-medium">
              {language === 'de' ? "Je mehr Kunden → Bessere Daten → Bessere Matches → Mehr Kunden" :
               language === 'it' ? "Più clienti → Dati migliori → Match migliori → Più clienti" :
               "Повече клиенти → По-добри данни → По-добри съвпадения → Повече клиенти"}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VisionSalesFunnelDiagram;
