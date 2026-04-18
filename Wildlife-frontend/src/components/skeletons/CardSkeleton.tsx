import { motion } from "framer-motion";
import { BaseSkeleton } from "./BaseSkeleton";

interface CardSkeletonProps {
  count?: number;
  columns?: 1 | 2 | 3 | 4;
}

export const CardSkeleton = ({ count = 6, columns = 3 }: CardSkeletonProps) => {
  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <div className={`grid ${gridCols[columns]} gap-6`}>
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-5"
        >
          <BaseSkeleton className="w-full h-32 mb-4" />

          <BaseSkeleton className="h-5 w-3/4 mb-2" />

          <BaseSkeleton className="h-3 w-full mb-1" />
          <BaseSkeleton className="h-3 w-2/3 mb-3" />

          <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/50">
            <BaseSkeleton className="h-8 w-20" />
            <div className="flex gap-2">
              <BaseSkeleton className="h-8 w-8 rounded-lg" />
              <BaseSkeleton className="h-8 w-8 rounded-lg" />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
