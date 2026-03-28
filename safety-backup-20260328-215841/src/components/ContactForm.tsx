import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, User, Mail, Phone, MapPin, MessageSquare, Check, Loader2, Building2, Users, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { trackConversion } from "@/lib/conversionTracker";

// Swiss cities with postal codes
const swissCities = [
  { plz: "8000", city: "Zürich", canton: "ZH" },
  { plz: "8001", city: "Zürich", canton: "ZH" },
  { plz: "8002", city: "Zürich", canton: "ZH" },
  { plz: "8003", city: "Zürich", canton: "ZH" },
  { plz: "8004", city: "Zürich", canton: "ZH" },
  { plz: "8005", city: "Zürich", canton: "ZH" },
  { plz: "8006", city: "Zürich", canton: "ZH" },
  { plz: "8008", city: "Zürich", canton: "ZH" },
  { plz: "8032", city: "Zürich", canton: "ZH" },
  { plz: "8037", city: "Zürich", canton: "ZH" },
  { plz: "8038", city: "Zürich", canton: "ZH" },
  { plz: "8041", city: "Zürich", canton: "ZH" },
  { plz: "8044", city: "Zürich", canton: "ZH" },
  { plz: "8045", city: "Zürich", canton: "ZH" },
  { plz: "8046", city: "Zürich", canton: "ZH" },
  { plz: "8047", city: "Zürich", canton: "ZH" },
  { plz: "8048", city: "Zürich", canton: "ZH" },
  { plz: "8049", city: "Zürich", canton: "ZH" },
  { plz: "8050", city: "Zürich", canton: "ZH" },
  { plz: "8051", city: "Zürich", canton: "ZH" },
  { plz: "8052", city: "Zürich", canton: "ZH" },
  { plz: "8053", city: "Zürich", canton: "ZH" },
  { plz: "8055", city: "Zürich", canton: "ZH" },
  { plz: "8057", city: "Zürich", canton: "ZH" },
  { plz: "3000", city: "Bern", canton: "BE" },
  { plz: "3001", city: "Bern", canton: "BE" },
  { plz: "3004", city: "Bern", canton: "BE" },
  { plz: "3005", city: "Bern", canton: "BE" },
  { plz: "3006", city: "Bern", canton: "BE" },
  { plz: "3007", city: "Bern", canton: "BE" },
  { plz: "3008", city: "Bern", canton: "BE" },
  { plz: "3010", city: "Bern", canton: "BE" },
  { plz: "3011", city: "Bern", canton: "BE" },
  { plz: "3012", city: "Bern", canton: "BE" },
  { plz: "3013", city: "Bern", canton: "BE" },
  { plz: "3014", city: "Bern", canton: "BE" },
  { plz: "3015", city: "Bern", canton: "BE" },
  { plz: "4000", city: "Basel", canton: "BS" },
  { plz: "4001", city: "Basel", canton: "BS" },
  { plz: "4051", city: "Basel", canton: "BS" },
  { plz: "4052", city: "Basel", canton: "BS" },
  { plz: "4053", city: "Basel", canton: "BS" },
  { plz: "4054", city: "Basel", canton: "BS" },
  { plz: "4055", city: "Basel", canton: "BS" },
  { plz: "4056", city: "Basel", canton: "BS" },
  { plz: "4057", city: "Basel", canton: "BS" },
  { plz: "4058", city: "Basel", canton: "BS" },
  { plz: "4059", city: "Basel", canton: "BS" },
  { plz: "1200", city: "Genève", canton: "GE" },
  { plz: "1201", city: "Genève", canton: "GE" },
  { plz: "1202", city: "Genève", canton: "GE" },
  { plz: "1203", city: "Genève", canton: "GE" },
  { plz: "1204", city: "Genève", canton: "GE" },
  { plz: "1205", city: "Genève", canton: "GE" },
  { plz: "1206", city: "Genève", canton: "GE" },
  { plz: "1207", city: "Genève", canton: "GE" },
  { plz: "1208", city: "Genève", canton: "GE" },
  { plz: "1000", city: "Lausanne", canton: "VD" },
  { plz: "1003", city: "Lausanne", canton: "VD" },
  { plz: "1004", city: "Lausanne", canton: "VD" },
  { plz: "1005", city: "Lausanne", canton: "VD" },
  { plz: "1006", city: "Lausanne", canton: "VD" },
  { plz: "1007", city: "Lausanne", canton: "VD" },
  { plz: "1010", city: "Lausanne", canton: "VD" },
  { plz: "1012", city: "Lausanne", canton: "VD" },
  { plz: "1018", city: "Lausanne", canton: "VD" },
  { plz: "6000", city: "Luzern", canton: "LU" },
  { plz: "6002", city: "Luzern", canton: "LU" },
  { plz: "6003", city: "Luzern", canton: "LU" },
  { plz: "6004", city: "Luzern", canton: "LU" },
  { plz: "6005", city: "Luzern", canton: "LU" },
  { plz: "6006", city: "Luzern", canton: "LU" },
  { plz: "6010", city: "Kriens", canton: "LU" },
  { plz: "6014", city: "Luzern", canton: "LU" },
  { plz: "9000", city: "St. Gallen", canton: "SG" },
  { plz: "9001", city: "St. Gallen", canton: "SG" },
  { plz: "9004", city: "St. Gallen", canton: "SG" },
  { plz: "9006", city: "St. Gallen", canton: "SG" },
  { plz: "9008", city: "St. Gallen", canton: "SG" },
  { plz: "9010", city: "St. Gallen", canton: "SG" },
  { plz: "9011", city: "St. Gallen", canton: "SG" },
  { plz: "9012", city: "St. Gallen", canton: "SG" },
  { plz: "9014", city: "St. Gallen", canton: "SG" },
  { plz: "8400", city: "Winterthur", canton: "ZH" },
  { plz: "8401", city: "Winterthur", canton: "ZH" },
  { plz: "8404", city: "Winterthur", canton: "ZH" },
  { plz: "8405", city: "Winterthur", canton: "ZH" },
  { plz: "8406", city: "Winterthur", canton: "ZH" },
  { plz: "8408", city: "Winterthur", canton: "ZH" },
  { plz: "8409", city: "Winterthur", canton: "ZH" },
  { plz: "8610", city: "Uster", canton: "ZH" },
  { plz: "8600", city: "Dübendorf", canton: "ZH" },
  { plz: "8700", city: "Küsnacht", canton: "ZH" },
  { plz: "8702", city: "Zollikon", canton: "ZH" },
  { plz: "8800", city: "Thalwil", canton: "ZH" },
  { plz: "8802", city: "Kilchberg", canton: "ZH" },
  { plz: "8810", city: "Horgen", canton: "ZH" },
  { plz: "8820", city: "Wädenswil", canton: "ZH" },
  { plz: "8903", city: "Birmensdorf", canton: "ZH" },
  { plz: "8902", city: "Urdorf", canton: "ZH" },
  { plz: "8952", city: "Schlieren", canton: "ZH" },
  { plz: "8953", city: "Dietikon", canton: "ZH" },
  { plz: "8954", city: "Geroldswil", canton: "ZH" },
  { plz: "8304", city: "Wallisellen", canton: "ZH" },
  { plz: "8302", city: "Kloten", canton: "ZH" },
  { plz: "8152", city: "Glattbrugg", canton: "ZH" },
  { plz: "8153", city: "Rümlang", canton: "ZH" },
  { plz: "8180", city: "Bülach", canton: "ZH" },
  { plz: "5000", city: "Aarau", canton: "AG" },
  { plz: "5001", city: "Aarau", canton: "AG" },
  { plz: "5400", city: "Baden", canton: "AG" },
  { plz: "5401", city: "Baden", canton: "AG" },
  { plz: "5430", city: "Wettingen", canton: "AG" },
  { plz: "2500", city: "Biel/Bienne", canton: "BE" },
  { plz: "2501", city: "Biel/Bienne", canton: "BE" },
  { plz: "2502", city: "Biel/Bienne", canton: "BE" },
  { plz: "3400", city: "Burgdorf", canton: "BE" },
  { plz: "3600", city: "Thun", canton: "BE" },
  { plz: "3700", city: "Spiez", canton: "BE" },
  { plz: "3800", city: "Interlaken", canton: "BE" },
  { plz: "7000", city: "Chur", canton: "GR" },
  { plz: "7001", city: "Chur", canton: "GR" },
  { plz: "7002", city: "Chur", canton: "GR" },
  { plz: "7500", city: "St. Moritz", canton: "GR" },
  { plz: "7260", city: "Davos", canton: "GR" },
  { plz: "6300", city: "Zug", canton: "ZG" },
  { plz: "6301", city: "Zug", canton: "ZG" },
  { plz: "6302", city: "Zug", canton: "ZG" },
  { plz: "6330", city: "Cham", canton: "ZG" },
  { plz: "6340", city: "Baar", canton: "ZG" },
  { plz: "8200", city: "Schaffhausen", canton: "SH" },
  { plz: "8201", city: "Schaffhausen", canton: "SH" },
  { plz: "8500", city: "Frauenfeld", canton: "TG" },
  { plz: "8570", city: "Weinfelden", canton: "TG" },
  { plz: "8580", city: "Amriswil", canton: "TG" },
  { plz: "9200", city: "Gossau", canton: "SG" },
  { plz: "9400", city: "Rorschach", canton: "SG" },
  { plz: "9500", city: "Wil", canton: "SG" },
  { plz: "6500", city: "Bellinzona", canton: "TI" },
  { plz: "6600", city: "Locarno", canton: "TI" },
  { plz: "6900", city: "Lugano", canton: "TI" },
  { plz: "6901", city: "Lugano", canton: "TI" },
  { plz: "1950", city: "Sion", canton: "VS" },
  { plz: "3900", city: "Brig", canton: "VS" },
  { plz: "3920", city: "Zermatt", canton: "VS" },
  { plz: "1700", city: "Fribourg", canton: "FR" },
  { plz: "1701", city: "Fribourg", canton: "FR" },
  { plz: "2000", city: "Neuchâtel", canton: "NE" },
  { plz: "2300", city: "La Chaux-de-Fonds", canton: "NE" },
  { plz: "2800", city: "Delémont", canton: "JU" },
  { plz: "4500", city: "Solothurn", canton: "SO" },
  { plz: "4600", city: "Olten", canton: "SO" },
  { plz: "6460", city: "Altdorf", canton: "UR" },
  { plz: "6370", city: "Stans", canton: "NW" },
  { plz: "6060", city: "Sarnen", canton: "OW" },
  { plz: "8750", city: "Glarus", canton: "GL" },
  { plz: "9050", city: "Appenzell", canton: "AI" },
  { plz: "9100", city: "Herisau", canton: "AR" },
];

