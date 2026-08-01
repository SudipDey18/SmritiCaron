import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { ActionButton, PageHeader, Panel } from "@/components/Bits";
import { LanguageToggle } from "@/components/LanguageToggle";
import { AppShell } from "@/components/layout/AppShell";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "সেটিংস — স্মৃতিচারণ | Settings" },
      {
        name: "description",
        content: "ভাষা, সাজ, বিজ্ঞপ্তি ও পরিকল্পনা — সব পছন্দ এক জায়গায় বদলান।",
      },
      { property: "og:title", content: "সেটিংস — স্মৃতিচারণ" },
      {
        property: "og:description",
        content: "ভাষা, সাজ ও বিজ্ঞপ্তির পছন্দ।",
      },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { t, lang } = useLang();
  const [dark, setDark] = useState(false);
  const [notify, setNotify] = useState(true);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <AppShell>
      <PageHeader titleKey="settings" subtitle={t("tagline")} />

      <div className="grid max-w-3xl gap-5">
        <Panel>
          <h2 className="font-display text-xl">{t("language")}</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {lang === "bn"
              ? "সম্পূর্ণ অ্যাপ বাংলা ও ইংরেজি — যেকোনো সময় বদলান।"
              : "The whole app in Bengali and English — switch any time."}
          </p>
          <div className="mt-4">
            <LanguageToggle />
          </div>
        </Panel>

        <Panel delay={90}>
          <h2 className="font-display text-xl">{t("theme")}</h2>
          <label className="mt-4 flex items-center justify-between text-sm">
            {lang === "bn" ? "সন্ধ্যার আলো (গাঢ়)" : "Evening lamp (dark)"}
            <button
              type="button"
              onClick={() => setDark((d) => !d)}
              aria-pressed={dark}
              className={`relative h-6 w-11 rounded-full transition-colors duration-300 ${
                dark ? "bg-primary" : "bg-secondary"
              }`}
            >
              <span
                className={`absolute top-0.5 size-5 rounded-full bg-card transition-all duration-300 ${
                  dark ? "left-[22px]" : "left-0.5"
                }`}
              />
            </button>
          </label>
        </Panel>

        <Panel delay={140}>
          <h2 className="font-display text-xl">{t("notifications")}</h2>
          <label className="mt-4 flex items-center justify-between text-sm">
            {lang === "bn"
              ? "সময়-সিন্দুক খোলার আগে ইমেইল"
              : "Email me before a vault opens"}
            <button
              type="button"
              onClick={() => setNotify((n) => !n)}
              aria-pressed={notify}
              className={`relative h-6 w-11 rounded-full transition-colors duration-300 ${
                notify ? "bg-primary" : "bg-secondary"
              }`}
            >
              <span
                className={`absolute top-0.5 size-5 rounded-full bg-card transition-all duration-300 ${
                  notify ? "left-[22px]" : "left-0.5"
                }`}
              />
            </button>
          </label>
        </Panel>

        <Panel delay={190} className="border-destructive/30">
          <h2 className="font-display text-xl text-destructive">{t("dangerZone")}</h2>
          <div className="mt-4 flex gap-2">
            <ActionButton variant="ghost">{t("signOut")}</ActionButton>
            <button className="rounded-md border border-destructive/50 px-4 py-2 text-sm text-destructive transition hover:bg-destructive/10">
              {t("del")}
            </button>
          </div>
        </Panel>
      </div>
    </AppShell>
  );
}
