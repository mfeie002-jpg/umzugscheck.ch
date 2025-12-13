import { ArrowRight, TrendingDown, Calculator, ChevronLeft, ChevronRight } from "lucide-react";
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

// Beautiful 3D-style Apartment Illustrations
const FloorPlanStudio = () => (
  <svg viewBox="0 0 120 100" className="w-full h-full drop-shadow-sm">
    {/* Floor with gradient */}
    <defs>
      <linearGradient id="floorGradStudio" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="hsl(var(--primary) / 0.08)" />
        <stop offset="100%" stopColor="hsl(var(--primary) / 0.15)" />
      </linearGradient>
      <linearGradient id="wallGradStudio" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="hsl(var(--primary) / 0.3)" />
        <stop offset="100%" stopColor="hsl(var(--primary) / 0.15)" />
      </linearGradient>
      <linearGradient id="furnitureGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="hsl(var(--primary) / 0.5)" />
        <stop offset="100%" stopColor="hsl(var(--primary) / 0.3)" />
      </linearGradient>
    </defs>
    
    {/* Main room floor */}
    <rect x="10" y="20" width="100" height="70" rx="4" fill="url(#floorGradStudio)" />
    
    {/* Walls with 3D effect */}
    <path d="M10 20 L10 90 L110 90 L110 20" fill="none" stroke="url(#wallGradStudio)" strokeWidth="3" strokeLinecap="round" />
    <path d="M10 20 L20 10 L100 10 L110 20" fill="hsl(var(--primary) / 0.05)" stroke="url(#wallGradStudio)" strokeWidth="2" />
    
    {/* Window with light effect */}
    <rect x="50" y="12" width="20" height="6" rx="1" fill="hsl(220 90% 85%)" stroke="hsl(var(--primary) / 0.4)" strokeWidth="1" />
    <rect x="52" y="13" width="7" height="4" rx="0.5" fill="hsl(200 100% 95%)" />
    <rect x="61" y="13" width="7" height="4" rx="0.5" fill="hsl(200 100% 95%)" />
    
    {/* Cozy bed with pillows */}
    <rect x="20" y="35" width="28" height="35" rx="3" fill="url(#furnitureGrad)" />
    <rect x="21" y="37" width="26" height="8" rx="2" fill="hsl(var(--primary) / 0.6)" />
    <ellipse cx="28" cy="41" rx="4" ry="3" fill="hsl(var(--background))" opacity="0.8" />
    <ellipse cx="40" cy="41" rx="4" ry="3" fill="hsl(var(--background))" opacity="0.8" />
    
    {/* Small kitchen area */}
    <rect x="75" y="30" width="25" height="12" rx="2" fill="hsl(var(--primary) / 0.35)" />
    <circle cx="82" cy="36" r="3" fill="hsl(var(--background))" opacity="0.6" />
    <circle cx="93" cy="36" r="3" fill="hsl(var(--background))" opacity="0.6" />
    
    {/* Mini bathroom */}
    <rect x="75" y="55" width="25" height="25" rx="2" fill="hsl(var(--primary) / 0.2)" stroke="hsl(var(--primary) / 0.3)" strokeWidth="1" strokeDasharray="4 2" />
    <ellipse cx="87" cy="70" rx="6" ry="4" fill="hsl(var(--primary) / 0.4)" />
    
    {/* Decorative plant */}
    <circle cx="55" cy="75" r="4" fill="hsl(140 60% 50% / 0.4)" />
    <rect x="53" y="78" width="4" height="5" rx="1" fill="hsl(30 40% 50% / 0.5)" />
    
    {/* Rug */}
    <ellipse cx="45" cy="60" rx="12" ry="8" fill="hsl(var(--accent) / 0.15)" />
  </svg>
);

