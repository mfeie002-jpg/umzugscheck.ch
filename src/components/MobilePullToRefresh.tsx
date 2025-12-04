import { ReactNode, useCallback } from 'react';
import { usePullToRefresh } from '@/hooks/use-pull-to-refresh';
import { PullToRefreshIndicator } from '@/components/PullToRefreshIndicator';
import { useIsMobile } from '@/hooks/use-mobile';

interface MobilePullToRefreshProps {
  children: ReactNode;
}

export const MobilePullToRefresh = ({ children }: MobilePullToRefreshProps) => {
  const isMobile = useIsMobile();

  const handleRefresh = useCallback(async () => {
    // Reload the current page data
    window.location.reload();
  }, []);

  const { isPulling, isRefreshing, pullDistance, threshold } = usePullToRefresh({
    onRefresh: handleRefresh
  });

  if (!isMobile) {
    return <>{children}</>;
  }

  return (
    <>
      <PullToRefreshIndicator
        isPulling={isPulling}
        isRefreshing={isRefreshing}
        pullDistance={pullDistance}
        threshold={threshold}
      />
      {children}
    </>
  );
};
