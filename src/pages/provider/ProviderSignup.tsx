import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Helmet } from "react-helmet";
import { CheckCircle2, TruckIcon } from "lucide-react";

const SWISS_CANTONS = ["ZH", "BE", "LU", "UR", "SZ", "OW", "NW", "GL", "ZG", "FR", "SO", "BS", "BL", "SH", "AR", "AI", "SG", "GR", "AG", "TG", "TI", "VD", "VS", "NE", "GE", "JU"];

const SERVICES = ["Umzug", "Reinigung", "Entsorgung", "Lagerung", "Möbelmontage", "Packservice", "Klaviertransport", "Firmenumzug"];

const BILLING_MODELS = [
  { value: "CPL", label: "Cost-Per-Lead (bezahlen pro Anfrage)" },
  { value: "PPC", label: "Pay-Per-Click (bezahlen pro Klick)" },
  { value: "Subscription", label: "Abo-Modell (Fixpreis monatlich)" }
];

const SUBSCRIPTION_PLANS = [
  { value: "none", label: "Kein Abo (nur CPL/PPC)" },
  { value: "basic", label: "Basic (CHF 99/Monat)" },
  { value: "premium", label: "Premium (CHF 299/Monat)" },
  { value: "enterprise", label: "Enterprise (CHF 599/Monat)" }
];

export default function ProviderSignup() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    companyName: "",
    website: "",
    phone: "",
    email: "",
    password: "",
    street: "",
    zip: "",
    city: "",
    description: "",
    employeesCount: "",
    fleetSize: "",
    billingModel: "CPL" as "CPL" | "PPC" | "Subscription",
    leadPriceChf: "25",
    clickPriceChf: "1.50",
    subscriptionPlan: "none" as "none" | "basic" | "premium" | "enterprise",
    cantonsServed: [] as string[],
    servicesOffered: [] as string[]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('provider-signup', {
        body: {
          companyName: formData.companyName,
          contactPersonName: formData.companyName,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          website: formData.website,
          street: formData.street,
          zip: formData.zip,
          city: formData.city,
          cantonsServed: formData.cantonsServed,
          servicesOffered: formData.servicesOffered,
          description: formData.description,
          fleetSize: parseInt(formData.fleetSize) || null,
          employeesCount: parseInt(formData.employeesCount) || null,
          billingModel: formData.billingModel,
          leadPriceChf: parseFloat(formData.leadPriceChf),
          clickPriceChf: parseFloat(formData.clickPriceChf),
          subscriptionPlan: formData.subscriptionPlan
        }
      });

      if (error) throw error;

      toast.success("Registrierung erfolgreich! Ihr Account wird geprüft.");
      navigate("/anbieter/login");
    } catch (error: any) {
      console.error("Signup error:", error);
      toast.error(error.message || "Fehler bei der Registrierung");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background py-12">
      <Helmet>
        <title>Anbieter Registrierung | Umzugscheck.ch</title>
        <meta name="description" content="Registrieren Sie sich als Umzugspartner und erhalten Sie qualifizierte Leads" />
      </Helmet>

      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <TruckIcon className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-3">Werden Sie Partner von Umzugscheck.ch</h1>
          <p className="text-lg text-muted-foreground">Erhalten Sie qualifizierte Leads für Ihre Umzugsfirma</p>
        </div>

        <Card className="shadow-xl border-2">
          <CardHeader>
            <CardTitle>Firmen-Registrierung</CardTitle>
            <CardDescription>Füllen Sie alle Felder aus, um sich als Anbieter zu registrieren</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Company Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  Firmendaten
                </h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="companyName">Firmenname *</Label>
                    <Input
                      id="companyName"
                      required
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      type="url"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Telefonnummer *</Label>
                    <Input
                      id="phone"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">E-Mail *</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="password">Passwort *</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    minLength={6}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="street">Strasse *</Label>
                    <Input
                      id="street"
                      required
                      value={formData.street}
                      onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="zip">PLZ *</Label>
                    <Input
                      id="zip"
                      required
                      value={formData.zip}
                      onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="city">Ort *</Label>
                    <Input
                      id="city"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Firmenbeschreibung</Label>
                  <Textarea
                    id="description"
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="employeesCount">Anzahl Mitarbeiter</Label>
                    <Input
                      id="employeesCount"
                      type="number"
                      min="1"
                      value={formData.employeesCount}
                      onChange={(e) => setFormData({ ...formData, employeesCount: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="fleetSize">Anzahl Fahrzeuge</Label>
                    <Input
                      id="fleetSize"
                      type="number"
                      min="1"
                      value={formData.fleetSize}
                      onChange={(e) => setFormData({ ...formData, fleetSize: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Services & Regions */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  Services & Regionen
                </h3>

                <div>
                  <Label className="mb-2 block">Angebotene Services *</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {SERVICES.map((service) => (
                      <div key={service} className="flex items-center space-x-2">
                        <Checkbox
                          id={service}
                          checked={formData.servicesOffered.includes(service)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setFormData({ ...formData, servicesOffered: [...formData.servicesOffered, service] });
                            } else {
                              setFormData({ ...formData, servicesOffered: formData.servicesOffered.filter(s => s !== service) });
                            }
                          }}
                        />
                        <label htmlFor={service} className="text-sm cursor-pointer">{service}</label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="mb-2 block">Bediente Kantone *</Label>
                  <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                    {SWISS_CANTONS.map((canton) => (
                      <div key={canton} className="flex items-center space-x-2">
                        <Checkbox
                          id={canton}
                          checked={formData.cantonsServed.includes(canton)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setFormData({ ...formData, cantonsServed: [...formData.cantonsServed, canton] });
                            } else {
                              setFormData({ ...formData, cantonsServed: formData.cantonsServed.filter(c => c !== canton) });
                            }
                          }}
                        />
                        <label htmlFor={canton} className="text-sm cursor-pointer">{canton}</label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Billing Model */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  Abrechnungsmodell
                </h3>

                <div>
                  <Label htmlFor="billingModel">Billing-Modell wählen</Label>
                  <Select value={formData.billingModel} onValueChange={(value: any) => setFormData({ ...formData, billingModel: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {BILLING_MODELS.map(model => (
                        <SelectItem key={model.value} value={model.value}>{model.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {formData.billingModel === "CPL" && (
                  <div>
                    <Label htmlFor="leadPrice">Preis pro Lead (CHF)</Label>
                    <Input
                      id="leadPrice"
                      type="number"
                      step="0.01"
                      value={formData.leadPriceChf}
                      onChange={(e) => setFormData({ ...formData, leadPriceChf: e.target.value })}
                    />
                  </div>
                )}

                {formData.billingModel === "PPC" && (
                  <div>
                    <Label htmlFor="clickPrice">Preis pro Klick (CHF)</Label>
                    <Input
                      id="clickPrice"
                      type="number"
                      step="0.01"
                      value={formData.clickPriceChf}
                      onChange={(e) => setFormData({ ...formData, clickPriceChf: e.target.value })}
                    />
                  </div>
                )}

                <div>
                  <Label htmlFor="subscriptionPlan">Abo-Plan (optional)</Label>
                  <Select value={formData.subscriptionPlan} onValueChange={(value: any) => setFormData({ ...formData, subscriptionPlan: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SUBSCRIPTION_PLANS.map(plan => (
                        <SelectItem key={plan.value} value={plan.value}>{plan.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? "Registrierung läuft..." : "Jetzt registrieren"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