const FloorPlan1_5 = () => (
  <svg viewBox="0 0 120 100" className="w-full h-full drop-shadow-sm">
    <defs>
      <linearGradient id="floorGrad15" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="hsl(var(--primary) / 0.08)" />
        <stop offset="100%" stopColor="hsl(var(--primary) / 0.15)" />
      </linearGradient>
    </defs>
    
    {/* Main floor */}
    <rect x="8" y="18" width="104" height="74" rx="4" fill="url(#floorGrad15)" />
    
    {/* 3D walls */}
    <path d="M8 18 L8 92 L112 92 L112 18" fill="none" stroke="hsl(var(--primary) / 0.25)" strokeWidth="3" />
    <path d="M8 18 L18 8 L102 8 L112 18" fill="hsl(var(--primary) / 0.05)" stroke="hsl(var(--primary) / 0.25)" strokeWidth="2" />
    
    {/* Window */}
    <rect x="40" y="10" width="30" height="6" rx="1" fill="hsl(220 90% 88%)" stroke="hsl(var(--primary) / 0.3)" strokeWidth="1" />
    
    {/* Living room with sofa */}
    <rect x="15" y="25" width="50" height="35" rx="2" fill="hsl(var(--primary) / 0.08)" stroke="hsl(var(--primary) / 0.15)" strokeDasharray="6 3" />
    <rect x="20" y="30" width="25" height="12" rx="3" fill="hsl(var(--primary) / 0.4)" />
    <rect x="17" y="32" width="4" height="8" rx="2" fill="hsl(var(--primary) / 0.35)" />
    <rect x="46" y="32" width="4" height="8" rx="2" fill="hsl(var(--primary) / 0.35)" />
    {/* Coffee table */}
    <rect x="28" y="47" width="12" height="8" rx="2" fill="hsl(var(--primary) / 0.25)" />
    
    {/* Small bedroom */}
    <rect x="15" y="65" width="35" height="22" rx="2" fill="hsl(var(--primary) / 0.12)" stroke="hsl(var(--primary) / 0.2)" strokeDasharray="4 2" />
    {/* Bed */}
    <rect x="18" y="68" width="20" height="16" rx="2" fill="hsl(var(--primary) / 0.4)" />
    <ellipse cx="28" cy="71" rx="4" ry="2" fill="hsl(var(--background))" opacity="0.7" />
    
    {/* Kitchen */}
    <rect x="70" y="25" width="35" height="30" rx="2" fill="hsl(var(--primary) / 0.1)" stroke="hsl(var(--primary) / 0.2)" strokeDasharray="4 2" />
    <rect x="75" y="30" width="25" height="8" rx="1" fill="hsl(var(--primary) / 0.35)" />
    <circle cx="82" cy="34" r="2.5" fill="hsl(var(--background))" opacity="0.5" />
    <circle cx="92" cy="34" r="2.5" fill="hsl(var(--background))" opacity="0.5" />
    {/* Fridge */}
    <rect x="90" y="42" width="12" height="10" rx="1" fill="hsl(var(--primary) / 0.3)" />
    
    {/* Bathroom */}
    <rect x="70" y="60" width="35" height="27" rx="2" fill="hsl(var(--primary) / 0.15)" stroke="hsl(var(--primary) / 0.25)" strokeDasharray="4 2" />
    <ellipse cx="85" cy="72" rx="8" ry="5" fill="hsl(var(--primary) / 0.35)" />
    <rect x="93" y="65" width="8" height="6" rx="1" fill="hsl(var(--primary) / 0.25)" />
  </svg>
);

const FloorPlan2_5 = () => (
  <svg viewBox="0 0 120 100" className="w-full h-full drop-shadow-sm">
    <defs>
      <linearGradient id="floorGrad25" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="hsl(var(--primary) / 0.06)" />
        <stop offset="100%" stopColor="hsl(var(--primary) / 0.12)" />
      </linearGradient>
    </defs>
    
    {/* Main floor */}
    <rect x="6" y="16" width="108" height="78" rx="4" fill="url(#floorGrad25)" />
    
    {/* 3D walls */}
    <path d="M6 16 L6 94 L114 94 L114 16" fill="none" stroke="hsl(var(--primary) / 0.25)" strokeWidth="3" />
    <path d="M6 16 L16 6 L104 6 L114 16" fill="hsl(var(--primary) / 0.04)" stroke="hsl(var(--primary) / 0.2)" strokeWidth="2" />
    
    {/* Multiple windows */}
    <rect x="25" y="8" width="18" height="6" rx="1" fill="hsl(220 90% 88%)" stroke="hsl(var(--primary) / 0.3)" />
    <rect x="55" y="8" width="18" height="6" rx="1" fill="hsl(220 90% 88%)" stroke="hsl(var(--primary) / 0.3)" />
    
    {/* Living room */}
    <rect x="10" y="22" width="45" height="32" rx="2" fill="hsl(var(--primary) / 0.06)" stroke="hsl(var(--primary) / 0.12)" strokeDasharray="6 3" />
    {/* L-shaped sofa */}
    <path d="M15 28 L35 28 L35 35 L25 35 L25 45 L15 45 Z" fill="hsl(var(--primary) / 0.4)" rx="2" />
    {/* Coffee table */}
    <rect x="30" y="40" width="10" height="7" rx="2" fill="hsl(var(--primary) / 0.25)" />
    {/* TV */}
    <rect x="45" y="30" width="3" height="15" rx="1" fill="hsl(var(--primary) / 0.3)" />
    
    {/* Kitchen/Dining */}
    <rect x="60" y="22" width="48" height="30" rx="2" fill="hsl(var(--primary) / 0.08)" stroke="hsl(var(--primary) / 0.15)" strokeDasharray="4 2" />
    {/* Kitchen counter */}
    <rect x="85" y="26" width="20" height="8" rx="1" fill="hsl(var(--primary) / 0.35)" />
    <circle cx="92" cy="30" r="2" fill="hsl(var(--background))" opacity="0.5" />
    <circle cx="100" cy="30" r="2" fill="hsl(var(--background))" opacity="0.5" />
    {/* Dining table */}
    <ellipse cx="72" cy="38" rx="8" ry="6" fill="hsl(var(--primary) / 0.25)" />
    <circle cx="65" cy="38" r="2" fill="hsl(var(--primary) / 0.2)" />
    <circle cx="79" cy="38" r="2" fill="hsl(var(--primary) / 0.2)" />
    <circle cx="72" cy="32" r="2" fill="hsl(var(--primary) / 0.2)" />
    <circle cx="72" cy="44" r="2" fill="hsl(var(--primary) / 0.2)" />
    
    {/* Bedroom 1 - Master */}
    <rect x="10" y="58" width="35" height="30" rx="2" fill="hsl(var(--primary) / 0.1)" stroke="hsl(var(--primary) / 0.18)" strokeDasharray="4 2" />
    <rect x="14" y="62" width="22" height="18" rx="2" fill="hsl(var(--primary) / 0.4)" />
    <ellipse cx="20" cy="66" rx="4" ry="2.5" fill="hsl(var(--background))" opacity="0.7" />
    <ellipse cx="30" cy="66" rx="4" ry="2.5" fill="hsl(var(--background))" opacity="0.7" />
    {/* Nightstand */}
    <rect x="37" y="68" width="5" height="5" rx="1" fill="hsl(var(--primary) / 0.25)" />
    
    {/* Bedroom 2 */}
    <rect x="50" y="58" width="30" height="30" rx="2" fill="hsl(var(--primary) / 0.1)" stroke="hsl(var(--primary) / 0.18)" strokeDasharray="4 2" />
    <rect x="54" y="64" width="18" height="14" rx="2" fill="hsl(var(--primary) / 0.4)" />
    <ellipse cx="63" cy="68" rx="4" ry="2" fill="hsl(var(--background))" opacity="0.7" />
    {/* Desk */}
    <rect x="65" y="82" width="12" height="4" rx="1" fill="hsl(var(--primary) / 0.25)" />
    
    {/* Bathroom */}
    <rect x="85" y="58" width="23" height="30" rx="2" fill="hsl(var(--primary) / 0.12)" stroke="hsl(var(--primary) / 0.22)" strokeDasharray="4 2" />
    <ellipse cx="95" cy="72" rx="7" ry="5" fill="hsl(var(--primary) / 0.35)" />
    <rect x="95" y="82" width="10" height="4" rx="1" fill="hsl(var(--primary) / 0.25)" />
  </svg>
);

