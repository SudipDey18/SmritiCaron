import { createFileRoute } from "@tanstack/react-router";

import { ActionButton, Field, PageHeader, Panel } from "@/components/Bits";
import { AppShell } from "@/components/layout/AppShell";
import { useLang } from "@/lib/i18n";
import { capsules } from "@/lib/mock-data";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "প্রোফাইল — স্মৃতিচারণ | Profile" },
      {
        name: "description",
        content: "আপনার নাম, ছবি, পরিকল্পনা ও সংরক্ষণের হিসাব দেখুন ও বদলান।",
      },
      { property: "og:title", content: "প্রোফাইল — স্মৃতিচারণ" },
      {
        property: "og:description",
        content: "আপনার পরিচয় ও সংরক্ষণের হিসাব।",
      },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { t, lang } = useLang();
  const total = capsules.reduce((a, c) => a + c.memoryCount, 0);

  return (
    <AppShell>
      <PageHeader titleKey="profile" subtitle={t("tagline")} />

      <div className="grid gap-5 lg:grid-cols-[300px_1fr]">
        <Panel className="h-fit text-center">
          <span className="mx-auto grid size-24 place-items-center rounded-full bg-gradient-to-br from-brass/40 to-primary/30 font-display text-3xl text-sepia">
            অ
          </span>
          <h2 className="mt-4 font-display text-2xl">
            {lang === "bn" ? "অনন্যা সেন" : "Ananya Sen"}
          </h2>
          <p className="text-sm text-muted-foreground">ananya@smritocharon.app</p>
          <p className="mt-3 inline-block rounded-full bg-brass/20 px-3 py-1 text-xs text-sepia">
            {t("pro")}
          </p>
          <div className="mt-6 grid grid-cols-2 gap-3 text-left">
            <div>
              <p className="text-[11px] uppercase tracking-widest text-muted-foreground">
                {t("totalMemories")}
              </p>
              <p className="font-display text-xl">{total}</p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-widest text-muted-foreground">
                {t("totalCapsules")}
              </p>
              <p className="font-display text-xl">{capsules.length}</p>
            </div>
          </div>
        </Panel>

        <Panel delay={100} className="space-y-5">
          <h2 className="font-display text-xl">{t("basicInfo")}</h2>
          <Field label={t("displayName")} />
          <Field label={t("email")} />
          <Field label={t("language")}>
            <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary">
              <option>বাংলা</option>
              <option>English</option>
            </select>
          </Field>
          <div>
            <p className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">
              {t("storageUsed")}
            </p>
            <div className="h-2 overflow-hidden rounded-full bg-secondary">
              <div className="h-full w-[41%] rounded-full bg-gradient-to-r from-primary to-brass" />
            </div>
            <p className="mt-1 text-xs text-muted-foreground">412 MB / 1 GB</p>
          </div>
          <ActionButton>{t("save")}</ActionButton>
        </Panel>
      </div>
    </AppShell>
  );
}
