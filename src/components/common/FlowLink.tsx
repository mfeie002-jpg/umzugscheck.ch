/**
 * FlowLink - A/B-aware link component for the Offerten flow
 * 
 * Use this component instead of hardcoded "/umzugsofferten" links.
 * It automatically routes to the correct A/B assigned flow path.
 */

import { Link, type LinkProps } from "react-router-dom";
import { useFlowPath } from "@/hooks/useUnifiedAB";
import { forwardRef } from "react";

interface FlowLinkProps extends Omit<LinkProps, 'to'> {
  /** Override the A/B path with a custom path */
  to?: string;
  /** Force use of A/B flow path even if 'to' is provided */
  useFlowPath?: boolean;
  children: React.ReactNode;
}

/**
 * A Link component that automatically uses the A/B assigned flow path.
 * 
 * Usage:
 * <FlowLink>Click here</FlowLink>  // Uses A/B flow path
 * <FlowLink to="/custom">Custom</FlowLink>  // Uses custom path
 * <FlowLink to="/custom" useFlowPath>Forced</FlowLink>  // Forces A/B path
 */
export const FlowLink = forwardRef<HTMLAnchorElement, FlowLinkProps>(
  ({ to, useFlowPath: forceFlowPath, children, ...props }, ref) => {
    const flowPath = useFlowPath();
    
    // Use flow path if no 'to' provided or if forceFlowPath is true
    const destination = forceFlowPath ? flowPath : (to || flowPath);
    
    return (
      <Link ref={ref} to={destination} {...props}>
        {children}
      </Link>
    );
  }
);

FlowLink.displayName = "FlowLink";

export default FlowLink;
