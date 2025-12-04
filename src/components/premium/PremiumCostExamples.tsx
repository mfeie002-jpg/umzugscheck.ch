import { ArrowRight, TrendingDown, Calculator, Package, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";

// Realistic floor plan with furniture for Studio (~25-30m²)
const FloorPlanStudio = () => (
  <svg viewBox="0 0 100 75" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="1">
    {/* Walls */}
    <rect x="5" y="5" width="90" height="65" rx="1" strokeWidth="2" className="fill-primary/5" />
    
    {/* Wohn/Schlafbereich */}
    {/* Bett */}
    <rect x="10" y="10" width="22" height="28" rx="1" className="fill-primary/20" />
    <rect x="12" y="12" width="18" height="6" rx="0.5" className="fill-primary/30" /> {/* Kissen */}
    
    {/* Sofa */}
    <rect x="38" y="12" width="24" height="10" rx="1" className="fill-primary/20" />
    <rect x="38" y="22" width="6" height="3" rx="0.5" className="fill-primary/30" /> {/* Armlehne */}
    <rect x="56" y="22" width="6" height="3" rx="0.5" className="fill-primary/30" />
    
    {/* TV */}
    <rect x="40" y="8" width="20" height="2" className="fill-primary/40" />
    
    {/* Tisch */}
    <circle cx="50" cy="32" r="6" className="fill-primary/15" />
    
    {/* Küche */}
    <rect x="70" y="10" width="20" height="8" rx="0.5" className="fill-primary/25" /> {/* Arbeitsplatte */}
    <rect x="70" y="20" width="8" height="8" rx="0.5" className="fill-primary/20" /> {/* Herd */}
    <rect x="80" y="20" width="10" height="10" rx="0.5" className="fill-primary/20" /> {/* Kühlschrank */}
    
    {/* Bad */}
    <rect x="70" y="45" width="20" height="20" rx="1" strokeWidth="1.5" />
    <ellipse cx="80" cy="52" rx="4" ry="3" className="fill-primary/20" /> {/* WC */}
    <rect x="84" y="56" width="4" height="7" rx="0.5" className="fill-primary/20" /> {/* Dusche */}
    
    {/* Kleiderschrank */}
    <rect x="10" y="42" width="15" height="8" rx="0.5" className="fill-primary/25" />
    
    {/* Schreibtisch */}
    <rect x="10" y="55" width="18" height="8" rx="0.5" className="fill-primary/15" />
    <rect x="12" y="63" width="4" height="4" rx="0.5" className="fill-primary/20" /> {/* Stuhl */}
  </svg>
);

// 1.5-Zimmer (~35-40m²)
const FloorPlan1_5 = () => (
  <svg viewBox="0 0 110 80" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="1">
    <rect x="5" y="5" width="100" height="70" rx="1" strokeWidth="2" className="fill-primary/5" />
    
    {/* Schlafnische */}
    <line x1="65" y1="5" x2="65" y2="45" strokeWidth="1.5" />
    {/* Bett */}
    <rect x="70" y="10" width="28" height="30" rx="1" className="fill-primary/20" />
    <rect x="72" y="12" width="24" height="8" rx="0.5" className="fill-primary/30" />
    {/* Nachttisch */}
    <rect x="70" y="42" width="8" height="8" rx="0.5" className="fill-primary/15" />
    
    {/* Wohnzimmer */}
    {/* Sofa */}
    <rect x="10" y="10" width="28" height="12" rx="1" className="fill-primary/20" />
    <rect x="10" y="22" width="6" height="4" rx="0.5" className="fill-primary/30" />
    <rect x="32" y="22" width="6" height="4" rx="0.5" className="fill-primary/30" />
    
    {/* TV-Möbel */}
    <rect x="10" y="30" width="20" height="3" className="fill-primary/25" />
    <rect x="12" y="28" width="16" height="2" className="fill-primary/40" /> {/* TV */}
    
    {/* Couchtisch */}
    <rect x="18" y="38" width="14" height="8" rx="0.5" className="fill-primary/15" />
    
    {/* Küche */}
    <rect x="10" y="52" width="30" height="18" rx="1" strokeWidth="1.5" />
    <rect x="12" y="54" width="26" height="6" rx="0.5" className="fill-primary/25" /> {/* Arbeitsplatte */}
    <rect x="12" y="62" width="8" height="6" rx="0.5" className="fill-primary/20" /> {/* Herd */}
    <rect x="32" y="62" width="6" height="6" rx="0.5" className="fill-primary/20" /> {/* Kühlschrank */}
    {/* Esstisch */}
    <rect x="22" y="62" width="8" height="6" rx="0.5" className="fill-primary/15" />
    
    {/* Bad */}
    <rect x="70" y="52" width="28" height="18" rx="1" strokeWidth="1.5" />
    <ellipse cx="78" cy="60" rx="5" ry="4" className="fill-primary/20" /> {/* WC */}
    <rect x="88" y="54" width="8" height="14" rx="0.5" className="fill-primary/20" /> {/* Dusche */}
    <rect x="70" y="54" width="5" height="3" className="fill-primary/15" /> {/* Waschbecken */}
  </svg>
);

// 2.5-Zimmer (~50-60m²)
const FloorPlan2_5 = () => (
  <svg viewBox="0 0 130 95" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="1">
    <rect x="5" y="5" width="120" height="85" rx="1" strokeWidth="2" className="fill-primary/5" />
    
    {/* Schlafzimmer */}
    <rect x="75" y="5" width="50" height="45" rx="1" strokeWidth="1.5" />
    {/* Doppelbett */}
    <rect x="80" y="12" width="38" height="28" rx="1" className="fill-primary/20" />
    <rect x="82" y="14" width="34" height="10" rx="0.5" className="fill-primary/30" />
    {/* Kleiderschrank */}
    <rect x="80" y="42" width="20" height="6" rx="0.5" className="fill-primary/25" />
    {/* Nachttische */}
    <rect x="102" y="42" width="6" height="6" rx="0.5" className="fill-primary/15" />
    <rect x="112" y="42" width="6" height="6" rx="0.5" className="fill-primary/15" />
    
    {/* Wohnzimmer */}
    {/* Ecksofa */}
    <rect x="10" y="10" width="35" height="14" rx="1" className="fill-primary/20" />
    <rect x="10" y="24" width="12" height="20" rx="1" className="fill-primary/20" />
    
    {/* TV-Wand */}
    <rect x="50" y="10" width="3" height="30" className="fill-primary/25" />
    <rect x="53" y="18" width="2" height="14" className="fill-primary/40" /> {/* TV */}
    
    {/* Couchtisch */}
    <rect x="26" y="28" width="16" height="10" rx="0.5" className="fill-primary/15" />
    
    {/* Esstisch mit Stühlen */}
    <rect x="28" y="50" width="22" height="12" rx="0.5" className="fill-primary/20" />
    <circle cx="32" cy="48" r="2" className="fill-primary/25" />
    <circle cx="46" cy="48" r="2" className="fill-primary/25" />
    <circle cx="32" cy="64" r="2" className="fill-primary/25" />
    <circle cx="46" cy="64" r="2" className="fill-primary/25" />
    
    {/* Küche */}
    <rect x="10" y="68" width="40" height="20" rx="1" strokeWidth="1.5" />
    <rect x="12" y="70" width="36" height="6" rx="0.5" className="fill-primary/25" />
    <rect x="12" y="78" width="10" height="8" rx="0.5" className="fill-primary/20" /> {/* Herd */}
    <rect x="38" y="78" width="8" height="8" rx="0.5" className="fill-primary/20" /> {/* Kühlschrank */}
    
    {/* Bad */}
    <rect x="75" y="55" width="25" height="33" rx="1" strokeWidth="1.5" />
    <ellipse cx="82" cy="65" rx="5" ry="4" className="fill-primary/20" />
    <rect x="90" y="58" width="8" height="12" rx="0.5" className="fill-primary/20" />
    <rect x="75" y="78" width="12" height="8" rx="0.5" className="fill-primary/15" /> {/* Badewanne */}
    
    {/* Flur/Garderobe */}
    <rect x="102" y="55" width="20" height="33" rx="1" strokeWidth="1" />
    <rect x="104" y="58" width="16" height="6" rx="0.5" className="fill-primary/15" /> {/* Garderobe */}
  </svg>
);

// 3.5-Zimmer (~70-80m²)
const FloorPlan3_5 = () => (
  <svg viewBox="0 0 150 110" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="1">
    <rect x="5" y="5" width="140" height="100" rx="1" strokeWidth="2" className="fill-primary/5" />
    
    {/* Schlafzimmer 1 (Master) */}
    <rect x="90" y="5" width="55" height="50" rx="1" strokeWidth="1.5" />
    <rect x="95" y="12" width="42" height="30" rx="1" className="fill-primary/20" />
    <rect x="97" y="14" width="38" height="10" rx="0.5" className="fill-primary/30" />
    <rect x="95" y="44" width="25" height="6" rx="0.5" className="fill-primary/25" />
    
    {/* Schlafzimmer 2 / Kinderzimmer */}
    <rect x="90" y="58" width="55" height="45" rx="1" strokeWidth="1.5" />
    <rect x="95" y="64" width="24" height="18" rx="1" className="fill-primary/20" /> {/* Einzelbett */}
    <rect x="97" y="66" width="20" height="6" rx="0.5" className="fill-primary/30" />
    <rect x="125" y="64" width="15" height="12" rx="0.5" className="fill-primary/15" /> {/* Schreibtisch */}
    <rect x="125" y="82" width="15" height="6" rx="0.5" className="fill-primary/25" /> {/* Regal */}
    
    {/* Wohnzimmer */}
    <rect x="10" y="10" width="40" height="16" rx="1" className="fill-primary/20" /> {/* Sofa */}
    <rect x="10" y="26" width="10" height="22" rx="1" className="fill-primary/20" /> {/* Sessel */}
    <rect x="55" y="10" width="3" height="35" className="fill-primary/25" />
    <rect x="58" y="20" width="2" height="16" className="fill-primary/40" />
    <rect x="28" y="32" width="18" height="12" rx="0.5" className="fill-primary/15" /> {/* Couchtisch */}
    
    {/* Essbereich */}
    <rect x="10" y="52" width="30" height="18" rx="0.5" className="fill-primary/20" />
    <circle cx="18" cy="50" r="2.5" className="fill-primary/25" />
    <circle cx="32" cy="50" r="2.5" className="fill-primary/25" />
    <circle cx="18" cy="72" r="2.5" className="fill-primary/25" />
    <circle cx="32" cy="72" r="2.5" className="fill-primary/25" />
    <circle cx="8" cy="61" r="2.5" className="fill-primary/25" />
    <circle cx="42" cy="61" r="2.5" className="fill-primary/25" />
    
    {/* Küche */}
    <rect x="10" y="76" width="45" height="27" rx="1" strokeWidth="1.5" />
    <rect x="12" y="78" width="41" height="8" rx="0.5" className="fill-primary/25" />
    <rect x="12" y="88" width="12" height="12" rx="0.5" className="fill-primary/20" />
    <rect x="42" y="88" width="10" height="12" rx="0.5" className="fill-primary/20" />
    
    {/* Bad */}
    <rect x="58" y="52" width="28" height="26" rx="1" strokeWidth="1.5" />
    <ellipse cx="66" cy="62" rx="5" ry="4" className="fill-primary/20" />
    <rect x="76" y="54" width="8" height="12" rx="0.5" className="fill-primary/20" />
    <rect x="58" y="70" width="14" height="6" rx="0.5" className="fill-primary/15" />
    
    {/* WC separat */}
    <rect x="58" y="82" width="15" height="18" rx="1" strokeWidth="1.5" />
    <ellipse cx="66" cy="92" rx="4" ry="3" className="fill-primary/20" />
    
    {/* Flur */}
    <rect x="75" y="82" width="13" height="18" rx="1" strokeWidth="1" />
  </svg>
);

// 4.5-Zimmer (~90-100m²)
const FloorPlan4_5 = () => (
  <svg viewBox="0 0 160 120" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="1">
    <rect x="5" y="5" width="150" height="110" rx="1" strokeWidth="2" className="fill-primary/5" />
    
    {/* Master Bedroom */}
    <rect x="100" y="5" width="55" height="45" rx="1" strokeWidth="1.5" />
    <rect x="105" y="12" width="42" height="28" rx="1" className="fill-primary/20" />
    <rect x="107" y="14" width="38" height="9" rx="0.5" className="fill-primary/30" />
    <rect x="105" y="42" width="22" height="5" rx="0.5" className="fill-primary/25" />
    <rect x="130" y="42" width="6" height="5" rx="0.5" className="fill-primary/15" />
    <rect x="140" y="42" width="6" height="5" rx="0.5" className="fill-primary/15" />
    
    {/* Schlafzimmer 2 */}
    <rect x="100" y="52" width="30" height="32" rx="1" strokeWidth="1.5" />
    <rect x="104" y="56" width="22" height="18" rx="1" className="fill-primary/20" />
    <rect x="106" y="58" width="18" height="6" rx="0.5" className="fill-primary/30" />
    <rect x="104" y="76" width="12" height="5" rx="0.5" className="fill-primary/25" />
    
    {/* Schlafzimmer 3 / Büro */}
    <rect x="132" y="52" width="23" height="32" rx="1" strokeWidth="1.5" />
    <rect x="136" y="56" width="15" height="10" rx="0.5" className="fill-primary/15" /> {/* Schreibtisch */}
    <rect x="136" y="70" width="15" height="10" rx="1" className="fill-primary/20" /> {/* Schlafsofa */}
    
    {/* Wohnzimmer gross */}
    <rect x="10" y="10" width="45" height="18" rx="1" className="fill-primary/20" />
    <rect x="10" y="28" width="12" height="24" rx="1" className="fill-primary/20" />
    <rect x="60" y="10" width="3" height="40" className="fill-primary/25" />
    <rect x="63" y="22" width="2" height="18" className="fill-primary/40" />
    <rect x="28" y="34" width="20" height="14" rx="0.5" className="fill-primary/15" />
    
    {/* Esszimmer */}
    <rect x="10" y="56" width="35" height="20" rx="0.5" className="fill-primary/20" />
    <circle cx="18" cy="54" r="2.5" className="fill-primary/25" />
    <circle cx="38" cy="54" r="2.5" className="fill-primary/25" />
    <circle cx="18" cy="78" r="2.5" className="fill-primary/25" />
    <circle cx="38" cy="78" r="2.5" className="fill-primary/25" />
    <circle cx="8" cy="66" r="2.5" className="fill-primary/25" />
    <circle cx="47" cy="66" r="2.5" className="fill-primary/25" />
    
    {/* Küche */}
    <rect x="10" y="82" width="50" height="28" rx="1" strokeWidth="1.5" />
    <rect x="12" y="84" width="46" height="8" rx="0.5" className="fill-primary/25" />
    <rect x="12" y="94" width="14" height="14" rx="0.5" className="fill-primary/20" />
    <rect x="44" y="94" width="12" height="14" rx="0.5" className="fill-primary/20" />
    
    {/* Hauptbad */}
    <rect x="65" y="56" width="30" height="28" rx="1" strokeWidth="1.5" />
    <ellipse cx="74" cy="66" rx="5" ry="4" className="fill-primary/20" />
    <rect x="84" y="58" width="9" height="14" rx="0.5" className="fill-primary/20" />
    <rect x="65" y="76" width="16" height="6" rx="0.5" className="fill-primary/15" />
    
    {/* Gäste-WC */}
    <rect x="65" y="88" width="18" height="20" rx="1" strokeWidth="1.5" />
    <ellipse cx="74" cy="98" rx="4" ry="3" className="fill-primary/20" />
    
    {/* Flur/Eingang */}
    <rect x="85" y="88" width="13" height="20" rx="1" strokeWidth="1" />
    <rect x="87" y="90" width="9" height="4" rx="0.5" className="fill-primary/15" />
  </svg>
);

// 5.5-Zimmer (~110-130m²)
const FloorPlan5_5 = () => (
  <svg viewBox="0 0 180 130" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="1">
    <rect x="5" y="5" width="170" height="120" rx="1" strokeWidth="2" className="fill-primary/5" />
    
    {/* Master Suite */}
    <rect x="115" y="5" width="60" height="50" rx="1" strokeWidth="1.5" />
    <rect x="120" y="12" width="48" height="32" rx="1" className="fill-primary/20" />
    <rect x="122" y="14" width="44" height="10" rx="0.5" className="fill-primary/30" />
    <rect x="120" y="46" width="28" height="6" rx="0.5" className="fill-primary/25" />
    <rect x="152" y="46" width="7" height="6" rx="0.5" className="fill-primary/15" />
    <rect x="162" y="46" width="7" height="6" rx="0.5" className="fill-primary/15" />
    
    {/* Schlafzimmer 2 */}
    <rect x="115" y="58" width="35" height="32" rx="1" strokeWidth="1.5" />
    <rect x="119" y="62" width="26" height="20" rx="1" className="fill-primary/20" />
    <rect x="121" y="64" width="22" height="7" rx="0.5" className="fill-primary/30" />
    <rect x="119" y="84" width="14" height="5" rx="0.5" className="fill-primary/25" />
    
    {/* Schlafzimmer 3 */}
    <rect x="152" y="58" width="23" height="32" rx="1" strokeWidth="1.5" />
    <rect x="155" y="62" width="17" height="14" rx="1" className="fill-primary/20" />
    <rect x="156" y="64" width="15" height="5" rx="0.5" className="fill-primary/30" />
    <rect x="155" y="78" width="10" height="5" rx="0.5" className="fill-primary/25" />
    
    {/* Schlafzimmer 4 / Büro */}
    <rect x="115" y="92" width="60" height="30" rx="1" strokeWidth="1.5" />
    <rect x="120" y="96" width="20" height="12" rx="0.5" className="fill-primary/15" />
    <rect x="145" y="96" width="24" height="16" rx="1" className="fill-primary/20" />
    
    {/* Grosses Wohnzimmer */}
    <rect x="10" y="10" width="55" height="20" rx="1" className="fill-primary/20" />
    <rect x="10" y="30" width="14" height="28" rx="1" className="fill-primary/20" />
    <rect x="70" y="10" width="3" height="50" className="fill-primary/25" />
    <rect x="73" y="24" width="2" height="22" className="fill-primary/40" />
    <rect x="32" y="38" width="24" height="16" rx="0.5" className="fill-primary/15" />
    
    {/* Esszimmer */}
    <rect x="10" y="64" width="40" height="24" rx="0.5" className="fill-primary/20" />
    <circle cx="18" cy="62" r="3" className="fill-primary/25" />
    <circle cx="42" cy="62" r="3" className="fill-primary/25" />
    <circle cx="18" cy="90" r="3" className="fill-primary/25" />
    <circle cx="42" cy="90" r="3" className="fill-primary/25" />
    <circle cx="7" cy="76" r="3" className="fill-primary/25" />
    <circle cx="53" cy="76" r="3" className="fill-primary/25" />
    <circle cx="30" cy="62" r="3" className="fill-primary/25" />
    <circle cx="30" cy="90" r="3" className="fill-primary/25" />
    
    {/* Küche */}
    <rect x="10" y="92" width="55" height="30" rx="1" strokeWidth="1.5" />
    <rect x="12" y="94" width="51" height="10" rx="0.5" className="fill-primary/25" />
    <rect x="12" y="106" width="16" height="14" rx="0.5" className="fill-primary/20" />
    <rect x="48" y="106" width="14" height="14" rx="0.5" className="fill-primary/20" />
    
    {/* Hauptbad */}
    <rect x="70" y="64" width="35" height="28" rx="1" strokeWidth="1.5" />
    <ellipse cx="80" cy="74" rx="6" ry="5" className="fill-primary/20" />
    <rect x="92" y="66" width="10" height="16" rx="0.5" className="fill-primary/20" />
    <rect x="70" y="84" width="18" height="6" rx="0.5" className="fill-primary/15" />
    
    {/* Gäste-WC */}
    <rect x="70" y="96" width="20" height="24" rx="1" strokeWidth="1.5" />
    <ellipse cx="80" cy="108" rx="5" ry="4" className="fill-primary/20" />
    
    {/* Flur */}
    <rect x="92" y="96" width="20" height="24" rx="1" strokeWidth="1" />
    <rect x="94" y="98" width="16" height="6" rx="0.5" className="fill-primary/15" />
  </svg>
);

// KMU-Büro (~150-250m²)
const FloorPlanOffice = () => (
  <svg viewBox="0 0 180 130" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="1">
    <rect x="5" y="5" width="170" height="120" rx="1" strokeWidth="2" className="fill-primary/5" />
    
    {/* Grossraumbüro */}
    <rect x="10" y="10" width="100" height="65" rx="1" strokeWidth="1.5" />
    {/* Schreibtische mit Stühlen */}
    <rect x="15" y="15" width="18" height="10" rx="0.5" className="fill-primary/20" />
    <circle cx="24" cy="28" r="2.5" className="fill-primary/25" />
    <rect x="38" y="15" width="18" height="10" rx="0.5" className="fill-primary/20" />
    <circle cx="47" cy="28" r="2.5" className="fill-primary/25" />
    <rect x="61" y="15" width="18" height="10" rx="0.5" className="fill-primary/20" />
    <circle cx="70" cy="28" r="2.5" className="fill-primary/25" />
    <rect x="84" y="15" width="18" height="10" rx="0.5" className="fill-primary/20" />
    <circle cx="93" cy="28" r="2.5" className="fill-primary/25" />
    
    <rect x="15" y="40" width="18" height="10" rx="0.5" className="fill-primary/20" />
    <circle cx="24" cy="53" r="2.5" className="fill-primary/25" />
    <rect x="38" y="40" width="18" height="10" rx="0.5" className="fill-primary/20" />
    <circle cx="47" cy="53" r="2.5" className="fill-primary/25" />
    <rect x="61" y="40" width="18" height="10" rx="0.5" className="fill-primary/20" />
    <circle cx="70" cy="53" r="2.5" className="fill-primary/25" />
    <rect x="84" y="40" width="18" height="10" rx="0.5" className="fill-primary/20" />
    <circle cx="93" cy="53" r="2.5" className="fill-primary/25" />
    
    {/* Drucker/Kopierer */}
    <rect x="15" y="60" width="10" height="8" rx="0.5" className="fill-primary/30" />
    
    {/* Besprechungsraum */}
    <rect x="115" y="10" width="55" height="40" rx="1" strokeWidth="1.5" />
    <rect x="122" y="18" width="40" height="22" rx="1" className="fill-primary/20" />
    <circle cx="130" cy="15" r="2.5" className="fill-primary/25" />
    <circle cx="142" cy="15" r="2.5" className="fill-primary/25" />
    <circle cx="154" cy="15" r="2.5" className="fill-primary/25" />
    <circle cx="130" cy="43" r="2.5" className="fill-primary/25" />
    <circle cx="142" cy="43" r="2.5" className="fill-primary/25" />
    <circle cx="154" cy="43" r="2.5" className="fill-primary/25" />
    <circle cx="119" cy="29" r="2.5" className="fill-primary/25" />
    <circle cx="165" cy="29" r="2.5" className="fill-primary/25" />
    <rect x="138" y="26" width="8" height="5" rx="0.5" className="fill-primary/40" /> {/* Bildschirm */}
    
    {/* Chefbüro */}
    <rect x="115" y="55" width="55" height="35" rx="1" strokeWidth="1.5" />
    <rect x="130" y="60" width="24" height="14" rx="0.5" className="fill-primary/20" />
    <circle cx="142" cy="78" r="3" className="fill-primary/25" />
    <rect x="158" y="60" width="8" height="16" rx="0.5" className="fill-primary/15" /> {/* Regal */}
    <rect x="120" y="74" width="8" height="8" rx="0.5" className="fill-primary/15" /> {/* Sessel */}
    
    {/* Küche/Pausenraum */}
    <rect x="10" y="80" width="50" height="40" rx="1" strokeWidth="1.5" />
    <rect x="12" y="82" width="46" height="8" rx="0.5" className="fill-primary/25" />
    <rect x="12" y="92" width="10" height="10" rx="0.5" className="fill-primary/20" />
    <rect x="48" y="92" width="8" height="10" rx="0.5" className="fill-primary/20" />
    <rect x="20" y="100" width="20" height="12" rx="0.5" className="fill-primary/15" /> {/* Tisch */}
    <circle cx="24" cy="115" r="2" className="fill-primary/25" />
    <circle cx="36" cy="115" r="2" className="fill-primary/25" />
    
    {/* WC */}
    <rect x="65" y="80" width="22" height="40" rx="1" strokeWidth="1.5" />
    <ellipse cx="76" cy="92" rx="5" ry="4" className="fill-primary/20" />
    <ellipse cx="76" cy="108" rx="5" ry="4" className="fill-primary/20" />
    
    {/* Serverraum/Lager */}
    <rect x="90" y="80" width="20" height="40" rx="1" strokeWidth="1.5" />
    <rect x="92" y="82" width="16" height="8" rx="0.5" className="fill-primary/30" />
    <rect x="92" y="92" width="16" height="8" rx="0.5" className="fill-primary/30" />
    <rect x="92" y="102" width="16" height="16" rx="0.5" className="fill-primary/15" />
    
    {/* Empfang */}
    <rect x="115" y="94" width="55" height="28" rx="1" strokeWidth="1.5" />
    <rect x="125" y="100" width="30" height="8" rx="0.5" className="fill-primary/20" />
    <circle cx="140" cy="112" r="2.5" className="fill-primary/25" />
    <rect x="160" y="98" width="6" height="18" rx="0.5" className="fill-primary/15" /> {/* Pflanze */}
  </svg>
);

const costExamples = [
  {
    FloorPlan: FloorPlanStudio,
    title: "Studio",
    sqm: "25-30 m²",
    price: "ab CHF 450",
    priceWithPacking: "ab CHF 650",
    details: ["1-2 Umzugshelfer", "Kleintransporter", "2-3 Stunden"]
  },
  {
    FloorPlan: FloorPlan1_5,
    title: "1.5-Zimmer",
    sqm: "35-45 m²",
    price: "ab CHF 680",
    priceWithPacking: "ab CHF 950",
    details: ["2 Umzugshelfer", "Kleintransporter", "3-4 Stunden"]
  },
  {
    FloorPlan: FloorPlan2_5,
    title: "2.5-Zimmer",
    sqm: "50-65 m²",
    price: "ab CHF 980",
    priceWithPacking: "ab CHF 1'400",
    details: ["2-3 Umzugshelfer", "Umzugswagen", "4-5 Stunden"]
  },
  {
    FloorPlan: FloorPlan3_5,
    title: "3.5-Zimmer",
    sqm: "70-85 m²",
    price: "ab CHF 1'350",
    priceWithPacking: "ab CHF 1'950",
    details: ["3 Umzugshelfer", "Umzugswagen", "5-7 Stunden"]
  },
  {
    FloorPlan: FloorPlan4_5,
    title: "4.5-Zimmer",
    sqm: "90-110 m²",
    price: "ab CHF 1'650",
    priceWithPacking: "ab CHF 2'400",
    details: ["3-4 Umzugshelfer", "LKW 3.5t", "6-8 Stunden"]
  },
  {
    FloorPlan: FloorPlan5_5,
    title: "5.5-Zimmer",
    sqm: "110-140 m²",
    price: "ab CHF 2'200",
    priceWithPacking: "ab CHF 3'200",
    details: ["4-5 Umzugshelfer", "LKW 7.5t", "8-10 Stunden"]
  },
  {
    FloorPlan: FloorPlanOffice,
    title: "KMU-Büro",
    sqm: "150-300 m²",
    price: "ab CHF 2'800",
    priceWithPacking: "ab CHF 4'500",
    details: ["4-6 Umzugshelfer", "LKW + Möbellift", "1-2 Tage"]
  }
];

export const PremiumCostExamples = () => {
  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-muted/30 to-background relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <motion.span 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-success/10 rounded-full text-success font-semibold text-sm uppercase tracking-wider mb-4"
          >
            <TrendingDown className="h-4 w-4" />
            Preistransparenz
          </motion.span>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            Was kostet ein Umzug in der Schweiz?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Transparente Preisübersicht für alle Wohnungsgrössen
          </p>
        </motion.div>

        {/* Service Type Legend */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap items-center justify-center gap-4 md:gap-8 mb-10"
        >
          <div className="flex items-center gap-2 px-4 py-2 bg-card rounded-full border shadow-sm">
            <Truck className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Nur Transport</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
            <Package className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Mit Ein- & Auspacken</span>
          </div>
        </motion.div>
        
        {/* Carousel */}
        <div className="max-w-6xl mx-auto mb-12 px-12 md:px-16">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-3 md:-ml-4">
              {costExamples.map((example, index) => (
                <CarouselItem key={index} className="pl-3 md:pl-4 basis-[85%] sm:basis-1/2 md:basis-1/3 lg:basis-[28%]">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className="h-full"
                  >
                    <Card className="h-full hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border bg-card overflow-hidden group">
                      <CardContent className="p-0 h-full flex flex-col">
                        {/* Floor Plan Illustration */}
                        <div className="bg-gradient-to-br from-muted/50 to-muted/30 p-3 h-28 md:h-32 relative">
                          <div className="w-full h-full text-primary/60 group-hover:text-primary/80 transition-colors duration-300 group-hover:scale-[1.02] transition-transform">
                            <example.FloorPlan />
                          </div>
                          {/* m² Badge */}
                          <div className="absolute top-2 right-2 px-2 py-0.5 bg-background/90 rounded text-xs font-semibold text-foreground shadow-sm">
                            {example.sqm}
                          </div>
                        </div>
                        
                        <div className="p-4 flex-1 flex flex-col">
                          <h3 className="text-base md:text-lg font-bold mb-3 text-foreground text-center">
                            {example.title}
                          </h3>
                          
                          {/* Price Options */}
                          <div className="space-y-2 mb-4">
                            <div className="flex items-center justify-between p-2 bg-muted/30 rounded-lg">
                              <div className="flex items-center gap-1.5">
                                <Truck className="h-3.5 w-3.5 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">Transport</span>
                              </div>
                              <span className="text-sm font-bold text-foreground">{example.price}</span>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-primary/5 rounded-lg border border-primary/10">
                              <div className="flex items-center gap-1.5">
                                <Package className="h-3.5 w-3.5 text-primary" />
                                <span className="text-xs text-primary">+ Packen</span>
                              </div>
                              <span className="text-sm font-bold text-primary">{example.priceWithPacking}</span>
                            </div>
                          </div>
                          
                          {/* Details */}
                          <ul className="space-y-1 text-left mt-auto">
                            {example.details.map((detail, i) => (
                              <li key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                                <div className="w-1 h-1 rounded-full bg-primary/50 flex-shrink-0" />
                                <span>{detail}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>
            {/* Always visible arrows */}
            <CarouselPrevious className="-left-4 md:-left-6 h-10 w-10 md:h-12 md:w-12 border-2 border-primary/20 bg-card hover:bg-primary hover:text-primary-foreground shadow-md" />
            <CarouselNext className="-right-4 md:-right-6 h-10 w-10 md:h-12 md:w-12 border-2 border-primary/20 bg-card hover:bg-primary hover:text-primary-foreground shadow-md" />
          </Carousel>
        </div>
        
        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mb-12"
        >
          <p className="text-sm md:text-base text-muted-foreground max-w-xl mx-auto">
            Richtwerte für lokale Umzüge in der Schweiz. Der Einpack- & Auspackservice beinhaltet professionelles Verpacken aller Gegenstände inkl. Material.
          </p>
        </motion.div>
        
        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center"
        >
          <Link to="/umzugsrechner">
            <Button size="lg" className="h-12 sm:h-14 px-5 sm:px-10 text-sm sm:text-lg font-semibold shadow-copper hover:shadow-lift transition-all group">
              <Calculator className="mr-1.5 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              <span className="hidden sm:inline">Meine Umzugskosten berechnen</span>
              <span className="sm:hidden">Kosten berechnen</span>
              <ArrowRight className="ml-1.5 sm:ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <p className="mt-4 text-sm text-muted-foreground">
            Kostenlos & unverbindlich in 2 Minuten
          </p>
        </motion.div>
      </div>
    </section>
  );
};
