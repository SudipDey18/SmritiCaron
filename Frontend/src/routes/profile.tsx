import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

import { ActionButton, Field, PageHeader, Panel } from "@/components/Bits";
import { AppShell } from "@/components/layout/AppShell";
import { mediaUrl } from "@/lib/api/client";
import { authApi, usersApi } from "@/lib/api/endpoints";
import { useStorageUsage } from "@/lib/api/hooks";
import { useAuth } from "@/lib/auth";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "প্রোফাইল — স্মৃতিচারণ | Profile" },
      { name: "description", content: "আপনার নাম, ছবি, পরিকল্পনা ও সংরক্ষণের হিসাব দেখুন ও বদলান।" },
      { property: "og:title", content: "প্রোফাইল — স্মৃতিচারণ" },
      { property: "og:description", content: "আপনার পরিচয় ও সংরক্ষণের হিসাব।" },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { t, lang } = useLang();
  const { user, refreshUser, signOut } = useAuth();
  const { data: storage } = useStorageUsage();
  const fileRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [language, setLanguage] = useState<"bn" | "en">("bn");
  const [saving, setSaving] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name);
      setLanguage(user.language);
      if ("bio" in user) setBio(user.bio ?? "");
    }
  }, [user]);

  async function handleSave() {
    setSaving(true);
    try {
      await usersApi.update({ name, bio, language });
      await refreshUser();
    } finally {
      setSaving(false);
    }
  }

  async function handleAvatar(file: File) {
    await usersApi.uploadAvatar(file);
    await refreshUser();
  }

  async function handlePasswordChange() {
    if (!currentPassword || !newPassword) return;
    await authApi.changePassword({ currentPassword, newPassword });
    setCurrentPassword("");
    setNewPassword("");
  }

  const avatarUrl = user?.avatarUrl ? mediaUrl(user.avatarUrl) : undefined;
  const usedBytes = storage?.totalBytes ?? 0;
  const quota = storage?.quota ?? 1;
  const pct = Math.min(100, Math.round((usedBytes / quota) * 100));

  return (
    <AppShell>
      <PageHeader titleKey="profile" subtitle={t("tagline")} />

      <div className="grid gap-5 lg:grid-cols-[300px_1fr]">
        <Panel className="h-fit text-center">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="mx-auto block"
          >
            {avatarUrl ? (
              <img src={avatarUrl} alt={user?.name} className="mx-auto size-24 rounded-full object-cover" />
            ) : (
              <span className="mx-auto grid size-24 place-items-center rounded-full bg-gradient-to-br from-brass/40 to-primary/30 font-display text-3xl text-sepia">
                {user?.name?.charAt(0) ?? "?"}
              </span>
            )}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void handleAvatar(f);
            }}
          />
          <h2 className="mt-4 font-display text-2xl">{user?.name}</h2>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
          <ActionButton variant="ghost" onClick={() => void signOut()}>
            {t("signOut")}
          </ActionButton>
        </Panel>

        <Panel delay={100} className="space-y-5">
          <h2 className="font-display text-xl">{t("basicInfo")}</h2>
          <Field label={t("displayName")}>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </Field>
          <Field label={t("description")}>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </Field>
          <Field label={t("language")}>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as "bn" | "en")}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            >
              <option value="bn">বাংলা</option>
              <option value="en">English</option>
            </select>
          </Field>
          <div>
            <p className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">{t("storageUsed")}</p>
            <div className="h-2 overflow-hidden rounded-full bg-secondary">
              <div className="h-full rounded-full bg-gradient-to-r from-primary to-brass" style={{ width: `${pct}%` }} />
            </div>
            {storage && (
              <p className="mt-1 text-xs text-muted-foreground">
                {(storage.totalBytes / 1e6).toFixed(0)} MB / {(storage.quota / 1e9).toFixed(1)} GB
              </p>
            )}
          </div>
          <ActionButton onClick={() => void handleSave()}>{saving ? t("loading") : t("save")}</ActionButton>

          <div className="border-t border-border pt-4">
            <h3 className="font-display text-lg">{t("password")}</h3>
            <div className="mt-3 space-y-3">
              <Field label={lang === "bn" ? "বর্তমান পাসওয়ার্ড" : "Current password"}>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                />
              </Field>
              <Field label={lang === "bn" ? "নতুন পাসওয়ার্ড" : "New password"}>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                />
              </Field>
              <ActionButton variant="ghost" onClick={() => void handlePasswordChange()}>
                {t("save")}
              </ActionButton>
            </div>
          </div>
        </Panel>
      </div>
    </AppShell>
  );
}