const FloorPlan3_5 = () => (
  <svg viewBox="0 0 120 100" className="w-full h-full drop-shadow-sm">
    <defs>
      <linearGradient id="floorGrad35" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="hsl(var(--primary) / 0.05)" />
        <stop offset="100%" stopColor="hsl(var(--primary) / 0.1)" />
      </linearGradient>
    </defs>
    
    {/* Main floor */}
    <rect x="5" y="14" width="110" height="80" rx="4" fill="url(#floorGrad35)" />
    
    {/* 3D walls */}
    <path d="M5 14 L5 94 L115 94 L115 14" fill="none" stroke="hsl(var(--primary) / 0.22)" strokeWidth="3" />
    <path d="M5 14 L15 4 L105 4 L115 14" fill="hsl(var(--primary) / 0.03)" stroke="hsl(var(--primary) / 0.18)" strokeWidth="2" />
    
    {/* Windows */}
    <rect x="20" y="6" width="15" height="6" rx="1" fill="hsl(220 90% 88%)" stroke="hsl(var(--primary) / 0.3)" />
    <rect x="50" y="6" width="20" height="6" rx="1" fill="hsl(220 90% 88%)" stroke="hsl(var(--primary) / 0.3)" />
    <rect x="85" y="6" width="15" height="6" rx="1" fill="hsl(220 90% 88%)" stroke="hsl(var(--primary) / 0.3)" />
    
    {/* Large living room */}
    <rect x="10" y="20" width="55" height="32" rx="2" fill="hsl(var(--primary) / 0.05)" stroke="hsl(var(--primary) / 0.1)" strokeDasharray="6 3" />
    {/* Sectional sofa */}
    <path d="M15 26 L45 26 L45 34 L35 34 L35 44 L15 44 Z" fill="hsl(var(--primary) / 0.38)" rx="2" />
    {/* Coffee table */}
    <rect x="38" y="38" width="12" height="8" rx="2" fill="hsl(var(--primary) / 0.22)" />
    {/* Plant */}
    <circle cx="55" cy="28" r="4" fill="hsl(140 55% 50% / 0.35)" />
    <rect x="53" y="31" width="4" height="5" rx="1" fill="hsl(30 35% 45% / 0.4)" />
    
    {/* Kitchen */}
    <rect x="70" y="20" width="40" height="25" rx="2" fill="hsl(var(--primary) / 0.07)" stroke="hsl(var(--primary) / 0.12)" strokeDasharray="4 2" />
    <rect x="85" y="24" width="22" height="8" rx="1" fill="hsl(var(--primary) / 0.32)" />
    <circle cx="92" cy="28" r="2.5" fill="hsl(var(--background))" opacity="0.5" />
    <circle cx="100" cy="28" r="2.5" fill="hsl(var(--background))" opacity="0.5" />
    {/* Island */}
    <rect x="75" y="32" width="8" height="10" rx="1" fill="hsl(var(--primary) / 0.25)" />
    
    {/* Bath */}
    <rect x="70" y="48" width="20" height="16" rx="2" fill="hsl(var(--primary) / 0.12)" stroke="hsl(var(--primary) / 0.2)" strokeDasharray="4 2" />
    <ellipse cx="80" cy="55" rx="6" ry="4" fill="hsl(var(--primary) / 0.32)" />
    
    {/* Bedroom 1 - Master */}
    <rect x="10" y="56" width="28" height="32" rx="2" fill="hsl(var(--primary) / 0.08)" stroke="hsl(var(--primary) / 0.15)" strokeDasharray="4 2" />
    <rect x="13" y="60" width="20" height="16" rx="2" fill="hsl(var(--primary) / 0.38)" />
    <ellipse cx="18" cy="64" rx="3.5" ry="2" fill="hsl(var(--background))" opacity="0.7" />
    <ellipse cx="28" cy="64" rx="3.5" ry="2" fill="hsl(var(--background))" opacity="0.7" />
    
    {/* Bedroom 2 */}
    <rect x="42" y="56" width="26" height="32" rx="2" fill="hsl(var(--primary) / 0.08)" stroke="hsl(var(--primary) / 0.15)" strokeDasharray="4 2" />
    <rect x="46" y="62" width="16" height="12" rx="2" fill="hsl(var(--primary) / 0.38)" />
    <ellipse cx="54" cy="66" rx="4" ry="2" fill="hsl(var(--background))" opacity="0.7" />
    
    {/* Bedroom 3 / Office */}
    <rect x="72" y="68" width="38" height="20" rx="2" fill="hsl(var(--primary) / 0.08)" stroke="hsl(var(--primary) / 0.15)" strokeDasharray="4 2" />
    <rect x="76" y="72" width="14" height="10" rx="2" fill="hsl(var(--primary) / 0.38)" />
    <rect x="95" y="74" width="10" height="4" rx="1" fill="hsl(var(--primary) / 0.22)" />
  </svg>
);

