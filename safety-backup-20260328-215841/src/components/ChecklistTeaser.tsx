import { ClipboardCheck, Download, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import AnimatedSection from "./AnimatedSection";

const ChecklistTeaser = () => {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <AnimatedSection>
          <Card className="p-6 md:p-8 max-w-3xl mx-auto bg-muted/50">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-14 h-14 rounded-xl bg-forest/10 flex items-center justify-center">
                <ClipboardCheck className="h-7 w-7 text-forest" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="font-bold text-lg">Kostenlose Umzugscheckliste</h3>
                <p className="text-sm text-muted-foreground">
                  12 Wochen vorher bis Einzugstag – nichts vergessen!
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  PDF
                </Button>
                <Link to="/guide/umzugscheckliste">
                  <Button variant="ghost" size="sm">
                    Online ansehen
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default ChecklistTeaser;
