import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";

export const GenerateHeroBackground = () => {
  const [generating, setGenerating] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    // Auto-generate on mount if no image exists
    const storedImage = localStorage.getItem('hero-background-image');
    if (!storedImage) {
      handleGenerate();
    } else {
      setImageUrl(storedImage);
    }
  }, []);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-hero-image');
      
      if (error) throw error;
      
      if (data?.imageUrl) {
        setImageUrl(data.imageUrl);
        localStorage.setItem('hero-background-image', data.imageUrl);
        // Trigger a custom event to update the Hero component
        window.dispatchEvent(new CustomEvent('hero-background-updated', { detail: data.imageUrl }));
      }
    } catch (error) {
      console.error('Error generating hero background:', error);
    } finally {
      setGenerating(false);
    }
  };

  return null; // This component doesn't render anything visible
};
