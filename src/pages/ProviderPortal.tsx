import { useState } from "react";
import { Helmet } from "react-helmet";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, Mail, Lock, Phone, MapPin, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export default function ProviderPortal() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Login erfolgreich",
        description: "Sie werden weitergeleitet...",
      });
      setIsLoading(false);
      navigate("/firmen-portal/dashboard");
    }, 1000);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Registrierung erfolgreich",
        description: "Ihr Account wird geprüft. Sie erhalten eine E-Mail.",
      });
      setIsLoading(false);
    }, 1000);
  };

  return (
    <>
      <Helmet>
        <title>Firmen-Portal - Login & Registrierung | Umzugscheck.ch</title>
        <meta name="description" content="Melden Sie sich an oder registrieren Sie Ihre Umzugsfirma bei Umzugscheck.ch" />
      </Helmet>

      <div className="min-h-screen flex flex-col bg-background">
        
        <main className="flex-1 py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold mb-4">Firmen-Portal</h1>
                <p className="text-lg text-muted-foreground">
                  Verwalten Sie Ihre Leads, Ihr Profil und Ihre Abonnements
                </p>
              </div>

              <Card className="p-6 sm:p-8">
                <Tabs defaultValue="login" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-8">
                    <TabsTrigger value="login">Login</TabsTrigger>
                    <TabsTrigger value="register">Registrierung</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="login">
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">E-Mail</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="email"
                            type="email"
                            placeholder="firma@beispiel.ch"
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="password">Passwort</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>

                      <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                        {isLoading ? "Wird geladen..." : "Anmelden"}
                      </Button>

                      <div className="text-center text-sm text-muted-foreground">
                        <button
                          type="button"
                          className="hover:underline"
                          onClick={() =>
                            toast({
                              title: "Passwort-Reset kommt bald",
                              description:
                                "Bitte kontaktieren Sie uns vorerst via E-Mail (info@umzugscheck.ch).",
                            })
                          }
                        >
                          Passwort vergessen?
                        </button>
                      </div>
                    </form>
                  </TabsContent>
                  
                  <TabsContent value="register">
                    <form onSubmit={handleRegister} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="company-name">Firmenname</Label>
                        <div className="relative">
                          <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="company-name"
                            placeholder="Ihre Umzugsfirma AG"
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="contact-person">Kontaktperson</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="contact-person"
                            placeholder="Max Mustermann"
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="reg-email">E-Mail</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="reg-email"
                            type="email"
                            placeholder="firma@beispiel.ch"
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Telefon</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="+41 44 123 45 67"
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="region">Hauptregion</Label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="region"
                            placeholder="z.B. Zürich, Bern, Basel"
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="reg-password">Passwort</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="reg-password"
                            type="password"
                            placeholder="Mindestens 8 Zeichen"
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>

                      <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                        {isLoading ? "Wird registriert..." : "Jetzt registrieren"}
                      </Button>

                      <p className="text-xs text-muted-foreground text-center">
                        Mit der Registrierung akzeptieren Sie unsere{" "}
                        <Link
                          to="/agb"
                          className="underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          AGB
                        </Link>{" "}
                        und{" "}
                        <Link
                          to="/datenschutz"
                          className="underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Datenschutzbestimmungen
                        </Link>.
                      </p>
                    </form>
                  </TabsContent>
                </Tabs>
              </Card>

              {/* Benefits Section */}
              <div className="mt-12 grid sm:grid-cols-3 gap-6">
                <Card className="p-6 text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Building2 className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Qualifizierte Leads</h3>
                  <p className="text-sm text-muted-foreground">
                    Erhalten Sie Anfragen von echten Kunden in Ihrer Region
                  </p>
                </Card>

                <Card className="p-6 text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Regionale Sichtbarkeit</h3>
                  <p className="text-sm text-muted-foreground">
                    Werden Sie in Ihrer Region gefunden und verglichen
                  </p>
                </Card>

                <Card className="p-6 text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Call-Tracking</h3>
                  <p className="text-sm text-muted-foreground">
                    Verfolgen Sie alle Anrufe und messen Sie Ihren Erfolg
                  </p>
                </Card>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}