import { memo } from "react";
import { motion } from "framer-motion";
import { User, Mail, Phone, Calendar, Camera, CheckCircle, Shield } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ValidatedInput } from "@/components/ui/ValidatedInput";
import { emailSchema, nameSchema, phoneSchema } from "@/lib/form-validation";

interface ContactFormStepProps {
  name: string;
  email: string;
  phone: string;
  moveDate: string;
  useVideoAI: boolean;
  privacyAccepted: boolean;
  selectedCompanyCount: number;
  onUpdateField: (field: string, value: string | boolean) => void;
}

export const ContactFormStep = memo(function ContactFormStep({
  name,
  email,
  phone,
  moveDate,
  useVideoAI,
  privacyAccepted,
  selectedCompanyCount,
  onUpdateField,
}: ContactFormStepProps) {
  return (
    <div className="space-y-4">
      <div className="text-center mb-4">
        <h3 className="text-lg font-bold">Fast geschafft!</h3>
        <p className="text-sm text-muted-foreground">
          Wohin sollen wir die {selectedCompanyCount > 0 ? selectedCompanyCount : ""} Offerten senden?
        </p>
        <p className="text-xs text-green-600 dark:text-green-400 mt-2 font-medium">
          → Sie erhalten die Offerten per E-Mail innerhalb von 24–48h
        </p>
      </div>

      <div className="space-y-3">
        <ValidatedInput
          schema={nameSchema}
          value={name}
          onValueChange={(v) => onUpdateField("name", v)}
          label="Name *"
          icon={<User className="w-4 h-4 text-primary" />}
          placeholder="Ihr vollständiger Name"
        />

        <ValidatedInput
          schema={emailSchema}
          value={email}
          onValueChange={(v) => onUpdateField("email", v)}
          label="E-Mail *"
          icon={<Mail className="w-4 h-4 text-primary" />}
          placeholder="ihre@email.ch"
          type="email"
        />

        <ValidatedInput
          schema={phoneSchema}
          value={phone}
          onValueChange={(v) => onUpdateField("phone", v)}
          label="Telefon (optional)"
          icon={<Phone className="w-4 h-4 text-muted-foreground" />}
          placeholder="+41 79 123 45 67"
          type="tel"
          inputMode="tel"
          showSuccessIcon={false}
        />

        <div className="space-y-1.5">
          <label className="text-sm font-medium flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            Umzugsdatum (optional)
          </label>
          <Input
            type="date"
            value={moveDate}
            onChange={(e) => onUpdateField("moveDate", e.target.value)}
            className="h-12 rounded-xl"
          />
        </div>

        {/* KI Video-Analyse Option */}
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
            useVideoAI
              ? "border-primary bg-primary/10 shadow-medium ring-2 ring-primary/20"
              : "border-primary/30 bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5 hover:border-primary/50"
          }`}
          onClick={() => onUpdateField("useVideoAI", !useVideoAI)}
        >
          <div className="flex items-start gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                useVideoAI ? "bg-primary text-primary-foreground" : "bg-primary/20"
              }`}
            >
              <Camera className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold">KI Video-Analyse</p>
                <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full font-medium">
                  Empfohlen
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Raum scannen statt Liste tippen – KI berechnet Volumen automatisch
              </p>
              <p className="text-[10px] text-green-600 dark:text-green-400 mt-1.5 font-medium">
                → Exaktere Preise, weniger Nachforderungen
              </p>
            </div>
            <div
              className={`mt-1 w-5 h-5 rounded-full flex items-center justify-center border-2 transition-colors ${
                useVideoAI ? "bg-primary border-primary" : "border-border"
              }`}
            >
              {useVideoAI && <CheckCircle className="w-3.5 h-3.5 text-primary-foreground" />}
            </div>
          </div>
        </motion.div>

        {/* Privacy Checkbox */}
        <div className="flex items-start gap-3">
          <Checkbox
            id="privacy"
            checked={privacyAccepted}
            onCheckedChange={(checked) => onUpdateField("privacyAccepted", !!checked)}
            className="mt-0.5"
          />
          <label htmlFor="privacy" className="text-xs text-muted-foreground cursor-pointer">
            Ich akzeptiere die{" "}
            <a href="/datenschutz" className="text-primary hover:underline">
              Datenschutzerklärung
            </a>{" "}
            und bin einverstanden, dass meine Daten zur Offerteneinholung weitergegeben werden.{" "}
            <span className="text-green-600 dark:text-green-400 font-medium">Keine Werbeanrufe.</span>
          </label>
        </div>
      </div>
    </div>
  );
});
