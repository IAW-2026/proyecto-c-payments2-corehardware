import { ActivitySkeleton } from '@/components/skeletons'

export default function Loading() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="h-7 w-24 rounded bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
          <div className="h-4 w-64 rounded bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
        </div>
        <div className="h-9 w-32 rounded-lg bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
      </div>
      <div className="flex gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-px">
        <div className="h-8 w-24 rounded bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
        <div className="h-8 w-24 rounded bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
      </div>
      <ActivitySkeleton />
    </div>
  )
}