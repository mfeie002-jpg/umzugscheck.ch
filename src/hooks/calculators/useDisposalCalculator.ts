import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { calculateDisposalPrice, DisposalCalculatorInput, DisposalCalculation } from "@/lib/pricing";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CalculatorEvents, ConversionEvents, EngagementEvents } from "@/lib/analytics-tracking";

// Schema definition
export const disposalFormSchema = z.object({
  volumeM3: z.number().min(1, "Mindestens 1 m³").max(50, "Maximal 50 m³"),
  distance: z.number().min(1, "Mindestens 1 km").max(200, "Maximal 200 km"),
  hasHazardous: z.boolean().default(false),
  hasElectronics: z.boolean().default(false),
  hasFurniture: z.boolean().default(false),
});

export type DisposalFormValues = z.infer<typeof disposalFormSchema>;

interface UseDisposalCalculatorOptions {
  autoNavigate?: boolean;
  navigateDelay?: number;
}

interface UseDisposalCalculatorReturn {
  form: ReturnType<typeof useForm<DisposalFormValues>>;
  result: DisposalCalculation | null;
  isSubmitting: boolean;
  onSubmit: (values: DisposalFormValues) => Promise<void>;
  handleSliderChange: (name: string, value: number) => void;
  priceAnnouncement: string;
}

const DEFAULT_VALUES: DisposalFormValues = {
  volumeM3: 5,
  distance: 10,
  hasHazardous: false,
  hasElectronics: false,
  hasFurniture: false,
};

/**
 * Custom hook for disposal calculator business logic
 */
export function useDisposalCalculator(
  options: UseDisposalCalculatorOptions = {}
): UseDisposalCalculatorReturn {
  const { autoNavigate = true, navigateDelay = 1500 } = options;

  const navigate = useNavigate();
  const [result, setResult] = useState<DisposalCalculation | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [priceAnnouncement, setPriceAnnouncement] = useState("");

  useEffect(() => {
    CalculatorEvents.started('entsorgungsrechner');
  }, []);

  const form = useForm<DisposalFormValues>({
    resolver: zodResolver(disposalFormSchema),
    defaultValues: DEFAULT_VALUES,
  });

  const handleSliderChange = useCallback((name: string, value: number) => {
    EngagementEvents.sliderUsed({ sliderName: `disposal_${name}`, value });
  }, []);

  const onSubmit = useCallback(async (values: DisposalFormValues) => {
    setIsSubmitting(true);

    try {
      const calculation = calculateDisposalPrice(values as DisposalCalculatorInput);
      setResult(calculation);

      setPriceAnnouncement(
        `Geschätzter Preis: ${calculation.totalPrice} Franken. ` +
        `Preisspanne von ${calculation.priceRange.min} bis ${calculation.priceRange.max} Franken.`
      );

      CalculatorEvents.priceShown({
        version: 'entsorgungsrechner',
        priceMin: calculation.priceRange.min,
        priceMax: calculation.priceRange.max,
      });
      ConversionEvents.calculatorCompleted({
        version: 'entsorgungsrechner',
        estimatedPrice: calculation.totalPrice,
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
              calculatorType: 'disposal',
              disposalDetails: values,
            },
            estimate: {
              priceMin: calculation.priceRange.min,
              priceMax: calculation.priceRange.max,
              volumeM3: values.volumeM3,
              estimatedHours: 0,
              distance: values.distance,
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
  };
}
