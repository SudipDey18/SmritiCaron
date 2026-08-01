import { createFileRoute, Link } from "@tanstack/react-router";
import { Archive, HardDrive, Image as ImageIcon, Plus, Sparkles } from "lucide-react";

import { ActionButton, EmptyState, Panel, PageHeader } from "@/components/Bits";
import { SkeletonGrid, SkeletonList } from "@/components/common/LoadingSkeletons";
import { AppShell } from "@/components/layout/AppShell";
import { mediaUrl } from "@/lib/api/client";
import { useCapsules, useDashboard, useRecentActivity, useStorageUsage } from "@/lib/api/hooks";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "ড্যাশবোর্ড — স্মৃতিচারণ | Dashboard" },
      {
        name: "description",
        content:
          "আপনার সব স্মৃতির সিন্দুক, সাম্প্রতিক কাজ ও শীঘ্রই খুলতে চলা সময়-সিন্দুক এক নজরে।",
      },
      { property: "og:title", content: "ড্যাশবোর্ড — স্মৃতিচারণ" },
      {
        property: "og:description",
        content: "সব সিন্দুক ও সাম্প্রতিক স্মৃতি এক নজরে।",
      },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const { t, lang } = useLang();
  const dashboard = useDashboard();
  const activity = useRecentActivity();
  const storage = useStorageUsage();
  const capsulesQuery = useCapsules({ page: 1, per_page: 6 });

  const summary = dashboard.data;
  const capsules = capsulesQuery.data?.items ?? [];

  return (
    <AppShell>
      <PageHeader
        title={`${t("welcome")}${summary ? "" : ""}`}
        subtitle={t("tagline")}
        action={
          <ActionButton to="/capsules/new">
            <Plus className="size-4" aria-hidden /> {t("newCapsule")}
          </ActionButton>
        }
      />

      {dashboard.isError ? (
        <Panel className="border-destructive/30">
          <p className="text-sm text-destructive">{t("errorTitle")}</p>
        </Panel>
      ) : dashboard.isPending ? (
        <SkeletonGrid count={3} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { icon: ImageIcon, label: t("totalMemories"), value: String(summary?.memoryCount ?? 0) },
            { icon: Archive, label: t("totalCapsules"), value: String(summary?.capsuleCount ?? 0) },
            {
              icon: HardDrive,
              label: t("storageUsed"),
              value: summary?.storageHuman ?? "0 MB",
            },
          ].map((s, i) => (
            <Panel key={s.label} delay={i * 90}>
              <s.icon className="mb-3 size-5 text-primary" aria-hidden />
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                {s.label}
              </p>
              <p className="mt-1 font-display text-2xl">{s.value}</p>
            </Panel>
          ))}
        </div>
      )}

      <h2 className="mt-10 font-display text-2xl">{t("capsules")}</h2>
      {capsulesQuery.isPending ? (
        <div className="mt-4">
          <SkeletonGrid count={3} />
        </div>
      ) : capsules.length === 0 ? (
        <div className="mt-4">
          <EmptyState />
        </div>
      ) : (
        <div className="mt-4 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {capsules.map((c, i) => (
            <Link
              key={c.id}
              to="/capsules/$id"
              params={{ id: c.id }}
              style={{ animationDelay: `${i * 90}ms` }}
              className="group frame-photo rounded-sm animate-unfurl transition-all duration-500 hover:-translate-y-1 hover:rotate-[0.4deg]"
            >
              <div
                className="h-36 rounded-sm bg-cover bg-center transition-transform duration-700 group-hover:scale-[1.02]"
                style={{
                  backgroundImage: c.coverUrl
                    ? `url(${mediaUrl(c.coverUrl)})`
                    : `linear-gradient(140deg, oklch(0.72 0.09 200), oklch(0.46 0.11 200))`,
                }}
              />
              <div className="pt-3">
                <h3 className="font-display text-lg">{c.title}</h3>
                <p className="text-xs text-muted-foreground">{c.description ?? ""}</p>
                <p className="mt-2 text-xs text-sepia">
                  {c._count?.memories ?? 0} {t("memoryCount")}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-10 grid gap-5 lg:grid-cols-2">
        <Panel>
          <h2 className="font-display text-xl">{t("recentActivity")}</h2>
          {activity.isPending ? (
            <div className="mt-4">
              <SkeletonList count={4} />
            </div>
          ) : (activity.data?.items.length ?? 0) === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">{t("emptyBody")}</p>
          ) : (
            <ul className="mt-4 space-y-4">
              {activity.data?.items.map((a) => (
                <li key={a.id} className="flex gap-3 text-sm">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                  <span>
                    {a.message}
                    <span className="block text-xs text-muted-foreground">
                      {new Date(a.createdAt).toLocaleString(lang === "bn" ? "bn-BD" : "en-US")}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Panel>
        <Panel delay={120}>
          <h2 className="flex items-center gap-2 font-display text-xl">
            <Sparkles className="size-4 text-brass" aria-hidden /> {t("storageGraph")}
          </h2>
          {storage.isPending ? (
            <div className="mt-4">
              <SkeletonList count={3} />
            </div>
          ) : (
            <div className="mt-4">
              <div className="h-3 w-full overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-brass transition-all duration-1000"
                  style={{ width: `${Math.min(100, storage.data?.usagePercent ?? 0)}%` }}
                />
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                {summary?.storageHuman ?? "0 MB"} · {Math.round(storage.data?.usagePercent ?? 0)}%
              </p>
            </div>
          )}
        </Panel>
      </div>

      <div className="mt-10">
        <Panel>
          <h2 className="font-display text-xl">{t("recentUploads")}</h2>
          {dashboard.isPending ? (
            <div className="mt-4">
              <SkeletonGrid count={3} />
            </div>
          ) : (summary?.recentMemories.length ?? 0) === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">{t("emptyBody")}</p>
          ) : (
            <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {summary?.recentMemories.map((m) => (
                <li
                  key={m.id}
                  className="flex items-center gap-3 rounded-md border border-border bg-background/60 px-3 py-2 text-xs"
                >
                  {m.thumbnailUrl ? (
                    <img
                      src={mediaUrl(m.thumbnailUrl)}
                      alt=""
                      className="size-8 shrink-0 rounded-sm object-cover"
                    />
                  ) : (
                    <span className="size-8 shrink-0 rounded-sm bg-gradient-to-br from-secondary to-muted" />
                  )}
                  <span className="min-w-0 flex-1 truncate">{m.title ?? t("memories")}</span>
                  <span className="shrink-0 text-sepia">{m.memoryDate ?? ""}</span>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>

      <Link
        to="/capsules/$id/upload"
        params={{ id: capsules[0]?.id ?? "" }}
        className="fixed bottom-20 right-5 z-30 grid size-14 place-items-center rounded-full bg-primary text-primary-foreground shadow-warm transition-transform hover:scale-110 lg:bottom-8"
        aria-label={t("upload")}
      >
        <Plus className="size-6" aria-hidden />
      </Link>
    </AppShell>
  );
}
