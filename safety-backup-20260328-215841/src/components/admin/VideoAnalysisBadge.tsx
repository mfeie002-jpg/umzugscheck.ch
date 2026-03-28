import { Video } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useVideoAnalysisNotifications } from '@/hooks/useVideoAnalysisNotifications';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface VideoAnalysisBadgeProps {
  showLabel?: boolean;
  variant?: 'button' | 'badge' | 'minimal';
}

export function VideoAnalysisBadge({ showLabel = true, variant = 'button' }: VideoAnalysisBadgeProps) {
  const { pendingCount, hasNewVideos } = useVideoAnalysisNotifications();
  const navigate = useNavigate();

  if (variant === 'minimal') {
    return (
      <AnimatePresence>
        {hasNewVideos && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="relative"
          >
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-destructive" />
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  if (variant === 'badge') {
    return (
      <Badge 
        variant={hasNewVideos ? 'destructive' : 'secondary'}
        className="cursor-pointer"
        onClick={() => navigate('/admin/video-analyses')}
      >
        <Video className="h-3 w-3 mr-1" />
        {pendingCount} Video{pendingCount !== 1 ? 's' : ''}
      </Badge>
    );
  }

  return (
    <Button
      variant={hasNewVideos ? 'default' : 'outline'}
      size="sm"
      onClick={() => navigate('/admin/video-analyses')}
      className={hasNewVideos ? 'bg-warning text-warning-foreground hover:bg-warning/90' : ''}
    >
      <Video className="h-4 w-4 mr-2" />
      {showLabel && 'Videos'}
      {pendingCount > 0 && (
        <Badge variant="secondary" className="ml-2 bg-background/20">
          {pendingCount}
        </Badge>
      )}
    </Button>
  );
}
