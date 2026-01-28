import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { calculateCleaningPrice, CleaningCalculatorInput, CleaningCalculation } from "@/lib/pricing";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CalculatorEvents, ConversionEvents, EngagementEvents } from "@/lib/analytics-tracking";

// Schema definition
export const cleaningFormSchema = z.object({
  cleaningType: z.enum(['end-of-lease', 'regular', 'deep-clean']),
  squareMeters: z.number().min(20, "Mindestens 20 m²").max(500, "Maximal 500 m²"),
  rooms: z.number().min(1, "Mindestens 1 Zimmer").max(10, "Maximal 10 Zimmer"),
  bathrooms: z.number().min(1, "Mindestens 1 Bad").max(5, "Maximal 5 Bäder"),
  hasBalcony: z.boolean().default(false),
  hasWindows: z.boolean().default(false),
  hasOven: z.boolean().default(false),
  hasCarpets: z.boolean().default(false),
  hasStorage: z.boolean().default(false),
});

export type CleaningFormValues = z.infer<typeof cleaningFormSchema>;

interface UseCleaningCalculatorOptions {
  autoNavigate?: boolean;
  navigateDelay?: number;
}

interface UseCleaningCalculatorReturn {
  form: ReturnType<typeof useForm<CleaningFormValues>>;
  result: CleaningCalculation | null;
  isSubmitting: boolean;
  onSubmit: (values: CleaningFormValues) => Promise<void>;
  handleSliderChange: (name: string, value: number) => void;
  priceAnnouncement: string;
}

const DEFAULT_VALUES: CleaningFormValues = {
  cleaningType: 'end-of-lease',
  squareMeters: 80,
  rooms: 3,
  bathrooms: 1,
  hasBalcony: false,
  hasWindows: false,
  hasOven: false,
  hasCarpets: false,
  hasStorage: false,
};

/**
 * Custom hook for cleaning calculator business logic
 * Encapsulates: pricing, form state, validation, Supabase sessions, analytics
 */
export function useCleaningCalculator(
  options: UseCleaningCalculatorOptions = {}
): UseCleaningCalculatorReturn {
  const { autoNavigate = true, navigateDelay = 1500 } = options;
  
  const navigate = useNavigate();
  const [result, setResult] = useState<CleaningCalculation | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [priceAnnouncement, setPriceAnnouncement] = useState("");

  // Track calculator start on mount
  useEffect(() => {
    CalculatorEvents.started('reinigungsrechner');
  }, []);

  const form = useForm<CleaningFormValues>({
    resolver: zodResolver(cleaningFormSchema),
    defaultValues: DEFAULT_VALUES,
  });

  // Track slider interactions for analytics
  const handleSliderChange = useCallback((name: string, value: number) => {
    EngagementEvents.sliderUsed({ sliderName: `cleaning_${name}`, value });
  }, []);

  // Main submit handler
  const onSubmit = useCallback(async (values: CleaningFormValues) => {
    setIsSubmitting(true);

    try {
      // Calculate price
      const calculation = calculateCleaningPrice(values as CleaningCalculatorInput);
      setResult(calculation);

      // Update aria-live announcement for screen readers
      setPriceAnnouncement(
        `Geschätzter Preis: ${calculation.totalPrice} Franken. ` +
        `Preisspanne von ${calculation.priceRange.min} bis ${calculation.priceRange.max} Franken. ` +
        `Geschätzte Dauer: ${calculation.estimatedHours} Stunden.`
      );

      // Track analytics events
      CalculatorEvents.priceShown({
        version: 'reinigungsrechner',
        priceMin: calculation.priceRange.min,
        priceMax: calculation.priceRange.max,
      });
      ConversionEvents.calculatorCompleted({
        version: 'reinigungsrechner',
        estimatedPrice: calculation.totalPrice,
        duration: calculation.estimatedHours,
      });

      // Create Supabase estimate session
      const { data: sessionData, error: sessionError } = await supabase.functions.invoke(
        'create-estimate-session',
        {
          body: {
            moveDetails: {
              fromPostal: '8000',
              fromCity: 'Zürich',
              toPostal: '8000',
              toCity: 'Zürich',
              calculatorType: 'cleaning',
              cleaningDetails: values,
            },
            estimate: {
              priceMin: calculation.priceRange.min,
              priceMax: calculation.priceRange.max,
              volumeM3: values.squareMeters,
              estimatedHours: calculation.estimatedHours,
              distance: 0,
            },
          },
        }
      );

      if (!sessionError && sessionData?.success) {
        toast.success("Kostenschätzung berechnet!");
        
        if (autoNavigate) {
          setTimeout(() => {
            navigate(`/ergebnis/${sessionData.data.id}`);
          }, navigateDelay);
        }
      } else if (sessionError) {
        console.error('Session creation error:', sessionError);
        // Still show result even if session creation fails
        toast.success("Kostenschätzung berechnet!");
      }
    } catch (error) {
      console.error('Calculation error:', error);
      toast.error("Fehler bei der Berechnung. Bitte versuchen Sie es erneut.");
    } finally {
      setIsSubmitting(false);
    }
  }, [navigate, autoNavigate, navigateDelay]);

  return {
    form,
    result,
    isSubmitting,
    onSubmit,
    handleSliderChange,
    priceAnnouncement,
  };
}
