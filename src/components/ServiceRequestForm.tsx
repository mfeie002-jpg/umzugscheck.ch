import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Send, Package, Truck, Home, Building2 } from "lucide-react";
import { motion } from "framer-motion";

const serviceTypes = [
  { value: "private", label: "Privatumzug", icon: Home },
  { value: "office", label: "Büroumzug", icon: Building2 },
  { value: "transport", label: "Transport", icon: Truck },
  { value: "storage", label: "Lagerung", icon: Package },
];

const additionalServices = [
  { id: "packing", label: "Verpackungsservice" },
  { id: "assembly", label: "Möbelmontage" },
  { id: "cleaning", label: "Endreinigung" },
  { id: "disposal", label: "Entsorgung" },
  { id: "insurance", label: "Zusatzversicherung" },
];

export default function ServiceRequestForm() {
  const [formData, setFormData] = useState({
    serviceType: "",
    fromAddress: "",
    toAddress: "",
    preferredDate: "",
    rooms: "",
    specialItems: "",
    additionalServices: [] as string[],
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast.success("Anfrage erfolgreich gesendet!", {
      description: "Wir werden uns innerhalb von 24 Stunden bei Ihnen melden.",
    });

    setFormData({
      serviceType: "",
      fromAddress: "",
      toAddress: "",
      preferredDate: "",
      rooms: "",
      specialItems: "",
      additionalServices: [],
      notes: "",
    });
    setSubmitting(false);
  };

  const toggleService = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      additionalServices: prev.additionalServices.includes(id)
        ? prev.additionalServices.filter((s) => s !== id)
        : [...prev.additionalServices, id],
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Send className="w-5 h-5" />
          Service anfragen
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label>Art des Services</Label>
            <div className="grid grid-cols-2 gap-3">
              {serviceTypes.map((type) => (
                <motion.button
                  key={type.value}
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-4 rounded-lg border text-left transition-colors ${
                    formData.serviceType === type.value
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                  onClick={() => setFormData({ ...formData, serviceType: type.value })}
                >
                  <type.icon className="w-5 h-5 mb-2 text-primary" />
                  <span className="font-medium text-sm">{type.label}</span>
                </motion.button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="from">Von (Adresse)</Label>
              <Input
                id="from"
                value={formData.fromAddress}
                onChange={(e) => setFormData({ ...formData, fromAddress: e.target.value })}
                placeholder="Strasse, PLZ Ort"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="to">Nach (Adresse)</Label>
              <Input
                id="to"
                value={formData.toAddress}
                onChange={(e) => setFormData({ ...formData, toAddress: e.target.value })}
                placeholder="Strasse, PLZ Ort"
                required
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Wunschtermin</Label>
              <Input
                id="date"
                type="date"
                value={formData.preferredDate}
                onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rooms">Anzahl Zimmer</Label>
              <Select
                value={formData.rooms}
                onValueChange={(value) => setFormData({ ...formData, rooms: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Auswählen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Zimmer</SelectItem>
                  <SelectItem value="2">2 Zimmer</SelectItem>
                  <SelectItem value="3">3 Zimmer</SelectItem>
                  <SelectItem value="4">4 Zimmer</SelectItem>
                  <SelectItem value="5">5+ Zimmer</SelectItem>
                  <SelectItem value="office">Büro/Gewerbe</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Zusatzleistungen</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {additionalServices.map((service) => (
                <div key={service.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={service.id}
                    checked={formData.additionalServices.includes(service.id)}
                    onCheckedChange={() => toggleService(service.id)}
                  />
                  <label htmlFor={service.id} className="text-sm cursor-pointer">
                    {service.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="special">Besondere Gegenstände</Label>
            <Input
              id="special"
              value={formData.specialItems}
              onChange={(e) => setFormData({ ...formData, specialItems: e.target.value })}
              placeholder="z.B. Klavier, Tresor, Aquarium..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Zusätzliche Informationen</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Weitere Details zu Ihrem Umzug..."
              rows={3}
            />
          </div>

          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? (
              "Wird gesendet..."
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Unverbindliche Anfrage senden
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}