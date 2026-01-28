import { useEffect, useState } from "react";
import { Menu, Phone } from "lucide-react";
import { track } from "@/utils/track";
import { FeierabendButton } from "@/components/ui/FeierabendButton";
import { CONTACT_PHONE_DISPLAY, CONTACT_PHONE_E164 } from "@/config/contact";

export function GlobalNav() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = [
    { label: "Services", href: "#services" },
    { label: "Service Area", href: "#areas" },
    { label: "Why Us", href: "#trust" },
    { label: "FAQ", href: "#faq" },
  ];

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
      isScrolled ? "bg-white/85 backdrop-blur-md shadow-soft" : "bg-transparent"
    }`}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className={`text-2xl font-black ${isScrolled ? "text-brand-primary" : "text-brand-primary"}`}>
            Feierabend<span className="text-brand-secondary">.</span>
          </div>
          <div className="hidden sm:inline-flex items-center text-xs px-2 py-1 rounded-full bg-surface-highlight text-text-link">
            Swiss Neo-Teal Edition
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-text-main">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="hover:text-brand-secondary transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={`tel:${CONTACT_PHONE_E164}`}
            className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-brand-primary"
            onClick={() => track("cta_call_click", { location: "global_nav" })}
          >
            <Phone className="h-4 w-4" />
            {CONTACT_PHONE_DISPLAY}
          </a>
          <FeierabendButton
            variant="primary"
            size="md"
            icon={<Phone className="h-4 w-4" />}
            onClick={() => {
              track("cta_quote_click", { location: "global_nav" });
              const el = document.getElementById("quick-quote");
              el?.scrollIntoView({ behavior: "smooth" });
            }}
            className="hidden sm:inline-flex"
          >
            Get Quote
          </FeierabendButton>
          <button
            type="button"
            className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-xl border border-line-default text-brand-primary shadow-soft"
            aria-label="Toggle menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
