import { Navigate, useLocation } from "react-router-dom";

/**
 * Redirect helper that preserves query params and hash.
 * Use this for route aliases/redirects in React Router.
 */
export function RedirectWithQuery({ to }: { to: string }) {
  const location = useLocation();
  return (
    <Navigate
      replace
      to={{
        pathname: to,
        search: location.search,
        hash: location.hash,
      }}
    />
  );
}
