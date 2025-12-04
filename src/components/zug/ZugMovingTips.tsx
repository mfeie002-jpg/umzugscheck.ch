/**
 * Zug Moving Tips Component
 * #36-42: Interactive tips carousel with local insights
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Lightbulb, Clock, FileText, Phone, Car, Key, 
  AlertTriangle, CheckSquare, ArrowRight, Calendar,
  Building2, Truck, Shield, MapPin
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const tipCategories = [
  {
    id: "planung",
    label: "Planung",
    icon: Calendar,
    tips: [
      {
        title: "4-8 Wochen vorher buchen",
        description: "Im Kanton Zug sind Umzugsfirmen oft früh ausgebucht. Besonders bei Monatsenden früh planen.",
        importance: "high",
        timeframe: "8 Wochen vorher",
      },
      {
        title: "Offerten vergleichen",
        description: "Hole mindestens 3 Offerten ein. Die Preise können um bis zu 40% variieren.",
        importance: "high",
        timeframe: "6 Wochen vorher",
      },
      {
        title: "Versicherung prüfen",
        description: "Kläre, welche Versicherung die Umzugsfirma hat und ob deine Hausrat die Umzugszeit abdeckt.",
        importance: "medium",
        timeframe: "4 Wochen vorher",
      },
    ],
  },
  {
    id: "bewilligungen",
    label: "Bewilligungen",
    icon: FileText,
    tips: [
      {
        title: "Parkbewilligung beantragen",
        description: "In der Zuger Altstadt und bei engen Strassen brauchst du oft eine Sonderbewilligung für den Umzugswagen.",
        importance: "high",
        timeframe: "2-3 Wochen vorher",
        localInfo: "Stadtverwaltung Zug: +41 41 728 21 11",
      },
      {
        title: "Halteverbot einrichten",
        description: "Bei vielbefahrenen Strassen kann ein temporäres Halteverbot sinnvoll sein.",
        importance: "medium",
        timeframe: "2 Wochen vorher",
      },
      {
        title: "Lift reservieren",
        description: "Bei Mehrfamilienhäusern den Lift für den Umzugstag reservieren (Verwaltung kontaktieren).",
        importance: "low",
        timeframe: "1 Woche vorher",
      },
    ],
  },
  {
    id: "umzugstag",
    label: "Umzugstag",
    icon: Truck,
    tips: [
      {
        title: "Früh starten",
        description: "Beginne früh morgens – so vermeidest du Verkehr und hast Zeit für Unvorhergesehenes.",
        importance: "high",
        timeframe: "Am Tag",
      },
      {
        title: "Zählerstände notieren",
        description: "Dokumentiere Wasser-, Strom- und Gaszählerstände bei Ein- und Auszug.",
        importance: "medium",
        timeframe: "Am Tag",
      },
      {
        title: "Schlüssel & Dokumente",
        description: "Halte alle wichtigen Schlüssel und Dokumente griffbereit – nicht in Umzugskartons!",
        importance: "high",
        timeframe: "Am Tag",
      },
    ],
  },
  {
    id: "admin",
    label: "Administratives",
    icon: Building2,
    tips: [
      {
        title: "Adressänderung melden",
        description: "Informiere Post, Banken, Versicherungen und Arbeitgeber über die neue Adresse.",
        importance: "high",
        timeframe: "2 Wochen vorher",
      },
      {
        title: "Anmeldung in Zug",
        description: "Innerhalb von 14 Tagen nach dem Umzug bei der neuen Gemeinde anmelden.",
        importance: "high",
        timeframe: "Nach dem Umzug",
        localInfo: "Online möglich: www.zug.ch/einwohner",
      },
      {
        title: "Abmeldung alte Gemeinde",
        description: "Bei Wegzug aus dem Kanton: Abmeldung nicht vergessen.",
        importance: "medium",
        timeframe: "Vor dem Umzug",
      },
    ],
  },
];

const localSpecificTips = [
  {
    location: "Altstadt Zug",
    icon: MapPin,
    tips: [
      "Enge Gassen: Möbellift oft nötig",
      "Parkbewilligung obligatorisch",
      "Früh morgens beste Zufahrt",
    ],
  },
  {
    location: "Baar",
    icon: Building2,
    tips: [
      "Gute Verkehrsanbindung (A4)",
      "Meist einfacher Zugang",
      "Viele Neubauten mit Lift",
    ],
  },
  {
    location: "Cham",
    icon: MapPin,
    tips: [
      "Seenähe: Zufahrt prüfen",
      "Gemeindeverwaltung hilft",
      "Viele Familienwohnungen",
    ],
  },
];

export const ZugMovingTips = () => {
  const [activeCategory, setActiveCategory] = useState("planung");

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case "high": return "bg-red-100 text-red-700 border-red-200";
      case "medium": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "low": return "bg-green-100 text-green-700 border-green-200";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-10 max-w-3xl mx-auto">
          <Badge className="mb-4" variant="outline">
            <Lightbulb className="w-3 h-3 mr-1" />
            Lokale Tipps
          </Badge>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
            Umzugstipps für den Kanton Zug
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground">
            Praktische Hinweise für einen reibungslosen Umzug – speziell für Zug, Baar und Cham
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeCategory} onValueChange={setActiveCategory} className="max-w-5xl mx-auto">
          <TabsList className="grid grid-cols-2 sm:grid-cols-4 mb-8">
            {tipCategories.map((category) => (
              <TabsTrigger 
                key={category.id} 
                value={category.id}
                className="flex items-center gap-2"
              >
                <category.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{category.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {tipCategories.map((category) => (
            <TabsContent key={category.id} value={category.id}>
              <div className="space-y-4">
                {category.tips.map((tip, index) => (
                  <motion.div
                    key={tip.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="p-5">
                        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                          <div className="flex-1">
                            <div className="flex items-start gap-3 mb-2">
                              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                <CheckSquare className="w-4 h-4 text-primary" />
                              </div>
                              <div>
                                <h3 className="font-bold text-foreground">{tip.title}</h3>
                                <p className="text-sm text-muted-foreground mt-1">{tip.description}</p>
                                {tip.localInfo && (
                                  <p className="text-sm text-primary mt-2 flex items-center gap-2">
                                    <Phone className="w-3 h-3" />
                                    {tip.localInfo}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 sm:flex-col sm:items-end">
                            <Badge variant="outline" className={getImportanceColor(tip.importance)}>
                              {tip.importance === "high" && "Wichtig"}
                              {tip.importance === "medium" && "Empfohlen"}
                              {tip.importance === "low" && "Optional"}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              <Clock className="w-3 h-3 mr-1" />
                              {tip.timeframe}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Local Specific Tips */}
        <div className="mt-12 max-w-5xl mx-auto">
          <h3 className="text-xl font-bold text-center mb-6">Spezielle Hinweise nach Ort</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            {localSpecificTips.map((location, index) => (
              <motion.div
                key={location.location}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full bg-gradient-to-br from-primary/5 to-transparent">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <location.icon className="w-5 h-5 text-primary" />
                      {location.location}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {location.tips.map((tip, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <CheckSquare className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Download Checklist CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-10 text-center"
        >
          <Card className="max-w-xl mx-auto bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-center gap-4 mb-4">
                <FileText className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-bold mb-2">Umzugs-Checkliste für Zug</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Lade unsere kostenlose Checkliste herunter – speziell für den Kanton Zug.
              </p>
              <Button variant="outline" className="group">
                Checkliste herunterladen (PDF)
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};
