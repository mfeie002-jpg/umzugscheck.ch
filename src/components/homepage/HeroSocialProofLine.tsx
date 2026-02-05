/**
 * HeroSocialProofLine - Consolidated compact social proof line
 * Combines: Rating + Live Online Count + Rotating Route Ticker
 * 
 * Single line format: ★ 4.8/5 (15k+) · 🟢 47 online · Genf → Zug (3 Min)
 * 
 * Replaces HeroLiveCounter + HeroMicroProofRow with one compact component
 */

import { memo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Users, MapPin, Clock } from "lucide-react";
import { TRUST } from "@/content/trust";

interface HeroSocialProofLineProps {
  className?: string;
  baseOnlineCount?: number;
}

// Swiss routes for rotating ticker
const ROUTES = [
  { from: "Zürich", to: "Bern", minutesAgo: 3 },
  { from: "Basel", to: "Luzern", minutesAgo: 5 },
  { from: "Genf", to: "Lausanne", minutesAgo: 8 },
  { from: "Bern", to: "Zürich", minutesAgo: 2 },
  { from: "Luzern", to: "Zug", minutesAgo: 6 },
  { from: "Winterthur", to: "St. Gallen", minutesAgo: 4 },
];

// Green pulsing dot indicator
const PulseDot = memo(function PulseDot() {
  return (
    <span className="relative flex h-2 w-2 shrink-0">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
    </span>
  );
});

export const HeroSocialProofLine = memo(function HeroSocialProofLine({ 
  className = "",
  baseOnlineCount = 47
}: HeroSocialProofLineProps) {
  // Session-persistent online count
  const [onlineCount, setOnlineCount] = useState(() => {
    if (typeof window === 'undefined') return baseOnlineCount;
    const stored = sessionStorage.getItem('uc_social_proof_online');
    if (stored) return parseInt(stored, 10);
    // Generate initial count with small variation (-5 to +10)
    const variation = Math.floor(Math.random() * 16) - 5;
    return Math.max(25, baseOnlineCount + variation);
  });
  
  // Rotating route index
  const [routeIndex, setRouteIndex] = useState(0);
  const [showRoute, setShowRoute] = useState(true);
  
  // Initialize & update online count
  useEffect(() => {
    sessionStorage.setItem('uc_social_proof_online', onlineCount.toString());
    
    // Small drift every 25-40 seconds
    const interval = setInterval(() => {
      setOnlineCount(prev => {
        const drift = Math.floor(Math.random() * 5) - 2; // -2 to +2
        const newCount = Math.max(25, Math.min(85, prev + drift));
        sessionStorage.setItem('uc_social_proof_online', newCount.toString());
        return newCount;
      });
    }, 25000 + Math.random() * 15000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Rotate routes every 5 seconds with fade
  useEffect(() => {
    const interval = setInterval(() => {
      setShowRoute(false);
      setTimeout(() => {
        setRouteIndex(prev => (prev + 1) % ROUTES.length);
        setShowRoute(true);
      }, 250);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  const currentRoute = ROUTES[routeIndex];
  
  return (
    <div className={`flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-xs ${className}`}>
      {/* Rating - Always visible */}
      <span className="inline-flex items-center gap-1 text-muted-foreground">
        <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
        <span className="font-semibold text-foreground">{TRUST.ratingValue}/5</span>
        <span className="hidden xs:inline">({TRUST.movesCount})</span>
      </span>
      
      <span className="text-muted-foreground/40">·</span>
      
      {/* Online count with pulse */}
      <span className="inline-flex items-center gap-1.5 text-muted-foreground">
        <PulseDot />
        <Users className="w-3.5 h-3.5" />
        <AnimatePresence mode="wait">
          <motion.span
            key={onlineCount}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15 }}
            className="font-semibold text-foreground tabular-nums"
          >
            {onlineCount}
          </motion.span>
        </AnimatePresence>
        <span>online</span>
      </span>
      
      {/* Route ticker - Hidden on very small screens */}
      <span className="hidden sm:inline text-muted-foreground/40">·</span>
      
      <motion.span 
        className="hidden sm:inline-flex items-center gap-1 text-muted-foreground"
        animate={{ opacity: showRoute ? 1 : 0 }}
        transition={{ duration: 0.25 }}
      >
        <MapPin className="w-3.5 h-3.5" />
        <span className="font-medium text-foreground">
          {currentRoute.from} → {currentRoute.to}
        </span>
        <Clock className="w-3 h-3" />
        <span>({currentRoute.minutesAgo} Min)</span>
      </motion.span>
    </div>
  );
});

export default HeroSocialProofLine;
