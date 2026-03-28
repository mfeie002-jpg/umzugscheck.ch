import { useState, useEffect, useCallback } from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { X, Star, MapPin, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface Testimonial {
  name: string;
  city: string;
  rating: number;
  quote: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    name: "Sarah M.",
    city: "Zürich",
    rating: 5,
    quote: "Innerhalb von 24 Stunden hatte ich 8 Angebote auf dem Tisch. Habe letztlich 35% gespart.",
  },
  {
    name: "Daniel K.",
    city: "Bern",
    rating: 5,
    quote: "Super einfach. Adresse eingeben, fertig. Die Firmen haben sich selbst bei mir gemeldet.",
  },
  {
    name: "Franziska L.",
    city: "Basel",
    rating: 5,
    quote: "Ich war skeptisch, aber es hat funktioniert wie versprochen. Absolut kostenlos.",
  },
  {
    name: "Marco B.",
    city: "Luzern",
    rating: 4,
    quote: "Gute Auswahl von Firmen. Insgesamt sehr empfehlenswert für jeden Umzug.",
  },
  {
    name: "Andrea S.",
    city: "Genf",
    rating: 5,
    quote: "Endlich ein Schweizer Portal das auch auf Französisch funktioniert. Schnell und übersichtlich.",
  },
];

const SESSION_KEY = "uc_exit_mobile_shown";

export const ExitIntentMobileSheet = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [testimonial, setTestimonial] = useState<Testimonial | null>(null);

  const checkAndTrigger = useCallback(() => {
    // Only on mobile
    if (window.innerWidth >= 768) return;
    
    // Check if already shown this session
    if (sessionStorage.getItem(SESSION_KEY)) return;

    // Set random testimonial
    const randomIndex = Math.floor(Math.random() * TESTIMONIALS.length);
    setTestimonial(TESTIMONIALS[randomIndex]);
    setIsOpen(true);
    sessionStorage.setItem(SESSION_KEY, "true");
  }, []);

  useEffect(() => {
    // Only run on mobile
    if (typeof window === "undefined" || window.innerWidth >= 768) return;
    
    // Check if already shown
    if (sessionStorage.getItem(SESSION_KEY)) return;

    let lastScrollY = window.scrollY;
    let lastTime = Date.now();
    let hasTriggered = false;

    const handleScroll = () => {
      if (hasTriggered) return;

      const currentY = window.scrollY;
      const currentTime = Date.now();
      const timeDelta = currentTime - lastTime;
      
      // Calculate velocity (pixels per second)
      const velocity = timeDelta > 0 ? ((lastScrollY - currentY) / timeDelta) * 1000 : 0;

      // Trigger conditions:
      // 1. User has scrolled down at least 300px
      // 2. User is scrolling UP quickly (velocity > 200px/s)
      // 3. Time delta is reasonable (< 500ms between measurements)
      if (currentY > 300 && velocity > 200 && timeDelta < 500) {
        hasTriggered = true;
        checkAndTrigger();
      }

      lastScrollY = currentY;
      lastTime = currentTime;
    };

    // Throttle scroll handler
    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", throttledScroll, { passive: true });
    
    return () => {
      window.removeEventListener("scroll", throttledScroll);
    };
  }, [checkAndTrigger]);

  if (!testimonial) return null;

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerContent className="md:hidden">
        <div className="mx-auto w-full max-w-sm pb-safe">
          <DrawerHeader className="relative">
            <DrawerClose asChild>
              <button
                className="absolute right-4 top-4 p-2 rounded-full hover:bg-muted transition-colors"
                aria-label="Schliessen"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </DrawerClose>
            <DrawerTitle className="text-xl font-bold text-center pr-8">
              Noch nicht sicher?
            </DrawerTitle>
            <p className="text-sm text-muted-foreground text-center mt-1">
              Lies, was andere sagen:
            </p>
            {/* Live Social Proof Counter */}
            <div className="flex items-center justify-center gap-2 mt-3 text-sm">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
              </span>
              <span className="font-medium text-foreground">248 Personen</span>
              <span className="text-muted-foreground">sparen heute</span>
            </div>
          </DrawerHeader>

          <div className="px-4 pb-6">
            {/* Testimonial Card */}
            <div className="bg-muted/50 rounded-xl p-4 mb-6">
              {/* Rating Stars */}
              <div className="flex items-center gap-0.5 mb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < testimonial.rating
                        ? "text-yellow-500 fill-yellow-500"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>

              {/* Quote */}
              <p className="text-sm text-foreground italic mb-3">
                "{testimonial.quote}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-xs font-semibold text-primary">
                    {testimonial.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <div className="text-sm font-medium text-foreground">
                    {testimonial.name}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    {testimonial.city}
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <Button asChild className="w-full group" size="lg">
              <Link to="/vergleich" onClick={() => setIsOpen(false)}>
                Jetzt kostenlos vergleichen
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>

            {/* Trust micro-text */}
            <p className="text-xs text-muted-foreground text-center mt-3">
              Kostenlos · Unverbindlich · Keine versteckten Gebühren
            </p>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default ExitIntentMobileSheet;
