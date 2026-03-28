import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  text?: string;
}

const sizeClasses = {
  sm: "w-6 h-6",
  md: "w-10 h-10",
  lg: "w-16 h-16",
};

const LoadingSpinner = ({ size = "md", className = "", text }: LoadingSpinnerProps) => {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-4", className)}>
      <div
        className={cn(
          "rounded-full border-4 border-muted border-t-primary animate-spin",
          sizeClasses[size]
        )}
      />
      {text && (
        <p className="text-sm text-muted-foreground font-medium">
          {text}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;
