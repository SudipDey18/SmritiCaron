import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus } from "lucide-react";

import { CapsuleTabs } from "./capsules.$id";
import { ActionButton, Field, PageHeader } from "@/components/Bits";
import { AppShell } from "@/components/layout/AppShell";
import { useLang } from "@/lib/i18n";
import { timeline } from "@/lib/mock-data";

export const Route = createFileRoute("/capsules/$id/timeline")({
  head: () => ({
    meta: [
      { title: "জীবনরেখা — স্মৃতিচারণ | Life timeline" },
      {
        name: "description",
        content: "জন্ম থেকে শেষ শীত — বছরের পর বছর সাজানো একটি জীবনের ঘটনাপ্রবাহ।",
      },
      { property: "og:title", content: "জীবনরেখা — স্মৃতিচারণ" },
      {
        property: "og:description",
        content: "এক জীবনের গল্প, বছরের পর বছর।",
      },
    ],
  }),
  component: TimelinePage,
});

const cats = ["all", "work", "education", "family", "travel", "other"] as const;

function TimelinePage() {
  const { id } = Route.useParams();
  const { t, lang } = useLang();
  const [cat, setCat] = useState<(typeof cats)[number]>("all");
  const [modal, setModal] = useState(false);

  const list = timeline.filter((e) => cat === "all" || e.cat === cat);

  return (
    <AppShell>
      <PageHeader
        titleKey="timeline"
        subtitle={t("tagline")}
        action={
          <ActionButton onClick={() => setModal(true)}>
            <Plus className="size-4" aria-hidden /> {t("addEvent")}
          </ActionButton>
        }
      />
      <CapsuleTabs id={id} />

      <div className="mb-8 flex flex-wrap gap-2">
        {cats.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`rounded-full border px-3 py-1.5 text-xs transition-all duration-300 ${
              cat === c
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border text-muted-foreground hover:border-primary/40"
            }`}
          >
            {t(c)}
          </button>
        ))}
      </div>

      <ol className="relative ml-4 border-l border-dashed border-border pl-8">
        {list.map((e, i) => (
          <li
            key={e.year + e.title.en}
            style={{ animationDelay: `${i * 110}ms` }}
            className="group relative mb-8 animate-rise"
          >
            <span className="absolute -left-[42px] grid size-8 place-items-center rounded-full border border-brass/60 bg-card font-display text-[10px] text-sepia transition-transform duration-500 group-hover:scale-110">
              ❦
            </span>
            <p className="font-display text-sm text-primary">{e.year}</p>
            <div className="mt-1 rounded-lg border border-border bg-card/85 p-5 shadow-warm transition-transform duration-500 group-hover:-translate-y-1">
              <h3 className="font-display text-xl">{e.title[lang]}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{e.body[lang]}</p>
              <div className="mt-4 flex gap-2">
                {[0, 1, 2].map((k) => (
                  <span
                    key={k}
                    className="size-14 rounded-sm bg-gradient-to-br from-secondary to-muted"
                  />
                ))}
              </div>
              <span className="mt-3 inline-block rounded-full bg-brass/20 px-2 py-0.5 text-[10px] text-sepia">
                {t(e.cat as "work")}
              </span>
            </div>
          </li>
        ))}
      </ol>

      {modal && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-foreground/60 px-4 backdrop-blur-sm"
          onClick={() => setModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md space-y-4 rounded-lg border border-border bg-card p-6 shadow-warm animate-unfurl"
          >
            <h2 className="font-display text-2xl">{t("addEvent")}</h2>
            <Field label={t("title")} />
            <Field label={t("date")}>
              <input
                type="date"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </Field>
            <Field label={t("filter")}>
              <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary">
                {cats.slice(1).map((c) => (
                  <option key={c}>{t(c)}</option>
                ))}
              </select>
            </Field>
            <Field label={t("description")}>
              <textarea
                rows={3}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </Field>
            <div className="flex justify-end gap-2">
              <ActionButton variant="ghost" onClick={() => setModal(false)}>
                {t("cancel")}
              </ActionButton>
              <ActionButton onClick={() => setModal(false)}>{t("save")}</ActionButton>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
