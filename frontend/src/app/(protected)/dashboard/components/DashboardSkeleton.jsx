'use client'

import { Skeleton } from '@/components/ui/skeleton'

export default function DashboardSkeleton() {
  return (
    <div className="flex w-full flex-col">
      <Skeleton className="mb-6 h-8 w-[350px] rounded-full" />
      <div className="mb-12 flex flex-col gap-4">
        <Skeleton className="h-6 w-[250px] rounded-full" />
        <Skeleton className="h-6 w-full rounded-full" />
        <Skeleton className="h-6  w-[200px] rounded-full" />
      </div>
      <div className="flex flex-col gap-4">
        <Skeleton className="h-12 w-full rounded-md" />
        <Skeleton className="h-12 w-full rounded-md" />
      </div>
    </div>
  )
}
