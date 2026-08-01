import { createFileRoute, Link, Outlet } from "@tanstack/react-router";

import { useLang, type Key } from "@/lib/i18n";
import { capsules } from "@/lib/mock-data";

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

export function useCapsule(id: string) {
  return capsules.find((c) => c.id === id) ?? capsules[0]!;
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