const FloorPlan4_5 = () => (
  <svg viewBox="0 0 120 100" className="w-full h-full drop-shadow-sm">
    <defs>
      <linearGradient id="floorGrad45" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="hsl(var(--primary) / 0.04)" />
        <stop offset="100%" stopColor="hsl(var(--primary) / 0.09)" />
      </linearGradient>
    </defs>
    
    {/* Main floor */}
    <rect x="4" y="12" width="112" height="82" rx="4" fill="url(#floorGrad45)" />
    
    {/* 3D walls */}
    <path d="M4 12 L4 94 L116 94 L116 12" fill="none" stroke="hsl(var(--primary) / 0.2)" strokeWidth="3" />
    <path d="M4 12 L14 2 L106 2 L116 12" fill="hsl(var(--primary) / 0.025)" stroke="hsl(var(--primary) / 0.15)" strokeWidth="2" />
    
    {/* Multiple windows */}
    <rect x="18" y="4" width="12" height="6" rx="1" fill="hsl(220 90% 88%)" stroke="hsl(var(--primary) / 0.25)" />
    <rect x="40" y="4" width="18" height="6" rx="1" fill="hsl(220 90% 88%)" stroke="hsl(var(--primary) / 0.25)" />
    <rect x="68" y="4" width="12" height="6" rx="1" fill="hsl(220 90% 88%)" stroke="hsl(var(--primary) / 0.25)" />
    <rect x="90" y="4" width="12" height="6" rx="1" fill="hsl(220 90% 88%)" stroke="hsl(var(--primary) / 0.25)" />
    
    {/* Open living/dining */}
    <rect x="8" y="18" width="60" height="30" rx="2" fill="hsl(var(--primary) / 0.04)" stroke="hsl(var(--primary) / 0.08)" strokeDasharray="6 3" />
    {/* Large sofa set */}
    <path d="M12 24 L38 24 L38 32 L28 32 L28 40 L12 40 Z" fill="hsl(var(--primary) / 0.35)" />
    <rect x="40" y="28" width="8" height="8" rx="2" fill="hsl(var(--primary) / 0.3)" />
    {/* Coffee table */}
    <rect x="32" y="36" width="14" height="8" rx="2" fill="hsl(var(--primary) / 0.2)" />
    {/* Dining area */}
    <ellipse cx="55" cy="32" rx="10" ry="7" fill="hsl(var(--primary) / 0.2)" />
    
    {/* Kitchen */}
    <rect x="72" y="18" width="40" height="22" rx="2" fill="hsl(var(--primary) / 0.06)" stroke="hsl(var(--primary) / 0.1)" strokeDasharray="4 2" />
    <rect x="88" y="22" width="20" height="7" rx="1" fill="hsl(var(--primary) / 0.3)" />
    <circle cx="95" cy="25.5" r="2" fill="hsl(var(--background))" opacity="0.5" />
    <circle cx="102" cy="25.5" r="2" fill="hsl(var(--background))" opacity="0.5" />
    <rect x="76" y="26" width="8" height="10" rx="1" fill="hsl(var(--primary) / 0.22)" />
    
    {/* Bath 1 */}
    <rect x="72" y="44" width="18" height="14" rx="2" fill="hsl(var(--primary) / 0.1)" stroke="hsl(var(--primary) / 0.18)" strokeDasharray="4 2" />
    <ellipse cx="80" cy="50" rx="5" ry="3.5" fill="hsl(var(--primary) / 0.3)" />
    
    {/* Bath 2 / WC */}
    <rect x="94" y="44" width="18" height="14" rx="2" fill="hsl(var(--primary) / 0.1)" stroke="hsl(var(--primary) / 0.18)" strokeDasharray="4 2" />
    <rect x="99" y="48" width="8" height="6" rx="1" fill="hsl(var(--primary) / 0.25)" />
    
    {/* Bedroom 1 - Master with ensuite */}
    <rect x="8" y="52" width="30" height="36" rx="2" fill="hsl(var(--primary) / 0.07)" stroke="hsl(var(--primary) / 0.13)" strokeDasharray="4 2" />
    <rect x="11" y="58" width="22" height="16" rx="2" fill="hsl(var(--primary) / 0.35)" />
    <ellipse cx="17" cy="62" rx="4" ry="2" fill="hsl(var(--background))" opacity="0.7" />
    <ellipse cx="27" cy="62" rx="4" ry="2" fill="hsl(var(--background))" opacity="0.7" />
    <rect x="14" y="78" width="10" height="7" rx="1" fill="hsl(var(--primary) / 0.15)" />
    
    {/* Bedroom 2 */}
    <rect x="42" y="52" width="26" height="36" rx="2" fill="hsl(var(--primary) / 0.07)" stroke="hsl(var(--primary) / 0.13)" strokeDasharray="4 2" />
    <rect x="46" y="58" width="16" height="12" rx="2" fill="hsl(var(--primary) / 0.35)" />
    <ellipse cx="54" cy="62" rx="4" ry="2" fill="hsl(var(--background))" opacity="0.7" />
    
    {/* Bedroom 3 */}
    <rect x="72" y="62" width="24" height="26" rx="2" fill="hsl(var(--primary) / 0.07)" stroke="hsl(var(--primary) / 0.13)" strokeDasharray="4 2" />
    <rect x="76" y="66" width="14" height="10" rx="2" fill="hsl(var(--primary) / 0.35)" />
    
    {/* Office/Guest */}
    <rect x="100" y="62" width="12" height="26" rx="2" fill="hsl(var(--primary) / 0.07)" stroke="hsl(var(--primary) / 0.13)" strokeDasharray="4 2" />
    <rect x="102" y="68" width="8" height="4" rx="1" fill="hsl(var(--primary) / 0.2)" />
  </svg>
);

