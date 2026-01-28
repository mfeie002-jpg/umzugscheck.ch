import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Upload, X, Image as ImageIcon, FileText, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "@/hooks/use-toast";

interface UploadedFile {
  id: string;
  file: File;
  preview: string;
  description: string;
  room: string;
}

const roomOptions = [
  { id: "living", labelKey: "room.living" },
  { id: "bedroom", labelKey: "room.bedroom" },
  { id: "kitchen", labelKey: "room.kitchen" },
  { id: "bathroom", labelKey: "room.bathroom" },
  { id: "office", labelKey: "room.office" },
  { id: "storage", labelKey: "room.storage" },
  { id: "garage", labelKey: "room.garage" },
  { id: "other", labelKey: "room.other" },
];

interface PhotoUploadProps {
  onFilesChange?: (files: UploadedFile[]) => void;
}

const PhotoUpload = ({ onFilesChange }: PhotoUploadProps) => {
  const { language } = useLanguage();
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const translations: Record<string, Record<string, string>> = {
    de: {
      title: "Fotos für Offerte",
      subtitle: "Laden Sie Fotos Ihrer Räume hoch für eine genauere Offerte",
      dropzone: "Fotos hierher ziehen oder klicken zum Hochladen",
      maxFiles: "Max. 10 Fotos, je max. 5MB",
      addDescription: "Beschreibung hinzufügen...",
      selectRoom: "Raum wählen",
      uploaded: "hochgeladen",
      remove: "Entfernen",
      filesReady: "Fotos bereit für Offerte",
      "room.living": "Wohnzimmer",
      "room.bedroom": "Schlafzimmer",
      "room.kitchen": "Küche",
      "room.bathroom": "Badezimmer",
      "room.office": "Büro",
      "room.storage": "Abstellraum",
      "room.garage": "Garage",
      "room.other": "Sonstiges",
      takePhoto: "Foto aufnehmen",
      browseFiles: "Durchsuchen",
      tips: "Tipps: Fotografieren Sie grosse Möbel, spezielle Gegenstände und enge Durchgänge",
    },
    fr: {
      title: "Photos pour devis",
      subtitle: "Téléchargez des photos de vos pièces pour un devis plus précis",
      dropzone: "Glissez les photos ici ou cliquez pour télécharger",
      maxFiles: "Max. 10 photos, max. 5MB chacune",
      addDescription: "Ajouter une description...",
      selectRoom: "Choisir la pièce",
      uploaded: "téléchargé(s)",
      remove: "Supprimer",
      filesReady: "Photos prêtes pour le devis",
      "room.living": "Salon",
      "room.bedroom": "Chambre",
      "room.kitchen": "Cuisine",
      "room.bathroom": "Salle de bain",
      "room.office": "Bureau",
      "room.storage": "Débarras",
      "room.garage": "Garage",
      "room.other": "Autre",
      takePhoto: "Prendre une photo",
      browseFiles: "Parcourir",
      tips: "Conseils: Photographiez les grands meubles, objets spéciaux et passages étroits",
    },
    it: {
      title: "Foto per preventivo",
      subtitle: "Carica foto delle tue stanze per un preventivo più preciso",
      dropzone: "Trascina le foto qui o clicca per caricare",
      maxFiles: "Max. 10 foto, max. 5MB ciascuna",
      addDescription: "Aggiungi descrizione...",
      selectRoom: "Seleziona stanza",
      uploaded: "caricato/i",
      remove: "Rimuovi",
      filesReady: "Foto pronte per il preventivo",
      "room.living": "Soggiorno",
      "room.bedroom": "Camera da letto",
      "room.kitchen": "Cucina",
      "room.bathroom": "Bagno",
      "room.office": "Ufficio",
      "room.storage": "Ripostiglio",
      "room.garage": "Garage",
      "room.other": "Altro",
      takePhoto: "Scatta foto",
      browseFiles: "Sfoglia",
      tips: "Suggerimenti: Fotografa mobili grandi, oggetti speciali e passaggi stretti",
    },
    en: {
      title: "Photos for Quote",
      subtitle: "Upload photos of your rooms for a more accurate quote",
      dropzone: "Drag photos here or click to upload",
      maxFiles: "Max. 10 photos, max. 5MB each",
      addDescription: "Add description...",
      selectRoom: "Select room",
      uploaded: "uploaded",
      remove: "Remove",
      filesReady: "Photos ready for quote",
      "room.living": "Living Room",
      "room.bedroom": "Bedroom",
      "room.kitchen": "Kitchen",
      "room.bathroom": "Bathroom",
      "room.office": "Office",
      "room.storage": "Storage",
      "room.garage": "Garage",
      "room.other": "Other",
      takePhoto: "Take Photo",
      browseFiles: "Browse",
      tips: "Tips: Photograph large furniture, special items, and narrow passages",
    },
  };

  const t = translations[language] || translations.de;

  const handleFileSelect = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;

    const newFiles: UploadedFile[] = [];
    const maxFiles = 10;
    const maxSize = 5 * 1024 * 1024; // 5MB

    Array.from(selectedFiles).forEach((file) => {
      if (files.length + newFiles.length >= maxFiles) {
        toast({
          title: "Maximum erreicht",
          description: `Maximal ${maxFiles} Fotos erlaubt`,
          variant: "destructive",
        });
        return;
      }

      if (file.size > maxSize) {
        toast({
          title: "Datei zu gross",
          description: `${file.name} ist grösser als 5MB`,
          variant: "destructive",
        });
        return;
      }

      if (!file.type.startsWith("image/")) {
        toast({
          title: "Ungültiger Dateityp",
          description: "Nur Bilder erlaubt",
          variant: "destructive",
        });
        return;
      }

      const preview = URL.createObjectURL(file);
      newFiles.push({
        id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        file,
        preview,
        description: "",
        room: "other",
      });
    });

    if (newFiles.length > 0) {
      setIsUploading(true);
      setTimeout(() => {
        const updatedFiles = [...files, ...newFiles];
        setFiles(updatedFiles);
        onFilesChange?.(updatedFiles);
        setIsUploading(false);
        toast({
          title: "Hochgeladen",
          description: `${newFiles.length} Foto(s) hinzugefügt`,
        });
      }, 500);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const removeFile = (id: string) => {
    const file = files.find(f => f.id === id);
    if (file) {
      URL.revokeObjectURL(file.preview);
    }
    const updatedFiles = files.filter(f => f.id !== id);
    setFiles(updatedFiles);
    onFilesChange?.(updatedFiles);
  };

  const updateFile = (id: string, updates: Partial<UploadedFile>) => {
    const updatedFiles = files.map(f => f.id === id ? { ...f, ...updates } : f);
    setFiles(updatedFiles);
    onFilesChange?.(updatedFiles);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Camera className="h-5 w-5 text-alpine" />
        <div>
          <h3 className="font-semibold">{t.title}</h3>
          <p className="text-xs text-muted-foreground">{t.subtitle}</p>
        </div>
      </div>

      {/* Upload Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-border rounded-xl p-6 text-center cursor-pointer hover:border-alpine/50 hover:bg-alpine/5 transition-colors"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFileSelect(e.target.files)}
        />
        
        {isUploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-alpine" />
            <p className="text-sm text-muted-foreground">Uploading...</p>
          </div>
        ) : (
          <>
            <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm font-medium">{t.dropzone}</p>
            <p className="text-xs text-muted-foreground mt-1">{t.maxFiles}</p>
            <div className="flex gap-2 justify-center mt-3">
              <Button size="sm" variant="outline" className="text-xs">
                <Camera className="h-3 w-3 mr-1" />
                {t.takePhoto}
              </Button>
              <Button size="sm" variant="outline" className="text-xs">
                <ImageIcon className="h-3 w-3 mr-1" />
                {t.browseFiles}
              </Button>
            </div>
          </>
        )}
      </div>

      {/* Tips */}
      <p className="text-xs text-muted-foreground bg-muted/50 p-2 rounded-lg">
        💡 {t.tips}
      </p>

      {/* Uploaded Files */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                {files.length} {t.uploaded}
              </p>
            </div>

            <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1">
              {files.map((file) => (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex gap-3 p-2 bg-background rounded-lg border"
                >
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                    <img
                      src={file.preview}
                      alt={file.description || "Upload"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <select
                      value={file.room}
                      onChange={(e) => updateFile(file.id, { room: e.target.value })}
                      className="w-full text-xs p-1.5 rounded border bg-background"
                    >
                      {roomOptions.map((room) => (
                        <option key={room.id} value={room.id}>
                          {t[room.labelKey] || room.labelKey}
                        </option>
                      ))}
                    </select>
                    <Input
                      value={file.description}
                      onChange={(e) => updateFile(file.id, { description: e.target.value })}
                      placeholder={t.addDescription}
                      className="h-7 text-xs"
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-destructive flex-shrink-0"
                    onClick={() => removeFile(file.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </motion.div>
              ))}
            </div>

            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
              <p className="text-sm text-green-700 dark:text-green-300 font-medium">
                ✓ {t.filesReady}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PhotoUpload;
