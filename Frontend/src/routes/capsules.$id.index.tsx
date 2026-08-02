import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Copy, Download, FileText, Headphones, Image as ImageIcon, Share2, ShieldOff, Video } from "lucide-react";

import { CapsuleTabs, useCapsule } from "./capsules.$id";
import { EmptyState, ActionButton, PageHeader, Panel } from "@/components/Bits";
import { SkeletonGrid, SkeletonList } from "@/components/common/LoadingSkeletons";
import { ExportDialog } from "@/components/common/ExportDialog";
import { ShareDialog } from "@/components/common/ShareDialog";
import { AppShell } from "@/components/layout/AppShell";
import { mediaUrl } from "@/lib/api/client";
import {
  useCreateShareLink,
  useExportData,
  useMemories,
  useRevokeShareLink,
  useShareLinks,
} from "@/lib/api/hooks";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/capsules/$id/")({
  head: () => ({
    meta: [
      { title: "সিন্দুকের ভেতরে — স্মৃতিচারণ | Capsule" },
      {
        name: "description",
        content:
          "একটি স্মৃতির সিন্দুকের কেন্দ্র — সাম্প্রতিক স্মৃতি, ভাগ করার লিংক ও পরিসংখ্যান।",
      },
      { property: "og:title", content: "সিন্দুকের ভেতরে — স্মৃতিচারণ" },
      {
        property: "og:description",
        content: "সাম্প্রতিক স্মৃতি, পরিসংখ্যান ও ভাগ করার ব্যবস্থা।",
      },
    ],
  }),
  component: CapsuleDetailPage,
});

const typeIcon = {
  PHOTO: ImageIcon,
  VIDEO: Video,
  AUDIO: Headphones,
  DOCUMENT: FileText,
  JOURNAL: FileText,
  NOTE: FileText,
  LINK: FileText,
} as const;

