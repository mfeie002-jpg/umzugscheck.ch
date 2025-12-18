import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface DropdownWrapperProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}

export const DropdownWrapper = ({ isOpen, onClose, children, className }: DropdownWrapperProps) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-40 hidden lg:block transition-opacity duration-200"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Dropdown Content */}
      <div 
        className={cn(
          "hidden lg:block absolute left-0 right-0 top-full",
          "bg-background border-b border-border",
          "shadow-[0_20px_60px_-15px_rgba(0,0,0,0.2)]",
          "z-50 overflow-hidden",
          "animate-in fade-in-0 slide-in-from-top-2 duration-200",
          className
        )}
      >
        {children}
      </div>
    </>
  );
};
