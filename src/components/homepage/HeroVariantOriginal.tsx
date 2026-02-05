/**
 * HeroVariantOriginal - "Original" Split Layout Hero
 * 
 * Based on the screenshot reference:
 * - Left: Headlines, USPs, CTAs ("Der beste Deal der ganzen Schweiz")
 * - Right: Form card with Von/Nach/Wohnungsgrösse
 * - Background: Emotional family image
 */

import { memo, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  ArrowRight, TrendingDown, Video, CheckCircle2, Shield, Clock, 
  Trophy, Check
} from 'lucide-react';
import heroFamilyMoving from '@/assets/hero-family-moving.jpg';
import { LiveActivityBadge } from '@/components/home/LiveActivityBadge';
import { useFlowPath } from '@/hooks/useUnifiedAB';
import { swissPostalCodes } from '@/lib/swiss-postal-codes';
import { HeroTrustBar } from './HeroTrustBar';
import { HeroTrustIntegration } from './HeroTrustIntegration';
import { PressTrustBar } from './PressTrustBar';
import { HeroTrustInline } from './HeroTrustInline';
import { KnownFromRow } from './KnownFromRow';
import { useSocialProofAB } from '@/contexts/SocialProofABContext';
import { HeroLiveCounter } from './HeroLiveCounter';
import { HeroLiveActivityLine } from './HeroLiveActivityLine';
import { HeroMicroProofRow } from './HeroMicroProofRow';

const APARTMENT_SIZES = [
  { value: '1', label: '1 Zimmer' },
  { value: '1.5', label: '1.5 Zimmer' },
  { value: '2', label: '2 Zimmer' },
  { value: '2.5', label: '2.5 Zimmer' },
  { value: '3', label: '3 Zimmer' },
  { value: '3.5', label: '3.5 Zimmer' },
  { value: '4', label: '4 Zimmer' },
  { value: '4.5', label: '4.5 Zimmer' },
  { value: '5', label: '5 Zimmer' },
  { value: '5.5+', label: '5.5+ Zimmer' },
];

