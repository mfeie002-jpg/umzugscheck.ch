import { useCallback, useState, useTransition } from 'react';

interface AsyncState<T> {
  data: T | null;
  error: Error | null;
  isLoading: boolean;
  isPending: boolean;
}

export function useAsyncAction<T, Args extends unknown[]>(
  asyncFn: (...args: Args) => Promise<T>
) {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    error: null,
    isLoading: false,
    isPending: false
  });
  const [isPending, startTransition] = useTransition();

  const execute = useCallback(
    async (...args: Args) => {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      try {
        const data = await asyncFn(...args);
        startTransition(() => {
          setState({ data, error: null, isLoading: false, isPending: false });
        });
        return data;
      } catch (error) {
        const errorObj = error instanceof Error ? error : new Error(String(error));
        setState({ data: null, error: errorObj, isLoading: false, isPending: false });
        throw errorObj;
      }
    },
    [asyncFn]
  );

  const reset = useCallback(() => {
    setState({ data: null, error: null, isLoading: false, isPending: false });
  }, []);

  return {
    ...state,
    isPending,
    execute,
    reset
  };
}
