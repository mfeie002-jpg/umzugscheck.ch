import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calculator, Phone, FileText, Calendar, Truck, ClipboardList } from "lucide-react";
import { Link } from "react-router-dom";

interface CantonQuickActionsProps {
  cantonName: string;
  cantonSlug: string;
}

export const CantonQuickActions = ({ cantonName, cantonSlug }: CantonQuickActionsProps) => {
  const actions = [
    { icon: Calculator, label: "Preis berechnen", link: "/rechner", desc: "Kostenlose Schätzung" },
    { icon: FileText, label: "Offerte anfordern", link: `/umzug-offerte?region=${cantonSlug}`, desc: "In 2 Minuten" },
    { icon: Calendar, label: "Termin buchen", link: "/kontakt", desc: "Beratungsgespräch" },
    { icon: Truck, label: "Firmen vergleichen", link: `/firmen?region=${cantonSlug}`, desc: `${cantonName}er Firmen` },
    { icon: ClipboardList, label: "Checkliste", link: "/ratgeber/umzugscheckliste", desc: "PDF Download" },
    { icon: Phone, label: "Anrufen", link: "tel:+41441234567", desc: "Direkter Kontakt" },
  ];

  return (
    <section className="py-10">
      <div className="container mx-auto px-4">
        <h3 className="text-xl font-semibold text-center mb-6">Schnellzugriff</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-5xl mx-auto">
          {actions.map((action, i) => {
            const Icon = action.icon;
            const isExternal = action.link.startsWith('tel:');
            
            const content = (
              <Card className="hover:shadow-lg hover:border-primary/30 transition-all cursor-pointer h-full">
                <CardContent className="p-4 text-center">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-2">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <p className="font-medium text-sm">{action.label}</p>
                  <p className="text-xs text-muted-foreground">{action.desc}</p>
                </CardContent>
              </Card>
            );

            return isExternal ? (
              <a key={i} href={action.link}>{content}</a>
            ) : (
              <Link key={i} to={action.link}>{content}</Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};
