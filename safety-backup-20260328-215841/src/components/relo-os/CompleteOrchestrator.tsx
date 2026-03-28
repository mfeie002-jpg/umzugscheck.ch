/**
 * Complete Orchestrator Component
 * 
 * Phase 6: Swiss Standard Handover Protocol orchestration with:
 * - Room-by-room documentation
 * - Digital signature capture
 * - Escrow release trigger
 * - Completion confirmation
 */

import { useState, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  ClipboardCheck,
  Camera,
  PenTool,
  CheckCircle2,
  Award,
  FileCheck,
  Download,
  Share2,
  AlertCircle,
  ChevronRight,
  Sparkles,
  CreditCard,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import { HandoverProtocol, HandoverRoom, HandoverCategory } from './HandoverProtocol';
import { DigitalSignaturePad } from './DigitalSignaturePad';
import { releaseEscrowFunds } from '@/lib/escrow-service';
import { MoveProject } from '@/lib/move-project';
import { toast } from 'sonner';

type CompleteStep = 'checklist' | 'rooms' | 'signatures' | 'escrow' | 'complete';

interface CompleteOrchestratorProps {
  project: MoveProject;
  escrowId?: string;
  propertyAddress: string;
  tenantName: string;
  landlordName?: string;
  onComplete?: () => void;
  className?: string;
}

// Default rooms for Swiss apartment
const DEFAULT_ROOMS: HandoverRoom[] = [
  { id: 'entrance', name: 'Eingang/Flur', type: 'other', status: 'pending', photos: [], notes: '', checklistItems: [] },
  { id: 'living', name: 'Wohnzimmer', type: 'room', status: 'pending', photos: [], notes: '', checklistItems: [] },
  { id: 'bedroom1', name: 'Schlafzimmer 1', type: 'room', status: 'pending', photos: [], notes: '', checklistItems: [] },
  { id: 'bedroom2', name: 'Schlafzimmer 2', type: 'room', status: 'pending', photos: [], notes: '', checklistItems: [] },
  { id: 'kitchen', name: 'Küche', type: 'kitchen', status: 'pending', photos: [], notes: '', checklistItems: [] },
  { id: 'bathroom', name: 'Bad/WC', type: 'bathroom', status: 'pending', photos: [], notes: '', checklistItems: [] },
  { id: 'balcony', name: 'Balkon/Terrasse', type: 'balcony', status: 'pending', photos: [], notes: '', checklistItems: [] },
  { id: 'storage', name: 'Keller/Reduit', type: 'storage', status: 'pending', photos: [], notes: '', checklistItems: [] },
];

// Swiss standard categories
const DEFAULT_CATEGORIES: HandoverCategory[] = [
  {
    id: 'cleaning',
    name: 'Reinigung',
    icon: ClipboardCheck,
    status: 'pending',
    items: [
      { id: 'c1', label: 'Böden gereinigt (inkl. Fugen)', checked: false, required: true },
      { id: 'c2', label: 'Fenster gereinigt (innen & aussen)', checked: false, required: true },
      { id: 'c3', label: 'Küche entfettet (Abzug, Herd, Backofen)', checked: false, required: true },
      { id: 'c4', label: 'Badezimmer desinfiziert (Fugen, Armaturen)', checked: false, required: true },
      { id: 'c5', label: 'Schränke innen gereinigt', checked: false, required: false },
      { id: 'c6', label: 'Storen/Jalousien gereinigt', checked: false, required: false },
    ],
  },
  {
    id: 'keys',
    name: 'Schlüssel',
    icon: ClipboardCheck,
    status: 'pending',
    items: [
      { id: 'k1', label: 'Wohnungsschlüssel übergeben (Anzahl: ___)', checked: false, required: true },
      { id: 'k2', label: 'Briefkastenschlüssel übergeben', checked: false, required: true },
      { id: 'k3', label: 'Kellerschlüssel übergeben', checked: false, required: false },
      { id: 'k4', label: 'Garagenschlüssel/Badge übergeben', checked: false, required: false },
      { id: 'k5', label: 'Waschküchenschlüssel übergeben', checked: false, required: false },
    ],
  },
  {
    id: 'utilities',
    name: 'Zähler & Anschlüsse',
    icon: ClipboardCheck,
    status: 'pending',
    items: [
      { id: 'u1', label: 'Stromzählerstand notiert', checked: false, required: true },
      { id: 'u2', label: 'Wasserzählerstand notiert (falls vorhanden)', checked: false, required: false },
      { id: 'u3', label: 'Heizungszählerstand notiert', checked: false, required: false },
      { id: 'u4', label: 'Serafe abgemeldet / umgemeldet', checked: false, required: false },
      { id: 'u5', label: 'Internet/Swisscom abgemeldet', checked: false, required: false },
    ],
  },
  {
    id: 'condition',
    name: 'Zustand & Mängel',
    icon: ClipboardCheck,
    status: 'pending',
    items: [
      { id: 'r1', label: 'Wände ohne Schäden (Dübellöcher gefüllt)', checked: false, required: true },
      { id: 'r2', label: 'Böden ohne Beschädigungen', checked: false, required: true },
      { id: 'r3', label: 'Fenster/Türen funktionsfähig', checked: false, required: true },
      { id: 'r4', label: 'Sanitäranlagen funktionsfähig', checked: false, required: true },
      { id: 'r5', label: 'Elektrogeräte funktionsfähig', checked: false, required: false },
      { id: 'r6', label: 'Keine Schimmelflecken', checked: false, required: true },
    ],
  },
];

export const CompleteOrchestrator = memo(function CompleteOrchestrator({
  project,
  escrowId,
  propertyAddress,
  tenantName,
  landlordName = 'Vermieter',
  onComplete,
  className,
}: CompleteOrchestratorProps) {
  const [step, setStep] = useState<CompleteStep>('checklist');
  const [rooms, setRooms] = useState<HandoverRoom[]>(DEFAULT_ROOMS);
  const [categories, setCategories] = useState<HandoverCategory[]>(DEFAULT_CATEGORIES);
  const [signatures, setSignatures] = useState<{
    tenant?: string;
    landlord?: string;
    provider?: string;
  }>({});
  const [showSignaturePad, setShowSignaturePad] = useState<'tenant' | 'landlord' | null>(null);
  const [isReleasing, setIsReleasing] = useState(false);
  const [escrowReleased, setEscrowReleased] = useState(false);
  
  // Calculate progress
  const totalItems = categories.reduce((sum, cat) => sum + cat.items.length, 0);
  const checkedItems = categories.reduce((sum, cat) => sum + cat.items.filter(i => i.checked).length, 0);
  const checklistProgress = totalItems > 0 ? (checkedItems / totalItems) * 100 : 0;
  
  const roomsWithPhotos = rooms.filter(r => r.photos.length > 0 || r.status === 'approved').length;
  const roomsProgress = (roomsWithPhotos / rooms.length) * 100;
  
  const allRequiredComplete = categories.every(cat =>
    cat.items.filter(i => i.required).every(i => i.checked)
  );
  
  const allSigned = !!signatures.tenant && !!signatures.landlord;
  
  // Update category item
  const handleUpdateCategory = useCallback((categoryId: string, itemId: string, checked: boolean) => {
    setCategories(prev => prev.map(cat => {
      if (cat.id !== categoryId) return cat;
      
      const updatedItems = cat.items.map(item =>
        item.id === itemId ? { ...item, checked } : item
      );
      
      const allChecked = updatedItems.every(i => i.checked);
      const hasIssues = updatedItems.some(i => i.required && !i.checked);
      
      return {
        ...cat,
        items: updatedItems,
        status: allChecked ? 'approved' : hasIssues ? 'issues' : 'pending',
      };
    }));
  }, []);
  
  // Update room
  const handleUpdateRoom = useCallback((roomId: string, updates: Partial<HandoverRoom>) => {
    setRooms(prev => prev.map(room =>
      room.id === roomId ? { ...room, ...updates } : room
    ));
  }, []);
  
  // Simulate photo capture
  const handleCapturePhoto = useCallback((roomId: string) => {
    // In production: open camera API
    const demoPhotoUrl = `https://picsum.photos/seed/${roomId}-${Date.now()}/400/300`;
    
    setRooms(prev => prev.map(room => {
      if (room.id !== roomId) return room;
      return {
        ...room,
        photos: [...room.photos, demoPhotoUrl],
        status: 'in_progress',
      };
    }));
    
    toast.success('Foto aufgenommen');
  }, []);
  
  // Approve room
  const handleApproveRoom = useCallback((roomId: string) => {
    setRooms(prev => prev.map(room =>
      room.id === roomId ? { ...room, status: 'approved' } : room
    ));
  }, []);
  
  // Handle signature
  const handleSign = useCallback((party: 'tenant' | 'landlord', signatureData: string) => {
    setSignatures(prev => ({ ...prev, [party]: signatureData }));
    setShowSignaturePad(null);
    toast.success(`${party === 'tenant' ? 'Mieter' : 'Vermieter'} hat unterschrieben`);
    
    // Auto-advance if both signed
    if ((party === 'tenant' && signatures.landlord) || (party === 'landlord' && signatures.tenant)) {
      setStep('escrow');
    }
  }, [signatures]);
  
  // Release escrow
  const handleReleaseEscrow = useCallback(async () => {
    if (!escrowId) {
      // Demo mode: simulate release
      setIsReleasing(true);
      await new Promise(r => setTimeout(r, 2000));
      setIsReleasing(false);
      setEscrowReleased(true);
      setStep('complete');
      toast.success('Escrow-Zahlung freigegeben!');
      return;
    }
    
    try {
      setIsReleasing(true);
      await releaseEscrowFunds(escrowId);
      setEscrowReleased(true);
      setStep('complete');
      toast.success('Zahlung an Anbieter freigegeben!');
    } catch (err: any) {
      toast.error(`Fehler: ${err.message}`);
    } finally {
      setIsReleasing(false);
    }
  }, [escrowId]);
  
  // Generate PDF
  const handleDownloadProtocol = useCallback(() => {
    toast.info('PDF-Export wird vorbereitet...');
    // In production: generate actual PDF
  }, []);
  
  // Share completion
  const handleShare = useCallback(async () => {
    const shareData = {
      title: 'Umzug abgeschlossen!',
      text: `Der Umzug nach ${propertyAddress} wurde erfolgreich abgeschlossen.`,
      url: window.location.href,
    };
    
    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      await navigator.clipboard.writeText(shareData.url);
      toast.success('Link kopiert!');
    }
  }, [propertyAddress]);
  
  // Step navigation
  const steps: { id: CompleteStep; label: string; icon: typeof Home }[] = [
    { id: 'checklist', label: 'Checkliste', icon: ClipboardCheck },
    { id: 'rooms', label: 'Räume', icon: Camera },
    { id: 'signatures', label: 'Signaturen', icon: PenTool },
    { id: 'escrow', label: 'Zahlung', icon: CreditCard },
    { id: 'complete', label: 'Fertig', icon: Award },
  ];
  
  const currentStepIndex = steps.findIndex(s => s.id === step);
  const overallProgress = ((currentStepIndex + 1) / steps.length) * 100;
  
  return (
    <div className={cn('space-y-4', className)}>
      {/* Signature Modal */}
      <AnimatePresence>
        {showSignaturePad && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="w-full max-w-md"
            >
              <DigitalSignaturePad
                documentType="handover_protocol"
                signerName={showSignaturePad === 'tenant' ? tenantName : landlordName}
                signerRole={showSignaturePad === 'tenant' ? 'customer' : 'provider'}
                documentSummary={`Übergabeprotokoll für ${propertyAddress}`}
                onSign={(data) => handleSign(showSignaturePad, data)}
                onCancel={() => setShowSignaturePad(null)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Main Card */}
      <Card>
        <CardHeader className="pb-3 bg-gradient-to-r from-emerald-500/10 to-primary/10">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Home className="h-5 w-5 text-primary" />
              Phase 6: Übergabe
            </CardTitle>
            <Badge className={step === 'complete' ? 'bg-emerald-500' : 'bg-primary'}>
              {steps.find(s => s.id === step)?.label}
            </Badge>
          </div>
          
          {/* Step Progress */}
          <div className="flex items-center gap-1 mt-3">
            {steps.map((s, idx) => {
              const Icon = s.icon;
              const isActive = s.id === step;
              const isComplete = idx < currentStepIndex;
              
              return (
                <div
                  key={s.id}
                  className={cn(
                    'flex-1 flex flex-col items-center gap-1 cursor-pointer transition-colors',
                    isActive && 'text-primary',
                    isComplete && 'text-emerald-600',
                    !isActive && !isComplete && 'text-muted-foreground'
                  )}
                  onClick={() => idx <= currentStepIndex && setStep(s.id)}
                >
                  <Icon className={cn('h-4 w-4', isActive && 'animate-pulse')} />
                  <div
                    className={cn(
                      'h-1 w-full rounded',
                      isComplete && 'bg-emerald-500',
                      isActive && 'bg-primary',
                      !isActive && !isComplete && 'bg-muted'
                    )}
                  />
                </div>
              );
            })}
          </div>
        </CardHeader>
        
        <CardContent className="pt-4">
          <AnimatePresence mode="wait">
            {/* Step 1: Checklist */}
            {step === 'checklist' && (
              <motion.div
                key="checklist"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Übergabe-Checkliste</h3>
                  <span className="text-sm text-muted-foreground">
                    {checkedItems}/{totalItems} erledigt
                  </span>
                </div>
                
                <Progress value={checklistProgress} className="h-2" />
                
                <div className="space-y-2">
                  {categories.map((category) => (
                    <div key={category.id} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm">{category.name}</span>
                        <Badge variant={
                          category.status === 'approved' ? 'default' :
                          category.status === 'issues' ? 'destructive' : 'outline'
                        }>
                          {category.items.filter(i => i.checked).length}/{category.items.length}
                        </Badge>
                      </div>
                      
                      <div className="space-y-1">
                        {category.items.map((item) => (
                          <label
                            key={item.id}
                            className={cn(
                              'flex items-center gap-2 text-sm p-1 rounded cursor-pointer hover:bg-muted/50',
                              item.checked && 'text-emerald-700 line-through'
                            )}
                          >
                            <input
                              type="checkbox"
                              checked={item.checked}
                              onChange={(e) => handleUpdateCategory(category.id, item.id, e.target.checked)}
                              className="w-4 h-4"
                            />
                            {item.label}
                            {item.required && !item.checked && (
                              <Badge variant="outline" className="text-[10px] text-red-500">Pflicht</Badge>
                            )}
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                
                <Button
                  className="w-full"
                  onClick={() => setStep('rooms')}
                  disabled={!allRequiredComplete}
                >
                  Weiter zu Räumen
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </motion.div>
            )}
            
            {/* Step 2: Room Documentation */}
            {step === 'rooms' && (
              <motion.div
                key="rooms"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Raumdokumentation</h3>
                  <span className="text-sm text-muted-foreground">
                    {roomsWithPhotos}/{rooms.length} dokumentiert
                  </span>
                </div>
                
                <Progress value={roomsProgress} className="h-2" />
                
                <div className="grid grid-cols-2 gap-2">
                  {rooms.map((room) => (
                    <div
                      key={room.id}
                      className={cn(
                        'border rounded-lg p-3 transition-colors',
                        room.status === 'approved' && 'border-emerald-500 bg-emerald-500/5',
                        room.status === 'in_progress' && 'border-blue-500 bg-blue-500/5'
                      )}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm">{room.name}</span>
                        {room.status === 'approved' && (
                          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        )}
                      </div>
                      
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                        <Camera className="h-3 w-3" />
                        {room.photos.length} Fotos
                      </div>
                      
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 text-xs"
                          onClick={() => handleCapturePhoto(room.id)}
                        >
                          <Camera className="h-3 w-3 mr-1" />
                          Foto
                        </Button>
                        {room.photos.length > 0 && room.status !== 'approved' && (
                          <Button
                            size="sm"
                            variant="default"
                            className="flex-1 text-xs"
                            onClick={() => handleApproveRoom(room.id)}
                          >
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            OK
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                <Button
                  className="w-full"
                  onClick={() => setStep('signatures')}
                >
                  Weiter zu Signaturen
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </motion.div>
            )}
            
            {/* Step 3: Signatures */}
            {step === 'signatures' && (
              <motion.div
                key="signatures"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <h3 className="font-medium">Digitale Unterschriften</h3>
                
                <Alert className="border-primary/20 bg-primary/5">
                  <FileCheck className="h-4 w-4 text-primary" />
                  <AlertTitle>Rechtlich bindend</AlertTitle>
                  <AlertDescription>
                    Digitale Signaturen sind gemäss OR Art. 14 rechtsgültig.
                  </AlertDescription>
                </Alert>
                
                <div className="grid grid-cols-2 gap-4">
                  {/* Tenant Signature */}
                  <div
                    className={cn(
                      'p-4 border-2 border-dashed rounded-lg text-center',
                      signatures.tenant ? 'border-emerald-500 bg-emerald-500/10' : 'border-muted'
                    )}
                  >
                    {signatures.tenant ? (
                      <>
                        <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
                        <p className="font-medium text-emerald-700">Mieter signiert</p>
                        <p className="text-xs text-muted-foreground">{tenantName}</p>
                      </>
                    ) : (
                      <>
                        <PenTool className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                        <Button
                          onClick={() => setShowSignaturePad('tenant')}
                          disabled={!allRequiredComplete}
                        >
                          Mieter unterschreiben
                        </Button>
                      </>
                    )}
                  </div>
                  
                  {/* Landlord Signature */}
                  <div
                    className={cn(
                      'p-4 border-2 border-dashed rounded-lg text-center',
                      signatures.landlord ? 'border-emerald-500 bg-emerald-500/10' : 'border-muted'
                    )}
                  >
                    {signatures.landlord ? (
                      <>
                        <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
                        <p className="font-medium text-emerald-700">Vermieter signiert</p>
                        <p className="text-xs text-muted-foreground">{landlordName}</p>
                      </>
                    ) : (
                      <>
                        <PenTool className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                        <Button
                          onClick={() => setShowSignaturePad('landlord')}
                          disabled={!signatures.tenant}
                        >
                          Vermieter unterschreiben
                        </Button>
                      </>
                    )}
                  </div>
                </div>
                
                {allSigned && (
                  <Button
                    className="w-full bg-emerald-600 hover:bg-emerald-700"
                    onClick={() => setStep('escrow')}
                  >
                    Weiter zur Zahlung
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                )}
              </motion.div>
            )}
            
            {/* Step 4: Escrow Release */}
            {step === 'escrow' && (
              <motion.div
                key="escrow"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <h3 className="font-medium">Escrow-Zahlung freigeben</h3>
                
                <Alert className="border-emerald-500/30 bg-emerald-500/5">
                  <CreditCard className="h-4 w-4 text-emerald-600" />
                  <AlertTitle>Sichere Abwicklung</AlertTitle>
                  <AlertDescription>
                    Die Zahlung wird nach Ihrer Bestätigung an den Umzugsanbieter freigegeben.
                  </AlertDescription>
                </Alert>
                
                <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Objekt</span>
                    <span className="font-medium">{propertyAddress}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Mieter</span>
                    <span className="font-medium">{tenantName}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Status</span>
                    <Badge className="bg-emerald-500">Vollständig unterschrieben</Badge>
                  </div>
                </div>
                
                <Button
                  size="lg"
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                  onClick={handleReleaseEscrow}
                  disabled={isReleasing}
                >
                  {isReleasing ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1 }}
                        className="mr-2"
                      >
                        <CreditCard className="h-4 w-4" />
                      </motion.div>
                      Zahlung wird freigegeben...
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-4 w-4 mr-2" />
                      Zahlung freigeben & Abschliessen
                    </>
                  )}
                </Button>
              </motion.div>
            )}
            
            {/* Step 5: Complete */}
            {step === 'complete' && (
              <motion.div
                key="complete"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-4 py-6"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.2 }}
                >
                  <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto">
                    <Award className="h-10 w-10 text-emerald-600" />
                  </div>
                </motion.div>
                
                <div>
                  <h3 className="text-xl font-bold text-emerald-700 dark:text-emerald-400">
                    Umzug abgeschlossen!
                  </h3>
                  <p className="text-muted-foreground">
                    Herzlichen Glückwunsch zum neuen Zuhause! 🎉
                  </p>
                </div>
                
                <div className="flex items-center justify-center gap-2 text-sm">
                  <Sparkles className="h-4 w-4 text-amber-500" />
                  <span>Übergabeprotokoll gespeichert</span>
                </div>
                
                <div className="flex gap-2 justify-center">
                  <Button variant="outline" onClick={handleDownloadProtocol}>
                    <Download className="h-4 w-4 mr-2" />
                    PDF speichern
                  </Button>
                  <Button variant="outline" onClick={handleShare}>
                    <Share2 className="h-4 w-4 mr-2" />
                    Teilen
                  </Button>
                </div>
                
                <Button className="w-full" onClick={onComplete}>
                  Zum Dashboard
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
});

export default CompleteOrchestrator;
