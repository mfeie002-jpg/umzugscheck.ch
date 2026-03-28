import { motion } from 'framer-motion';

interface SkeletonLoaderProps {
  type?: 'card' | 'list' | 'text' | 'avatar' | 'image';
  count?: number;
}

export default function SkeletonLoader({ type = 'card', count = 1 }: SkeletonLoaderProps) {
  const shimmer = {
    initial: { backgroundPosition: '-200% 0' },
    animate: { backgroundPosition: '200% 0' },
  };

  const baseClass = "bg-gradient-to-r from-muted via-muted/50 to-muted bg-[length:200%_100%] rounded";

  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return (
          <div className="border rounded-xl overflow-hidden">
            <motion.div
              className={`h-48 ${baseClass}`}
              variants={shimmer}
              initial="initial"
              animate="animate"
              transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
            />
            <div className="p-4 space-y-3">
              <motion.div
                className={`h-6 w-2/3 ${baseClass}`}
                variants={shimmer}
                initial="initial"
                animate="animate"
                transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
              />
              <motion.div
                className={`h-4 w-full ${baseClass}`}
                variants={shimmer}
                initial="initial"
                animate="animate"
                transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
              />
              <motion.div
                className={`h-4 w-4/5 ${baseClass}`}
                variants={shimmer}
                initial="initial"
                animate="animate"
                transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
              />
            </div>
          </div>
        );

      case 'list':
        return (
          <div className="flex items-center gap-4 p-4 border rounded-lg">
            <motion.div
              className={`w-12 h-12 rounded-full ${baseClass}`}
              variants={shimmer}
              initial="initial"
              animate="animate"
              transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
            />
            <div className="flex-1 space-y-2">
              <motion.div
                className={`h-4 w-1/3 ${baseClass}`}
                variants={shimmer}
                initial="initial"
                animate="animate"
                transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
              />
              <motion.div
                className={`h-3 w-2/3 ${baseClass}`}
                variants={shimmer}
                initial="initial"
                animate="animate"
                transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
              />
            </div>
          </div>
        );

      case 'text':
        return (
          <div className="space-y-2">
            <motion.div
              className={`h-4 w-full ${baseClass}`}
              variants={shimmer}
              initial="initial"
              animate="animate"
              transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
            />
            <motion.div
              className={`h-4 w-4/5 ${baseClass}`}
              variants={shimmer}
              initial="initial"
              animate="animate"
              transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
            />
            <motion.div
              className={`h-4 w-3/5 ${baseClass}`}
              variants={shimmer}
              initial="initial"
              animate="animate"
              transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
            />
          </div>
        );

      case 'avatar':
        return (
          <motion.div
            className={`w-16 h-16 rounded-full ${baseClass}`}
            variants={shimmer}
            initial="initial"
            animate="animate"
            transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
          />
        );

      case 'image':
        return (
          <motion.div
            className={`w-full aspect-video rounded-xl ${baseClass}`}
            variants={shimmer}
            initial="initial"
            animate="animate"
            transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i}>{renderSkeleton()}</div>
      ))}
    </div>
  );
}
