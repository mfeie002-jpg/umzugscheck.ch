/**
 * Support Contact V3 - Persönlicher Ansprechpartner
 * Addresses gap: "Persönlicher Kontakt fehlt"
 */
import { memo } from 'react';
import { Phone, Mail, MessageCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const SupportContact = memo(function SupportContact() {
  return (
    <section className="py-12 bg-muted/20 border-y border-border">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Team Photo */}
            <div className="flex -space-x-3">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face"
                alt="Umzugsberater"
                className="w-14 h-14 rounded-full border-4 border-background object-cover"
              />
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&h=60&fit=crop&crop=face"
                alt="Kundenberaterin"
                className="w-14 h-14 rounded-full border-4 border-background object-cover"
              />
              <div className="w-14 h-14 rounded-full border-4 border-background bg-secondary flex items-center justify-center">
                <span className="text-white font-bold text-sm">+5</span>
              </div>
            </div>

            {/* Text */}
            <div className="flex-1 text-center md:text-left">
              <h3 className="font-bold text-lg mb-1">
                Fragen? Unser Team hilft gerne.
              </h3>
              <p className="text-muted-foreground text-sm flex items-center justify-center md:justify-start gap-2">
                <Clock className="w-4 h-4" />
                Mo-Fr 8:00 - 18:00 Uhr
              </p>
            </div>

            {/* Contact Options */}
            <div className="flex flex-wrap justify-center gap-3">
              <Button variant="outline" size="sm" className="gap-2" asChild>
                <a href="tel:+41446880404">
                  <Phone className="w-4 h-4" />
                  <span className="hidden sm:inline">044 688 04 04</span>
                  <span className="sm:hidden">Anrufen</span>
                </a>
              </Button>
              <Button variant="outline" size="sm" className="gap-2" asChild>
                <a href="mailto:info@umzugscheck.ch">
                  <Mail className="w-4 h-4" />
                  <span className="hidden sm:inline">E-Mail</span>
                </a>
              </Button>
              <Button variant="outline" size="sm" className="gap-2 border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white">
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});