const contactSchema = z.object({
  firstName: z.string().trim()
    .min(1, "Bitte geben Sie Ihren Vornamen ein")
    .min(2, "Der Vorname muss mindestens 2 Zeichen haben")
    .max(100, "Der Vorname darf maximal 100 Zeichen haben"),
  lastName: z.string().trim()
    .min(1, "Bitte geben Sie Ihren Nachnamen ein")
    .min(2, "Der Nachname muss mindestens 2 Zeichen haben")
    .max(100, "Der Nachname darf maximal 100 Zeichen haben"),
  email: z.string()
    .min(1, "Bitte geben Sie Ihre E-Mail-Adresse ein")
    .email("Bitte geben Sie eine gültige E-Mail-Adresse ein (z.B. name@beispiel.ch)")
    .max(255, "Die E-Mail-Adresse darf maximal 255 Zeichen haben"),
  phone: z.string()
    .min(1, "Bitte geben Sie Ihre Telefonnummer ein")
    .regex(/^[\d\s+()-]{8,20}$/, "Bitte geben Sie eine gültige Telefonnummer ein (z.B. +41 44 123 45 67)"),
  moveFrom: z.string().trim()
    .min(1, "Bitte geben Sie die Auszugsadresse ein")
    .min(5, "Die Adresse scheint zu kurz zu sein")
    .max(200, "Die Adresse darf maximal 200 Zeichen haben"),
  moveTo: z.string().trim()
    .min(1, "Bitte geben Sie die Einzugsadresse ein")
    .min(5, "Die Adresse scheint zu kurz zu sein")
    .max(200, "Die Adresse darf maximal 200 Zeichen haben"),
  message: z.string()
    .max(1000, "Die Nachricht darf maximal 1000 Zeichen haben")
    .optional(),
});

