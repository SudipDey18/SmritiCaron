/** Warm paper-toned loading skeletons. */
export function SkeletonLine({ w = "100%" }: { w?: string }) {
  return (
    <span
      className="block h-3 animate-pulse rounded-full bg-gradient-to-r from-secondary via-muted to-secondary"
      style={{ width: w }}
    />
  );
}

export function SkeletonCard({ delay = 0 }: { delay?: number }) {
  return (
    <div
      style={{ animationDelay: `${delay}ms` }}
      className="rounded-lg border border-border bg-card/70 p-4 animate-rise"
    >
      <span className="block h-28 animate-pulse rounded-sm bg-gradient-to-br from-secondary to-muted" />
      <div className="mt-3 space-y-2">
        <SkeletonLine w="70%" />
        <SkeletonLine w="45%" />
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div
      className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
      role="status"
      aria-label="Loading"
    >
      {Array.from({ length: count }, (_, i) => (
        <SkeletonCard key={i} delay={i * 70} />
      ))}
    </div>
  );
}

export function SkeletonList({ count = 5 }: { count?: number }) {
  return (
    <ul className="space-y-3" role="status" aria-label="Loading">
      {Array.from({ length: count }, (_, i) => (
        <li
          key={i}
          className="flex items-center gap-3 rounded-lg border border-border bg-card/70 p-3"
        >
          <span className="size-9 shrink-0 animate-pulse rounded-sm bg-gradient-to-br from-secondary to-muted" />
          <span className="flex-1 space-y-2">
            <SkeletonLine w="55%" />
            <SkeletonLine w="30%" />
          </span>
        </li>
      ))}
    </ul>
  );
}
