import { cn } from "@/lib/utils";

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "success";
}

export const GradientText = ({ children, className, variant = "primary" }: GradientTextProps) => {
  const gradients = {
    primary: "from-primary via-primary to-secondary",
    secondary: "from-secondary via-secondary to-primary",
    success: "from-success via-success to-primary"
  };

  return (
    <span 
      className={cn(
        "bg-gradient-to-r bg-clip-text text-transparent",
        gradients[variant],
        className
      )}
    >
      {children}
    </span>
  );
};