type MoveType = "single" | "family" | "office";

interface ContactFormProps {
  defaultMoveType?: MoveType;
}

export const ContactForm = ({ defaultMoveType = "family" }: ContactFormProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [moveType, setMoveType] = useState<MoveType>(defaultMoveType);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [hasTrackedStart, setHasTrackedStart] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    moveFrom: "",
    moveTo: "",
    message: "",
  });
  const debounceTimers = useRef<Record<string, NodeJS.Timeout>>({});
  const [showSuggestions, setShowSuggestions] = useState<{ moveFrom: boolean; moveTo: boolean }>({
    moveFrom: false,
    moveTo: false,
  });
  const suggestionRefs = useRef<{ moveFrom: HTMLDivElement | null; moveTo: HTMLDivElement | null }>({
    moveFrom: null,
    moveTo: null,
  });

  // Track form start on first input
  useEffect(() => {
    const hasInput = Object.values(formData).some(v => v.length > 0);
    if (!hasTrackedStart && hasInput) {
      setHasTrackedStart(true);
      trackConversion('form_start', { form: 'contact' });
    }
  }, [formData, hasTrackedStart]);

  // Filter cities based on input
  const filterCities = useCallback((input: string) => {
    if (!input || input.length < 2) return [];
    const searchTerm = input.toLowerCase();
    return swissCities
      .filter(
        (c) =>
          c.city.toLowerCase().includes(searchTerm) ||
          c.plz.startsWith(searchTerm)
      )
      .slice(0, 6);
  }, []);

  const moveFromSuggestions = filterCities(formData.moveFrom);
  const moveToSuggestions = filterCities(formData.moveTo);

  // Handle city selection
  const handleCitySelect = useCallback((field: "moveFrom" | "moveTo", city: typeof swissCities[0]) => {
    const value = `${city.plz} ${city.city}`;
    setFormData((prev) => ({ ...prev, [field]: value }));
    setShowSuggestions((prev) => ({ ...prev, [field]: false }));
  }, []);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        suggestionRefs.current.moveFrom &&
        !suggestionRefs.current.moveFrom.contains(e.target as Node)
      ) {
        setShowSuggestions((prev) => ({ ...prev, moveFrom: false }));
      }
      if (
        suggestionRefs.current.moveTo &&
        !suggestionRefs.current.moveTo.contains(e.target as Node)
      ) {
        setShowSuggestions((prev) => ({ ...prev, moveTo: false }));
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Field-specific validation schemas
  const fieldSchemas: Record<string, z.ZodTypeAny> = {
    firstName: contactSchema.shape.firstName,
    lastName: contactSchema.shape.lastName,
    email: contactSchema.shape.email,
    phone: contactSchema.shape.phone,
    moveFrom: contactSchema.shape.moveFrom,
    moveTo: contactSchema.shape.moveTo,
  };

  // Validate single field
  const validateField = useCallback((name: string, value: string) => {
    const schema = fieldSchemas[name];
    if (!schema) return;

    try {
      schema.parse(value);
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors((prev) => ({
          ...prev,
          [name]: error.errors[0]?.message || "Ungültige Eingabe",
        }));
      }
    }
  }, []);

  // Handle input change with debounced validation
  const handleInputChange = useCallback((name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear existing timer
    if (debounceTimers.current[name]) {
      clearTimeout(debounceTimers.current[name]);
    }

    // Only validate if field has been touched
    if (touched[name]) {
      debounceTimers.current[name] = setTimeout(() => {
        validateField(name, value);
      }, 300);
    }
  }, [touched, validateField]);

  // Handle blur - mark as touched and validate
  const handleBlur = useCallback((name: string) => {
    setFocusedField(null);
    setTouched((prev) => ({ ...prev, [name]: true }));
    validateField(name, formData[name as keyof typeof formData]);
  }, [formData, validateField]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      Object.values(debounceTimers.current).forEach(clearTimeout);
    };
  }, []);

  // Calculate form progress
  const requiredFields = ["firstName", "lastName", "email", "phone", "moveFrom", "moveTo"];
  const filledFields = requiredFields.filter(
    (field) => formData[field as keyof typeof formData]?.trim().length > 0
  );
  const progress = Math.round((filledFields.length / requiredFields.length) * 100);
  
  const getProgressColor = () => {
    if (progress < 33) return "bg-destructive";
    if (progress < 66) return "bg-warm";
    if (progress < 100) return "bg-alpine";
    return "bg-forest";
  };

  const moveTypes = [
    { id: "single" as const, icon: User, label: "Einzelperson" },
    { id: "family" as const, icon: Users, label: "Familie" },
    { id: "office" as const, icon: Building2, label: "Büro" },
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Mark all fields as touched
    const allTouched = Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {});
    setTouched(allTouched);

    try {
      contactSchema.parse(formData);
      setErrors({});

      // Track form submission attempt
      trackConversion('form_complete', { form: 'contact', moveType });

      // Send to backend
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/contact-form`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "apikey": import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
          body: JSON.stringify({
            firstName: formData.firstName.trim(),
            lastName: formData.lastName.trim(),
            email: formData.email.trim().toLowerCase(),
            phone: formData.phone.trim(),
            moveFrom: formData.moveFrom.trim(),
            moveTo: formData.moveTo.trim(),
            moveType: moveType,
            message: formData.message.trim(),
          }),
        }
      );

      const result = await response.json();

      if (response.status === 429) {
        const retryAfter = result.retryAfter || 60;
        throw new Error(`Zu viele Anfragen. Bitte warten Sie ${retryAfter} Sekunden.`);
      }

      if (!response.ok) {
        throw new Error(result.error || "Ein Fehler ist aufgetreten");
      }

      setIsSuccess(true);
      toast({
        title: "Anfrage erfolgreich gesendet!",
        description: "Wir werden uns in Kürze bei Ihnen melden.",
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(newErrors);
        toast({
          title: "Fehler",
          description: "Bitte überprüfen Sie Ihre Eingaben",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Fehler",
          description: error instanceof Error ? error.message : "Ein Fehler ist aufgetreten",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="w-20 h-20 bg-forest/10 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <Check className="h-10 w-10 text-forest" />
        </motion.div>
        <h3 className="text-2xl font-display font-bold mb-3">Vielen Dank!</h3>
        <p className="text-muted-foreground mb-6">
          Ihre Anfrage wurde erfolgreich übermittelt.<br />
          Wir melden uns innerhalb von 24 Stunden bei Ihnen.
        </p>
        <Button onClick={() => setIsSuccess(false)} variant="outline">
          Neue Anfrage stellen
        </Button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Fortschritt</span>
          <span className={cn(
            "font-medium transition-colors",
            progress === 100 ? "text-forest" : "text-foreground"
          )}>
            {filledFields.length} von {requiredFields.length} Feldern
            {progress === 100 && (
              <CheckCircle2 className="inline-block ml-1.5 h-4 w-4 text-forest" />
            )}
          </span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            className={cn("h-full rounded-full transition-colors", getProgressColor())}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Move Type Selection */}
      <div className="space-y-3">
        <Label className="text-base">Art des Umzugs</Label>
        <div className="grid grid-cols-3 gap-3">
          {moveTypes.map((type) => {
            const Icon = type.icon;
            return (
              <motion.button
                key={type.id}
                type="button"
                onClick={() => setMoveType(type.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`relative p-4 rounded-xl border-2 transition-all min-h-[100px] flex flex-col items-center justify-center gap-2 ${
                  moveType === type.id
                    ? "border-alpine bg-alpine/10"
                    : "border-border hover:border-alpine/50"
                }`}
              >
                <Icon
                  className={`h-6 w-6 transition-colors ${
                    moveType === type.id ? "text-alpine" : "text-muted-foreground"
                  }`}
                />
                <span className={`text-sm font-medium ${moveType === type.id ? "" : "text-muted-foreground"}`}>
                  {type.label}
                </span>
                {moveType === type.id && (
                  <motion.div
                    layoutId="move-type-indicator"
                    className="absolute inset-0 border-2 border-alpine rounded-xl"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Name Fields */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Vorname *
          </Label>
          <Input
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={(e) => handleInputChange("firstName", e.target.value)}
            required
            maxLength={100}
            className={cn(
              "min-h-[48px] transition-all",
              focusedField === "firstName" && "ring-2 ring-alpine",
              errors.firstName && touched.firstName && "border-destructive ring-destructive/20"
            )}
            onFocus={() => setFocusedField("firstName")}
            onBlur={() => handleBlur("firstName")}
          />
          <AnimatePresence>
            {errors.firstName && (
              <motion.div
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-lg"
              >
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{errors.firstName}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Nachname *</Label>
          <Input
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={(e) => handleInputChange("lastName", e.target.value)}
            required
            maxLength={100}
            className={cn(
              "min-h-[48px] transition-all",
              focusedField === "lastName" && "ring-2 ring-alpine",
              errors.lastName && touched.lastName && "border-destructive ring-destructive/20"
            )}
            onFocus={() => setFocusedField("lastName")}
            onBlur={() => handleBlur("lastName")}
          />
          <AnimatePresence>
            {errors.lastName && (
              <motion.div
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-lg"
              >
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{errors.lastName}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Contact Fields */}
      <div className="space-y-2">
        <Label htmlFor="email" className="flex items-center gap-2">
          <Mail className="h-4 w-4" />
          E-Mail *
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange("email", e.target.value)}
          required
          maxLength={255}
          className={cn(
            "min-h-[48px] transition-all",
            focusedField === "email" && "ring-2 ring-alpine",
            errors.email && touched.email && "border-destructive ring-destructive/20"
          )}
          onFocus={() => setFocusedField("email")}
          onBlur={() => handleBlur("email")}
        />
        <AnimatePresence>
          {errors.email && (
            <motion.div
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-lg"
            >
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{errors.email}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone" className="flex items-center gap-2">
          <Phone className="h-4 w-4" />
          Telefon *
        </Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => handleInputChange("phone", e.target.value)}
          required
          maxLength={20}
          className={cn(
            "min-h-[48px] transition-all",
            focusedField === "phone" && "ring-2 ring-alpine",
            errors.phone && touched.phone && "border-destructive ring-destructive/20"
          )}
          onFocus={() => setFocusedField("phone")}
          onBlur={() => handleBlur("phone")}
        />
        <AnimatePresence>
          {errors.phone && (
            <motion.div
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-lg"
            >
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{errors.phone}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Address Fields */}
      <div className="space-y-2" ref={(el) => (suggestionRefs.current.moveFrom = el)}>
        <Label htmlFor="moveFrom" className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          Auszugsadresse *
        </Label>
        <div className="relative">
          <Input
            id="moveFrom"
            name="moveFrom"
            value={formData.moveFrom}
            onChange={(e) => {
              handleInputChange("moveFrom", e.target.value);
              setShowSuggestions((prev) => ({ ...prev, moveFrom: true }));
            }}
            placeholder="PLZ oder Ort eingeben..."
            required
            maxLength={200}
            autoComplete="off"
            className={cn(
              "min-h-[48px] transition-all",
              focusedField === "moveFrom" && "ring-2 ring-alpine",
              errors.moveFrom && touched.moveFrom && "border-destructive ring-destructive/20"
            )}
            onFocus={() => {
              setFocusedField("moveFrom");
              setShowSuggestions((prev) => ({ ...prev, moveFrom: true }));
            }}
            onBlur={() => handleBlur("moveFrom")}
          />
          <AnimatePresence>
            {showSuggestions.moveFrom && moveFromSuggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute z-50 w-full mt-1 bg-background border border-border rounded-lg shadow-lg overflow-hidden"
              >
                {moveFromSuggestions.map((city, index) => (
                  <button
                    key={`${city.plz}-${index}`}
                    type="button"
                    className="w-full px-4 py-3 text-left hover:bg-muted flex items-center justify-between transition-colors"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleCitySelect("moveFrom", city);
                    }}
                  >
                    <span className="font-medium">{city.plz} {city.city}</span>
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">{city.canton}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <AnimatePresence>
          {errors.moveFrom && (
            <motion.div
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-lg"
            >
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{errors.moveFrom}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="space-y-2" ref={(el) => (suggestionRefs.current.moveTo = el)}>
        <Label htmlFor="moveTo" className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          Einzugsadresse *
        </Label>
        <div className="relative">
          <Input
            id="moveTo"
            name="moveTo"
            value={formData.moveTo}
            onChange={(e) => {
              handleInputChange("moveTo", e.target.value);
              setShowSuggestions((prev) => ({ ...prev, moveTo: true }));
            }}
            placeholder="PLZ oder Ort eingeben..."
            required
            maxLength={200}
            autoComplete="off"
            className={cn(
              "min-h-[48px] transition-all",
              focusedField === "moveTo" && "ring-2 ring-alpine",
              errors.moveTo && touched.moveTo && "border-destructive ring-destructive/20"
            )}
            onFocus={() => {
              setFocusedField("moveTo");
              setShowSuggestions((prev) => ({ ...prev, moveTo: true }));
            }}
            onBlur={() => handleBlur("moveTo")}
          />
          <AnimatePresence>
            {showSuggestions.moveTo && moveToSuggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute z-50 w-full mt-1 bg-background border border-border rounded-lg shadow-lg overflow-hidden"
              >
                {moveToSuggestions.map((city, index) => (
                  <button
                    key={`${city.plz}-${index}`}
                    type="button"
                    className="w-full px-4 py-3 text-left hover:bg-muted flex items-center justify-between transition-colors"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleCitySelect("moveTo", city);
                    }}
                  >
                    <span className="font-medium">{city.plz} {city.city}</span>
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">{city.canton}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <AnimatePresence>
          {errors.moveTo && (
            <motion.div
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-lg"
            >
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{errors.moveTo}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Message */}
      <div className="space-y-2">
        <Label htmlFor="message" className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          Nachricht (optional)
        </Label>
        <Textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
          rows={4}
          maxLength={1000}
          placeholder="Besondere Wünsche oder Anforderungen..."
          className="resize-none"
        />
      </div>

      {/* Submit */}
      <Button
        type="submit"
        className="w-full bg-gradient-hero text-primary-foreground hover:opacity-90 min-h-[52px] text-base"
        disabled={isSubmitting}
        size="lg"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Wird gesendet...
          </>
        ) : (
          <>
            Anfrage senden
            <Send className="ml-2 h-5 w-5" />
          </>
        )}
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        * Pflichtfelder. Ihre Daten werden vertraulich behandelt.
      </p>
    </form>
  );
};

export default ContactForm;
