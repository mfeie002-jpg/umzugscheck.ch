/**
 * /umzugsofferten-v1 - REDIRECT to V1.a
 * 
 * This route now redirects to the versioned V1.a page.
 * Use /umzugsofferten-baseline for the original version.
 * Use /umzugsofferten-v1a for the ChatGPT UX improvements.
 */

import { Navigate } from "react-router-dom";

const UmzugsoffertenV1 = () => {
  return <Navigate to="/umzugsofferten-v1a" replace />;
};

export default UmzugsoffertenV1;
