import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { EmptyState, PageHeader, Panel } from "@/components/Bits";
import { ActivityTimeline, ActivityTimelineSkeleton } from "@/components/common/ActivityTimeline";
import { AppShell } from "@/components/layout/AppShell";
import { useActivity } from "@/lib/api/hooks";
import type { ActivityItem } from "@/lib/api/types";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/activity")({
  head: () => ({
    meta: [
      { title: "কার্যবিবরণী — স্মৃতিচারণ | Activity log" },
      {
        name: "description",
        content: "সিন্দুকে কে কী করেছে — আপলোড, সম্পাদনা, আলাপ ও ভাগ করার পূর্ণ ইতিহাস।",
      },
      { property: "og:title", content: "কার্যবিবরণী — স্মৃতিচারণ" },
      { property: "og:description", content: "সিন্দুকের সব কাজের পূর্ণ ইতিহাস।" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ActivityPage,
});

const kinds = ["all", "upload", "edit", "chat", "vault", "letter", "share"] as const;
const PER_PAGE = 20;

function ActivityPage() {
  const { t } = useLang();
  const [kind, setKind] = useState<(typeof kinds)[number]>("all");
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState<ActivityItem[]>([]);

  const { data, isLoading, isError } = useActivity({ page, per_page: PER_PAGE });

  useEffect(() => {
    if (!data) return;
    setRows((prev) => (page === 1 ? data.items : [...prev, ...data.items]));
  }, [data, page]);

  const filtered = rows.filter((r) => kind === "all" || r.type === kind);
  const canLoadMore = Boolean(data && page < data.total_pages);

  return (
    <AppShell>
      <PageHeader titleKey="activityLog" subtitle={t("tagline")} />

      <div className="mb-8 flex flex-wrap gap-2">
        {kinds.map((k) => (
          <button
            key={k}
            onClick={() => {
              setKind(k);
            }}
            className={`rounded-full border px-3 py-1.5 text-xs transition-all duration-300 ${
              kind === k
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border text-muted-foreground hover:border-primary/40"
            }`}
          >
            {t(
              k === "all"
                ? "all"
                : k === "vault"
                  ? "vault"
                  : k === "letter"
                    ? "letters"
                    : k === "edit"
                      ? "edits"
                      : k === "chat"
                        ? "chat"
                        : k === "share"
                          ? "share"
                          : "upload",
            )}
          </button>
        ))}
      </div>

      <Panel>
        {isLoading && page === 1 ? (
          <ActivityTimelineSkeleton />
        ) : isError ? (
          <p className="py-8 text-center text-sm text-destructive">{t("errorTitle")}</p>
        ) : filtered.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <ActivityTimeline rows={filtered} />
            {canLoadMore && (
              <div className="mt-2 text-center">
                <button
                  type="button"
                  onClick={() => setPage((p) => p + 1)}
                  className="rounded-md border border-border px-4 py-2 text-sm transition hover:border-primary/50 hover:text-primary"
                >
                  {t("loadMore")}
                </button>
              </div>
            )}
          </>
        )}
      </Panel>
    </AppShell>
  );
}
