import { ReactNode } from 'react';

interface ConditionalRenderProps {
  condition: boolean;
  children: ReactNode;
  fallback?: ReactNode;
}

const ConditionalRender = ({ condition, children, fallback = null }: ConditionalRenderProps) => {
  return condition ? <>{children}</> : <>{fallback}</>;
};

export default ConditionalRender;