function CapsuleDetailPage() {
  const { id } = Route.useParams();
  const capsule = useCapsule(id);
  const memoriesQuery = useMemories(id, { page: 1, per_page: 6 });
  const shareLinksQuery = useShareLinks("CAPSULE", id);
  const createShareLink = useCreateShareLink("CAPSULE", id);
  const revokeShareLink = useRevokeShareLink("CAPSULE", id);
  const exportData = useExportData();
  const { t } = useLang();
  const [share, setShare] = useState(false);
  const [export_, setExport_] = useState(false);

  if (!capsule) {
    return (
      <AppShell>
        <SkeletonList count={3} />
      </AppShell>
    );
  }

  const memories = memoriesQuery.data?.items ?? [];
  const activeLink = shareLinksQuery.data?.find((l) => l.isActive);

  return (
    <AppShell>
      <div
        className="mb-8 overflow-hidden rounded-lg border border-border shadow-warm animate-unfurl"
        style={{
          background: capsule.coverColor
            ? `linear-gradient(120deg, ${capsule.coverColor}, ${capsule.coverColor})`
            : "linear-gradient(120deg, oklch(0.7 0.09 200), oklch(0.42 0.1 200))",
        }}
      >
        <div className="bg-background/72 px-6 py-8 backdrop-blur-sm">
          <p className="text-xs uppercase tracking-widest text-sepia">
            {capsule.relation ?? ""}
          </p>
          <h1 className="mt-2 font-display text-3xl lg:text-4xl">{capsule.title}</h1>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
            {capsule.description ?? ""}
          </p>
        </div>
      </div>

      <CapsuleTabs id={id} />

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          [t("totalMemories"), String(capsule._count?.memories ?? 0)],
          [t("lastUpdated"), new Date(capsule.updatedAt).toLocaleDateString()],
          [t("privacy"), t(capsule.privacy === "PRIVATE" ? "privateOnly" : "withFamily")],
        ].map(([label, value], i) => (
          <Panel key={label} delay={i * 80}>
            <p className="text-xs uppercase tracking-widest text-muted-foreground">{label}</p>
            <p className="mt-1 font-display text-2xl">{value}</p>
          </Panel>
        ))}
      </div>

      <PageHeader titleKey="memories" />
      {memoriesQuery.isPending ? (
        <SkeletonGrid count={3} />
      ) : memories.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {memories.map((m, i) => {
            const Icon = typeIcon[m.type];
            const thumb = m.media?.[0]?.thumbnailUrl;
            return (
              <article
                key={m.id}
                style={{ animationDelay: `${i * 80}ms` }}
                className="group frame-photo rounded-sm animate-unfurl transition-transform duration-500 hover:-translate-y-1 hover:rotate-[-0.5deg]"
              >
                {thumb ? (
                  <img
                    src={mediaUrl(thumb)}
                    alt=""
                    className="h-32 w-full rounded-sm object-cover"
                  />
                ) : (
                  <div className="grid h-32 place-items-center rounded-sm bg-gradient-to-br from-secondary to-muted">
                    <Icon className="size-7 text-sepia transition-transform duration-500 group-hover:scale-110" aria-hidden />
                  </div>
                )}
                <div className="pt-3">
                  <h3 className="font-display text-base">{m.title ?? t("memories")}</h3>
                  <p className="text-xs text-muted-foreground">
                    {m.memoryDate ?? ""} · {m.location ?? ""}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <div className="mt-10 grid gap-5 lg:grid-cols-2">
        <Panel>
          <h2 className="font-display text-xl">{t("share")}</h2>
          {activeLink && (
            <div className="mt-4 flex items-center gap-2 rounded-md border border-border bg-background/60 px-3 py-2 text-xs text-muted-foreground">
              <span className="truncate">{activeLink.url ?? activeLink.token}</span>
              <Copy
                className="ml-auto size-4 shrink-0 cursor-pointer text-primary"
                aria-hidden
                onClick={() => void navigator.clipboard?.writeText(activeLink.url ?? activeLink.token)}
              />
            </div>
          )}
          <div className="mt-4 flex flex-wrap gap-2">
            <ActionButton
              onClick={() => {
                if (!activeLink) createShareLink.mutate(undefined);
                setShare(true);
              }}
            >
              <Share2 className="size-4" aria-hidden /> {t("share")}
            </ActionButton>
            <ActionButton
              variant="ghost"
              onClick={() => {
                exportData.mutate();
                setExport_(true);
              }}
            >
              <Download className="size-4" aria-hidden /> {t("export")}
            </ActionButton>
          </div>
          <ul className="mt-5 space-y-2">
            {(shareLinksQuery.data ?? []).map((s) => (
              <li
                key={s.id}
                className="flex items-center gap-3 rounded-md border border-border bg-background/60 px-3 py-2 text-xs"
              >
                <span className="min-w-0 flex-1 truncate">{s.token}</span>
                <span className="shrink-0 text-muted-foreground">{s.permission}</span>
                <span className="shrink-0 text-sepia">
                  {s.views} · {s.expiresAt ?? "-"}
                </span>
                <button
                  type="button"
                  aria-label={t("revoke")}
                  onClick={() => revokeShareLink.mutate(s.id)}
                  className="shrink-0 text-destructive"
                >
                  <ShieldOff className="size-3.5" aria-hidden />
                </button>
              </li>
            ))}
          </ul>
        </Panel>
        <Panel delay={100} className="border-destructive/30">
          <h2 className="font-display text-xl text-destructive">{t("dangerZone")}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{t("emptyBody")}</p>
          <div className="mt-4 flex gap-2">
            <button className="rounded-md border border-border px-3 py-1.5 text-sm transition hover:border-primary/50">
              {t("archive")}
            </button>
            <button className="rounded-md border border-destructive/50 px-3 py-1.5 text-sm text-destructive transition hover:bg-destructive/10">
              {t("del")}
            </button>
          </div>
        </Panel>
      </div>

      <ShareDialog open={share} onClose={() => setShare(false)} token={activeLink?.token ?? id} />
      <ExportDialog open={export_} onClose={() => setExport_(false)} target={capsule.title} />

    </AppShell>
  );
}
