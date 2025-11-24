import { useState, useCallback } from "react";

interface UseOptimisticUpdateOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

export const useOptimisticUpdate = <T,>(
  initialData: T,
  options: UseOptimisticUpdateOptions<T> = {}
) => {
  const [data, setData] = useState<T>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = useCallback(
    async (
      optimisticData: T,
      asyncFn: () => Promise<T>
    ) => {
      // Set optimistic data immediately
      setData(optimisticData);
      setIsLoading(true);
      setError(null);

      try {
        const result = await asyncFn();
        setData(result);
        options.onSuccess?.(result);
        return result;
      } catch (err) {
        // Rollback on error
        setData(initialData);
        const error = err instanceof Error ? err : new Error("Unknown error");
        setError(error);
        options.onError?.(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [initialData, options]
  );

  return {
    data,
    isLoading,
    error,
    mutate,
    setData,
  };
};
