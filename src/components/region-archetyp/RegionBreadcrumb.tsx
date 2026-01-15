import { memo } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface RegionBreadcrumbProps {
  regionName: string;
  regionType: "canton" | "city";
  cantonName?: string;
  cantonSlug?: string;
}

export const RegionBreadcrumb = memo(({ 
  regionName, 
  regionType,
  cantonName,
  cantonSlug
}: RegionBreadcrumbProps) => {
  return (
    <div className="bg-muted/30 border-b border-border/50">
      <div className="container mx-auto px-4 py-3">
        <Breadcrumb>
          <BreadcrumbList className="text-sm">
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/" className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors">
                  <Home className="h-3.5 w-3.5" />
                  <span>Home</span>
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            
            <BreadcrumbSeparator>
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50" />
            </BreadcrumbSeparator>
            
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/umzugsfirmen-schweiz" className="text-muted-foreground hover:text-primary transition-colors">
                  Umzugsfirmen Schweiz
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            
            {regionType === "city" && cantonName && cantonSlug && (
              <>
                <BreadcrumbSeparator>
                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50" />
                </BreadcrumbSeparator>
                
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link 
                      to={`/umzugsfirmen/kanton-${cantonSlug}`} 
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      Kanton {cantonName}
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </>
            )}
            
            <BreadcrumbSeparator>
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50" />
            </BreadcrumbSeparator>
            
            <BreadcrumbItem>
              <BreadcrumbPage className="font-medium text-foreground">
                {regionType === "canton" ? `Kanton ${regionName}` : regionName}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </div>
  );
});

RegionBreadcrumb.displayName = "RegionBreadcrumb";
