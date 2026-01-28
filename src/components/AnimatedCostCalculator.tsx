import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence, useSpring, useTransform } from 'framer-motion';
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
  CalendarDays,
  Building,
  Boxes,
  Wrench,
  Brush,
  TrendingUp,
  CheckCircle2,
  Phone
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface PriceBreakdown {
  base: number;
  distance: number;
  packing: number;
  extras: number;
  weekend: number;
  insurance: number;
}

// Animated number component
const AnimatedNumber = ({ value, prefix = '', suffix = '' }: { value: number; prefix?: string; suffix?: string }) => {
  const spring = useSpring(value, { stiffness: 100, damping: 30 });
  const display = useTransform(spring, (current) => Math.round(current).toLocaleString('de-CH'));
  
  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  return (
    <motion.span>
      {prefix}
      <motion.span>{display}</motion.span>
      {suffix}
    </motion.span>
  );
};

const AnimatedCostCalculator = () => {
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
  const [activeStep, setActiveStep] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  const priceBreakdown = useMemo((): PriceBreakdown => {
    const basePricePerRoom = 280;
    const base = rooms * basePricePerRoom;
    
    const pricePerKm = 3.5;
    const distancePrice = distance * pricePerKm;
    
    const packingPrice = packingService ? rooms * 120 : 0;
    
    let extras = 0;
    if (dismantleService) extras += rooms * 80;
    if (cleaningService) extras += rooms * 100;
    
    if (!hasElevator && floor > 1) {
      extras += (floor - 1) * 50;
    }
    
    const subtotal = base + distancePrice + packingPrice + extras;
    const weekendSurcharge = isWeekend ? subtotal * 0.15 : 0;
    const insurance = subtotal * 0.03;
    
    return { base, distance: distancePrice, packing: packingPrice, extras, weekend: weekendSurcharge, insurance };
  }, [rooms, distance, floor, hasElevator, packingService, dismantleService, cleaningService, isWeekend]);

  const totalPrice = useMemo(() => {
    return Object.values(priceBreakdown).reduce((sum, val) => sum + val, 0);
  }, [priceBreakdown]);

  const estimatedHours = useMemo(() => {
    const baseHours = rooms * 1.5;
    const distanceHours = distance / 40;
    const packingHours = packingService ? rooms * 0.5 : 0;
    return Math.round((baseHours + distanceHours + packingHours) * 10) / 10;
  }, [rooms, distance, packingService]);

  const teamSize = useMemo(() => {
    if (rooms <= 2) return 2;
    if (rooms <= 4) return 3;
    return 4;
  }, [rooms]);

  const services = [
    { id: 'packing', label: 'Ein- & Auspacken', checked: packingService, onChange: setPackingService, price: rooms * 120, icon: Boxes },
    { id: 'dismantle', label: 'Möbelmontage', checked: dismantleService, onChange: setDismantleService, price: rooms * 80, icon: Wrench },
    { id: 'cleaning', label: 'Endreinigung', checked: cleaningService, onChange: setCleaningService, price: rooms * 100, icon: Brush },
    { id: 'weekend', label: 'Wochenende', checked: isWeekend, onChange: setIsWeekend, price: null, icon: CalendarDays },
  ];

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-muted/30 via-background to-muted/20 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute -top-20 -right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div 
          className="absolute -bottom-20 -left-20 w-80 h-80 bg-alpine/5 rounded-full blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.5, 0.3, 0.5] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", delay: 0.2 }}
          >
            <Badge variant="secondary" className="mb-4 gap-2">
              <Calculator className="w-3 h-3" />
              Live-Kalkulation in Echtzeit
            </Badge>
          </motion.div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
            Sofort-Kostenrechner
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Erhalten Sie in Sekunden eine präzise Kostenschätzung für Ihren Umzug
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Configuration Panel */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-3"
            >
              <Card className="border-primary/10 shadow-xl backdrop-blur-sm bg-card/95">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Home className="w-5 h-5 text-primary" />
                    Umzugsdetails konfigurieren
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">
                  {/* Locations with animation */}
                  <motion.div 
                    className="grid sm:grid-cols-2 gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                  >
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-primary" />
                        Von
                      </Label>
                      <Input 
                        placeholder="z.B. Zürich" 
                        value={fromCity}
                        onChange={(e) => setFromCity(e.target.value)}
                        className="transition-all focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div className="space-y-2 relative">
                      <Label className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-alpine" />
                        Nach
                      </Label>
                      <Input 
                        placeholder="z.B. Basel" 
                        value={toCity}
                        onChange={(e) => setToCity(e.target.value)}
                        className="transition-all focus:ring-2 focus:ring-alpine/20"
                      />
                      {fromCity && toCity && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="absolute -right-2 -top-2"
                        >
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                        </motion.div>
                      )}
                    </div>
                  </motion.div>

                  {/* Animated Rooms Slider */}
                  <motion.div 
                    className="space-y-4"
                    whileHover={{ scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="flex justify-between items-center">
                      <Label className="flex items-center gap-2 text-base">
                        <Home className="w-4 h-4 text-primary" />
                        Anzahl Zimmer
                      </Label>
                      <motion.div
                        key={rooms}
                        initial={{ scale: 1.3, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring" }}
                      >
                        <Badge className="text-lg font-bold px-4 py-1 bg-primary/10 text-primary border-primary/20">
                          {rooms} Zimmer
                        </Badge>
                      </motion.div>
                    </div>
                    <div className="relative">
                      <Slider
                        value={[rooms]}
                        onValueChange={([value]) => setRooms(value)}
                        min={1}
                        max={8}
                        step={0.5}
                        className="py-2"
                      />
                      <div className="absolute -bottom-4 left-0 right-0 flex justify-between text-xs text-muted-foreground">
                        <span>1</span>
                        <span>8+</span>
                      </div>
                    </div>
                  </motion.div>

                  {/* Animated Distance Slider */}
                  <motion.div 
                    className="space-y-4 mt-8"
                    whileHover={{ scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="flex justify-between items-center">
                      <Label className="flex items-center gap-2 text-base">
                        <Truck className="w-4 h-4 text-alpine" />
                        Entfernung
                      </Label>
                      <motion.div
                        key={distance}
                        initial={{ scale: 1.3, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring" }}
                      >
                        <Badge className="text-lg font-bold px-4 py-1 bg-alpine/10 text-alpine border-alpine/20">
                          {distance} km
                        </Badge>
                      </motion.div>
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
                  </motion.div>

                  {/* Floor with Elevator Toggle */}
                  <motion.div 
                    className="space-y-4 p-4 rounded-xl bg-muted/30 border"
                    whileHover={{ scale: 1.01 }}
                  >
                    <div className="flex justify-between items-center">
                      <Label className="flex items-center gap-2">
                        <Building className="w-4 h-4 text-muted-foreground" />
                        Stockwerk
                      </Label>
                      <Badge variant="outline">{floor}. Stock</Badge>
                    </div>
                    <Slider
                      value={[floor]}
                      onValueChange={([value]) => setFloor(value)}
                      min={0}
                      max={10}
                      step={1}
                    />
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-3">
                        <Switch 
                          checked={hasElevator} 
                          onCheckedChange={setHasElevator}
                          id="elevator"
                        />
                        <Label htmlFor="elevator" className="text-sm cursor-pointer">
                          Lift vorhanden
                        </Label>
                      </div>
                      <AnimatePresence>
                        {!hasElevator && floor > 1 && (
                          <motion.span
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            className="text-xs text-amber-600"
                          >
                            +CHF {(floor - 1) * 50} Zuschlag
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>

                  {/* Animated Services Grid */}
                  <div className="space-y-4">
                    <Label className="flex items-center gap-2 text-base">
                      <Package className="w-4 h-4 text-primary" />
                      Zusatzleistungen
                    </Label>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {services.map((service, index) => (
                        <motion.div
                          key={service.id}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all cursor-pointer ${
                            service.checked 
                              ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10' 
                              : 'border-border hover:border-primary/50'
                          }`}
                          onClick={() => service.onChange(!service.checked)}
                        >
                          <div className="flex items-center gap-3">
                            <motion.div
                              animate={{ rotate: service.checked ? 360 : 0 }}
                              transition={{ type: "spring" }}
                            >
                              <Switch 
                                checked={service.checked} 
                                onCheckedChange={service.onChange}
                                id={service.id}
                              />
                            </motion.div>
                            <div className="flex items-center gap-2">
                              <service.icon className={`w-4 h-4 ${service.checked ? 'text-primary' : 'text-muted-foreground'}`} />
                              <Label htmlFor={service.id} className="text-sm cursor-pointer font-medium">
                                {service.label}
                              </Label>
                            </div>
                          </div>
                          {service.price && (
                            <motion.span 
                              className={`text-xs font-medium ${service.checked ? 'text-primary' : 'text-muted-foreground'}`}
                              animate={{ scale: service.checked ? [1, 1.2, 1] : 1 }}
                            >
                              +CHF {service.price}
                            </motion.span>
                          )}
                          {service.id === 'weekend' && (
                            <span className="text-xs text-amber-600 font-medium">+15%</span>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Animated Price Display */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="lg:col-span-2"
            >
              <Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-background to-alpine/5 sticky top-24 shadow-2xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    >
                      <Sparkles className="w-5 h-5 text-primary" />
                    </motion.div>
                    Ihre Schätzung
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Animated Total Price */}
                  <motion.div 
                    className="text-center p-8 bg-gradient-to-br from-primary/10 to-alpine/10 rounded-2xl relative overflow-hidden"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
                    <p className="text-sm text-muted-foreground mb-2">Geschätzte Kosten</p>
                    <motion.div
                      key={totalPrice}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="flex items-baseline justify-center gap-1"
                    >
                      <span className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary to-alpine bg-clip-text text-transparent">
                        CHF <AnimatedNumber value={Math.round(totalPrice)} />
                      </span>
                    </motion.div>
                    <p className="text-xs text-muted-foreground mt-3 flex items-center justify-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      ± 10% je nach Gegebenheiten
                    </p>
                  </motion.div>

                  {/* Animated Breakdown */}
                  <div className="space-y-2 text-sm">
                    {[
                      { label: `Grundpreis (${rooms} Zimmer)`, value: priceBreakdown.base, show: true },
                      { label: `Transport (${distance} km)`, value: Math.round(priceBreakdown.distance), show: true },
                      { label: 'Ein- & Auspacken', value: priceBreakdown.packing, show: priceBreakdown.packing > 0 },
                      { label: 'Zusatzleistungen', value: priceBreakdown.extras, show: priceBreakdown.extras > 0 },
                      { label: 'Wochenend-Zuschlag', value: Math.round(priceBreakdown.weekend), show: priceBreakdown.weekend > 0, isWarning: true },
                    ].map((item, index) => (
                      <AnimatePresence key={item.label}>
                        {item.show && (
                          <motion.div
                            initial={{ opacity: 0, x: -20, height: 0 }}
                            animate={{ opacity: 1, x: 0, height: 'auto' }}
                            exit={{ opacity: 0, x: -20, height: 0 }}
                            className={`flex justify-between py-2 px-2 rounded ${item.isWarning ? 'text-amber-600 bg-amber-50 dark:bg-amber-900/20' : ''}`}
                          >
                            <span className="text-muted-foreground">{item.label}</span>
                            <span className="font-medium">CHF {item.value}</span>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    ))}
                    <motion.div 
                      className="flex justify-between py-2 px-2 rounded text-green-600 bg-green-50 dark:bg-green-900/20"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <span className="flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" />
                        Versicherung inkl.
                      </span>
                      <span className="font-medium">CHF {Math.round(priceBreakdown.insurance)}</span>
                    </motion.div>
                  </div>

                  {/* Animated Info Cards */}
                  <div className="grid grid-cols-2 gap-3">
                    <motion.div 
                      className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl"
                      whileHover={{ scale: 1.05 }}
                    >
                      <Clock className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-medium text-sm">{estimatedHours}h</p>
                        <p className="text-xs text-muted-foreground">Dauer</p>
                      </div>
                    </motion.div>
                    <motion.div 
                      className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl"
                      whileHover={{ scale: 1.05 }}
                    >
                      <Users className="w-5 h-5 text-alpine" />
                      <div>
                        <p className="font-medium text-sm">{teamSize} Helfer</p>
                        <p className="text-xs text-muted-foreground">Team</p>
                      </div>
                    </motion.div>
                  </div>

                  {/* CTA Buttons */}
                  <div className="space-y-3 pt-4">
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button asChild className="w-full gap-2 h-12 text-base" size="lg">
                        <Link to="/contact">
                          Verbindliche Offerte
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button asChild variant="outline" className="w-full gap-2 h-11">
                        <Link to="/booking">
                          <CalendarDays className="w-4 h-4" />
                          Termin buchen
                        </Link>
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button variant="ghost" className="w-full gap-2" asChild>
                        <a href="tel:+41765681302">
                          <Phone className="w-4 h-4" />
                          Jetzt anrufen
                        </a>
                      </Button>
                    </motion.div>
                  </div>

                  <p className="text-xs text-center text-muted-foreground pt-2">
                    ✓ Kostenlos & unverbindlich • ✓ Antwort innert 2h
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AnimatedCostCalculator;
