import { Phone, MessageCircle, FileText } from "lucide-react";

type Props = {
  phoneE164: string; // e.g. "+41441234567"
  whatsappLink: string; // e.g. "https://wa.me/41441234567"
  quoteAnchorId?: string; // e.g. "quote-form"
  onTrack?: (eventName: string, params?: Record<string, unknown>) => void;
};

export function MobileStickyCTA({
  phoneE164,
  whatsappLink,
  quoteAnchorId = "quote-form",
  onTrack,
}: Props) {
  const telHref = `tel:${phoneE164.replace(/\s/g, "")}`;

  const scrollToQuote = () => {
    const el = document.getElementById(quoteAnchorId);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-[9999] border-t border-gray-200 bg-white shadow-[0_-4px_12px_rgba(0,0,0,0.08)] pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto max-w-screen-xl px-4 py-3">
        <div className="grid grid-cols-5 gap-2 items-stretch">
          {/* WhatsApp Button */}
          <a
            href={whatsappLink}
            target="_blank"
            rel="noreferrer"
            onClick={() => onTrack?.("cta_whatsapp_click", { location: "sticky_bar" })}
            className="col-span-1 flex flex-col items-center justify-center rounded-lg border-2 border-green-500 bg-white hover:bg-green-50 px-2 py-2.5 active:scale-95 transition-all"
            aria-label="WhatsApp"
          >
            <MessageCircle className="h-5 w-5 text-green-600 mb-1" />
            <span className="text-xs font-medium text-green-700">WhatsApp</span>
          </a>

          {/* Phone Button (Primary CTA - Center, Largest) */}
          <a
            href={telHref}
            onClick={() => onTrack?.("cta_call_click", { location: "sticky_bar" })}
            className="col-span-3 flex flex-col items-center justify-center rounded-xl px-3 py-3 font-accent font-semibold text-white shadow-[0_4px_12px_rgba(255,69,0,0.25)] active:scale-95 bg-feierabend-orange-600 hover:bg-feierabend-orange-500 transition-all"
          >
            <Phone className="h-6 w-6 mb-1" />
            <span className="text-sm">Jetzt anrufen</span>
          </a>

          {/* Quote Button */}
          <button
            type="button"
            onClick={() => {
              onTrack?.("cta_quote_click", { location: "sticky_bar" });
              scrollToQuote();
            }}
            className="col-span-1 flex flex-col items-center justify-center rounded-lg border-2 border-feierabend-blue-300 bg-white hover:bg-feierabend-blue-50 px-2 py-2.5 active:scale-95 transition-all"
            aria-label="Offerte anfordern"
          >
            <FileText className="h-5 w-5 text-feierabend-blue-700 mb-1" />
            <span className="text-xs font-medium text-feierabend-blue-700">Offerte</span>
          </button>
        </div>

        {/* Micro-copy */}
        <div className="mt-2 text-center text-[10px] leading-tight text-gray-500">
          In 5-10 Min fix gebucht - Live 08-19 Uhr
        </div>
      </div>
    </div>
  );
}
