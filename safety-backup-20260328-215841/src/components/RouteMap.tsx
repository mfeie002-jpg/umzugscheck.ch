import { useMemo } from "react";
import { MapPin, Navigation, Flag } from "lucide-react";
import { Card } from "@/components/ui/card";
import { swissCities, extractPLZ } from "./DistanceCalculator";

interface RouteMapProps {
  fromAddress: string;
  toAddress: string;
}

export default function RouteMap({ fromAddress, toAddress }: RouteMapProps) {
  const routeData = useMemo(() => {
    const fromPLZ = extractPLZ(fromAddress);
    const toPLZ = extractPLZ(toAddress);

    if (!fromPLZ || !toPLZ) return null;

    const fromCity = swissCities[fromPLZ];
    const toCity = swissCities[toPLZ];

    if (!fromCity || !toCity) return null;

    return { from: fromCity, to: toCity };
  }, [fromAddress, toAddress]);

  if (!routeData) return null;

  // Calculate SVG viewBox to fit both points
  const minLat = Math.min(routeData.from.lat, routeData.to.lat) - 0.2;
  const maxLat = Math.max(routeData.from.lat, routeData.to.lat) + 0.2;
  const minLng = Math.min(routeData.from.lng, routeData.to.lng) - 0.3;
  const maxLng = Math.max(routeData.from.lng, routeData.to.lng) + 0.3;

  // Transform coordinates to SVG space
  const transformX = (lng: number) => ((lng - minLng) / (maxLng - minLng)) * 100;
  const transformY = (lat: number) => 100 - ((lat - minLat) / (maxLat - minLat)) * 100;

  const fromX = transformX(routeData.from.lng);
  const fromY = transformY(routeData.from.lat);
  const toX = transformX(routeData.to.lng);
  const toY = transformY(routeData.to.lat);

  // Create a curved path between points
  const midX = (fromX + toX) / 2;
  const midY = Math.min(fromY, toY) - 15;
  const pathD = `M ${fromX} ${fromY} Q ${midX} ${midY} ${toX} ${toY}`;

  return (
    <Card className="p-4 overflow-hidden">
      <div className="flex items-center gap-2 mb-3">
        <Navigation className="h-5 w-5 text-alpine" />
        <span className="font-semibold text-sm">Umzugsroute</span>
      </div>
      
      <div className="relative bg-gradient-to-br from-muted/50 to-muted rounded-lg p-4 aspect-video">
        {/* Switzerland outline approximation */}
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Background grid */}
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.2" className="text-muted-foreground/20" />
            </pattern>
            <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(var(--alpine))" />
              <stop offset="100%" stopColor="hsl(var(--primary))" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          <rect width="100" height="100" fill="url(#grid)" />
          
          {/* Route line with animation */}
          <path
            d={pathD}
            fill="none"
            stroke="url(#routeGradient)"
            strokeWidth="2"
            strokeDasharray="4 2"
            strokeLinecap="round"
            filter="url(#glow)"
            className="animate-pulse"
          />
          
          {/* Animated dot along path */}
          <circle r="2" fill="hsl(var(--alpine))">
            <animateMotion dur="3s" repeatCount="indefinite" path={pathD} />
          </circle>
          
          {/* Start point */}
          <g transform={`translate(${fromX}, ${fromY})`}>
            <circle r="6" fill="hsl(var(--alpine))" className="animate-pulse" />
            <circle r="3" fill="white" />
          </g>
          
          {/* End point */}
          <g transform={`translate(${toX}, ${toY})`}>
            <circle r="6" fill="hsl(var(--primary))" className="animate-pulse" />
            <circle r="3" fill="white" />
          </g>
        </svg>

        {/* Legend */}
        <div className="absolute bottom-2 left-2 right-2 flex justify-between text-xs">
          <div className="flex items-center gap-1 bg-background/80 backdrop-blur-sm px-2 py-1 rounded">
            <div className="w-2 h-2 rounded-full bg-alpine" />
            <span className="font-medium">{routeData.from.name}</span>
          </div>
          <div className="flex items-center gap-1 bg-background/80 backdrop-blur-sm px-2 py-1 rounded">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <span className="font-medium">{routeData.to.name}</span>
          </div>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="h-4 w-4 text-alpine" />
          <span>Start: {routeData.from.name}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Flag className="h-4 w-4 text-primary" />
          <span>Ziel: {routeData.to.name}</span>
        </div>
      </div>
    </Card>
  );
}
