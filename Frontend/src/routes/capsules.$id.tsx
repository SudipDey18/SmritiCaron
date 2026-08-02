import { createFileRoute, Link, Outlet } from "@tanstack/react-router";

import { useCapsule as useCapsuleQuery } from "@/lib/api/hooks";
import type { Capsule } from "@/lib/api/types";
import { useLang, type Key } from "@/lib/i18n";

export const Route = createFileRoute("/capsules/$id")({
  component: () => <Outlet />,
});

const tabs: { to: string; key: Key }[] = [
  { to: "/capsules/$id", key: "all" },
  { to: "/capsules/$id/memories", key: "memories" },
  { to: "/capsules/$id/chat", key: "chat" },
  { to: "/capsules/$id/timeline", key: "timeline" },
  { to: "/capsules/$id/family", key: "family" },
  { to: "/capsules/$id/time-vault", key: "vault" },
  { to: "/capsules/$id/legacy", key: "legacy" },
];

/** API-backed capsule query, re-exported for other capsule sub-routes. */
export function useCapsuleData(id: string) {
  return useCapsuleQuery(id);
}

/** Returns the API capsule object (or undefined while loading/missing). */
export function useCapsule(id: string): Capsule | undefined {
  const { data } = useCapsuleQuery(id);
  return data;
}

export function CapsuleTabs({ id }: { id: string }) {
  const { t } = useLang();
  return (
    <nav className="scroll-alpona-x mb-8 flex gap-1 overflow-x-auto rounded-md border border-border bg-card/70 p-1">
      {tabs.map((tb) => (
        <Link
          key={tb.to}
          to={tb.to}
          params={{ id }}
          activeOptions={{ exact: tb.to === "/capsules/$id" }}
          activeProps={{ className: "bg-primary text-primary-foreground" }}
          className="whitespace-nowrap rounded px-3 py-1.5 text-xs text-muted-foreground transition-all duration-300 hover:text-foreground"
        >
          {tb.key === "all" ? t("dashboard") : t(tb.key)}
        </Link>
      ))}
    </nav>
  );
}
