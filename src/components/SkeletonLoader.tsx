import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

export const SkeletonCard = () => (
  <div className="p-6 border-2 border-border rounded-2xl">
    <Skeleton className="w-12 h-12 rounded-full mb-4" />
    <Skeleton className="h-6 w-3/4 mb-2" />
    <Skeleton className="h-4 w-full mb-2" />
    <Skeleton className="h-4 w-5/6" />
  </div>
);

export const SkeletonSection = () => (
  <section className="py-16 md:py-20">
    <div className="container mx-auto px-4">
      <div className="text-center mb-12">
        <Skeleton className="w-16 h-16 rounded-full mx-auto mb-4" />
        <Skeleton className="h-10 w-64 mx-auto mb-4" />
        <Skeleton className="h-6 w-96 max-w-full mx-auto" />
      </div>
      
      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {[1, 2, 3].map((i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  </section>
);

export const SkeletonTestimonial = () => (
  <div className="p-6 border-2 border-border rounded-2xl">
    <div className="flex items-start gap-4 mb-4">
      <Skeleton className="w-12 h-12 rounded-full flex-shrink-0" />
      <div className="flex-1">
        <Skeleton className="h-5 w-32 mb-2" />
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
    <Skeleton className="h-4 w-full mb-2" />
    <Skeleton className="h-4 w-full mb-2" />
    <Skeleton className="h-4 w-3/4" />
  </div>
);

export const SkeletonCompanyCard = () => (
  <div className="p-6 border-2 border-border rounded-2xl">
    <div className="flex items-center gap-4 mb-4">
      <Skeleton className="w-16 h-16 rounded-lg flex-shrink-0" />
      <div className="flex-1">
        <Skeleton className="h-6 w-32 mb-2" />
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="w-4 h-4" />
          ))}
        </div>
      </div>
    </div>
    <Skeleton className="h-4 w-full mb-2" />
    <Skeleton className="h-4 w-5/6 mb-4" />
    <Skeleton className="h-10 w-full" />
  </div>
);

interface AnimatedSkeletonProps {
  className?: string;
  delay?: number;
}

export const AnimatedSkeleton = ({ className, delay = 0 }: AnimatedSkeletonProps) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay }}
  >
    <Skeleton className={className} />
  </motion.div>
);
