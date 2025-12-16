import { useState, useEffect } from "react";
import { List, Clock, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface TOCItem {
  id: string;
  title: string;
  level: number;
}

interface TableOfContentsProps {
  items: TOCItem[];
  readTime?: number;
  className?: string;
  collapsible?: boolean;
}

export const TableOfContents = ({
  items,
  readTime,
  className,
  collapsible = true,
}: TableOfContentsProps) => {
  const [activeId, setActiveId] = useState<string>("");
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-20% 0% -80% 0%",
      }
    );

    items.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [items]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // Header height
      const top = element.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <nav
      className={cn(
        "bg-muted/50 rounded-lg border border-border p-4",
        className
      )}
      aria-label="Inhaltsverzeichnis"
    >
      <div
        className={cn(
          "flex items-center justify-between mb-3",
          collapsible && "cursor-pointer"
        )}
        onClick={() => collapsible && setIsCollapsed(!isCollapsed)}
      >
        <div className="flex items-center gap-2">
          <List className="h-4 w-4 text-primary" />
          <span className="font-semibold text-sm">Inhaltsverzeichnis</span>
        </div>
        <div className="flex items-center gap-3">
          {readTime && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>{readTime} Min. Lesezeit</span>
            </div>
          )}
          {collapsible && (
            <button className="p-1 hover:bg-muted rounded">
              {isCollapsed ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronUp className="h-4 w-4" />
              )}
            </button>
          )}
        </div>
      </div>

      {!isCollapsed && (
        <ol className="space-y-1">
          {items.map((item, index) => (
            <li
              key={item.id}
              style={{ paddingLeft: `${(item.level - 1) * 12}px` }}
            >
              <button
                onClick={() => scrollToSection(item.id)}
                className={cn(
                  "w-full text-left py-1.5 px-2 rounded text-sm transition-colors",
                  "hover:bg-muted hover:text-primary",
                  activeId === item.id
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground"
                )}
              >
                <span className="mr-2 text-xs opacity-50">{index + 1}.</span>
                {item.title}
              </button>
            </li>
          ))}
        </ol>
      )}
    </nav>
  );
};

// Helper to calculate read time
export const calculateReadTime = (text: string): number => {
  const wordsPerMinute = 200;
  const wordCount = text.trim().split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
};

// Helper to extract headings from content
export const extractHeadings = (
  containerSelector: string = "main"
): TOCItem[] => {
  const container = document.querySelector(containerSelector);
  if (!container) return [];

  const headings = container.querySelectorAll("h2, h3");
  return Array.from(headings).map((heading, index) => {
    const id = heading.id || `section-${index}`;
    if (!heading.id) heading.id = id;
    
    return {
      id,
      title: heading.textContent || "",
      level: parseInt(heading.tagName.charAt(1)),
    };
  });
};
