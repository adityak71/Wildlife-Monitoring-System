import { motion } from 'framer-motion'
import { BaseSkeleton } from './BaseSkeleton'

interface ListSkeletonProps {
  count?: number
}

export const ListSkeleton = ({ count = 5 }: ListSkeletonProps) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.05 }}
          className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-4"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <BaseSkeleton className="h-6 w-6 rounded-full" />
                <BaseSkeleton className="h-5 w-48" />
                <BaseSkeleton className="h-5 w-16 rounded-full" />
              </div>
              <BaseSkeleton className="h-3 w-3/4 mb-2" />
              <div className="flex items-center gap-4 mt-3">
                <BaseSkeleton className="h-3 w-24" />
                <BaseSkeleton className="h-3 w-24" />
                <BaseSkeleton className="h-3 w-24" />
              </div>
            </div>
            <div className="flex gap-2">
              <BaseSkeleton className="h-8 w-8 rounded-lg" />
              <BaseSkeleton className="h-8 w-8 rounded-lg" />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}