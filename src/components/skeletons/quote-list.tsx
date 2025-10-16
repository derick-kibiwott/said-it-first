import { Skeleton } from "@/components/ui/skeleton";

export function QuoteListSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-7 w-48 mb-6" /> {/* Title skeleton */}
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="p-6 border border-border rounded-lg bg-card flex gap-4"
          >
            {/* Avatar */}
            <Skeleton className="h-10 w-10 rounded-full" />

            {/* Quote text + author */}
            <div className="flex-1 space-y-3">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-3 w-1/3" />
            </div>

            {/* Buttons */}
            <div className="flex flex-shrink-0 gap-2">
              <Skeleton className="h-8 w-8 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
