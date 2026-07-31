import { createFileRoute } from "@tanstack/react-router";
import { Lock, LockOpen, Plus } from "lucide-react";

import { CapsuleTabs } from "./capsules.$id";
import { ActionButton, PageHeader } from "@/components/Bits";
import { AppShell } from "@/components/layout/AppShell";
import { useLang } from "@/lib/i18n";
import { vaults } from "@/lib/mock-data";

export const Route = createFileRoute("/capsules/$id/time-vault")({
  head: () => ({
    meta: [
      { title: "সময়-সিন্দুক — স্মৃতিচারণ | Time vault" },
      {
        name: "description",
        content: "ভবিষ্যতের নির্দিষ্ট দিনে খুলবে এমন তালাবন্ধ স্মৃতির সিন্দুক তৈরি করুন।",
      },
      { property: "og:title", content: "সময়-সিন্দুক — স্মৃতিচারণ" },
      {
        property: "og:description",
        content: "ভবিষ্যতের জন্য তালাবন্ধ স্মৃতি।",
      },
    ],
  }),
  component: TimeVaultPage,
});

function daysLeft(date: string) {
  return Math.max(
    0,
    Math.round((new Date(date).getTime() - Date.now()) / 86_400_000),
  );
}

function TimeVaultPage() {
  const { id } = Route.useParams();
  const { t, lang } = useLang();

  return (
    <AppShell>
      <PageHeader
        titleKey="vault"
        subtitle={t("tagline")}
        action={
          <ActionButton>
            <Plus className="size-4" aria-hidden /> {t("newVault")}
          </ActionButton>
        }
      />
      <CapsuleTabs id={id} />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {vaults.map((v, i) => {
          const sealed = v.state === "sealed";
          return (
            <article
              key={v.id}
              style={{ animationDelay: `${i * 100}ms` }}
              className="group relative overflow-hidden rounded-lg border border-border bg-card/85 p-6 shadow-warm animate-unfurl transition-all duration-500 hover:-translate-y-1"
            >
              {sealed && (
                <span
                  className="pointer-events-none absolute -right-10 -top-10 size-32 animate-flicker rounded-full bg-brass/30"
                  aria-hidden
                />
              )}
              <span
                className={`relative grid size-12 place-items-center rounded-full ${
                  sealed ? "bg-brass/20 text-sepia" : "bg-primary/15 text-primary"
                }`}
              >
                {sealed ? <Lock className="size-5" aria-hidden /> : <LockOpen className="size-5" aria-hidden />}
              </span>
              <h3 className="relative mt-4 font-display text-xl">{v.title[lang]}</h3>
              <p className="relative mt-1 text-xs uppercase tracking-widest text-muted-foreground">
                {sealed ? t("sealed") : t("opened")}
              </p>
              <p className="relative mt-3 text-sm text-sepia">
                {t("opens")} {v.opens}
              </p>
              {sealed && (
                <>
                  <div className="relative mt-4 h-1.5 overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-brass to-primary transition-all duration-1000"
                      style={{ width: `${Math.max(6, 100 - daysLeft(v.opens) / 8)}%` }}
                    />
                  </div>
                  <p className="relative mt-2 font-display text-2xl">
                    {daysLeft(v.opens)}{" "}
                    <span className="text-sm text-muted-foreground">
                      {lang === "bn" ? "দিন বাকি" : "days left"}
                    </span>
                  </p>
                </>
              )}
            </article>
          );
        })}
      </div>
    </AppShell>
  );
}
