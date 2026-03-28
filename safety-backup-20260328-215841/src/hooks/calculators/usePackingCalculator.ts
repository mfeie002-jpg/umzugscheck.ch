import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { calculatePackingPrice, PackingCalculatorInput, PackingCalculation } from "@/lib/pricing";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CalculatorEvents, ConversionEvents, EngagementEvents } from "@/lib/analytics-tracking";

// Schema definition
export const packingFormSchema = z.object({
  rooms: z.number().min(1, "Mindestens 1 Zimmer").max(10, "Maximal 10 Zimmer"),
  packingLevel: z.enum(['partial', 'full']),
  hasFragileItems: z.boolean().default(false),
  hasArtwork: z.boolean().default(false),
});

export type PackingFormValues = z.infer<typeof packingFormSchema>;

interface UsePackingCalculatorOptions {
  autoNavigate?: boolean;
  navigateDelay?: number;
}

interface UsePackingCalculatorReturn {
  form: ReturnType<typeof useForm<PackingFormValues>>;
  result: PackingCalculation | null;
  isSubmitting: boolean;
  onSubmit: (values: PackingFormValues) => Promise<void>;
  handleSliderChange: (name: string, value: number) => void;
  priceAnnouncement: string;
  firstErrorRef: React.RefObject<HTMLElement>;
}

const DEFAULT_VALUES: PackingFormValues = {
  rooms: 3,
  packingLevel: 'full',
  hasFragileItems: false,
  hasArtwork: false,
};

/**
 * Custom hook for packing calculator business logic
 * Includes focus management for validation errors
 */
export function usePackingCalculator(
  options: UsePackingCalculatorOptions = {}
): UsePackingCalculatorReturn {
  const { autoNavigate = true, navigateDelay = 1500 } = options;

  const navigate = useNavigate();
  const [result, setResult] = useState<PackingCalculation | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [priceAnnouncement, setPriceAnnouncement] = useState("");
  const firstErrorRef = useRef<HTMLElement>(null);

  useEffect(() => {
    CalculatorEvents.started('packservice-rechner');
  }, []);

  const form = useForm<PackingFormValues>({
    resolver: zodResolver(packingFormSchema),
    defaultValues: DEFAULT_VALUES,
  });

  // Focus first error field on validation failure
  useEffect(() => {
    const errors = form.formState.errors;
    const errorKeys = Object.keys(errors);
    
    if (errorKeys.length > 0 && form.formState.isSubmitted) {
      const firstErrorField = document.querySelector(`[name="${errorKeys[0]}"]`);
      if (firstErrorField instanceof HTMLElement) {
        firstErrorField.focus();
      }
    }
  }, [form.formState.errors, form.formState.isSubmitted]);

  const handleSliderChange = useCallback((name: string, value: number) => {
    EngagementEvents.sliderUsed({ sliderName: `packing_${name}`, value });
  }, []);

  const onSubmit = useCallback(async (values: PackingFormValues) => {
    setIsSubmitting(true);

    try {
      const calculation = calculatePackingPrice(values as PackingCalculatorInput);
      setResult(calculation);

      setPriceAnnouncement(
        `Geschätzter Preis: ${calculation.totalPrice} Franken. ` +
        `Preisspanne von ${calculation.priceRange.min} bis ${calculation.priceRange.max} Franken. ` +
        `Geschätzte Dauer: ${calculation.estimatedHours} Stunden.`
      );

      CalculatorEvents.priceShown({
        version: 'packservice-rechner',
        priceMin: calculation.priceRange.min,
        priceMax: calculation.priceRange.max,
      });
      ConversionEvents.calculatorCompleted({
        version: 'packservice-rechner',
        estimatedPrice: calculation.totalPrice,
        duration: calculation.estimatedHours,
      });

      const { data: sessionData, error: sessionError } = await supabase.functions.invoke(
        'create-estimate-session',
        {
          body: {
            moveDetails: {
              fromPostal: '8000',
              fromCity: 'Zürich',
              toPostal: '8000',
              toCity: 'Zürich',
              calculatorType: 'packing',
              packingDetails: values,
            },
            estimate: {
              priceMin: calculation.priceRange.min,
              priceMax: calculation.priceRange.max,
              volumeM3: values.rooms * 15,
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
      } else {
        toast.success("Kostenschätzung berechnet!");
      }
    } catch (error) {
      console.error('Calculation error:', error);
      toast.error("Fehler bei der Berechnung");
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
    firstErrorRef,
  };
}
