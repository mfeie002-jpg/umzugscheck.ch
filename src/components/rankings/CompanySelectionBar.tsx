import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface CompanySelectionBarProps {
  selectedCompanyIds: string[];
  companies: Array<{ id: string; name: string; logo_url?: string }>;
  onRequestOffers: (contactData: ContactFormData) => void;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message?: string;
}

export const CompanySelectionBar = ({
  selectedCompanyIds,
  companies,
  onRequestOffers,
}: CompanySelectionBarProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const selectedCompanies = companies.filter(c => 
    selectedCompanyIds.includes(c.id)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.phone) {
      toast.error("Bitte füllen Sie alle Pflichtfelder aus");
      return;
    }
    
    onRequestOffers(formData);
    setIsDialogOpen(false);
    
    // Reset form
    setFormData({
      name: "",
      email: "",
      phone: "",
      message: "",
    });
  };

  if (selectedCompanyIds.length === 0) return null;

  return (
    <>
      <AnimatePresence>
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border shadow-2xl"
        >
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Selected Count & Companies */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  <Badge variant="default" className="text-base px-3 py-1">
                    {selectedCompanyIds.length} {selectedCompanyIds.length === 1 ? 'Firma' : 'Firmen'}
                  </Badge>
                </div>
                
                <div className="hidden sm:flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">ausgewählt:</span>
                  <div className="flex -space-x-2">
                    {selectedCompanies.slice(0, 3).map((company) => (
                      <div
                        key={company.id}
                        className="w-8 h-8 rounded-full bg-muted border-2 border-background flex items-center justify-center text-lg"
                        title={company.name}
                      >
                        {company.logo_url || "🏢"}
                      </div>
                    ))}
                    {selectedCompanies.length > 3 && (
                      <div className="w-8 h-8 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs font-semibold">
                        +{selectedCompanies.length - 3}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <Button
                size="lg"
                className="w-full sm:w-auto min-w-[280px]"
                onClick={() => setIsDialogOpen(true)}
              >
                <CheckCircle2 className="w-5 h-5 mr-2" />
                Offerten von ausgewählten Firmen erhalten
              </Button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Lead Capture Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Offerten anfordern</DialogTitle>
            <DialogDescription>
              Erhalten Sie kostenlose Offerten von {selectedCompanyIds.length} ausgewählten Umzugsfirmen
            </DialogDescription>
          </DialogHeader>

          {/* Selected Companies Preview */}
          <div className="bg-muted rounded-lg p-4 space-y-2">
            <p className="text-sm font-semibold">Ausgewählte Firmen:</p>
            <div className="space-y-2">
              {selectedCompanies.map((company) => (
                <div key={company.id} className="flex items-center gap-2 text-sm">
                  <span className="text-lg">{company.logo_url || "🏢"}</span>
                  <span>{company.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div>
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ihr vollständiger Name"
                required
              />
            </div>

            <div>
              <Label htmlFor="email">E-Mail *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="ihre.email@beispiel.ch"
                required
              />
            </div>

            <div>
              <Label htmlFor="phone">Telefon *</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+41 79 123 45 67"
                required
              />
            </div>

            <div>
              <Label htmlFor="message">Nachricht (optional)</Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Zusätzliche Informationen zu Ihrem Umzug..."
                rows={3}
              />
            </div>

            <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
              <p className="text-xs text-blue-700 dark:text-blue-300">
                ✓ 100% kostenlos & unverbindlich<br />
                ✓ Ihre Daten werden sicher verschlüsselt<br />
                ✓ Sie erhalten Offerten innerhalb von 24 Stunden
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="flex-1"
              >
                Abbrechen
              </Button>
              <Button type="submit" className="flex-1">
                Offerten anfordern
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};
