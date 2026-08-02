import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  FileText,
  Headphones,
  Heart,
  Image as ImageIcon,
  LayoutGrid,
  List,
  Search,
  Trash2,
  Video,
} from "lucide-react";

import { CapsuleTabs } from "./capsules.$id";
import { EmptyState, PageHeader } from "@/components/Bits";
import { MediaViewer, type MediaKind } from "@/components/common/MediaViewer";
import { SkeletonGrid, SkeletonList } from "@/components/common/LoadingSkeletons";
import { AppShell } from "@/components/layout/AppShell";
import { mediaUrl } from "@/lib/api/client";
import {
  useDeleteMemory,
  useMemories,
  useMemory,
  useToggleMemoryFavorite,
} from "@/lib/api/hooks";
import type { Memory, MemoryType } from "@/lib/api/types";
import { useLang, type Key } from "@/lib/i18n";

export const Route = createFileRoute("/capsules/$id/memories")({
  head: () => ({
    meta: [
      { title: "স্মৃতি সংগ্রহ — স্মৃতিচারণ | Memories" },
      {
        name: "description",
        content:
          "ছবি, ভিডিও, কণ্ঠ ও নথি — আবেগের ট্যাগ ধরে সব স্মৃতি খুঁজুন ও দেখুন।",
      },
      { property: "og:title", content: "স্মৃতি সংগ্রহ — স্মৃতিচারণ" },
      {
        property: "og:description",
        content: "আবেগ ধরে সাজানো স্মৃতির সংগ্রহ।",
      },
    ],
  }),
  component: MemoriesPage,
});

const types = ["all", "photo", "video", "audio", "document", "text"] as const;
type UiType = (typeof types)[number];

const uiToApiType: Partial<Record<UiType, MemoryType>> = {
  photo: "PHOTO",
  video: "VIDEO",
  audio: "AUDIO",
  document: "DOCUMENT",
  text: "JOURNAL",
};

const apiTypeIcon: Record<MemoryType, typeof ImageIcon> = {
  PHOTO: ImageIcon,
  VIDEO: Video,
  AUDIO: Headphones,
  DOCUMENT: FileText,
  JOURNAL: FileText,
  NOTE: FileText,
  LINK: FileText,
};

const apiTypeToUi: Record<MemoryType, MediaKind> = {
  PHOTO: "photo",
  VIDEO: "video",
  AUDIO: "audio",
  DOCUMENT: "document",
  JOURNAL: "text",
  NOTE: "text",
  LINK: "text",
};

function useDebounced<T>(value: T, delay = 350) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setV(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return v;
}

