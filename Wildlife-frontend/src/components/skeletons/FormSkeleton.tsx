import { BaseSkeleton } from './BaseSkeleton'

export const FormSkeleton = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 space-y-4">
        <BaseSkeleton className="h-6 w-40 mb-4" />
        
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <BaseSkeleton className="h-4 w-24" />
            <BaseSkeleton className="h-10 w-full rounded-lg" />
          </div>
        ))}
        
        <div className="flex justify-end gap-3 pt-4">
          <BaseSkeleton className="h-10 w-24 rounded-lg" />
          <BaseSkeleton className="h-10 w-32 rounded-lg" />
        </div>
      </div>
    </div>
  )
}