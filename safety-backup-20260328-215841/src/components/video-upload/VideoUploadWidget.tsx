import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Video, CheckCircle, AlertCircle, X, Shield, Clock, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface VideoUploadWidgetProps {
  onUploadComplete?: (analysisId: string) => void;
  onClose?: () => void;
  showInline?: boolean;
}

type UploadStep = 'select' | 'consent' | 'details' | 'uploading' | 'success';

export function VideoUploadWidget({ onUploadComplete, onClose, showInline = false }: VideoUploadWidgetProps) {
  const navigate = useNavigate();
  const [step, setStep] = useState<UploadStep>('select');
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [privacyConsent, setPrivacyConsent] = useState(false);
  const [dataUsageConsent, setDataUsageConsent] = useState(false);
  const [analysisId, setAnalysisId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // User details
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [fromCity, setFromCity] = useState('');
  const [toCity, setToCity] = useState('');

  const handleFileSelect = useCallback((selectedFile: File) => {
    // Validate file
    const maxSize = 500 * 1024 * 1024; // 500MB
    const allowedTypes = ['video/mp4', 'video/quicktime', 'video/webm', 'video/x-msvideo'];
    
    if (selectedFile.size > maxSize) {
      setError('Video zu gross. Maximum 500MB erlaubt.');
      return;
    }
    
    if (!allowedTypes.includes(selectedFile.type)) {
      setError('Ungültiges Format. Erlaubt: MP4, MOV, WebM, AVI');
      return;
    }
    
    setFile(selectedFile);
    setError(null);
    setStep('consent');
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleUpload = async () => {
    if (!file || !privacyConsent || !dataUsageConsent || !userEmail) {
      toast.error('Bitte alle Felder ausfüllen und Einwilligungen bestätigen');
      return;
    }

    setStep('uploading');
    setUploadProgress(0);

    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      // Upload to Supabase Storage with progress simulation
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 5, 90));
      }, 200);

      const { error: uploadError } = await supabase.storage
        .from('video-analyses')
        .upload(filePath, file);

      clearInterval(progressInterval);

      if (uploadError) throw uploadError;

      setUploadProgress(95);

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('video-analyses')
        .getPublicUrl(filePath);

      // Create video analysis record
      const { data: analysisData, error: insertError } = await supabase
        .from('video_analyses')
        .insert({
          video_url: urlData.publicUrl,
          user_email: userEmail,
          user_name: userName,
          user_phone: userPhone,
          from_city: fromCity,
          to_city: toCity,
          file_size_bytes: file.size,
          privacy_consent: privacyConsent,
          data_usage_consent: dataUsageConsent,
          consent_timestamp: new Date().toISOString(),
          status: 'pending'
        })
        .select()
        .single();

      if (insertError) throw insertError;

      setUploadProgress(100);
      setAnalysisId(analysisData.id);
      setStep('success');
      
      toast.success('Video erfolgreich hochgeladen!');
      onUploadComplete?.(analysisData.id);

    } catch (err: any) {
      console.error('Upload error:', err);
      setError(err.message || 'Upload fehlgeschlagen');
      setStep('select');
      toast.error('Upload fehlgeschlagen. Bitte erneut versuchen.');
    }
  };

  const containerClass = showInline 
    ? "w-full" 
    : "fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4";

  return (
    <div className={containerClass}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={showInline ? "w-full" : "w-full max-w-lg"}
      >
        <Card className="overflow-hidden border-2 border-primary/20 shadow-premium">
          {!showInline && (
            <div className="flex items-center justify-between p-4 border-b bg-muted/50">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">KI Video-Analyse</h3>
              </div>
              {onClose && (
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}

          <CardContent className="p-6">
            <AnimatePresence mode="wait">
              {/* Step 1: Select File */}
              {step === 'select' && (
                <motion.div
                  key="select"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-4"
                >
                  <div className="text-center mb-6">
                    <h4 className="text-lg font-semibold mb-2">Video hochladen</h4>
                    <p className="text-sm text-muted-foreground">
                      Laden Sie ein Video Ihrer Wohnung hoch und sparen Sie bis zu 30% bei Ihrer Offerte
                    </p>
                  </div>

                  <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    className="border-2 border-dashed border-primary/30 rounded-xl p-8 text-center hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer"
                  >
                    <input
                      type="file"
                      accept="video/mp4,video/quicktime,video/webm,video/x-msvideo"
                      onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                      className="hidden"
                      id="video-upload"
                    />
                    <label htmlFor="video-upload" className="cursor-pointer">
                      <Upload className="h-12 w-12 text-primary/60 mx-auto mb-4" />
                      <p className="font-medium mb-1">Video hier ablegen</p>
                      <p className="text-sm text-muted-foreground">oder klicken zum Auswählen</p>
                      <p className="text-xs text-muted-foreground mt-2">MP4, MOV, WebM • Max 500MB</p>
                    </label>
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 text-destructive text-sm p-3 bg-destructive/10 rounded-lg">
                      <AlertCircle className="h-4 w-4" />
                      {error}
                    </div>
                  )}

                  {/* Trust signals */}
                  <div className="grid grid-cols-2 gap-3 mt-6">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Shield className="h-4 w-4 text-success" />
                      <span>SSL-verschlüsselt</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-4 w-4 text-success" />
                      <span>Analyse in 24h</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Consent */}
              {step === 'consent' && file && (
                <motion.div
                  key="consent"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <Video className="h-8 w-8 text-primary" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{file.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(file.size / (1024 * 1024)).toFixed(1)} MB
                      </p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => { setFile(null); setStep('select'); }}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="privacy"
                        checked={privacyConsent}
                        onCheckedChange={(checked) => setPrivacyConsent(checked === true)}
                      />
                      <Label htmlFor="privacy" className="text-sm leading-relaxed cursor-pointer">
                        Ich stimme der <a href="/datenschutz" className="text-primary underline" target="_blank">Datenschutzerklärung</a> zu 
                        und erlaube die Speicherung meines Videos für die Analyse.
                      </Label>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="dataUsage"
                        checked={dataUsageConsent}
                        onCheckedChange={(checked) => setDataUsageConsent(checked === true)}
                      />
                      <Label htmlFor="dataUsage" className="text-sm leading-relaxed cursor-pointer">
                        Ich erlaube die Nutzung meiner Daten zur Erstellung einer personalisierten Umzugsofferte.
                      </Label>
                    </div>
                  </div>

                  <div className="p-3 bg-info/10 rounded-lg">
                    <p className="text-sm text-info flex items-start gap-2">
                      <Shield className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      Ihr Video wird nach 30 Tagen automatisch gelöscht und nie an Dritte weitergegeben.
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => { setFile(null); setStep('select'); }} className="flex-1">
                      Zurück
                    </Button>
                    <Button 
                      onClick={() => setStep('details')} 
                      disabled={!privacyConsent || !dataUsageConsent}
                      className="flex-1"
                    >
                      Weiter
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: User Details */}
              {step === 'details' && (
                <motion.div
                  key="details"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-4"
                >
                  <h4 className="font-semibold text-center">Ihre Kontaktdaten</h4>

                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="email">E-Mail *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="ihre@email.ch"
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          placeholder="Max Muster"
                          value={userName}
                          onChange={(e) => setUserName(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Telefon</Label>
                        <Input
                          id="phone"
                          placeholder="+41 79 123 45 67"
                          value={userPhone}
                          onChange={(e) => setUserPhone(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="fromCity">Von (Stadt)</Label>
                        <Input
                          id="fromCity"
                          placeholder="Zürich"
                          value={fromCity}
                          onChange={(e) => setFromCity(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="toCity">Nach (Stadt)</Label>
                        <Input
                          id="toCity"
                          placeholder="Bern"
                          value={toCity}
                          onChange={(e) => setToCity(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setStep('consent')} className="flex-1">
                      Zurück
                    </Button>
                    <Button 
                      onClick={handleUpload} 
                      disabled={!userEmail}
                      className="flex-1 bg-secondary hover:bg-secondary/90"
                    >
                      Video hochladen
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Step 4: Uploading */}
              {step === 'uploading' && (
                <motion.div
                  key="uploading"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="text-center space-y-6 py-8"
                >
                  <div className="relative">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full mx-auto"
                    />
                    <Video className="h-6 w-6 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  </div>
                  
                  <div>
                    <p className="font-medium mb-2">Video wird hochgeladen...</p>
                    <Progress value={uploadProgress} className="h-2" />
                    <p className="text-sm text-muted-foreground mt-2">{uploadProgress}%</p>
                  </div>
                </motion.div>
              )}

              {/* Step 5: Success */}
              {step === 'success' && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center space-y-6 py-8"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.2 }}
                  >
                    <CheckCircle className="h-16 w-16 text-success mx-auto" />
                  </motion.div>
                  
                  <div>
                    <h4 className="text-xl font-semibold mb-2">Erfolgreich hochgeladen!</h4>
                    <p className="text-muted-foreground">
                      Wir analysieren Ihr Video und melden uns innerhalb von 24 Stunden mit Ihrer personalisierten Offerte.
                    </p>
                  </div>

                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm">
                      <span className="font-medium">Referenz-ID:</span>{' '}
                      <code className="bg-background px-2 py-0.5 rounded">{analysisId?.slice(0, 8)}</code>
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <Button variant="outline" onClick={onClose} className="flex-1">
                      Schliessen
                    </Button>
                    <Button 
                      onClick={() => {
                        onClose?.();
                        navigate(`/video-analyse/${analysisId}`);
                      }} 
                      className="flex-1 gap-2"
                    >
                      Status prüfen
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
