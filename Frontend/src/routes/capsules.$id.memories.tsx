import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  FileText,
  Headphones,
  Image as ImageIcon,
  LayoutGrid,
  List,
  Search,
  Video,
  X,
} from "lucide-react";

import { CapsuleTabs } from "./capsules.$id";
import { EmptyState, PageHeader } from "@/components/Bits";
import { AppShell } from "@/components/layout/AppShell";
import { useLang, type Key } from "@/lib/i18n";
import { memories, type Memory } from "@/lib/mock-data";

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

const typeIcon = {
  photo: ImageIcon,
  video: Video,
  audio: Headphones,
  document: FileText,
  text: FileText,
} as const;

const types = ["all", "photo", "video", "audio", "document", "text"] as const;

function MemoriesPage() {
  const { id } = Route.useParams();
  const { t, lang } = useLang();
  const [type, setType] = useState<(typeof types)[number]>("all");
  const [q, setQ] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [sort, setSort] = useState<"newest" | "oldest">("newest");
  const [open, setOpen] = useState<Memory | null>(null);

  const list = memories
    .filter(
      (m) =>
        (type === "all" || m.type === type) &&
        m.title[lang].toLowerCase().includes(q.toLowerCase()),
    )
    .sort((a, b) =>
      sort === "newest" ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date),
    );

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
          onChange={(e) => setType(e.target.value as (typeof types)[number])}
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

      {list.length === 0 ? (
        <EmptyState />
      ) : view === "grid" ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {list.map((m, i) => {
            const Icon = typeIcon[m.type];
            return (
              <button
                key={m.id}
                onClick={() => setOpen(m)}
                style={{ animationDelay: `${i * 60}ms` }}
                className="group frame-photo rounded-sm text-left animate-unfurl transition-transform duration-500 hover:-translate-y-1 hover:rotate-[0.6deg]"
              >
                <div className="grid h-32 place-items-center rounded-sm bg-gradient-to-br from-secondary to-muted">
                  <Icon className="size-7 text-sepia transition-transform duration-500 group-hover:scale-110" aria-hidden />
                </div>
                <div className="pt-3">
                  <h3 className="font-display text-base">{m.title[lang]}</h3>
                  <p className="text-xs text-muted-foreground">
                    {m.date} · {m.place[lang]}
                  </p>
                  <span className="mt-2 inline-block rounded-full bg-brass/20 px-2 py-0.5 text-[10px] text-sepia">
                    {t(m.emotion)}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <ul className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-card/80">
          {list.map((m) => {
            const Icon = typeIcon[m.type];
            return (
              <li key={m.id}>
                <button
                  onClick={() => setOpen(m)}
                  className="flex w-full items-center gap-4 px-4 py-3 text-left transition hover:bg-secondary/50"
                >
                  <Icon className="size-4 shrink-0 text-primary" aria-hidden />
                  <span className="flex-1">
                    <span className="font-display">{m.title[lang]}</span>
                    <span className="block text-xs text-muted-foreground">
                      {m.date} · {m.place[lang]}
                    </span>
                  </span>
                  <span className="text-xs text-sepia">{t(m.emotion)}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {open && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-foreground/60 px-4 backdrop-blur-sm"
          onClick={() => setOpen(null)}
        >
          <div
            className="w-full max-w-lg rounded-lg border border-border bg-card p-6 shadow-warm animate-unfurl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <h2 className="font-display text-2xl">{open.title[lang]}</h2>
              <button onClick={() => setOpen(null)} aria-label={t("cancel")}>
                <X className="size-5 text-muted-foreground transition hover:text-foreground" />
              </button>
            </div>
            <div className="mt-4 grid h-44 place-items-center rounded-md bg-gradient-to-br from-secondary to-muted">
              {(() => {
                const Icon = typeIcon[open.type];
                return <Icon className="size-10 text-sepia" aria-hidden />;
              })()}
            </div>
            <p className="mt-4 text-sm leading-relaxed">{open.body[lang]}</p>
            <dl className="mt-4 grid grid-cols-2 gap-3 text-xs text-muted-foreground">
              <div>
                <dt className="uppercase tracking-widest">{t("date")}</dt>
                <dd className="text-foreground">{open.date}</dd>
              </div>
              <div>
                <dt className="uppercase tracking-widest">{t("location")}</dt>
                <dd className="text-foreground">{open.place[lang]}</dd>
              </div>
              <div>
                <dt className="uppercase tracking-widest">{t("emotion")}</dt>
                <dd className="text-foreground">{t(open.emotion)}</dd>
              </div>
              <div>
                <dt className="uppercase tracking-widest">{t("filter")}</dt>
                <dd className="text-foreground">{t(open.type)}</dd>
              </div>
            </dl>
          </div>
        </div>
      )}
    </AppShell>
  );
}
