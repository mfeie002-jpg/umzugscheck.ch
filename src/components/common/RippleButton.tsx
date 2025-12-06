import { memo, useState, useCallback } from "react";
import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface RippleButtonProps extends ButtonProps {
  rippleColor?: string;
}

export const RippleButton = memo(function RippleButton({ 
  children, 
  className,
  rippleColor = "rgba(255, 255, 255, 0.4)",
  onClick,
  ...props 
}: RippleButtonProps) {
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([]);

  const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();
    
    setRipples(prev => [...prev, { x, y, id }]);
    setTimeout(() => setRipples(prev => prev.filter(r => r.id !== id)), 600);
    
    onClick?.(e);
  }, [onClick]);

  return (
    <Button 
      className={cn("relative overflow-hidden", className)} 
      onClick={handleClick}
      {...props}
    >
      {ripples.map(({ x, y, id }) => (
        <span
          key={id}
          className="absolute rounded-full animate-ping pointer-events-none"
          style={{
            left: x,
            top: y,
            width: 20,
            height: 20,
            marginLeft: -10,
            marginTop: -10,
            backgroundColor: rippleColor
          }}
        />
      ))}
      {children}
    </Button>
  );
});
