import { createFileRoute, Link } from "@tanstack/react-router";
import { Archive, HardDrive, Image as ImageIcon, Plus, Sparkles } from "lucide-react";

import { ActionButton, Panel, PageHeader } from "@/components/Bits";
import { AppShell } from "@/components/layout/AppShell";
import { useLang } from "@/lib/i18n";
import { activity, capsules, vaults } from "@/lib/mock-data";

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
  const total = capsules.reduce((a, c) => a + c.memoryCount, 0);

  return (
    <AppShell>
      <PageHeader
        title={`${t("welcome")}, ${lang === "bn" ? "অনন্যা" : "Ananya"}`}
        subtitle={t("tagline")}
        action={
          <ActionButton to="/capsules/new">
            <Plus className="size-4" aria-hidden /> {t("newCapsule")}
          </ActionButton>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { icon: ImageIcon, label: t("totalMemories"), value: String(total) },
          { icon: Archive, label: t("totalCapsules"), value: String(capsules.length) },
          { icon: HardDrive, label: t("storageUsed"), value: "412 MB / 1 GB" },
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

      <h2 className="mt-10 font-display text-2xl">{t("capsules")}</h2>
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
              className="h-36 rounded-sm transition-transform duration-700 group-hover:scale-[1.02]"
              style={{
                background: `linear-gradient(140deg, oklch(0.72 0.09 ${c.hue}), oklch(0.46 0.11 ${c.hue}))`,
              }}
            />
            <div className="pt-3">
              <h3 className="font-display text-lg">{c.name[lang]}</h3>
              <p className="text-xs text-muted-foreground">{c.subject[lang]}</p>
              <p className="mt-2 text-xs text-sepia">
                {c.memoryCount} {t("memoryCount")} · {c.updated}
              </p>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-10 grid gap-5 lg:grid-cols-2">
        <Panel>
          <h2 className="font-display text-xl">{t("recentActivity")}</h2>
          <ul className="mt-4 space-y-4">
            {activity.map((a) => (
              <li key={a.what.en} className="flex gap-3 text-sm">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                <span>
                  {a.what[lang]}
                  <span className="block text-xs text-muted-foreground">
                    {a.when[lang]}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </Panel>
        <Panel delay={120}>
          <h2 className="flex items-center gap-2 font-display text-xl">
            <Sparkles className="size-4 text-brass" aria-hidden /> {t("upcomingVaults")}
          </h2>
          <ul className="mt-4 space-y-3">
            {vaults
              .filter((v) => v.state === "sealed")
              .map((v) => (
                <li
                  key={v.id}
                  className="flex items-center justify-between rounded-md border border-border bg-background/60 px-3 py-2.5 text-sm transition hover:border-brass/50"
                >
                  <span>{v.title[lang]}</span>
                  <span className="text-xs text-sepia">
                    {t("opens")} {v.opens}
                  </span>
                </li>
              ))}
          </ul>
          <ActionButton to="/capsules/$id/time-vault" params={{ id: "dida" }} variant="ghost">
            {t("vault")}
          </ActionButton>
        </Panel>
      </div>

      <Link
        to="/capsules/$id/upload"
        params={{ id: "dida" }}
        className="fixed bottom-20 right-5 z-30 grid size-14 place-items-center rounded-full bg-primary text-primary-foreground shadow-warm transition-transform hover:scale-110 lg:bottom-8"
        aria-label={t("upload")}
      >
        <Plus className="size-6" aria-hidden />
      </Link>
    </AppShell>
  );
}
