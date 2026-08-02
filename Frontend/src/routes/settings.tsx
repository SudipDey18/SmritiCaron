import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { ActionButton, PageHeader, Panel } from "@/components/Bits";
import { LanguageToggle } from "@/components/LanguageToggle";
import { AppShell } from "@/components/layout/AppShell";
import { useExportData, useSettings, useUpdateSettings } from "@/lib/api/hooks";
import { usersApi } from "@/lib/api/endpoints";
import { useAuth } from "@/lib/auth";
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
  const { signOut } = useAuth();
  const { data: settings, isLoading } = useSettings();
  const updateMut = useUpdateSettings();
  const exportMut = useExportData();

  const dark = settings?.["darkMode"] === "true";
  const notify = settings?.["emailBeforeUnlock"] === "true";

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  const toggle = (key: string, current: boolean) => {
    updateMut.mutate({ [key]: current ? "false" : "true" });
  };

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [password, setPassword] = useState("");
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleteError(null);
    setDeleting(true);
    try {
      await usersApi.remove(password);
      await signOut();
    } catch {
      setDeleteError(t("errorTitle"));
    } finally {
      setDeleting(false);
    }
  };

  const handleExport = async () => {
    const result = await exportMut.mutateAsync();
    window.open(result.exportUrl, "_blank");
  };

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
              disabled={isLoading || updateMut.isPending}
              onClick={() => toggle("darkMode", dark)}
              aria-pressed={dark}
              className={`relative h-6 w-11 rounded-full transition-colors duration-300 disabled:opacity-50 ${
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
              disabled={isLoading || updateMut.isPending}
              onClick={() => toggle("emailBeforeUnlock", notify)}
              aria-pressed={notify}
              className={`relative h-6 w-11 rounded-full transition-colors duration-300 disabled:opacity-50 ${
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

        <Panel delay={165}>
          <h2 className="font-display text-xl">{t("exportAccount")}</h2>
          <div className="mt-4">
            <ActionButton onClick={() => void handleExport()}>
              {exportMut.isPending ? t("loading") : t("exportAccount")}
            </ActionButton>
          </div>
        </Panel>

        <Panel delay={190} className="border-destructive/30">
          <h2 className="font-display text-xl text-destructive">{t("dangerZone")}</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            <ActionButton variant="ghost" onClick={() => void signOut()}>
              {t("signOut")}
            </ActionButton>
            <button
              onClick={() => setConfirmDelete(true)}
              className="rounded-md border border-destructive/50 px-4 py-2 text-sm text-destructive transition hover:bg-destructive/10"
            >
              {t("del")}
            </button>
          </div>

          {confirmDelete && (
            <div className="mt-4 rounded-md border border-destructive/40 bg-destructive/5 p-4">
              <p className="text-sm text-destructive">{t("confirmDelete")}</p>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t("password")}
                className="mt-3 w-full max-w-xs rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/30"
              />
              {deleteError && <p className="mt-2 text-xs text-destructive">{deleteError}</p>}
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  disabled={deleting || !password}
                  onClick={() => void handleDelete()}
                  className="rounded-md bg-destructive px-4 py-2 text-sm text-destructive-foreground disabled:opacity-50"
                >
                  {t("confirm")}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setConfirmDelete(false);
                    setPassword("");
                    setDeleteError(null);
                  }}
                  className="rounded-md border border-border px-4 py-2 text-sm"
                >
                  {t("cancelUpload")}
                </button>
              </div>
            </div>
          )}
        </Panel>
      </div>
    </AppShell>
  );
}
