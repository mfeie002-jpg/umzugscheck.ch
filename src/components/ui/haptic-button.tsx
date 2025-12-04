import { forwardRef, ButtonHTMLAttributes } from "react";
import { Button, ButtonProps } from "@/components/ui/button";
import { useHapticFeedback } from "@/hooks/useHapticFeedback";

interface HapticButtonProps extends ButtonProps {
  hapticType?: "light" | "medium" | "heavy" | "selection";
}

export const HapticButton = forwardRef<HTMLButtonElement, HapticButtonProps>(
  ({ onClick, hapticType = "light", children, ...props }, ref) => {
    const { vibrate } = useHapticFeedback();

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      vibrate(hapticType);
      onClick?.(e);
    };

    return (
      <Button ref={ref} onClick={handleClick} {...props}>
        {children}
      </Button>
    );
  }
);

HapticButton.displayName = "HapticButton";
