import { createFileRoute } from "@tanstack/react-router";
import { Copy, FileText, Headphones, Image as ImageIcon, Video } from "lucide-react";

import { CapsuleTabs, useCapsule } from "./capsules.$id";
import { ActionButton, PageHeader, Panel } from "@/components/Bits";
import { AppShell } from "@/components/layout/AppShell";
import { useLang } from "@/lib/i18n";
import { memories } from "@/lib/mock-data";

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
  photo: ImageIcon,
  video: Video,
  audio: Headphones,
  document: FileText,
  text: FileText,
} as const;

function CapsuleDetailPage() {
  const { id } = Route.useParams();
  const capsule = useCapsule(id);
  const { t, lang } = useLang();

  return (
    <AppShell>
      <div
        className="mb-8 overflow-hidden rounded-lg border border-border shadow-warm animate-unfurl"
        style={{
          background: `linear-gradient(120deg, oklch(0.7 0.09 ${capsule.hue}), oklch(0.42 0.1 ${capsule.hue}))`,
        }}
      >
        <div className="bg-background/72 px-6 py-8 backdrop-blur-sm">
          <p className="text-xs uppercase tracking-widest text-sepia">
            {capsule.subject[lang]}
          </p>
          <h1 className="mt-2 font-display text-3xl lg:text-4xl">{capsule.name[lang]}</h1>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
            {capsule.description[lang]}
          </p>
        </div>
      </div>

      <CapsuleTabs id={id} />

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          [t("totalMemories"), String(capsule.memoryCount)],
          [t("storageUsed"), "184 MB"],
          [t("lastUpdated"), capsule.updated],
        ].map(([label, value], i) => (
          <Panel key={label} delay={i * 80}>
            <p className="text-xs uppercase tracking-widest text-muted-foreground">{label}</p>
            <p className="mt-1 font-display text-2xl">{value}</p>
          </Panel>
        ))}
      </div>

      <PageHeader titleKey="memories" />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {memories.slice(0, 6).map((m, i) => {
          const Icon = typeIcon[m.type];
          return (
            <article
              key={m.id}
              style={{ animationDelay: `${i * 80}ms` }}
              className="group frame-photo rounded-sm animate-unfurl transition-transform duration-500 hover:-translate-y-1 hover:rotate-[-0.5deg]"
            >
              <div className="grid h-32 place-items-center rounded-sm bg-gradient-to-br from-secondary to-muted">
                <Icon className="size-7 text-sepia transition-transform duration-500 group-hover:scale-110" aria-hidden />
              </div>
              <div className="pt-3">
                <h3 className="font-display text-base">{m.title[lang]}</h3>
                <p className="text-xs text-muted-foreground">
                  {m.date} · {m.place[lang]}
                </p>
              </div>
            </article>
          );
        })}
      </div>

      <div className="mt-10 grid gap-5 lg:grid-cols-2">
        <Panel>
          <h2 className="font-display text-xl">{t("share")}</h2>
          <div className="mt-4 flex items-center gap-2 rounded-md border border-border bg-background/60 px-3 py-2 text-xs text-muted-foreground">
            <span className="truncate">smritocharon.app/shared/{id}-a91f</span>
            <Copy className="ml-auto size-4 shrink-0 text-primary" aria-hidden />
          </div>
          <ActionButton to="/shared/$token" params={{ token: `${id}-a91f` }} variant="ghost">
            {t("copyLink")}
          </ActionButton>
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
    </AppShell>
  );
}