export const HeroVariantOriginal = memo(function HeroVariantOriginal() {
  const navigate = useNavigate();
  const flowPath = useFlowPath();
  const { variant: spVariant } = useSocialProofAB();
  
  const [fromPostal, setFromPostal] = useState('');
  const [toPostal, setToPostal] = useState('');
  const [apartmentSize, setApartmentSize] = useState('');
  
  // Determine if we should show hero-integrated trust based on SP variant
  // New mapping: I-M are hero-integrated, N-Q are psychological
  const showHeroTrust = ['I', 'J', 'K', 'L', 'M', 'Q'].includes(spVariant);
  
  // V9 (I): Card CTA Trust - Trust directly at CTA decision point (was Z)
  const showKnownFrom = spVariant === 'I';
  
  // V10 (J): Press Trust Bar - Desktop rail + Mobile inline (was X)
  const showPressTrust = spVariant === 'J';
  
  // V11 (K): Glassmorphism Bar - Premium overlay at bottom (was W)
  const showGlassmorphism = spVariant === 'K';
  
  // V12 (L): Hero Left + Form - Desktop left under CTA + Mobile in form footer (was Y)
  const showTrustInline = spVariant === 'L';
  
  // V13 (M): Left Under CTA - Monochrome white logos (was U)
  const showLeftUnderCTA = spVariant === 'M';
  
  // V17 (Q): In-Form Container (was V)
  const showInFormContainer = spVariant === 'Q';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const prefillData = {
      from: fromPostal,
      to: toPostal,
      rooms: apartmentSize,
      source: 'homepage_original',
      timestamp: Date.now(),
    };
    try {
      localStorage.setItem('uc_prefill', JSON.stringify(prefillData));
    } catch {
      // Ignore storage errors
    }
    
    const params = new URLSearchParams();
    if (fromPostal) params.set('from', fromPostal);
    if (toPostal) params.set('to', toPostal);
    if (apartmentSize) params.set('rooms', apartmentSize);
    navigate(`${flowPath}?${params.toString()}`);
  };

  return (
    <section className="relative sm:min-h-[62vh] lg:min-h-[55vh] flex items-start sm:items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src={heroFamilyMoving}
          alt=""
          loading="eager"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        {/* Gradient overlays for readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/60 to-background/40" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background/60" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 pt-2 pb-3 sm:py-7 md:py-8 lg:py-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          
          {/* Left Column - Text & CTAs */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-5 md:space-y-6 order-2 lg:order-1 text-center lg:text-left max-w-2xl mx-auto lg:mx-0 lg:max-w-none"
          >
            {/* Dual USP Badges */}
            <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
              {/* Savings Badge - Primary Blue */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-3 px-4 py-2 bg-primary/10 rounded-2xl shadow-soft border border-primary/30"
              >
                <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary">
                  <TrendingDown className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-xs font-bold text-primary uppercase tracking-wide">Bis 40% sparen</p>
                  <p className="text-sm font-semibold text-foreground">durch Vergleich</p>
                </div>
              </motion.div>

              {/* KI Video Badge - Secondary Red */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="inline-flex items-center gap-3 px-4 py-2 bg-secondary/10 rounded-2xl shadow-soft border border-secondary/30"
              >
                <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-secondary">
                  <Video className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-xs font-bold text-secondary uppercase tracking-wide">Schweizer Innovation</p>
                  <p className="text-sm font-semibold text-foreground">KI Video-Rechner</p>
                </div>
              </motion.div>
            </div>
            
            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-center lg:text-left">
              <span className="text-foreground">Der beste Deal</span>
              <span className="block text-primary mt-1">der ganzen Schweiz.</span>
            </h1>
            
            {/* Subheadline */}
            <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-xl leading-relaxed text-center lg:text-left mx-auto lg:mx-0">
              Unser <span className="inline-flex items-center gap-1 text-secondary font-semibold"><Video className="h-4 w-4" />KI-Rechner</span> analysiert 
              Ihren Umzug per Video – wir vergleichen <span className="font-semibold text-foreground">200+ Firmen</span> und finden 
              das <span className="inline-flex items-center gap-1 text-primary font-semibold"><Trophy className="h-4 w-4" />beste Angebot</span>.
            </p>
            
            {/* USP Pills */}
            <div className="flex flex-wrap gap-2 pt-1 justify-center lg:justify-start">
              <span className="inline-flex items-center gap-1.5 text-xs bg-primary/10 text-primary px-3 py-1.5 rounded-full font-medium">
                <TrendingDown className="w-3 h-3" />
                Bis 40% günstiger
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs bg-secondary/10 text-secondary px-3 py-1.5 rounded-full font-medium">
                <Video className="w-3 h-3" />
                Video-Analyse
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs bg-primary/10 text-primary px-3 py-1.5 rounded-full font-medium">
                <CheckCircle2 className="w-3 h-3" />
                200+ Firmen
              </span>
            </div>
            
            {/* Live Activity Badge */}
            <div className="hidden sm:block">
              <LiveActivityBadge />
            </div>
            
            {/* Desktop CTAs */}
            <div className="hidden lg:flex items-center gap-4 pt-2">
              <Link to={flowPath}>
                <Button size="lg" className="h-14 px-8 text-lg font-semibold shadow-cta bg-secondary hover:bg-secondary/90">
                  <CheckCircle2 className="mr-2 h-5 w-5" />
                  Jetzt checken lassen
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/umzugsrechner">
                <Button size="lg" variant="outline" className="h-14 px-6 text-lg font-semibold border-2">
                  Kosten berechnen
                </Button>
              </Link>
            </div>
            
            {/* V13 (M): Left Under CTA - Monochrome WHITE logos */}
            {showLeftUnderCTA && (
              <HeroTrustIntegration variant="left-under-cta" />
            )}
            
            {/* V12 (L): Hero Left + Form - Desktop left under CTA */}
            {showTrustInline && (
              <div className="hidden lg:block">
                <HeroTrustInline variant="desktop-left" />
              </div>
            )}
            
            {/* V25 (Y): Best Practice - Desktop left under CTA */}
            {showTrustInline && (
              <div className="hidden lg:block">
                <HeroTrustInline variant="desktop-left" />
              </div>
            )}
          </motion.div>
          
          {/* Right Column - Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="order-1 lg:order-2"
          >
            {/* Form Card with primary border accent like 4-Tab Hero */}
            <div className="bg-card rounded-2xl shadow-xl border-2 border-primary/20 hover:border-primary/40 transition-colors p-4 md:p-6 relative ring-1 ring-primary/10">
              {/* Best Price Badge - positioned inside card with proper spacing */}
              <div className="flex justify-center mb-4">
                <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-secondary text-white text-xs font-bold rounded-full shadow-lg whitespace-nowrap">
                  <Trophy className="w-3.5 h-3.5" />
                  Bester Preis garantiert
                </span>
              </div>

              <div className="space-y-5">
                {/* Form Header */}
                <div className="text-center space-y-2">
                  <h2 className="text-xl md:text-2xl font-bold text-foreground">
                    200+ Firmen vergleichen
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Wir finden den günstigsten Anbieter für Sie
                  </p>
                  {/* Live Counter - Social Proof */}
                  <HeroLiveCounter baseValue={47} />
                  {/* Micro Proof Row - Rating + Online + Last Request */}
                  <HeroMicroProofRow className="pt-1" />
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* From */}
                  <div className="space-y-2">
                    <Label htmlFor="from-postal" className="text-sm font-medium flex items-center gap-1">
                      Von (PLZ oder Ort)
                      <span className="text-primary/60 text-xs">*</span>
                    </Label>
                    <Input
                      id="from-postal"
                      placeholder="z.B. 8001 oder Zürich"
                      value={fromPostal}
                      onChange={(e) => setFromPostal(e.target.value)}
                      className="h-12 border-2 border-muted/60 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                      required
                    />
                  </div>

                  {/* To */}
                  <div className="space-y-2">
                    <Label htmlFor="to-postal" className="text-sm font-medium flex items-center gap-1">
                      Nach (PLZ oder Ort)
                      <span className="text-primary/60 text-xs">*</span>
                    </Label>
                    <Input
                      id="to-postal"
                      placeholder="z.B. 3011 oder Bern"
                      value={toPostal}
                      onChange={(e) => setToPostal(e.target.value)}
                      className="h-12 border-2 border-muted/60 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                      required
                    />
                  </div>

                  {/* Apartment Size */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="apartment-size" className="text-sm font-medium flex items-center gap-1">
                        Wohnungsgrösse
                        <span className="text-primary/60 text-xs">*</span>
                      </Label>
                      <Link to="/umzugsrechner" className="text-xs text-primary hover:underline">
                        Rechner →
                      </Link>
                    </div>
                    <Select value={apartmentSize} onValueChange={setApartmentSize} required>
                      <SelectTrigger id="apartment-size" className="h-12 border-2 border-muted/60 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all">
                        <SelectValue placeholder="Wählen Sie..." />
                      </SelectTrigger>
                      <SelectContent>
                        {APARTMENT_SIZES.map((size) => (
                          <SelectItem key={size.value} value={size.value}>
                            {size.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Submit Button */}
                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full h-14 text-lg font-bold bg-secondary hover:bg-secondary/90"
                  >
                    <CheckCircle2 className="mr-2 h-5 w-5" />
                    Jetzt checken lassen
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  
                  {/* Live Activity Line - Shows rotating recent activity */}
                  <HeroLiveActivityLine className="mt-3" />
                  
                  {/* Trust integration: Always show KnownFrom below CTA (research-backed) */}
                  <KnownFromRow variant="below-cta" />
                </form>

                {/* Trust Badges */}
                <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground pt-1">
                  <span className="inline-flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 text-primary" />
                    Kostenlos
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 text-primary" />
                    Unverbindlich
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Shield className="w-3.5 h-3.5 text-secondary" />
                    Datenschutz
                  </span>
                </div>
                
                {/* V17 (Q): In-Form Container - Trust bar at bottom of form box */}
                {showInFormContainer && (
                  <HeroTrustIntegration variant="in-form-container" />
                )}
                
                {/* V10 (J): Press Trust Bar - Mobile inline */}
                {showPressTrust && (
                  <div className="lg:hidden">
                    <PressTrustBar variant="inline" />
                  </div>
                )}
                
                {/* V12 (L): Hero Left + Form - Mobile in form footer */}
                {showTrustInline && (
                  <div className="lg:hidden">
                    <HeroTrustInline variant="mobile-form" />
                  </div>
                )}
              </div>
            </div>
          </motion.div>
          
        </div>
        
        {/* V11 (K): Glassmorphism Bar - Premium overlay at bottom */}
        {showGlassmorphism && (
          <HeroTrustIntegration variant="glassmorphism-bar" />
        )}
        
        {/* V10 (J): Press Trust Bar - Desktop glassy rail */}
        {showPressTrust && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="hidden lg:block"
          >
            <PressTrustBar variant="rail" />
          </motion.div>
        )}
      </div>
    </section>
  );
});
