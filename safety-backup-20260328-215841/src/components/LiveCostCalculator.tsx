import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Calculator, 
  Home, 
  Truck, 
  Package, 
  Users, 
  Clock, 
  MapPin,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  CalendarDays
} from 'lucide-react';
import { Link } from 'react-router-dom';
import AnimatedSection from '@/components/AnimatedSection';

interface PriceBreakdown {
  base: number;
  distance: number;
  packing: number;
  extras: number;
  weekend: number;
  insurance: number;
}

const LiveCostCalculator = () => {
  const [rooms, setRooms] = useState(3);
  const [distance, setDistance] = useState(25);
  const [floor, setFloor] = useState(2);
  const [hasElevator, setHasElevator] = useState(true);
  const [packingService, setPackingService] = useState(false);
  const [dismantleService, setDismantleService] = useState(false);
  const [cleaningService, setCleaningService] = useState(false);
  const [isWeekend, setIsWeekend] = useState(false);
  const [fromCity, setFromCity] = useState('');
  const [toCity, setToCity] = useState('');

  const priceBreakdown = useMemo((): PriceBreakdown => {
    // Base price per room
    const basePricePerRoom = 280;
    const base = rooms * basePricePerRoom;
    
    // Distance pricing (CHF per km)
    const pricePerKm = 3.5;
    const distancePrice = distance * pricePerKm;
    
    // Packing service
    const packingPrice = packingService ? rooms * 120 : 0;
    
    // Extra services
    let extras = 0;
    if (dismantleService) extras += rooms * 80;
    if (cleaningService) extras += rooms * 100;
    
    // Floor surcharge (only if no elevator)
    if (!hasElevator && floor > 1) {
      extras += (floor - 1) * 50;
    }
    
    // Weekend surcharge (15%)
    const subtotal = base + distancePrice + packingPrice + extras;
    const weekendSurcharge = isWeekend ? subtotal * 0.15 : 0;
    
    // Insurance (included in price, shown as value)
    const insurance = subtotal * 0.03;
    
    return {
      base,
      distance: distancePrice,
      packing: packingPrice,
      extras,
      weekend: weekendSurcharge,
      insurance
    };
  }, [rooms, distance, floor, hasElevator, packingService, dismantleService, cleaningService, isWeekend]);

  const totalPrice = useMemo(() => {
    return Object.values(priceBreakdown).reduce((sum, val) => sum + val, 0);
  }, [priceBreakdown]);

  const estimatedHours = useMemo(() => {
    const baseHours = rooms * 1.5;
    const distanceHours = distance / 40; // Average 40km/h including loading
    const packingHours = packingService ? rooms * 0.5 : 0;
    return Math.round((baseHours + distanceHours + packingHours) * 10) / 10;
  }, [rooms, distance, packingService]);

  return (
    <AnimatedSection>
      <section className="py-16 md:py-24 bg-gradient-to-b from-muted/30 to-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge variant="secondary" className="mb-4">
              <Calculator className="w-3 h-3 mr-1" />
              Live-Kalkulation
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Sofort-Kostenrechner
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Erhalten Sie in Sekunden eine präzise Kostenschätzung für Ihren Umzug
            </p>
          </motion.div>

          <div className="max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-5 gap-8">
              {/* Configuration Panel */}
              <Card className="lg:col-span-3 border-primary/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Home className="w-5 h-5 text-primary" />
                    Umzugsdetails
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">
                  {/* Locations */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        Von
                      </Label>
                      <Input 
                        placeholder="z.B. Zürich" 
                        value={fromCity}
                        onChange={(e) => setFromCity(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        Nach
                      </Label>
                      <Input 
                        placeholder="z.B. Basel" 
                        value={toCity}
                        onChange={(e) => setToCity(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Rooms Slider */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Label className="flex items-center gap-2">
                        <Home className="w-4 h-4 text-muted-foreground" />
                        Anzahl Zimmer
                      </Label>
                      <Badge variant="outline" className="text-lg font-bold px-3">
                        {rooms} Zimmer
                      </Badge>
                    </div>
                    <Slider
                      value={[rooms]}
                      onValueChange={([value]) => setRooms(value)}
                      min={1}
                      max={8}
                      step={0.5}
                      className="py-2"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>1</span>
                      <span>8+</span>
                    </div>
                  </div>

                  {/* Distance Slider */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Label className="flex items-center gap-2">
                        <Truck className="w-4 h-4 text-muted-foreground" />
                        Entfernung
                      </Label>
                      <Badge variant="outline" className="text-lg font-bold px-3">
                        {distance} km
                      </Badge>
                    </div>
                    <Slider
                      value={[distance]}
                      onValueChange={([value]) => setDistance(value)}
                      min={5}
                      max={200}
                      step={5}
                      className="py-2"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>5 km</span>
                      <span>200+ km</span>
                    </div>
                  </div>

                  {/* Floor Slider */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Label>Stockwerk</Label>
                      <Badge variant="outline">{floor}. Stock</Badge>
                    </div>
                    <Slider
                      value={[floor]}
                      onValueChange={([value]) => setFloor(value)}
                      min={0}
                      max={10}
                      step={1}
                    />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Switch 
                          checked={hasElevator} 
                          onCheckedChange={setHasElevator}
                          id="elevator"
                        />
                        <Label htmlFor="elevator" className="text-sm">Lift vorhanden</Label>
                      </div>
                    </div>
                  </div>

                  {/* Services */}
                  <div className="space-y-4">
                    <Label className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-muted-foreground" />
                      Zusatzleistungen
                    </Label>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {[
                        { id: 'packing', label: 'Ein- & Auspacken', checked: packingService, onChange: setPackingService, price: rooms * 120 },
                        { id: 'dismantle', label: 'Möbelmontage', checked: dismantleService, onChange: setDismantleService, price: rooms * 80 },
                        { id: 'cleaning', label: 'Endreinigung', checked: cleaningService, onChange: setCleaningService, price: rooms * 100 },
                        { id: 'weekend', label: 'Wochenende (+15%)', checked: isWeekend, onChange: setIsWeekend, price: null },
                      ].map((service) => (
                        <div 
                          key={service.id}
                          className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                            service.checked ? 'border-primary bg-primary/5' : 'border-border'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <Switch 
                              checked={service.checked} 
                              onCheckedChange={service.onChange}
                              id={service.id}
                            />
                            <Label htmlFor={service.id} className="text-sm cursor-pointer">
                              {service.label}
                            </Label>
                          </div>
                          {service.price && (
                            <span className="text-xs text-muted-foreground">
                              +CHF {service.price}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Price Display */}
              <Card className="lg:col-span-2 border-primary/20 bg-gradient-to-br from-primary/5 to-background sticky top-24 h-fit">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    Ihre Schätzung
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Total Price */}
                  <div className="text-center p-6 bg-primary/10 rounded-2xl">
                    <p className="text-sm text-muted-foreground mb-2">Geschätzte Kosten</p>
                    <motion.div
                      key={totalPrice}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="flex items-baseline justify-center gap-1"
                    >
                      <span className="text-4xl md:text-5xl font-bold text-primary">
                        CHF {Math.round(totalPrice).toLocaleString()}
                      </span>
                    </motion.div>
                    <p className="text-xs text-muted-foreground mt-2">
                      ± 10% je nach Gegebenheiten
                    </p>
                  </div>

                  {/* Breakdown */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between py-1">
                      <span className="text-muted-foreground">Grundpreis ({rooms} Zimmer)</span>
                      <span>CHF {priceBreakdown.base}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-muted-foreground">Transport ({distance} km)</span>
                      <span>CHF {Math.round(priceBreakdown.distance)}</span>
                    </div>
                    {priceBreakdown.packing > 0 && (
                      <div className="flex justify-between py-1">
                        <span className="text-muted-foreground">Ein- & Auspacken</span>
                        <span>CHF {priceBreakdown.packing}</span>
                      </div>
                    )}
                    {priceBreakdown.extras > 0 && (
                      <div className="flex justify-between py-1">
                        <span className="text-muted-foreground">Zusatzleistungen</span>
                        <span>CHF {priceBreakdown.extras}</span>
                      </div>
                    )}
                    {priceBreakdown.weekend > 0 && (
                      <div className="flex justify-between py-1 text-warning">
                        <span>Wochenend-Zuschlag</span>
                        <span>+CHF {Math.round(priceBreakdown.weekend)}</span>
                      </div>
                    )}
                    <div className="flex justify-between py-1 text-green-600">
                      <span className="flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" />
                        Versicherung inkl.
                      </span>
                      <span>CHF {Math.round(priceBreakdown.insurance)}</span>
                    </div>
                  </div>

                  {/* Time Estimate */}
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <Clock className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium">Geschätzte Dauer</p>
                      <p className="text-sm text-muted-foreground">{estimatedHours} Stunden</p>
                    </div>
                  </div>

                  {/* Team Size */}
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <Users className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium">Team-Größe</p>
                      <p className="text-sm text-muted-foreground">
                        {rooms <= 2 ? '2' : rooms <= 4 ? '3' : '4+'} erfahrene Umzugshelfer
                      </p>
                    </div>
                  </div>

                  {/* CTA Buttons */}
                  <div className="space-y-3 pt-4">
                    <Button asChild className="w-full gap-2" size="lg">
                      <Link to="/contact">
                        Verbindliche Offerte
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full gap-2">
                      <Link to="/booking">
                        <CalendarDays className="w-4 h-4" />
                        Termin buchen
                      </Link>
                    </Button>
                  </div>

                  <p className="text-xs text-center text-muted-foreground">
                    Kostenlos & unverbindlich • Antwort innert 2h
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </AnimatedSection>
  );
};

export default LiveCostCalculator;