function MemoriesPage() {
  const { id } = Route.useParams();
  const { t, lang } = useLang();
  const [type, setType] = useState<UiType>("all");
  const [q, setQ] = useState("");
  const debouncedQ = useDebounced(q);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [sort, setSort] = useState<"newest" | "oldest">("newest");
  const [openId, setOpenId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [accum, setAccum] = useState<Memory[]>([]);
  const perPage = 12;

  useEffect(() => {
    setPage(1);
    setAccum([]);
  }, [type, debouncedQ]);

  const params = useMemo(
    () => ({
      page,
      per_page: perPage,
      type: type === "all" ? undefined : uiToApiType[type],
      search: debouncedQ.trim() || undefined,
    }),
    [page, type, debouncedQ],
  );

  const { data, isLoading, isFetching } = useMemories(id, params);
  const deleteMemory = useDeleteMemory(id);
  const toggleFavorite = useToggleMemoryFavorite(id);

  useEffect(() => {
    if (!data) return;
    setAccum((prev) => (page === 1 ? data.items : [...prev, ...data.items]));
  }, [data, page]);

  const list = useMemo(
    () =>
      [...accum].sort((a, b) => {
        const da = a.memoryDate ?? a.createdAt;
        const db = b.memoryDate ?? b.createdAt;
        return sort === "newest" ? db.localeCompare(da) : da.localeCompare(db);
      }),
    [accum, sort],
  );

  const openMemoryQuery = useMemory(openId ?? "", { enabled: openId !== null });
  const openMemory = openMemoryQuery.data;

  const related = list
    .filter((m) => m.id !== openId)
    .slice(0, 3)
    .map((m) => ({
      id: m.id,
      title: m.title ?? t("emptyTitle"),
      sub: [m.memoryDate, m.location].filter(Boolean).join(" · "),
    }));

  const handleDelete = (memoryId: string) => {
    if (!window.confirm(t("confirmDelete"))) return;
    deleteMemory.mutate(memoryId, {
      onSuccess: () => {
        if (openId === memoryId) setOpenId(null);
        setAccum((prev) => prev.filter((m) => m.id !== memoryId));
      },
    });
  };

  return (
    <AppShell>
      <PageHeader titleKey="memories" subtitle={t("tagline")} />
      <CapsuleTabs id={id} />

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="relative min-w-[200px] flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t("search")}
            className="w-full rounded-md border border-input bg-card/70 py-2 pl-9 pr-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/30"
          />
        </div>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as UiType)}
          className="rounded-md border border-input bg-card/70 px-3 py-2 text-sm outline-none focus:border-primary"
        >
          {types.map((tp) => (
            <option key={tp} value={tp}>
              {t(tp as Key)}
            </option>
          ))}
        </select>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as "newest" | "oldest")}
          className="rounded-md border border-input bg-card/70 px-3 py-2 text-sm outline-none focus:border-primary"
        >
          <option value="newest">{t("newest")}</option>
          <option value="oldest">{t("oldest")}</option>
        </select>
        <div className="flex gap-1 rounded-md border border-border bg-card/70 p-1">
          {(["grid", "list"] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setView(v)}
              aria-label={t(v)}
              className={`rounded p-1.5 transition ${
                view === v ? "bg-primary text-primary-foreground" : "text-muted-foreground"
              }`}
            >
              {v === "grid" ? <LayoutGrid className="size-4" /> : <List className="size-4" />}
            </button>
          ))}
        </div>
      </div>

      {isLoading && page === 1 ? (
        view === "grid" ? (
          <SkeletonGrid count={8} />
        ) : (
          <SkeletonList count={8} />
        )
      ) : list.length === 0 ? (
        <EmptyState />
      ) : view === "grid" ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {list.map((m, i) => {
            const Icon = apiTypeIcon[m.type];
            const thumb = mediaUrl(m.media?.[0]?.thumbnailUrl ?? m.media?.[0]?.url);
            const emotion = m.metadata?.emotion;
            return (
              <div
                key={m.id}
                style={{ animationDelay: `${i * 60}ms` }}
                className="group frame-photo relative rounded-sm text-left animate-unfurl transition-transform duration-500 hover:-translate-y-1 hover:rotate-[0.6deg]"
              >
                <button onClick={() => setOpenId(m.id)} className="block w-full text-left">
                  {thumb ? (
                    <img
                      src={thumb}
                      alt={m.title ?? ""}
                      loading="lazy"
                      className="h-32 w-full rounded-sm object-cover"
                    />
                  ) : (
                    <div className="grid h-32 place-items-center rounded-sm bg-gradient-to-br from-secondary to-muted">
                      <Icon className="size-7 text-sepia transition-transform duration-500 group-hover:scale-110" aria-hidden />
                    </div>
                  )}
                  <div className="pt-3">
                    <h3 className="font-display text-base">{m.title ?? t("emptyTitle")}</h3>
                    <p className="text-xs text-muted-foreground">
                      {[m.memoryDate, m.location].filter(Boolean).join(" · ")}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {emotion && (
                        <span className="inline-block rounded-full bg-brass/20 px-2 py-0.5 text-[10px] text-sepia">
                          {emotion}
                        </span>
                      )}
                      {m.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="inline-block rounded-full bg-secondary px-2 py-0.5 text-[10px] text-secondary-foreground">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </button>
                <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition group-hover:opacity-100">
                  <button
                    type="button"
                    aria-label={t("pin")}
                    onClick={() => toggleFavorite.mutate(m.id)}
                    className={`grid size-7 place-items-center rounded-full border backdrop-blur ${
                      m.isFavorite ? "border-destructive/50 bg-card text-destructive" : "border-border bg-card/80 text-muted-foreground"
                    }`}
                  >
                    <Heart className={`size-3.5 ${m.isFavorite ? "fill-current" : ""}`} aria-hidden />
                  </button>
                  <button
                    type="button"
                    aria-label={t("del")}
                    onClick={() => handleDelete(m.id)}
                    className="grid size-7 place-items-center rounded-full border border-border bg-card/80 text-muted-foreground backdrop-blur hover:border-destructive/50 hover:text-destructive"
                  >
                    <Trash2 className="size-3.5" aria-hidden />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <ul className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-card/80">
          {list.map((m) => {
            const Icon = apiTypeIcon[m.type];
            return (
              <li key={m.id} className="flex items-center">
                <button
                  onClick={() => setOpenId(m.id)}
                  className="flex flex-1 items-center gap-4 px-4 py-3 text-left transition hover:bg-secondary/50"
                >
                  <Icon className="size-4 shrink-0 text-primary" aria-hidden />
                  <span className="flex-1">
                    <span className="font-display">{m.title ?? t("emptyTitle")}</span>
                    <span className="block text-xs text-muted-foreground">
                      {[m.memoryDate, m.location].filter(Boolean).join(" · ")}
                    </span>
                  </span>
                  <span className="text-xs text-sepia">{m.metadata?.emotion ?? ""}</span>
                </button>
                <div className="flex gap-1 px-3">
                  <button
                    type="button"
                    aria-label={t("pin")}
                    onClick={() => toggleFavorite.mutate(m.id)}
                    className={`grid size-7 place-items-center rounded-md border ${
                      m.isFavorite ? "border-destructive/50 text-destructive" : "border-border text-muted-foreground"
                    }`}
                  >
                    <Heart className={`size-3.5 ${m.isFavorite ? "fill-current" : ""}`} aria-hidden />
                  </button>
                  <button
                    type="button"
                    aria-label={t("del")}
                    onClick={() => handleDelete(m.id)}
                    className="grid size-7 place-items-center rounded-md border border-border text-muted-foreground hover:border-destructive/50 hover:text-destructive"
                  >
                    <Trash2 className="size-3.5" aria-hidden />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {data && page < data.total_pages && (
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => setPage((p) => p + 1)}
            disabled={isFetching}
            className="rounded-md border border-border bg-card px-4 py-2 text-sm transition hover:border-primary/50 disabled:opacity-60"
          >
            {isFetching ? t("loading") : t("loadMore")}
          </button>
        </div>
      )}

      <MediaViewer
        open={openId !== null}
        onClose={() => setOpenId(null)}
        loading={openMemoryQuery.isLoading}
        kind={openMemory ? apiTypeToUi[openMemory.type] : "photo"}
        title={openMemory?.title ?? ""}
        body={openMemory?.description ?? openMemory?.content ?? undefined}
        emotion={openMemory?.metadata?.emotion}
        mediaSrc={mediaUrl(openMemory?.media?.[0]?.url)}
        downloadUrl={mediaUrl(openMemory?.media?.[0]?.url)}
        ocrText={openMemory?.media?.map((m) => m.ocrText).filter(Boolean).join("\n") || undefined}
        transcription={openMemory?.media?.map((m) => m.transcription).filter(Boolean).join("\n") || undefined}
        summary={openMemory?.metadata?.summary}
        favorite={openMemory?.isFavorite}
        onToggleFavorite={openMemory ? () => toggleFavorite.mutate(openMemory.id) : undefined}
        onDelete={openMemory ? () => handleDelete(openMemory.id) : undefined}
        related={related}
        onSelectRelated={(rid) => setOpenId(rid)}
        meta={
          openMemory
            ? [
                { label: t("date"), value: openMemory.memoryDate ?? "—" },
                { label: t("location"), value: openMemory.location ?? "—" },
                { label: t("filter"), value: apiTypeToUi[openMemory.type] },
              ]
            : []
        }
      />
    </AppShell>
  );
}
