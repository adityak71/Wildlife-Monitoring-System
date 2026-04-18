import { BaseSkeleton } from './BaseSkeleton'

export const DetailsSkeleton = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <BaseSkeleton className="h-10 w-10 rounded-full" />
        <div className="flex-1">
          <BaseSkeleton className="h-8 w-64 mb-2" />
          <BaseSkeleton className="h-4 w-32" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 space-y-4">
          <BaseSkeleton className="h-6 w-32" />
          <BaseSkeleton className="h-4 w-full" />
          <BaseSkeleton className="h-4 w-3/4" />
          <BaseSkeleton className="h-4 w-1/2" />
        </div>
        <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 space-y-4">
          <BaseSkeleton className="h-6 w-32" />
          <BaseSkeleton className="h-4 w-full" />
          <BaseSkeleton className="h-4 w-3/4" />
          <BaseSkeleton className="h-4 w-1/2" />
        </div>
      </div>

      <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 space-y-4">
        <BaseSkeleton className="h-6 w-40" />
        <BaseSkeleton className="h-4 w-full" />
        <BaseSkeleton className="h-4 w-full" />
        <BaseSkeleton className="h-4 w-2/3" />
      </div>
    </div>
  )
}