const FloorPlan5_5 = () => (
  <svg viewBox="0 0 120 100" className="w-full h-full drop-shadow-sm">
    <defs>
      <linearGradient id="floorGrad55" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="hsl(var(--primary) / 0.035)" />
        <stop offset="100%" stopColor="hsl(var(--primary) / 0.08)" />
      </linearGradient>
    </defs>
    
    {/* Main floor */}
    <rect x="3" y="10" width="114" height="84" rx="4" fill="url(#floorGrad55)" />
    
    {/* 3D walls */}
    <path d="M3 10 L3 94 L117 94 L117 10" fill="none" stroke="hsl(var(--primary) / 0.18)" strokeWidth="3" />
    <path d="M3 10 L13 0 L107 0 L117 10" fill="hsl(var(--primary) / 0.02)" stroke="hsl(var(--primary) / 0.12)" strokeWidth="2" />
    
    {/* Many windows */}
    <rect x="15" y="2" width="10" height="6" rx="1" fill="hsl(220 90% 88%)" stroke="hsl(var(--primary) / 0.2)" />
    <rect x="32" y="2" width="15" height="6" rx="1" fill="hsl(220 90% 88%)" stroke="hsl(var(--primary) / 0.2)" />
    <rect x="54" y="2" width="15" height="6" rx="1" fill="hsl(220 90% 88%)" stroke="hsl(var(--primary) / 0.2)" />
    <rect x="76" y="2" width="10" height="6" rx="1" fill="hsl(220 90% 88%)" stroke="hsl(var(--primary) / 0.2)" />
    <rect x="93" y="2" width="10" height="6" rx="1" fill="hsl(220 90% 88%)" stroke="hsl(var(--primary) / 0.2)" />
    
    {/* Large living area */}
    <rect x="7" y="16" width="65" height="28" rx="2" fill="hsl(var(--primary) / 0.03)" stroke="hsl(var(--primary) / 0.07)" strokeDasharray="6 3" />
    <path d="M12 22 L42 22 L42 30 L30 30 L30 38 L12 38 Z" fill="hsl(var(--primary) / 0.32)" />
    <rect x="45" y="26" width="10" height="10" rx="2" fill="hsl(var(--primary) / 0.28)" />
    <rect x="35" y="34" width="16" height="8" rx="2" fill="hsl(var(--primary) / 0.18)" />
    <ellipse cx="60" cy="30" rx="8" ry="6" fill="hsl(var(--primary) / 0.18)" />
    
    {/* Kitchen */}
    <rect x="76" y="16" width="38" height="20" rx="2" fill="hsl(var(--primary) / 0.05)" stroke="hsl(var(--primary) / 0.09)" strokeDasharray="4 2" />
    <rect x="92" y="20" width="18" height="6" rx="1" fill="hsl(var(--primary) / 0.28)" />
    <rect x="80" y="24" width="8" height="8" rx="1" fill="hsl(var(--primary) / 0.2)" />
    
    {/* Bath 1 */}
    <rect x="76" y="40" width="16" height="12" rx="2" fill="hsl(var(--primary) / 0.09)" stroke="hsl(var(--primary) / 0.15)" strokeDasharray="4 2" />
    <ellipse cx="84" cy="46" rx="5" ry="3" fill="hsl(var(--primary) / 0.28)" />
    
    {/* Bath 2 */}
    <rect x="96" y="40" width="18" height="12" rx="2" fill="hsl(var(--primary) / 0.09)" stroke="hsl(var(--primary) / 0.15)" strokeDasharray="4 2" />
    <rect x="100" y="44" width="10" height="5" rx="1" fill="hsl(var(--primary) / 0.22)" />
    
    {/* Bedroom 1 - Master Suite */}
    <rect x="7" y="48" width="28" height="40" rx="2" fill="hsl(var(--primary) / 0.06)" stroke="hsl(var(--primary) / 0.11)" strokeDasharray="4 2" />
    <rect x="10" y="54" width="20" height="14" rx="2" fill="hsl(var(--primary) / 0.32)" />
    <ellipse cx="15" cy="58" rx="3.5" ry="2" fill="hsl(var(--background))" opacity="0.7" />
    <ellipse cx="25" cy="58" rx="3.5" ry="2" fill="hsl(var(--background))" opacity="0.7" />
    <rect x="12" y="72" width="10" height="8" rx="1" fill="hsl(var(--primary) / 0.12)" />
    
    {/* Bedroom 2 */}
    <rect x="39" y="48" width="24" height="20" rx="2" fill="hsl(var(--primary) / 0.06)" stroke="hsl(var(--primary) / 0.11)" strokeDasharray="4 2" />
    <rect x="43" y="52" width="14" height="10" rx="2" fill="hsl(var(--primary) / 0.32)" />
    
    {/* Bedroom 3 */}
    <rect x="39" y="72" width="24" height="16" rx="2" fill="hsl(var(--primary) / 0.06)" stroke="hsl(var(--primary) / 0.11)" strokeDasharray="4 2" />
    <rect x="43" y="76" width="14" height="9" rx="2" fill="hsl(var(--primary) / 0.32)" />
    
    {/* Bedroom 4 */}
    <rect x="67" y="56" width="22" height="18" rx="2" fill="hsl(var(--primary) / 0.06)" stroke="hsl(var(--primary) / 0.11)" strokeDasharray="4 2" />
    <rect x="70" y="60" width="12" height="8" rx="2" fill="hsl(var(--primary) / 0.32)" />
    
    {/* Office */}
    <rect x="93" y="56" width="20" height="32" rx="2" fill="hsl(var(--primary) / 0.06)" stroke="hsl(var(--primary) / 0.11)" strokeDasharray="4 2" />
    <rect x="97" y="62" width="12" height="5" rx="1" fill="hsl(var(--primary) / 0.18)" />
    <rect x="97" y="74" width="8" height="8" rx="1" fill="hsl(var(--primary) / 0.15)" />
    
    {/* Storage */}
    <rect x="67" y="78" width="22" height="10" rx="2" fill="hsl(var(--primary) / 0.05)" stroke="hsl(var(--primary) / 0.1)" strokeDasharray="4 2" />
  </svg>
);

