import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  CheckCircle, Mail, Clock, Globe, Gavel, Users, 
  ArrowRight, Bell, ExternalLink, Sparkles, TrendingDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Header } from "@/components/homepage/Header";

export default function UmzugsoffertenBestaetigung() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(true);
  const [leadId, setLeadId] = useState<string | null>(null);
  const [listingId, setListingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Extract params
  const submitOption = searchParams.get("submitOption") as "direct" | "publish" | "both" | null;
  const name = searchParams.get("name") || "";
  const email = searchParams.get("email") || "";
  const phone = searchParams.get("phone") || "";
  const fromLocation = searchParams.get("from") || "";
  const toLocation = searchParams.get("to") || "";
  const moveDate = searchParams.get("date") || "";
  const apartmentSize = searchParams.get("size") || "";
  const services = searchParams.get("services")?.split(",") || ["umzug"];
  const companies = searchParams.get("companies")?.split(",").filter(Boolean) || [];
  const priceMin = parseInt(searchParams.get("priceMin") || "0");
  const priceMax = parseInt(searchParams.get("priceMax") || "0");

  // Extract postal code and city
  const fromParts = fromLocation.split(" ");
  const fromPostal = fromParts[0] || "";
  const fromCity = fromParts.slice(1).join(" ") || fromLocation;
  
  const toParts = toLocation.split(" ");
  const toPostal = toParts[0] || "";
  const toCity = toParts.slice(1).join(" ") || toLocation;

  useEffect(() => {
    const createLeadAndListing = async () => {
      if (!email || !fromLocation || !toLocation) {
        setError("Fehlende Daten. Bitte füllen Sie das Formular erneut aus.");
        setIsSubmitting(false);
        return;
      }

      try {
        // 1. Create the lead
        // Note: selected_company_ids expects UUIDs, so we store company selection in calculator_input instead
        const { data: lead, error: leadError } = await supabase
          .from("leads")
          .insert({
            name,
            email,
            phone: phone || null,
            from_postal: fromPostal,
            from_city: fromCity,
            to_postal: toPostal,
            to_city: toCity,
            move_date: moveDate || null,
            calculator_type: "umzug",
            calculator_input: {
              apartmentSize,
              services,
              fromLocation,
              toLocation,
              selectedCompanies: companies, // Store company selection here (can be any format)
            },
            calculator_output: {
              priceMin,
              priceMax,
            },
            // Don't use selected_company_ids - it expects UUIDs but we have temporary IDs like "zuerich-0"
            lead_source: submitOption === "publish" ? "public_listing" : "calculator",
          })
          .select()
          .single();

        if (leadError) throw leadError;
        setLeadId(lead.id);

        // 2. If publish or both, create public listing
        if (submitOption === "publish" || submitOption === "both") {
          const { data: listing, error: listingError } = await supabase
            .from("public_move_listings")
            .insert({
              lead_id: lead.id,
              from_postal: fromPostal,
              from_city: fromCity,
              to_postal: toPostal,
              to_city: toCity,
              apartment_size: apartmentSize,
              move_date: moveDate || new Date().toISOString().split("T")[0],
              services_requested: services,
              budget_min: priceMin,
              budget_max: priceMax,
              starting_price: priceMin,
              is_urgent: moveDate ? new Date(moveDate) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) : false,
              status: "active",
              visibility: "public",
            })
            .select()
            .single();

          if (listingError) {
            console.error("Listing error:", listingError);
            // Don't fail completely if listing fails
          } else {
            setListingId(listing.id);
          }
        }

        toast.success("Anfrage erfolgreich gesendet!");
      } catch (err) {
        console.error("Submit error:", err);
        setError("Fehler beim Senden. Bitte versuchen Sie es erneut.");
      } finally {
        setIsSubmitting(false);
      }
    };

    createLeadAndListing();
  }, []);

  if (isSubmitting) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-muted-foreground">Ihre Anfrage wird verarbeitet...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container max-w-lg mx-auto px-4 py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">❌</span>
          </div>
          <h1 className="text-2xl font-bold mb-2">Fehler</h1>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button onClick={() => navigate("/umzugsofferten")}>
            Zurück zum Rechner
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container max-w-2xl mx-auto px-4 py-8">
        {/* Success Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Anfrage erfolgreich gesendet!</h1>
          <p className="text-muted-foreground">
            Vielen Dank, {name.split(" ")[0]}! Wir haben Ihre Anfrage erhalten.
          </p>
        </motion.div>

        {/* What happens next */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4 mb-8"
        >
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Was passiert als nächstes?
          </h2>

          <div className="grid gap-3">
            {/* Direct contact info */}
            {(submitOption === "direct" || submitOption === "both") && companies.length > 0 && (
              <Card className="p-4 border-primary/20 bg-primary/5">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Direktkontakt mit {companies.length} Firmen</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Ihre ausgewählten Firmen werden direkt kontaktiert und melden sich innerhalb 
                      von <strong>24-48 Stunden</strong> mit persönlichen Offerten per E-Mail.
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {/* Public listing info */}
            {(submitOption === "publish" || submitOption === "both") && listingId && (
              <Card className="p-4 border-amber-400/30 bg-amber-50/50 dark:bg-amber-950/20">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center shrink-0">
                    <Gavel className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-sm">Ausschreibung ist live!</p>
                      <Badge className="text-[8px] bg-green-500 text-white">Aktiv</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Ihr Umzug ist jetzt für alle registrierten Firmen sichtbar. 
                      Bieter können Angebote abgeben – Sie werden per E-Mail benachrichtigt.
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="text-[9px] gap-1">
                        <TrendingDown className="w-2.5 h-2.5" />
                        Startpreis: CHF {priceMin}
                      </Badge>
                      <Badge variant="outline" className="text-[9px] gap-1">
                        <Clock className="w-2.5 h-2.5" />
                        14 Tage aktiv
                      </Badge>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Email confirmation */}
            <Card className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <Bell className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-semibold text-sm">E-Mail-Bestätigung</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Eine Bestätigung wurde an <strong>{email}</strong> gesendet. 
                    Prüfen Sie auch Ihren Spam-Ordner.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </motion.div>

        {/* Move Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Card className="p-4">
            <h3 className="font-semibold text-sm mb-3">Ihre Umzugsdetails</h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-muted-foreground">Von:</span>
                <p className="font-medium">{fromLocation}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Nach:</span>
                <p className="font-medium">{toLocation}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Datum:</span>
                <p className="font-medium">{moveDate || "Flexibel"}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Grösse:</span>
                <p className="font-medium">{apartmentSize} Zimmer</p>
              </div>
              <div className="col-span-2">
                <span className="text-muted-foreground">Services:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {services.map((service) => (
                    <Badge key={service} variant="secondary" className="text-[9px]">
                      {service}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="col-span-2">
                <span className="text-muted-foreground">Geschätzter Preis:</span>
                <p className="font-bold text-primary">CHF {priceMin.toLocaleString()} – {priceMax.toLocaleString()}</p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <Button 
            onClick={() => navigate("/")} 
            variant="outline"
            className="flex-1"
          >
            Zur Startseite
          </Button>
          
          {listingId && (
            <Button 
              onClick={() => navigate(`/ausschreibung/${listingId}`)}
              className="flex-1 gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              Ausschreibung ansehen
            </Button>
          )}
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 pt-6 border-t border-border"
        >
          <div className="flex flex-wrap justify-center gap-4 text-[10px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <CheckCircle className="w-3 h-3 text-green-500" />
              100% kostenlos
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle className="w-3 h-3 text-green-500" />
              Keine versteckten Gebühren
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle className="w-3 h-3 text-green-500" />
              Unverbindlich vergleichen
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
