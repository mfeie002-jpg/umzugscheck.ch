import { Phone, Mail, MessageCircle, Clock } from "lucide-react";
import { Button } from "./ui/button";

export default function QuickContactBar() {
  return (
    <section className="bg-gradient-hero text-primary-foreground py-4">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4" />
              <span>Mo-Fr 7-18h, Sa 8-14h</span>
            </div>
            <a href="tel:+41765681302" className="flex items-center gap-2 text-sm hover:underline">
              <Phone className="h-4 w-4" />
              <span className="font-semibold">+41 76 568 13 02</span>
            </a>
            <a href="mailto:info@feierabend-umzuege.ch" className="hidden md:flex items-center gap-2 text-sm hover:underline">
              <Mail className="h-4 w-4" />
              <span>info@feierabend-umzuege.ch</span>
            </a>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="https://wa.me/41765681302"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
            >
              <MessageCircle className="h-4 w-4" />
              <span className="hidden sm:inline">WhatsApp</span>
            </a>
            <Button variant="secondary" size="sm" asChild>
              <a href="/contact">Offerte anfragen</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