const FloorPlanOffice = () => (
  <svg viewBox="0 0 120 100" className="w-full h-full drop-shadow-sm">
    <defs>
      <linearGradient id="floorGradOffice" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="hsl(var(--primary) / 0.04)" />
        <stop offset="100%" stopColor="hsl(var(--primary) / 0.09)" />
      </linearGradient>
    </defs>
    
    {/* Main floor */}
    <rect x="4" y="12" width="112" height="82" rx="4" fill="url(#floorGradOffice)" />
    
    {/* 3D walls */}
    <path d="M4 12 L4 94 L116 94 L116 12" fill="none" stroke="hsl(var(--primary) / 0.2)" strokeWidth="3" />
    <path d="M4 12 L14 2 L106 2 L116 12" fill="hsl(var(--primary) / 0.025)" stroke="hsl(var(--primary) / 0.15)" strokeWidth="2" />
    
    {/* Large windows */}
    <rect x="20" y="4" width="25" height="6" rx="1" fill="hsl(220 90% 88%)" stroke="hsl(var(--primary) / 0.25)" />
    <rect x="55" y="4" width="25" height="6" rx="1" fill="hsl(220 90% 88%)" stroke="hsl(var(--primary) / 0.25)" />
    
    {/* Open Office Area */}
    <rect x="8" y="18" width="70" height="45" rx="2" fill="hsl(var(--primary) / 0.04)" stroke="hsl(var(--primary) / 0.08)" strokeDasharray="6 3" />
    {/* Desk clusters */}
    <rect x="14" y="24" width="14" height="7" rx="1" fill="hsl(var(--primary) / 0.28)" />
    <rect x="32" y="24" width="14" height="7" rx="1" fill="hsl(var(--primary) / 0.28)" />
    <rect x="50" y="24" width="14" height="7" rx="1" fill="hsl(var(--primary) / 0.28)" />
    <rect x="14" y="38" width="14" height="7" rx="1" fill="hsl(var(--primary) / 0.28)" />
    <rect x="32" y="38" width="14" height="7" rx="1" fill="hsl(var(--primary) / 0.28)" />
    <rect x="50" y="38" width="14" height="7" rx="1" fill="hsl(var(--primary) / 0.28)" />
    <rect x="14" y="52" width="14" height="7" rx="1" fill="hsl(var(--primary) / 0.28)" />
    <rect x="32" y="52" width="14" height="7" rx="1" fill="hsl(var(--primary) / 0.28)" />
    {/* Chairs (dots) */}
    <circle cx="21" cy="34" r="2" fill="hsl(var(--primary) / 0.2)" />
    <circle cx="39" cy="34" r="2" fill="hsl(var(--primary) / 0.2)" />
    <circle cx="57" cy="34" r="2" fill="hsl(var(--primary) / 0.2)" />
    <circle cx="21" cy="48" r="2" fill="hsl(var(--primary) / 0.2)" />
    <circle cx="39" cy="48" r="2" fill="hsl(var(--primary) / 0.2)" />
    <circle cx="57" cy="48" r="2" fill="hsl(var(--primary) / 0.2)" />
    
    {/* Meeting Room */}
    <rect x="82" y="18" width="30" height="25" rx="2" fill="hsl(var(--primary) / 0.07)" stroke="hsl(var(--primary) / 0.12)" strokeDasharray="4 2" />
    <ellipse cx="97" cy="30" rx="12" ry="8" fill="hsl(var(--primary) / 0.2)" />
    <circle cx="88" cy="30" r="2" fill="hsl(var(--primary) / 0.15)" />
    <circle cx="106" cy="30" r="2" fill="hsl(var(--primary) / 0.15)" />
    <circle cx="97" cy="22" r="2" fill="hsl(var(--primary) / 0.15)" />
    <circle cx="97" cy="38" r="2" fill="hsl(var(--primary) / 0.15)" />
    
    {/* Manager Office */}
    <rect x="82" y="47" width="30" height="20" rx="2" fill="hsl(var(--primary) / 0.07)" stroke="hsl(var(--primary) / 0.12)" strokeDasharray="4 2" />
    <rect x="88" y="52" width="18" height="8" rx="1" fill="hsl(var(--primary) / 0.25)" />
    <circle cx="97" cy="62" r="2" fill="hsl(var(--primary) / 0.18)" />
    
    {/* Kitchen/Break Room */}
    <rect x="8" y="67" width="35" height="21" rx="2" fill="hsl(var(--primary) / 0.06)" stroke="hsl(var(--primary) / 0.1)" strokeDasharray="4 2" />
    <rect x="12" y="71" width="15" height="5" rx="1" fill="hsl(var(--primary) / 0.25)" />
    <ellipse cx="35" cy="78" rx="5" ry="4" fill="hsl(var(--primary) / 0.18)" />
    
    {/* Restrooms */}
    <rect x="47" y="67" width="14" height="21" rx="2" fill="hsl(var(--primary) / 0.08)" stroke="hsl(var(--primary) / 0.12)" strokeDasharray="4 2" />
    <rect x="50" y="72" width="8" height="5" rx="1" fill="hsl(var(--primary) / 0.2)" />
    <rect x="50" y="80" width="8" height="5" rx="1" fill="hsl(var(--primary) / 0.2)" />
    
    {/* Server/Storage */}
    <rect x="65" y="67" width="13" height="21" rx="2" fill="hsl(var(--primary) / 0.08)" stroke="hsl(var(--primary) / 0.12)" strokeDasharray="4 2" />
    <rect x="68" y="72" width="7" height="12" rx="1" fill="hsl(var(--primary) / 0.22)" />
    
    {/* Reception */}
    <rect x="82" y="71" width="30" height="17" rx="2" fill="hsl(var(--primary) / 0.05)" stroke="hsl(var(--primary) / 0.1)" strokeDasharray="4 2" />
    <path d="M88 76 L100 76 L100 82 L88 82 Z" fill="hsl(var(--primary) / 0.22)" />
  </svg>
);

