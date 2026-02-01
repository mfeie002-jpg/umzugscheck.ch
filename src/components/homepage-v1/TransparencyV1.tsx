/**
 * Transparency V1 - 'Wie verdient ihr Geld?' Abschnitt
 * P1 Improvement #9 from Analysis
 * 
 * Counter-intuitiv aber extrem wirksam. Ehrlichkeit = Trust.
 */
import { memo, useState } from 'react';
import { Info, ChevronDown, ChevronUp, Handshake, DollarSign, Shield, Users } from 'lucide-react';

export const TransparencyV1 = memo(function TransparencyV1() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section className="py-12 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          {/* Mobile: Collapsible Info */}
          <div className="md:hidden">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full flex items-center justify-between p-4 bg-card rounded-xl border border-border/50"
            >
              <div className="flex items-center gap-3">
                <Info className="w-5 h-5 text-secondary" />
                <span className="font-semibold">Wie finanzieren wir uns?</span>
              </div>
              {isExpanded ? (
                <ChevronUp className="w-5 h-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="w-5 h-5 text-muted-foreground" />
              )}
            </button>
            
            {isExpanded && (
              <div className="mt-2 p-4 bg-card rounded-xl border border-border/50 text-sm text-muted-foreground leading-relaxed">
                <p className="mb-3">
                  <strong className="text-foreground">100% transparent:</strong> Unser Service ist für Sie komplett kostenlos. 
                  Umzugsfirmen zahlen uns eine kleine Vermittlungsgebühr, wenn Sie einen Auftrag über uns erhalten.
                </p>
                <p>
                  Das bedeutet: Wir verdienen nur, wenn Sie zufrieden sind und eine Firma beauftragen. 
                  Darum liegt uns Ihre Zufriedenheit am Herzen.
                </p>
              </div>
            )}
          </div>

          {/* Desktop: Always Visible */}
          <div className="hidden md:block bg-card rounded-2xl border border-border/50 p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Handshake className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Wie finanzieren wir uns?</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Wir glauben an <strong className="text-foreground">100% Transparenz</strong>. 
                  Unser Service ist für Sie komplett kostenlos und unverbindlich. 
                  Umzugsfirmen zahlen uns eine kleine Vermittlungsgebühr, wenn Sie einen Auftrag über uns erhalten.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border/50">
              <div className="text-center">
                <DollarSign className="w-6 h-6 text-green-500 mx-auto mb-2" />
                <div className="text-sm font-semibold">Für Sie gratis</div>
                <div className="text-xs text-muted-foreground">Keine versteckten Kosten</div>
              </div>
              <div className="text-center">
                <Shield className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                <div className="text-sm font-semibold">Unabhängig</div>
                <div className="text-xs text-muted-foreground">Wir bevorzugen niemanden</div>
              </div>
              <div className="text-center">
                <Users className="w-6 h-6 text-secondary mx-auto mb-2" />
                <div className="text-sm font-semibold">Win-Win</div>
                <div className="text-xs text-muted-foreground">Alle profitieren</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});
