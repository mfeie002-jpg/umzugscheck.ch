import React from 'react';
import { ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SecureExternalLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  showIcon?: boolean;
  onClick?: () => void;
}

/**
 * Secure external link component that prevents tabnabbing attacks.
 * Uses rel="noopener noreferrer" and validates URLs.
 */
export const SecureExternalLink: React.FC<SecureExternalLinkProps> = ({
  href,
  children,
  className,
  showIcon = true,
  onClick
}) => {
  const isValidUrl = (url: string): boolean => {
    try {
      const parsed = new URL(url);
      // Only allow http and https protocols
      return ['http:', 'https:'].includes(parsed.protocol);
    } catch {
      return false;
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!isValidUrl(href)) {
      e.preventDefault();
      console.warn('Invalid or potentially dangerous URL blocked:', href);
      return;
    }
    onClick?.();
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn('inline-flex items-center gap-1 hover:underline', className)}
      onClick={handleClick}
    >
      {children}
      {showIcon && <ExternalLink className="h-3 w-3" aria-hidden="true" />}
      <span className="sr-only">(öffnet in neuem Tab)</span>
    </a>
  );
};
