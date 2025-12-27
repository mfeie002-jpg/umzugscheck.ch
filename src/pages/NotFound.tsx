import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const { pathname, search, hash } = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", pathname);
  }, [pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-4 text-xl text-muted-foreground">Oops! Page not found</p>
        
        {import.meta.env.DEV && (
          <pre className="mb-4 rounded-lg bg-card p-4 text-left text-sm opacity-80">
{`Debug Location:
pathname: ${pathname}
search:   ${search}
hash:     ${hash}`}
          </pre>
        )}
        
        <Link to="/" className="text-primary underline hover:text-primary/90">
          Zur Startseite
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
