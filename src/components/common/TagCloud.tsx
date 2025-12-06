import { memo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Tag {
  label: string;
  count?: number;
  href?: string;
}

interface TagCloudProps {
  tags: Tag[];
  className?: string;
  variant?: "default" | "outline" | "filled";
}

export const TagCloud = memo(function TagCloud({ 
  tags, 
  className,
  variant = "default"
}: TagCloudProps) {
  const variants = {
    default: "bg-muted text-foreground hover:bg-primary/10 hover:text-primary",
    outline: "border border-border text-foreground hover:border-primary hover:text-primary",
    filled: "bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground"
  };

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {tags.map((tag, index) => (
        <motion.a
          key={index}
          href={tag.href || "#"}
          className={cn(
            "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
            variants[variant]
          )}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          {tag.label}
          {tag.count !== undefined && (
            <span className="text-xs opacity-70">({tag.count})</span>
          )}
        </motion.a>
      ))}
    </div>
  );
});
