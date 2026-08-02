import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, Search, Star, Trash2 } from "lucide-react";

import { ActionButton, EmptyState, PageHeader } from "@/components/Bits";
import { SkeletonGrid } from "@/components/common/LoadingSkeletons";
import { AppShell } from "@/components/layout/AppShell";
import { mediaUrl } from "@/lib/api/client";
import { useCapsules, useDeleteCapsule, useToggleCapsuleFavorite } from "@/lib/api/hooks";
import type { CapsuleStatus } from "@/lib/api/types";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/capsules/")({
  head: () => ({
    meta: [
      { title: "সিন্দুক তালিকা — স্মৃতিচারণ | All capsules" },
      {
        name: "description",
        content:
          "সব স্মৃতির সিন্দুক খুঁজুন ও ছেঁকে দেখুন — সক্রিয়, সংরক্ষিত বা পরিবারের সঙ্গে ভাগ করা।",
      },
      { property: "og:title", content: "সিন্দুক তালিকা — স্মৃতিচারণ" },
      {
        property: "og:description",
        content: "সব স্মৃতির সিন্দুক এক জায়গায়।",
      },
    ],
  }),
  component: CapsulesListPage,
});

const tabs = ["all", "active", "archived"] as const;
const statusMap: Record<(typeof tabs)[number], CapsuleStatus | undefined> = {
  all: undefined,
  active: "ACTIVE",
  archived: "ARCHIVED",
};

function CapsulesListPage() {
  const { t } = useLang();
  const [tab, setTab] = useState<(typeof tabs)[number]>("all");
  const [q, setQ] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const id = setTimeout(() => setDebouncedQ(q), 350);
    return () => clearTimeout(id);
  }, [q]);

  useEffect(() => {
    setPage(1);
  }, [tab, debouncedQ]);

  const status = statusMap[tab];
  const query = useCapsules({
    page,
    per_page: 12,
    ...(debouncedQ ? { search: debouncedQ } : {}),
    ...(status ? { status } : {}),
  });
  const toggleFavorite = useToggleCapsuleFavorite();
  const deleteCapsule = useDeleteCapsule();

  const list = query.data?.items ?? [];

  return (
    <AppShell>
      <PageHeader
        titleKey="capsules"
        subtitle={t("tagline")}
        action={
          <ActionButton to="/capsules/new">
            <Plus className="size-4" aria-hidden /> {t("newCapsule")}
          </ActionButton>
        }
      />

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t("search")}
            className="w-full rounded-md border border-input bg-card/70 py-2 pl-9 pr-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/30"
          />
        </div>
        <div className="flex gap-1 rounded-md border border-border bg-card/70 p-1">
          {tabs.map((tb) => (
            <button
              key={tb}
              type="button"
              onClick={() => setTab(tb)}
              className={`rounded px-3 py-1.5 text-xs transition-all duration-300 ${
                tab === tb
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t(tb)}
            </button>
          ))}
        </div>
      </div>

      {query.isError ? (
        <p className="rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {t("errorTitle")}
        </p>
      ) : query.isPending ? (
        <SkeletonGrid count={6} />
      ) : list.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {list.map((c, i) => (
              <div
                key={c.id}
                style={{ animationDelay: `${i * 80}ms` }}
                className="group frame-photo relative rounded-sm animate-unfurl transition-all duration-500 hover:-translate-y-1"
              >
                <Link to="/capsules/$id" params={{ id: c.id }}>
                  <div
                    className="h-40 rounded-sm bg-cover bg-center"
                    style={{
                      backgroundImage: c.coverUrl
                        ? `url(${mediaUrl(c.coverUrl)})`
                        : `linear-gradient(140deg, oklch(0.74 0.09 200), oklch(0.44 0.11 200))`,
                    }}
                  />
                  <div className="pt-3">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-display text-lg">{c.title}</h3>
                      <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] text-secondary-foreground">
                        {t(c.status === "ACTIVE" ? "active" : c.status === "ARCHIVED" ? "archived" : "all")}
                      </span>
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      {c.description ?? ""}
                    </p>
                    <p className="mt-2 text-xs text-sepia">
                      {c._count?.memories ?? 0} {t("memoryCount")}
                    </p>
                  </div>
                </Link>
                <div className="absolute right-2 top-2 flex gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    type="button"
                    aria-label={t("pin")}
                    onClick={(e) => {
                      e.preventDefault();
                      toggleFavorite.mutate(c.id);
                    }}
                    className={`grid size-8 place-items-center rounded-full border border-border bg-card/90 backdrop-blur ${
                      c.isFavorite ? "text-brass" : "text-muted-foreground"
                    }`}
                  >
                    <Star className="size-4" fill={c.isFavorite ? "currentColor" : "none"} aria-hidden />
                  </button>
                  <button
                    type="button"
                    aria-label={t("del")}
                    onClick={(e) => {
                      e.preventDefault();
                      if (window.confirm(t("confirmDelete"))) deleteCapsule.mutate(c.id);
                    }}
                    className="grid size-8 place-items-center rounded-full border border-destructive/40 bg-card/90 text-destructive backdrop-blur"
                  >
                    <Trash2 className="size-4" aria-hidden />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {query.data && query.data.total_pages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-3">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="rounded-md border border-border px-3 py-1.5 text-sm transition hover:border-primary/50 disabled:opacity-40"
              >
                {t("back")}
              </button>
              <span className="text-sm text-muted-foreground">
                {t("page")} {page} / {query.data.total_pages}
              </span>
              <button
                type="button"
                disabled={page >= query.data.total_pages}
                onClick={() => setPage((p) => Math.min(query.data!.total_pages, p + 1))}
                className="rounded-md border border-border px-3 py-1.5 text-sm transition hover:border-primary/50 disabled:opacity-40"
              >
                {t("next")}
              </button>
            </div>
          )}
        </>
      )}
    </AppShell>
  );
}
