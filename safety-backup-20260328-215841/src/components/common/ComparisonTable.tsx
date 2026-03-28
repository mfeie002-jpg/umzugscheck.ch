import { memo } from "react";
import { Check, X, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface ComparisonRow {
  feature: string;
  values: (boolean | string | null)[];
}

interface ComparisonTableProps {
  headers: string[];
  rows: ComparisonRow[];
  highlightColumn?: number;
  className?: string;
}

export const ComparisonTable = memo(function ComparisonTable({ 
  headers, 
  rows,
  highlightColumn,
  className 
}: ComparisonTableProps) {
  const renderValue = (value: boolean | string | null) => {
    if (value === true) return <Check className="h-5 w-5 text-secondary mx-auto" />;
    if (value === false) return <X className="h-5 w-5 text-muted-foreground/50 mx-auto" />;
    if (value === null) return <Minus className="h-5 w-5 text-muted-foreground/30 mx-auto" />;
    return <span className="text-foreground font-medium">{value}</span>;
  };

  return (
    <div className={cn("overflow-x-auto", className)}>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="p-4 text-left font-semibold text-foreground bg-muted/50 rounded-tl-lg" />
            {headers.map((header, i) => (
              <th 
                key={i}
                className={cn(
                  "p-4 text-center font-semibold text-foreground",
                  i === highlightColumn && "bg-primary/10",
                  i === headers.length - 1 && "rounded-tr-lg",
                  i !== highlightColumn && "bg-muted/50"
                )}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-b border-border/50 last:border-0">
              <td className="p-4 text-left text-foreground font-medium">
                {row.feature}
              </td>
              {row.values.map((value, colIndex) => (
                <td 
                  key={colIndex}
                  className={cn(
                    "p-4 text-center",
                    colIndex === highlightColumn && "bg-primary/5"
                  )}
                >
                  {renderValue(value)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});
