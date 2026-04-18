import { StatsSkeleton } from './StatsSkeleton'
import { ChartSkeleton } from './ChartSkeleton'
import { ListSkeleton } from './ListSkeleton'
import { BaseSkeleton } from './BaseSkeleton'

export const DashboardSkeleton = () => {
  return (
    <div className="space-y-6">
      <div>
        <BaseSkeleton className="h-8 w-48 mb-2" />
        <BaseSkeleton className="h-4 w-64" />
      </div>

      <StatsSkeleton />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChartSkeleton />
        </div>
        <ChartSkeleton />
      </div>

      <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-6">
        <BaseSkeleton className="h-6 w-32 mb-4" />
        <BaseSkeleton className="h-[400px] w-full rounded-lg" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-6">
          <BaseSkeleton className="h-6 w-40 mb-4" />
          <ListSkeleton count={3} />
        </div>
        <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-6">
          <BaseSkeleton className="h-6 w-40 mb-4" />
          <ListSkeleton count={3} />
        </div>
      </div>
    </div>
  )
}