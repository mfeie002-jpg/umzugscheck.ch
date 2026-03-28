import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

export const BernBreadcrumb = () => (
  <nav aria-label="Breadcrumb" className="py-3 bg-muted/30">
    <div className="container mx-auto px-4">
      <ol className="flex items-center gap-2 text-sm flex-wrap">
        <li className="flex items-center gap-2"><Home className="h-4 w-4 text-muted-foreground" /><Link to="/" className="text-muted-foreground hover:text-primary">Home</Link></li>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
        <li><Link to="/umzugsfirmen-schweiz" className="text-muted-foreground hover:text-primary">Kantone</Link></li>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
        <li><span className="font-medium">Bern</span></li>
      </ol>
    </div>
  </nav>
);
