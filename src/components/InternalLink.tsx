import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface InternalLinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
  showArrow?: boolean;
}

export const InternalLink = ({ to, children, className, showArrow = false }: InternalLinkProps) => {
  return (
    <Link
      to={to}
      className={cn(
        "inline-flex items-center gap-1 text-primary hover:text-primary/80 font-medium transition-colors link-underline",
        className
      )}
    >
      {children}
      {showArrow && <ArrowRight className="w-4 h-4" />}
    </Link>
  );
};
