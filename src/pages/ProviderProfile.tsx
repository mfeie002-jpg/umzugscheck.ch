import { useEffect, useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { Helmet } from "react-helmet";
import { Loader2, ArrowLeft } from "lucide-react";
import { useProviderAuth } from "@/contexts/ProviderAuthContext";

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

const ProviderProfile = () => {
  const navigate = useNavigate();
  const { provider, loading: authLoading, updateProvider } = useProviderAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    companyName: "",
    contactPersonName: "",
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

  useEffect(() => {
    if (!authLoading && !provider) {
      navigate('/anbieter/login');
    } else if (provider) {
      setFormData({
        companyName: provider.company_name,
        contactPersonName: provider.contact_person_name,
        phone: provider.phone,
        website: provider.website || "",
        street: provider.street,
        zip: provider.zip,
        city: provider.city,
        description: provider.description || "",
        fleetSize: provider.fleet_size?.toString() || "",
        employeesCount: provider.employees_count?.toString() || "",
        priceLevel: provider.price_level || "fair",
        cantonsServed: provider.cantons_served,
        servicesOffered: provider.services_offered
      });
    }
  }, [provider, authLoading, navigate]);

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
      const { error } = await updateProvider({
        company_name: formData.companyName,
        contact_person_name: formData.contactPersonName,
        phone: formData.phone,
        website: formData.website || null,
        street: formData.street,
        zip: formData.zip,
        city: formData.city,
        cantons_served: formData.cantonsServed,
        services_offered: formData.servicesOffered,
        description: formData.description || null,
        fleet_size: formData.fleetSize ? parseInt(formData.fleetSize) : null,
        employees_count: formData.employeesCount ? parseInt(formData.employeesCount) : null,
        price_level: formData.priceLevel
      } as any);

      if (error) {
        toast.error(error);
        return;
      }

      toast.success('Profil erfolgreich aktualisiert!');
      navigate('/anbieter/dashboard');
      
    } catch (error) {
      toast.error('Ein Fehler ist aufgetreten');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || !provider) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Helmet>
        <title>Profil bearbeiten - {provider.company_name} | Umzugscheck.ch</title>
      </Helmet>

      <Navigation />
      
      <main className="flex-1 py-12">
        <div className="container max-w-3xl mx-auto px-4">
          <div className="mb-8">
            <Button variant="ghost" asChild className="mb-4">
              <Link to="/anbieter/dashboard">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Zurück zum Dashboard
              </Link>
            </Button>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Profil bearbeiten
            </h1>
            <p className="text-muted-foreground">
              Aktualisieren Sie Ihre Firmendaten und Präferenzen
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8 bg-card border rounded-lg p-6">
            {/* Company Info */}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Firmendaten</h2>
              
              <div>
                <Label htmlFor="companyName">Firmenname</Label>
                <Input
                  id="companyName"
                  required
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="contactPersonName">Ansprechpartner</Label>
                <Input
                  id="contactPersonName"
                  required
                  value={formData.contactPersonName}
                  onChange={(e) => setFormData({ ...formData, contactPersonName: e.target.value })}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Telefonnummer</Label>
                  <Input
                    id="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="website">Webseite</Label>
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
                <Label htmlFor="street">Strasse & Hausnummer</Label>
                <Input
                  id="street"
                  required
                  value={formData.street}
                  onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="zip">PLZ</Label>
                  <Input
                    id="zip"
                    required
                    value={formData.zip}
                    onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="city">Ort</Label>
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
              <h2 className="text-2xl font-semibold">Kantone</h2>
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
              <h2 className="text-2xl font-semibold">Leistungen</h2>
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
                <Label htmlFor="description">Kurzbeschreibung</Label>
                <Textarea
                  id="description"
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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

            <div className="pt-4 border-t flex gap-4">
              <Button 
                type="submit" 
                size="lg"
                disabled={loading}
                className="flex-1"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Wird gespeichert...
                  </>
                ) : (
                  'Änderungen speichern'
                )}
              </Button>
              <Button 
                type="button"
                size="lg"
                variant="outline"
                asChild
              >
                <Link to="/anbieter/dashboard">Abbrechen</Link>
              </Button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProviderProfile;
