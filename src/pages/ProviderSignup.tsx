import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Helmet } from "react-helmet";
import { Loader2 } from "lucide-react";

const SWISS_CANTONS = [
  "Aargau", "Appenzell Ausserrhoden", "Appenzell Innerrhoden", "Basel-Landschaft", 
  "Basel-Stadt", "Bern", "Freiburg", "Genf", "Glarus", "Graubünden", "Jura", 
  "Luzern", "Neuenburg", "Nidwalden", "Obwalden", "Schaffhausen", "Schwyz", 
  "Solothurn", "St. Gallen", "Tessin", "Thurgau", "Uri", "Waadt", "Wallis", 
  "Zug", "Zürich"
];

const SERVICES = [
  "Privatumzug",
  "Firmenumzug",
  "Wohnungsendreinigung",
  "Entsorgung & Räumung",
  "Lagerung",
  "Packservice",
  "Möbelmontage"
];

const PRICE_LEVELS = [
  { value: "günstig", label: "Günstig" },
  { value: "fair", label: "Fair" },
  { value: "premium", label: "Premium" }
];

const ProviderSignup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    companyName: "",
    contactPersonName: "",
    email: "",
    password: "",
    phone: "",
    website: "",
    street: "",
    zip: "",
    city: "",
    description: "",
    fleetSize: "",
    employeesCount: "",
    priceLevel: "fair",
    cantonsServed: [] as string[],
    servicesOffered: [] as string[]
  });

  const handleCantonToggle = (canton: string) => {
    setFormData(prev => ({
      ...prev,
      cantonsServed: prev.cantonsServed.includes(canton)
        ? prev.cantonsServed.filter(c => c !== canton)
        : [...prev.cantonsServed, canton]
    }));
  };

  const handleServiceToggle = (service: string) => {
    setFormData(prev => ({
      ...prev,
      servicesOffered: prev.servicesOffered.includes(service)
        ? prev.servicesOffered.filter(s => s !== service)
        : [...prev.servicesOffered, service]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('provider-signup', {
        body: {
          companyName: formData.companyName,
          contactPersonName: formData.contactPersonName,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          website: formData.website || null,
          street: formData.street,
          zip: formData.zip,
          city: formData.city,
          cantonsServed: formData.cantonsServed,
          servicesOffered: formData.servicesOffered,
          description: formData.description || null,
          fleetSize: formData.fleetSize ? parseInt(formData.fleetSize) : null,
          employeesCount: formData.employeesCount ? parseInt(formData.employeesCount) : null,
          priceLevel: formData.priceLevel
        }
      });

      if (error || !data.success) {
        toast.error(data?.error || 'Registrierung fehlgeschlagen');
        return;
      }

      toast.success('Registrierung erfolgreich!');
      navigate('/anbieter/login');
      
    } catch (error) {
      toast.error('Ein Fehler ist aufgetreten');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Helmet>
        <title>Partner Registrierung - Umzugscheck.ch</title>
      </Helmet>

      <Navigation />
      
      <main className="flex-1 py-12">
        <div className="container max-w-3xl mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Als Umzugspartner registrieren
            </h1>
            <p className="text-muted-foreground">
              Füllen Sie das Formular aus und werden Sie Teil unseres Netzwerks
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8 bg-card border rounded-lg p-6">
            {/* Company Info */}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Firmendaten</h2>
              
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
                <Label htmlFor="contactPersonName">Ansprechpartner *</Label>
                <Input
                  id="contactPersonName"
                  required
                  value={formData.contactPersonName}
                  onChange={(e) => setFormData({ ...formData, contactPersonName: e.target.value })}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">E-Mail (Login) *</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="password">Passwort *</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    minLength={8}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Telefonnummer *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="website">Webseite (optional)</Label>
                  <Input
                    id="website"
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Adresse</h2>
              
              <div>
                <Label htmlFor="street">Strasse & Hausnummer *</Label>
                <Input
                  id="street"
                  required
                  value={formData.street}
                  onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
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
            </div>

            {/* Cantons */}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Kantone (Mehrfachauswahl) *</h2>
              <p className="text-sm text-muted-foreground">
                Wählen Sie die Kantone aus, in denen Sie Dienstleistungen anbieten
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {SWISS_CANTONS.map(canton => (
                  <div key={canton} className="flex items-center space-x-2">
                    <Checkbox
                      id={`canton-${canton}`}
                      checked={formData.cantonsServed.includes(canton)}
                      onCheckedChange={() => handleCantonToggle(canton)}
                    />
                    <Label htmlFor={`canton-${canton}`} className="cursor-pointer">
                      {canton}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Services */}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Leistungen (Mehrfachauswahl) *</h2>
              <div className="grid md:grid-cols-2 gap-3">
                {SERVICES.map(service => (
                  <div key={service} className="flex items-center space-x-2">
                    <Checkbox
                      id={`service-${service}`}
                      checked={formData.servicesOffered.includes(service)}
                      onCheckedChange={() => handleServiceToggle(service)}
                    />
                    <Label htmlFor={`service-${service}`} className="cursor-pointer">
                      {service}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Info */}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Weitere Informationen</h2>
              
              <div>
                <Label htmlFor="description">Kurzbeschreibung / Firmenprofil</Label>
                <Textarea
                  id="description"
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Beschreiben Sie Ihre Firma und Ihre Leistungen..."
                />
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="fleetSize">Flottengrösse</Label>
                  <Input
                    id="fleetSize"
                    type="number"
                    min="0"
                    value={formData.fleetSize}
                    onChange={(e) => setFormData({ ...formData, fleetSize: e.target.value })}
                    placeholder="Anzahl Fahrzeuge"
                  />
                </div>
                <div>
                  <Label htmlFor="employeesCount">Anzahl Mitarbeiter</Label>
                  <Input
                    id="employeesCount"
                    type="number"
                    min="0"
                    value={formData.employeesCount}
                    onChange={(e) => setFormData({ ...formData, employeesCount: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="priceLevel">Preisniveau</Label>
                  <select
                    id="priceLevel"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={formData.priceLevel}
                    onChange={(e) => setFormData({ ...formData, priceLevel: e.target.value })}
                  >
                    {PRICE_LEVELS.map(level => (
                      <option key={level.value} value={level.value}>
                        {level.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <Button 
                type="submit" 
                size="lg" 
                className="w-full"
                disabled={loading || formData.cantonsServed.length === 0 || formData.servicesOffered.length === 0}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Wird registriert...
                  </>
                ) : (
                  'Jetzt registrieren'
                )}
              </Button>
              <p className="text-sm text-muted-foreground text-center mt-4">
                Nach der Registrierung wird Ihr Account geprüft und innerhalb von 24 Stunden freigeschaltet.
              </p>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProviderSignup;