const costExamples = [
  {
    FloorPlan: FloorPlanStudio,
    title: "Studio",
    subtitle: "ca. 25-35 m²",
    price: "ab CHF 450",
    details: ["1-2 Umzugshelfer", "Kleintransporter", "2-3 Stunden"]
  },
  {
    FloorPlan: FloorPlan1_5,
    title: "1.5-Zimmer",
    subtitle: "ca. 35-45 m²",
    price: "ab CHF 680",
    details: ["2 Umzugshelfer", "Kleintransporter", "3-4 Stunden"]
  },
  {
    FloorPlan: FloorPlan2_5,
    title: "2.5-Zimmer",
    subtitle: "ca. 50-65 m²",
    price: "ab CHF 980",
    details: ["2-3 Umzugshelfer", "Umzugswagen", "4-5 Stunden"]
  },
  {
    FloorPlan: FloorPlan3_5,
    title: "3.5-Zimmer",
    subtitle: "ca. 70-85 m²",
    price: "ab CHF 1'350",
    details: ["3 Umzugshelfer", "Umzugswagen", "5-7 Stunden"]
  },
  {
    FloorPlan: FloorPlan4_5,
    title: "4.5-Zimmer",
    subtitle: "ca. 90-110 m²",
    price: "ab CHF 1'650",
    details: ["3-4 Umzugshelfer", "LKW 3.5t", "6-8 Stunden"]
  },
  {
    FloorPlan: FloorPlan5_5,
    title: "5.5-Zimmer",
    subtitle: "ca. 120-150 m²",
    price: "ab CHF 2'200",
    details: ["4-5 Umzugshelfer", "LKW 7.5t", "8-10 Stunden"]
  },
  {
    FloorPlan: FloorPlanOffice,
    title: "KMU-Büroumzug",
    subtitle: "ca. 100-200 m²",
    price: "ab CHF 2'800",
    details: ["4-6 Umzugshelfer", "LKW + Möbellift", "1-2 Tage"]
  }
];

