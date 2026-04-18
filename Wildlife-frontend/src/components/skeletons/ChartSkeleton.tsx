import { BaseSkeleton } from "./BaseSkeleton";

export const ChartSkeleton = () => {
  return (
    <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-6">
      <BaseSkeleton className="h-6 w-32 mb-6" />
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <BaseSkeleton className="h-8 w-12" />
            <BaseSkeleton
              className="flex-1 h-8"
              style={{ width: `${((i * 13) % 60) + 20}%` }} 
            />
          </div>
        ))}
      </div>
    </div>
  );
};
