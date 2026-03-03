import { Skeleton } from "@/components/ui/skeleton";

interface PageLoadingProps {
  label?: string;
}

export function PageLoading({ label }: PageLoadingProps) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-full max-w-2xl px-6 space-y-6">
        <div className="space-y-3">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-40 w-full rounded-2xl" />
        <div className="space-y-3">
          <Skeleton className="h-20 w-full rounded-xl" />
          <Skeleton className="h-20 w-full rounded-xl" />
        </div>
        {label && (
          <p className="text-sm text-muted-foreground text-center animate-pulse">
            {label}
          </p>
        )}
      </div>
    </div>
  );
}
