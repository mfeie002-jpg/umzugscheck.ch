import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Leaf, Recycle, Truck, Package, TreePine, Lightbulb, TrendingDown, Award, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useLanguage } from '@/contexts/LanguageContext';

interface EcoMovingCalculatorProps {
  distance?: number;
  rooms?: number;
}

const EcoMovingCalculator = ({ distance = 30, rooms = 3 }: EcoMovingCalculatorProps) => {
  const { language } = useLanguage();
  const [useEcoBoxes, setUseEcoBoxes] = useState(true);
  const [useEcoTruck, setUseEcoTruck] = useState(false);
  const [donateItems, setDonateItems] = useState(false);
  const [offsetCarbon, setOffsetCarbon] = useState(false);

  const translations = {
    de: {
      title: 'Öko-Umzugsrechner',
      subtitle: 'Reduzieren Sie Ihren ökologischen Fussabdruck',
      carbonFootprint: 'CO₂-Fussabdruck',
      standardMove: 'Standard Umzug',
      ecoMove: 'Öko-Umzug',
      savings: 'Einsparung',
      ecoOptions: 'Öko-Optionen',
      ecoBoxes: 'Wiederverwendbare Boxen',
      ecoBoxesDesc: 'Statt Einweg-Kartons',
      ecoTruck: 'Elektro-Fahrzeug',
      ecoTruckDesc: 'Emissionsfreier Transport',
      donate: 'Spenden statt wegwerfen',
      donateDesc: 'Weniger Transportvolumen',
      offset: 'CO₂-Kompensation',
      offsetDesc: 'Baumpflanzung unterstützen',
      tips: 'Öko-Tipps für Ihren Umzug',
      tipsList: [
        'Entrümpeln Sie vor dem Umzug - weniger ist mehr',
        'Verwenden Sie Decken und Handtücher als Polsterung',
        'Packen Sie Kleidung in Koffern statt Kartons',
        'Wählen Sie einen Umzugstermin ausserhalb der Hauptzeiten',
        'Organisieren Sie eine "Moving Party" mit Freunden'
      ],
      ecoScore: 'Öko-Score',
      treesNeeded: 'Bäume zum Ausgleich',
      kg: 'kg CO₂',
      excellent: 'Ausgezeichnet',
      good: 'Gut',
      moderate: 'Moderat',
      needsWork: 'Verbesserungspotenzial'
    },
    en: {
      title: 'Eco Moving Calculator',
      subtitle: 'Reduce your ecological footprint',
      carbonFootprint: 'Carbon Footprint',
      standardMove: 'Standard Move',
      ecoMove: 'Eco Move',
      savings: 'Savings',
      ecoOptions: 'Eco Options',
      ecoBoxes: 'Reusable Boxes',
      ecoBoxesDesc: 'Instead of disposable cardboard',
      ecoTruck: 'Electric Vehicle',
      ecoTruckDesc: 'Zero-emission transport',
      donate: 'Donate instead of discard',
      donateDesc: 'Less transport volume',
      offset: 'Carbon Offset',
      offsetDesc: 'Support tree planting',
      tips: 'Eco Tips for Your Move',
      tipsList: [
        'Declutter before moving - less is more',
        'Use blankets and towels as padding',
        'Pack clothes in suitcases instead of boxes',
        'Choose a moving date outside peak times',
        'Organize a moving party with friends'
      ],
      ecoScore: 'Eco Score',
      treesNeeded: 'Trees to offset',
      kg: 'kg CO₂',
      excellent: 'Excellent',
      good: 'Good',
      moderate: 'Moderate',
      needsWork: 'Needs Improvement'
    },
    fr: {
      title: 'Calculateur Éco-Déménagement',
      subtitle: 'Réduisez votre empreinte écologique',
      carbonFootprint: 'Empreinte carbone',
      standardMove: 'Déménagement standard',
      ecoMove: 'Déménagement écolo',
      savings: 'Économies',
      ecoOptions: 'Options écolo',
      ecoBoxes: 'Boîtes réutilisables',
      ecoBoxesDesc: 'Au lieu de cartons jetables',
      ecoTruck: 'Véhicule électrique',
      ecoTruckDesc: 'Transport zéro émission',
      donate: 'Donner au lieu de jeter',
      donateDesc: 'Moins de volume à transporter',
      offset: 'Compensation carbone',
      offsetDesc: 'Soutenir la plantation d\'arbres',
      tips: 'Conseils écolo pour votre déménagement',
      tipsList: [
        'Désencombrez avant de déménager',
        'Utilisez couvertures et serviettes comme rembourrage',
        'Emballez les vêtements dans des valises',
        'Choisissez une date hors période de pointe',
        'Organisez une fête de déménagement'
      ],
      ecoScore: 'Score écolo',
      treesNeeded: 'Arbres pour compenser',
      kg: 'kg CO₂',
      excellent: 'Excellent',
      good: 'Bon',
      moderate: 'Modéré',
      needsWork: 'À améliorer'
    },
    it: {
      title: 'Calcolatore Eco-Trasloco',
      subtitle: 'Riduci la tua impronta ecologica',
      carbonFootprint: 'Impronta di carbonio',
      standardMove: 'Trasloco standard',
      ecoMove: 'Eco-trasloco',
      savings: 'Risparmio',
      ecoOptions: 'Opzioni ecologiche',
      ecoBoxes: 'Scatole riutilizzabili',
      ecoBoxesDesc: 'Invece di cartoni usa e getta',
      ecoTruck: 'Veicolo elettrico',
      ecoTruckDesc: 'Trasporto a zero emissioni',
      donate: 'Donare invece di buttare',
      donateDesc: 'Meno volume da trasportare',
      offset: 'Compensazione CO₂',
      offsetDesc: 'Sostenere la piantumazione',
      tips: 'Consigli ecologici per il tuo trasloco',
      tipsList: [
        'Decluttering prima del trasloco',
        'Usa coperte e asciugamani come imbottitura',
        'Metti i vestiti nelle valigie',
        'Scegli una data fuori dai periodi di punta',
        'Organizza una festa di trasloco'
      ],
      ecoScore: 'Punteggio ecologico',
      treesNeeded: 'Alberi per compensare',
      kg: 'kg CO₂',
      excellent: 'Eccellente',
      good: 'Buono',
      moderate: 'Moderato',
      needsWork: 'Da migliorare'
    }
  };

  const t = translations[language] || translations.de;

  const calculations = useMemo(() => {
    // Base CO2 calculation (kg per km for moving truck)
    const baseEmissionPerKm = 0.35; // kg CO2 per km
    const boxEmissions = rooms * 5; // kg CO2 for cardboard production
    const truckEmissions = distance * baseEmissionPerKm * 2; // Round trip
    
    const standardTotal = boxEmissions + truckEmissions + (rooms * 10); // Additional emissions
    
    let ecoReduction = 0;
    if (useEcoBoxes) ecoReduction += boxEmissions * 0.8;
    if (useEcoTruck) ecoReduction += truckEmissions * 0.9;
    if (donateItems) ecoReduction += standardTotal * 0.15;
    if (offsetCarbon) ecoReduction = standardTotal; // Full offset
    
    const ecoTotal = Math.max(0, standardTotal - ecoReduction);
    const savingsPercent = Math.round((ecoReduction / standardTotal) * 100);
    const treesNeeded = Math.ceil(standardTotal / 21); // ~21kg CO2 per tree per year
    
    // Eco score (0-100)
    let score = 50;
    if (useEcoBoxes) score += 15;
    if (useEcoTruck) score += 20;
    if (donateItems) score += 10;
    if (offsetCarbon) score += 5;
    
    return {
      standardTotal: Math.round(standardTotal),
      ecoTotal: Math.round(ecoTotal),
      savings: Math.round(standardTotal - ecoTotal),
      savingsPercent,
      treesNeeded,
      score: Math.min(100, score)
    };
  }, [distance, rooms, useEcoBoxes, useEcoTruck, donateItems, offsetCarbon]);

  const getScoreLabel = (score: number) => {
    if (score >= 90) return { label: t.excellent, color: 'text-green-600 dark:text-green-400' };
    if (score >= 70) return { label: t.good, color: 'text-blue-600 dark:text-blue-400' };
    if (score >= 50) return { label: t.moderate, color: 'text-yellow-600 dark:text-yellow-400' };
    return { label: t.needsWork, color: 'text-orange-600 dark:text-orange-400' };
  };

  const scoreInfo = getScoreLabel(calculations.score);

  return (
    <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Leaf className="h-5 w-5 text-green-500" />
          {t.title}
        </CardTitle>
        <p className="text-sm text-muted-foreground">{t.subtitle}</p>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Eco Score */}
        <motion.div
          className="rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 p-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-green-500" />
              <span className="font-semibold">{t.ecoScore}</span>
            </div>
            <span className={`font-bold text-xl ${scoreInfo.color}`}>
              {calculations.score}/100
            </span>
          </div>
          <Progress value={calculations.score} className="h-3" />
          <p className={`text-sm mt-2 ${scoreInfo.color}`}>{scoreInfo.label}</p>
        </motion.div>

        {/* CO2 Comparison */}
        <div className="grid grid-cols-2 gap-3">
          <motion.div
            className="rounded-lg bg-muted/50 p-3 text-center"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Truck className="h-5 w-5 mx-auto text-muted-foreground mb-1" />
            <p className="text-xs text-muted-foreground">{t.standardMove}</p>
            <p className="text-lg font-bold">{calculations.standardTotal}</p>
            <p className="text-xs text-muted-foreground">{t.kg}</p>
          </motion.div>
          <motion.div
            className="rounded-lg bg-green-500/10 p-3 text-center"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Leaf className="h-5 w-5 mx-auto text-green-500 mb-1" />
            <p className="text-xs text-muted-foreground">{t.ecoMove}</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">
              {calculations.ecoTotal}
            </p>
            <p className="text-xs text-muted-foreground">{t.kg}</p>
          </motion.div>
        </div>

        {calculations.savings > 0 && (
          <motion.div
            className="flex items-center justify-center gap-2 p-2 rounded-lg bg-green-500/10"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <TrendingDown className="h-4 w-4 text-green-500" />
            <span className="text-sm font-medium text-green-600 dark:text-green-400">
              {t.savings}: -{calculations.savings} {t.kg} ({calculations.savingsPercent}%)
            </span>
          </motion.div>
        )}

        {/* Eco Options */}
        <div className="space-y-3">
          <h4 className="font-semibold text-sm flex items-center gap-2">
            <Recycle className="h-4 w-4 text-primary" />
            {t.ecoOptions}
          </h4>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-muted-foreground" />
                <div>
                  <Label className="text-sm">{t.ecoBoxes}</Label>
                  <p className="text-xs text-muted-foreground">{t.ecoBoxesDesc}</p>
                </div>
              </div>
              <Switch checked={useEcoBoxes} onCheckedChange={setUseEcoBoxes} />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-muted-foreground" />
                <div>
                  <Label className="text-sm">{t.ecoTruck}</Label>
                  <p className="text-xs text-muted-foreground">{t.ecoTruckDesc}</p>
                </div>
              </div>
              <Switch checked={useEcoTruck} onCheckedChange={setUseEcoTruck} />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Recycle className="h-4 w-4 text-muted-foreground" />
                <div>
                  <Label className="text-sm">{t.donate}</Label>
                  <p className="text-xs text-muted-foreground">{t.donateDesc}</p>
                </div>
              </div>
              <Switch checked={donateItems} onCheckedChange={setDonateItems} />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TreePine className="h-4 w-4 text-muted-foreground" />
                <div>
                  <Label className="text-sm">{t.offset}</Label>
                  <p className="text-xs text-muted-foreground">{t.offsetDesc}</p>
                </div>
              </div>
              <Switch checked={offsetCarbon} onCheckedChange={setOffsetCarbon} />
            </div>
          </div>
        </div>

        {/* Trees needed */}
        <div className="flex items-center justify-center gap-2 p-3 rounded-lg bg-muted/30">
          <TreePine className="h-5 w-5 text-green-500" />
          <span className="text-sm">
            {t.treesNeeded}: <strong>{calculations.treesNeeded}</strong>
          </span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs max-w-[200px]">
                  Ein Baum absorbiert ca. 21 kg CO₂ pro Jahr
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Eco Tips */}
        <div className="space-y-2">
          <h4 className="font-semibold text-sm flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-yellow-500" />
            {t.tips}
          </h4>
          <ul className="space-y-1">
            {t.tipsList.map((tip, index) => (
              <motion.li
                key={index}
                className="text-xs text-muted-foreground flex items-start gap-2"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <span className="text-green-500 mt-0.5">•</span>
                {tip}
              </motion.li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default EcoMovingCalculator;
