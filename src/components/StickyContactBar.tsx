import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Phone, Mail, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export const StickyContactBar = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 600);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <div className={cn(
      "fixed bottom-24 md:bottom-6 right-4 z-40 flex flex-col gap-2",
      "animate-in slide-in-from-bottom-4 duration-300"
    )}>
      <Button
        size="icon"
        className="h-12 w-12 rounded-full shadow-lg hover:scale-110 transition-transform"
        onClick={() => window.location.href = 'tel:+41445678900'}
      >
        <Phone className="h-5 w-5" />
      </Button>
      
      <Button
        size="icon"
        variant="outline"
        className="h-12 w-12 rounded-full shadow-lg hover:scale-110 transition-transform"
        onClick={() => window.location.href = 'mailto:info@umzugscheck.ch'}
      >
        <Mail className="h-5 w-5" />
      </Button>
      
      <Button
        size="icon"
        variant="outline"
        className="h-12 w-12 rounded-full shadow-lg hover:scale-110 transition-transform bg-green-500 hover:bg-green-600 text-white border-green-500"
        onClick={() => window.open('https://wa.me/41445678900', '_blank')}
      >
        <MessageCircle className="h-5 w-5" />
      </Button>
    </div>
  );
};
