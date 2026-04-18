import { BaseSkeleton } from "./BaseSkeleton";

export const StatsSkeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-6"
        >
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <BaseSkeleton className="h-4 w-24" />
              <BaseSkeleton className="h-8 w-16" />
            </div>
            <BaseSkeleton className="h-12 w-12 rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  );
};
