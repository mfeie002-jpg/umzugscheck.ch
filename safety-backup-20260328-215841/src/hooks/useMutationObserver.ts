import { useEffect, useRef, useCallback, useState } from 'react';

interface MutationInfo {
  type: 'childList' | 'attributes' | 'characterData';
  target: Node;
  addedNodes: Node[];
  removedNodes: Node[];
  attributeName: string | null;
  oldValue: string | null;
}

interface UseMutationObserverOptions {
  childList?: boolean;
  attributes?: boolean;
  characterData?: boolean;
  subtree?: boolean;
  attributeOldValue?: boolean;
  characterDataOldValue?: boolean;
  attributeFilter?: string[];
  onMutation?: (mutations: MutationInfo[]) => void;
}

interface UseMutationObserverReturn<T extends HTMLElement> {
  ref: React.RefObject<T>;
  mutations: MutationInfo[];
  isObserving: boolean;
  clearMutations: () => void;
}

export function useMutationObserver<T extends HTMLElement = HTMLDivElement>(
  options: UseMutationObserverOptions = {}
): UseMutationObserverReturn<T> {
  const {
    childList = true,
    attributes = true,
    characterData = false,
    subtree = true,
    attributeOldValue = false,
    characterDataOldValue = false,
    attributeFilter,
    onMutation
  } = options;

  const ref = useRef<T>(null);
  const [mutations, setMutations] = useState<MutationInfo[]>([]);
  const [isObserving, setIsObserving] = useState(false);

  const handleMutation = useCallback((mutationsList: MutationRecord[]) => {
    const mappedMutations: MutationInfo[] = mutationsList.map(mutation => ({
      type: mutation.type as 'childList' | 'attributes' | 'characterData',
      target: mutation.target,
      addedNodes: Array.from(mutation.addedNodes),
      removedNodes: Array.from(mutation.removedNodes),
      attributeName: mutation.attributeName,
      oldValue: mutation.oldValue
    }));

    setMutations(prev => [...prev, ...mappedMutations]);
    onMutation?.(mappedMutations);
  }, [onMutation]);

  const clearMutations = useCallback(() => {
    setMutations([]);
  }, []);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new MutationObserver(handleMutation);
    
    observer.observe(element, {
      childList,
      attributes,
      characterData,
      subtree,
      attributeOldValue,
      characterDataOldValue,
      attributeFilter
    });
    
    setIsObserving(true);

    return () => {
      observer.disconnect();
      setIsObserving(false);
    };
  }, [
    handleMutation,
    childList,
    attributes,
    characterData,
    subtree,
    attributeOldValue,
    characterDataOldValue,
    attributeFilter
  ]);

  return { ref, mutations, isObserving, clearMutations };
}
