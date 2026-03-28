import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Plus, Trash2, AlertTriangle, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";

interface ValuableItem {
  id: string;
  name: string;
  category: string;
  value: number;
}

const categories = [
  { id: "electronics", labelKey: "insurance.electronics", defaultValue: 1500 },
  { id: "furniture", labelKey: "insurance.furniture", defaultValue: 2000 },
  { id: "art", labelKey: "insurance.art", defaultValue: 5000 },
  { id: "jewelry", labelKey: "insurance.jewelry", defaultValue: 3000 },
  { id: "antiques", labelKey: "insurance.antiques", defaultValue: 4000 },
  { id: "instruments", labelKey: "insurance.instruments", defaultValue: 2500 },
  { id: "appliances", labelKey: "insurance.appliances", defaultValue: 800 },
  { id: "other", labelKey: "insurance.other", defaultValue: 500 },
];

const InsuranceEstimator = () => {
  const { t, language } = useLanguage();
  const [items, setItems] = useState<ValuableItem[]>([]);
  const [newItemName, setNewItemName] = useState("");
  const [newItemCategory, setNewItemCategory] = useState("electronics");
  const [newItemValue, setNewItemValue] = useState("");

  const categoryLabels: Record<string, Record<string, string>> = {
    de: {
      electronics: "Elektronik",
      furniture: "Möbel",
      art: "Kunst",
      jewelry: "Schmuck",
      antiques: "Antiquitäten",
      instruments: "Instrumente",
      appliances: "Haushaltsgeräte",
      other: "Sonstiges",
    },
    fr: {
      electronics: "Électronique",
      furniture: "Meubles",
      art: "Art",
      jewelry: "Bijoux",
      antiques: "Antiquités",
      instruments: "Instruments",
      appliances: "Électroménager",
      other: "Autre",
    },
    it: {
      electronics: "Elettronica",
      furniture: "Mobili",
      art: "Arte",
      jewelry: "Gioielli",
      antiques: "Antiquariato",
      instruments: "Strumenti",
      appliances: "Elettrodomestici",
      other: "Altro",
    },
    en: {
      electronics: "Electronics",
      furniture: "Furniture",
      art: "Art",
      jewelry: "Jewelry",
      antiques: "Antiques",
      instruments: "Instruments",
      appliances: "Appliances",
      other: "Other",
    },
  };

  const labels = categoryLabels[language] || categoryLabels.de;

  const totalValue = useMemo(() => {
    return items.reduce((sum, item) => sum + item.value, 0);
  }, [items]);

  const insuranceCost = useMemo(() => {
    // Approximately 1.5% of total value for moving insurance
    return Math.round(totalValue * 0.015);
  }, [totalValue]);

  const addItem = () => {
    if (!newItemName.trim() || !newItemValue) return;

    const newItem: ValuableItem = {
      id: `item-${Date.now()}`,
      name: newItemName.trim(),
      category: newItemCategory,
      value: parseFloat(newItemValue) || 0,
    };

    setItems(prev => [...prev, newItem]);
    setNewItemName("");
    setNewItemValue("");
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const getRecommendation = () => {
    if (totalValue === 0) return null;
    if (totalValue < 10000) return { level: "basic", color: "text-green-600" };
    if (totalValue < 50000) return { level: "standard", color: "text-yellow-600" };
    return { level: "premium", color: "text-red-600" };
  };

  const recommendation = getRecommendation();

  const insuranceLabels: Record<string, Record<string, string>> = {
    de: {
      title: "Versicherungsschätzung",
      addItem: "Wertgegenstand hinzufügen",
      itemName: "Bezeichnung",
      category: "Kategorie",
      value: "Wert (CHF)",
      add: "Hinzufügen",
      totalValue: "Gesamtwert",
      recommendedInsurance: "Empfohlene Versicherung",
      estimatedCost: "Geschätzte Prämie",
      basic: "Basis-Schutz",
      standard: "Standard-Schutz",
      premium: "Premium-Schutz",
      noItems: "Fügen Sie wertvolle Gegenstände hinzu für eine Versicherungsempfehlung",
      perMove: "pro Umzug",
    },
    fr: {
      title: "Estimation d'assurance",
      addItem: "Ajouter un objet de valeur",
      itemName: "Description",
      category: "Catégorie",
      value: "Valeur (CHF)",
      add: "Ajouter",
      totalValue: "Valeur totale",
      recommendedInsurance: "Assurance recommandée",
      estimatedCost: "Prime estimée",
      basic: "Protection de base",
      standard: "Protection standard",
      premium: "Protection premium",
      noItems: "Ajoutez des objets de valeur pour une recommandation d'assurance",
      perMove: "par déménagement",
    },
    it: {
      title: "Stima assicurazione",
      addItem: "Aggiungi oggetto di valore",
      itemName: "Descrizione",
      category: "Categoria",
      value: "Valore (CHF)",
      add: "Aggiungi",
      totalValue: "Valore totale",
      recommendedInsurance: "Assicurazione consigliata",
      estimatedCost: "Premio stimato",
      basic: "Protezione base",
      standard: "Protezione standard",
      premium: "Protezione premium",
      noItems: "Aggiungi oggetti di valore per una raccomandazione assicurativa",
      perMove: "per trasloco",
    },
    en: {
      title: "Insurance Estimate",
      addItem: "Add Valuable Item",
      itemName: "Description",
      category: "Category",
      value: "Value (CHF)",
      add: "Add",
      totalValue: "Total Value",
      recommendedInsurance: "Recommended Insurance",
      estimatedCost: "Estimated Premium",
      basic: "Basic Protection",
      standard: "Standard Protection",
      premium: "Premium Protection",
      noItems: "Add valuable items for an insurance recommendation",
      perMove: "per move",
    },
  };

  const l = insuranceLabels[language] || insuranceLabels.de;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Shield className="h-5 w-5 text-alpine" />
        <h3 className="font-semibold">{l.title}</h3>
      </div>

      {/* Add Item Form */}
      <div className="space-y-3 p-3 bg-muted/50 rounded-lg">
        <Label className="text-sm font-medium">{l.addItem}</Label>
        <div className="grid grid-cols-2 gap-2">
          <Input
            placeholder={l.itemName}
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            className="text-sm"
          />
          <Select value={newItemCategory} onValueChange={setNewItemCategory}>
            <SelectTrigger className="text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {labels[cat.id]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder={l.value}
            value={newItemValue}
            onChange={(e) => setNewItemValue(e.target.value)}
            className="text-sm flex-1"
          />
          <Button onClick={addItem} size="sm" className="bg-alpine hover:bg-alpine/90">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Items List */}
      <AnimatePresence>
        {items.length > 0 ? (
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {items.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center justify-between p-2 bg-background rounded-lg border text-sm"
              >
                <div className="flex-1">
                  <span className="font-medium">{item.name}</span>
                  <span className="text-muted-foreground ml-2">({labels[item.category]})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">CHF {item.value.toLocaleString("de-CH")}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-destructive"
                    onClick={() => removeItem(item.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">
            {l.noItems}
          </p>
        )}
      </AnimatePresence>

      {/* Summary */}
      {items.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-3 pt-3 border-t"
        >
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">{l.totalValue}</span>
            <span className="text-lg font-bold">CHF {totalValue.toLocaleString("de-CH")}</span>
          </div>

          {recommendation && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">{l.recommendedInsurance}</span>
              <span className={`font-semibold ${recommendation.color}`}>
                {l[recommendation.level as keyof typeof l]}
              </span>
            </div>
          )}

          <div className="flex justify-between items-center p-3 bg-alpine/10 rounded-lg">
            <span className="text-sm font-medium">{l.estimatedCost}</span>
            <div className="text-right">
              <span className="text-xl font-bold text-alpine">CHF {insuranceCost}</span>
              <span className="text-xs text-muted-foreground block">{l.perMove}</span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default InsuranceEstimator;
