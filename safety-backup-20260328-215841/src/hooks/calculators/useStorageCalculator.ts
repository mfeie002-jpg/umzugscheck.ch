import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { calculateStoragePrice, StorageCalculatorInput, StorageCalculation } from "@/lib/pricing";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CalculatorEvents, ConversionEvents, EngagementEvents } from "@/lib/analytics-tracking";

// Schema definition
export const storageFormSchema = z.object({
  volumeM3: z.number().min(1, "Mindestens 1 m³").max(100, "Maximal 100 m³"),
  duration: z.number().min(1, "Mindestens 1 Monat").max(24, "Maximal 24 Monate"),
  climateControlled: z.boolean().default(false),
  insurance: z.boolean().default(false),
  accessFrequency: z.enum(['rare', 'monthly', 'weekly']),
});

export type StorageFormValues = z.infer<typeof storageFormSchema>;

interface UseStorageCalculatorOptions {
  autoNavigate?: boolean;
  navigateDelay?: number;
}

interface StorageResultWithDuration extends StorageCalculation {
  duration: number;
}

interface UseStorageCalculatorReturn {
  form: ReturnType<typeof useForm<StorageFormValues>>;
  result: StorageResultWithDuration | null;
  isSubmitting: boolean;
  onSubmit: (values: StorageFormValues) => Promise<void>;
  handleSliderChange: (name: string, value: number) => void;
  priceAnnouncement: string;
}

const DEFAULT_VALUES: StorageFormValues = {
  volumeM3: 10,
  duration: 3,
  climateControlled: false,
  insurance: false,
  accessFrequency: 'rare',
};

/**
 * Custom hook for storage calculator business logic
 */
export function useStorageCalculator(
  options: UseStorageCalculatorOptions = {}
): UseStorageCalculatorReturn {
  const { autoNavigate = true, navigateDelay = 1500 } = options;

  const navigate = useNavigate();
  const [result, setResult] = useState<StorageResultWithDuration | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [priceAnnouncement, setPriceAnnouncement] = useState("");

  useEffect(() => {
    CalculatorEvents.started('lagerrechner');
  }, []);

  const form = useForm<StorageFormValues>({
    resolver: zodResolver(storageFormSchema),
    defaultValues: DEFAULT_VALUES,
  });

  const handleSliderChange = useCallback((name: string, value: number) => {
    EngagementEvents.sliderUsed({ sliderName: `storage_${name}`, value });
  }, []);

  const onSubmit = useCallback(async (values: StorageFormValues) => {
    setIsSubmitting(true);

    try {
      const calculation = calculateStoragePrice(values as StorageCalculatorInput);
      const resultWithDuration = { ...calculation, duration: values.duration };
      setResult(resultWithDuration);

      const totalCost = calculation.setupFee + (calculation.monthlyPrice * values.duration);
      setPriceAnnouncement(
        `Monatlicher Preis: ${calculation.monthlyPrice} Franken. ` +
        `Gesamtkosten für ${values.duration} Monate: ${totalCost} Franken.`
      );

      CalculatorEvents.priceShown({
        version: 'lagerrechner',
        priceMin: calculation.priceRange.min,
        priceMax: calculation.priceRange.max,
      });
      ConversionEvents.calculatorCompleted({
        version: 'lagerrechner',
        estimatedPrice: calculation.monthlyPrice,
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
              calculatorType: 'storage',
              storageDetails: values,
            },
            estimate: {
              priceMin: calculation.priceRange.min,
              priceMax: calculation.priceRange.max,
              volumeM3: values.volumeM3,
              estimatedHours: 0,
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
  };
}
