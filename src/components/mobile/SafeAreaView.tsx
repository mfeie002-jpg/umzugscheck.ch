import { ReactNode } from 'react';

interface SafeAreaViewProps {
  children: ReactNode;
  className?: string;
  top?: boolean;
  bottom?: boolean;
  left?: boolean;
  right?: boolean;
}

export const SafeAreaView = ({
  children,
  className = '',
  top = true,
  bottom = true,
  left = true,
  right = true,
}: SafeAreaViewProps) => {
  const paddingClasses = [
    top && 'pt-safe',
    bottom && 'pb-safe',
    left && 'pl-safe',
    right && 'pr-safe',
  ].filter(Boolean).join(' ');

  return (
    <div className={`${paddingClasses} ${className}`}>
      {children}
    </div>
  );
};
