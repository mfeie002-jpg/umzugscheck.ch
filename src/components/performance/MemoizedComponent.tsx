import { memo, ComponentType } from 'react';

// Shallow comparison for arrays
export const shallowArrayEqual = <T,>(a: T[], b: T[]): boolean => {
  if (a === b) return true;
  if (a.length !== b.length) return false;
  return a.every((item, index) => item === b[index]);
};

// Deep comparison for objects (1 level deep)
export const shallowObjectEqual = <T extends Record<string, unknown>>(a: T, b: T): boolean => {
  if (a === b) return true;
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;
  return keysA.every(key => a[key] === b[key]);
};

// Simple memo wrapper
export const withMemo = <P extends Record<string, unknown>>(
  Component: ComponentType<P>
) => memo(Component);
