import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search as SearchIcon, SlidersHorizontal } from "lucide-react";

import { PageHeader, Panel } from "@/components/Bits";
import { AIThinking, RelevanceMeter } from "@/components/ai/AIBits";
import { HitList, useGlobalHits } from "@/components/common/SearchModal";
import { AppShell } from "@/components/layout/AppShell";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/search")({
  head: () => ({
    meta: [
      { title: "খোঁজ — স্মৃতিচারণ | Search memories" },
      {
        name: "description",
        content:
          "স্বাভাবিক ভাষায় খুঁজুন — “১৯৬৮ সালের পুজোর ছবি” লিখলেই সংশ্লিষ্ট স্মৃতি সামনে আসবে।",
      },
      { property: "og:title", content: "খোঁজ — স্মৃতিচারণ" },
      { property: "og:description", content: "স্বাভাবিক ভাষায় স্মৃতির খোঁজ।" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SearchPage,
});

const types = ["all", "photo", "video", "audio", "document", "text"] as const;

function SearchPage() {
  const { t } = useLang();
  const [q, setQ] = useState("");
  const [type, setType] = useState<(typeof types)[number]>("all");
  const [emotion, setEmotion] = useState("all");
  const { hits, loading, error } = useGlobalHits(q);

  const visible = hits.filter((h) => {
    if (type === "all") return true;
    if (h.group !== "memories") return false;
    const map: Record<string, string> = {
      PHOTO: "photo",
      VIDEO: "video",
      AUDIO: "audio",
      DOCUMENT: "document",
      JOURNAL: "text",
      NOTE: "text",
      LINK: "text",
    };
    return h.type ? map[h.type] === type : false;
  });
  const topScore = visible.find((h) => typeof h.score === "number")?.score ?? 0;

  return (
    <AppShell>
      <PageHeader titleKey="globalSearch" subtitle={t("naturalSearch")} />

      <div className="grid gap-6 lg:grid-cols-[1fr_18rem]">
        <div>
          <div className="flex items-center gap-3 rounded-lg border border-input bg-card px-4 py-3 shadow-warm focus-within:border-primary">
            <SearchIcon className="size-4 text-muted-foreground" aria-hidden />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t("naturalSearch")}
              aria-label={t("globalSearch")}
              className="w-full bg-transparent text-sm outline-none"
            />
          </div>

          {loading && (
            <div className="mt-4">
              <AIThinking label={t("indexing")} />
            </div>
          )}

          {error && (
            <p className="mt-4 rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error.message}
            </p>
          )}

          <p className="mt-6 text-xs uppercase tracking-widest text-muted-foreground">
            {visible.length} {t("results")}
          </p>
          <div className="mt-3 overflow-hidden rounded-lg border border-border bg-card/80">
            <HitList hits={visible} />
          </div>
        </div>

        <Panel>
          <p className="flex items-center gap-2 font-display text-lg">
            <SlidersHorizontal className="size-4 text-primary" aria-hidden />{" "}
            {t("advancedFilters")}
          </p>

          <p className="mt-5 text-[11px] uppercase tracking-widest text-muted-foreground">
            {t("filter")}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {types.map((ty) => (
              <button
                key={ty}
                onClick={() => setType(ty)}
                className={`rounded-full border px-3 py-1 text-xs transition ${
                  type === ty
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border text-muted-foreground hover:border-primary/40"
                }`}
              >
                {t(ty)}
              </button>
            ))}
          </div>

          <p className="mt-5 text-[11px] uppercase tracking-widest text-muted-foreground">
            {t("emotion")}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {["all", "joy", "nostalgia", "love", "pride", "sadness"].map((em) => (
              <button
                key={em}
                onClick={() => setEmotion(em)}
                className={`rounded-full border px-3 py-1 text-xs transition ${
                  emotion === em
                    ? "border-brass bg-brass/20 text-sepia"
                    : "border-border text-muted-foreground hover:border-brass/50"
                }`}
              >
                {t(em as "joy")}
              </button>
            ))}
          </div>

          <p className="mt-5 text-[11px] uppercase tracking-widest text-muted-foreground">
            {t("dateRange")}
          </p>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <input
              type="date"
              className="rounded-md border border-input bg-background px-2 py-1.5 text-xs outline-none focus:border-primary"
            />
            <input
              type="date"
              className="rounded-md border border-input bg-background px-2 py-1.5 text-xs outline-none focus:border-primary"
            />
          </div>

          <div className="mt-6">
            <RelevanceMeter value={topScore} />
          </div>
        </Panel>
      </div>
    </AppShell>
  );
}
