import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Search } from "lucide-react";

import { ActionButton, EmptyState, PageHeader } from "@/components/Bits";
import { AppShell } from "@/components/layout/AppShell";
import { useLang } from "@/lib/i18n";
import { capsules } from "@/lib/mock-data";

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

const tabs = ["all", "active", "archived", "shared"] as const;

function CapsulesListPage() {
  const { t, lang } = useLang();
  const [tab, setTab] = useState<(typeof tabs)[number]>("all");
  const [q, setQ] = useState("");

  const list = capsules.filter(
    (c) =>
      (tab === "all" || c.status === tab) &&
      (c.name[lang] + c.subject[lang]).toLowerCase().includes(q.toLowerCase()),
  );

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

      {list.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {list.map((c, i) => (
            <Link
              key={c.id}
              to="/capsules/$id"
              params={{ id: c.id }}
              style={{ animationDelay: `${i * 80}ms` }}
              className="group frame-photo rounded-sm animate-unfurl transition-all duration-500 hover:-translate-y-1"
            >
              <div
                className="h-40 rounded-sm"
                style={{
                  background: `linear-gradient(140deg, oklch(0.74 0.09 ${c.hue}), oklch(0.44 0.11 ${c.hue}))`,
                }}
              />
              <div className="pt-3">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-display text-lg">{c.name[lang]}</h3>
                  <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] text-secondary-foreground">
                    {t(c.status)}
                  </span>
                </div>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {c.description[lang]}
                </p>
                <p className="mt-2 text-xs text-sepia">
                  {c.memoryCount} {t("memoryCount")}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </AppShell>
  );
}
