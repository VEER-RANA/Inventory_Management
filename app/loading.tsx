"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="glass rounded-[1.5rem] p-6 space-y-3">
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-8 w-16" />
          </div>
        ))}
      </div>

      {/* Charts Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass rounded-[1.5rem] p-6 space-y-4">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-[300px] w-full rounded-xl" />
        </div>
        <div className="glass rounded-[1.5rem] p-6 space-y-4">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-[300px] w-full rounded-xl" />
        </div>
      </div>

      {/* Alerts & Movements Skeleton */}
      <div className="space-y-3">
        <Skeleton className="h-6 w-48 mb-4" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="glass rounded-[1.5rem] p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
            <Skeleton className="h-8 w-24 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