export const PremiumCostExamples = () => {
  return (
    <section className="py-10 sm:py-14 md:py-20 bg-gradient-to-b from-muted/30 to-background relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 sm:px-6 relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
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
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-foreground mb-3 sm:mb-4">
            Was kostet ein Umzug?
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Transparente Preisübersicht für alle Wohnungsgrössen
          </p>
        </motion.div>
        
        {/* Carousel with visible arrows */}
        <div className="max-w-6xl mx-auto mb-8 sm:mb-12 relative px-8 sm:px-12 md:px-16">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {costExamples.map((example, index) => (
                <CarouselItem key={index} className="pl-2 md:pl-4 basis-[75%] xs:basis-[80%] sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className="h-full"
                  >
                    <Card className="h-full text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border bg-card overflow-hidden group">
                      <CardContent className="p-0 h-full flex flex-col">
                        {/* Floor Plan Visual */}
                        <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-5 flex items-center justify-center min-h-[120px]">
                          <div className="w-28 h-24 text-primary group-hover:scale-105 transition-transform duration-500">
                            <example.FloorPlan />
                          </div>
                        </div>
                        <div className="p-4 md:p-5 flex-1 flex flex-col">
                          <h3 className="text-base md:text-lg font-bold mb-0.5 text-foreground">
                            {example.title}
                          </h3>
                          <p className="text-xs text-muted-foreground mb-3">
                            {example.subtitle}
                          </p>
                          <p className="text-2xl md:text-3xl font-bold text-primary mb-4">
                            {example.price}
                          </p>
                          <ul className="space-y-1.5 text-left mt-auto">
                            {example.details.map((detail, i) => (
                              <li key={i} className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
                                <div className="w-1.5 h-1.5 rounded-full bg-primary/60 flex-shrink-0" />
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
            
            {/* Always visible arrow buttons */}
            <CarouselPrevious className="absolute -left-1 sm:-left-2 md:-left-4 top-1/2 -translate-y-1/2 h-9 w-9 sm:h-10 sm:w-10 md:h-12 md:w-12 border-2 border-primary/20 bg-background hover:bg-primary hover:text-primary-foreground hover:border-primary shadow-md active:scale-95 transition-transform" />
            <CarouselNext className="absolute -right-1 sm:-right-2 md:-right-4 top-1/2 -translate-y-1/2 h-9 w-9 sm:h-10 sm:w-10 md:h-12 md:w-12 border-2 border-primary/20 bg-background hover:bg-primary hover:text-primary-foreground hover:border-primary shadow-md active:scale-95 transition-transform" />
          </Carousel>
          
          {/* Swipe hint for mobile */}
          <p className="text-center text-xs text-muted-foreground mt-4 md:hidden flex items-center justify-center gap-1">
            <ChevronLeft className="h-3 w-3" />
            Wischen zum Durchblättern
            <ChevronRight className="h-3 w-3" />
          </p>
        </div>
        
        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mb-12"
        >
          <p className="text-sm md:text-base text-muted-foreground max-w-lg mx-auto italic">
            Richtwerte für lokale Umzüge. Exakte Preise mit Ihrer persönlichen Offerte.
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
