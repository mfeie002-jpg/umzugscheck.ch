import { useState } from "react";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { Helmet } from "react-helmet";
import { Loader2 } from "lucide-react";
import { useProviderAuth } from "@/contexts/ProviderAuthContext";

const ProviderLogin = () => {
  const navigate = useNavigate();
  const { signIn } = useProviderAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await signIn(formData.email, formData.password);
      
      if (error) {
        toast.error(error);
        return;
      }

      toast.success('Erfolgreich angemeldet!');
      navigate('/anbieter/dashboard');
      
    } catch (error) {
      toast.error('Ein Fehler ist aufgetreten');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Helmet>
        <title>Partner Login - Umzugscheck.ch</title>
      </Helmet>

      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">Partner Login</h1>
            <p className="text-muted-foreground">
              Melden Sie sich bei Ihrem Partner-Dashboard an
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 bg-card border rounded-lg p-6">
            <div>
              <Label htmlFor="email">E-Mail</Label>
              <Input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="password">Passwort</Label>
              <Input
                id="password"
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

            <Button 
              type="submit" 
              size="lg" 
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Wird angemeldet...
                </>
              ) : (
                'Anmelden'
              )}
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              Noch kein Partner?{' '}
              <Link to="/anbieter-werden" className="text-primary hover:underline">
                Jetzt registrieren
              </Link>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProviderLogin;
