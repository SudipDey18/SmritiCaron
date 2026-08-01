import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Lock, LockOpen, Plus, Trash2 } from "lucide-react";

import { CapsuleTabs } from "./capsules.$id";
import { ActionButton, EmptyState, Field, PageHeader } from "@/components/Bits";
import { SkeletonGrid } from "@/components/common/LoadingSkeletons";
import { AppShell } from "@/components/layout/AppShell";
import {
  useCancelVault,
  useCreateVault,
  useDeleteVault,
  useUnlockVault,
  useVaults,
} from "@/lib/api/hooks";
import { useLang } from "@/lib/i18n";

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
  return Math.max(0, Math.round((new Date(date).getTime() - Date.now()) / 86_400_000));
}

function TimeVaultPage() {
  const { id } = Route.useParams();
  const { t, lang } = useLang();
  const [modal, setModal] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [unlockDate, setUnlockDate] = useState("");
  const [, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTick((n) => n + 1), 60_000);
    return () => clearInterval(interval);
  }, []);

  const { data, isLoading, isError } = useVaults();
  const createVault = useCreateVault();
  const unlockVault = useUnlockVault();
  const cancelVault = useCancelVault();
  const deleteVault = useDeleteVault();

  const vaults = data?.items ?? [];

  async function handleCreate() {
    if (!title || !unlockDate) return;
    await createVault.mutateAsync({ title, description: description || undefined, unlockDate });
    setModal(false);
    setTitle("");
    setDescription("");
    setUnlockDate("");
  }

  return (
    <AppShell>
      <PageHeader
        titleKey="vault"
        subtitle={t("tagline")}
        action={
          <ActionButton onClick={() => setModal(true)}>
            <Plus className="size-4" aria-hidden /> {t("newVault")}
          </ActionButton>
        }
      />
      <CapsuleTabs id={id} />

      {isLoading && <SkeletonGrid count={3} />}
      {isError && <EmptyState />}
      {!isLoading && !isError && vaults.length === 0 && <EmptyState />}

      {!isLoading && !isError && vaults.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {vaults.map((v, i) => {
            const sealed = v.status === "LOCKED";
            const unlocked = v.status === "UNLOCKED" || v.status === "RELEASED";
            const dLeft = daysLeft(v.unlockDate);
            const canUnlock = sealed && dLeft <= 0;
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
                <div className="relative flex items-start justify-between">
                  <span
                    className={`grid size-12 place-items-center rounded-full ${
                      sealed ? "bg-brass/20 text-sepia" : "bg-primary/15 text-primary"
                    }`}
                  >
                    {sealed ? <Lock className="size-5" aria-hidden /> : <LockOpen className="size-5" aria-hidden />}
                  </span>
                  <button
                    type="button"
                    aria-label={t("del")}
                    onClick={() => deleteVault.mutate(v.id)}
                    className="text-muted-foreground transition hover:text-destructive"
                  >
                    <Trash2 className="size-4" aria-hidden />
                  </button>
                </div>
                <h3 className="relative mt-4 font-display text-xl">{v.title}</h3>
                {v.description && (
                  <p className="relative mt-1 text-sm text-muted-foreground">{v.description}</p>
                )}
                <p className="relative mt-1 text-xs uppercase tracking-widest text-muted-foreground">
                  {sealed ? t("sealed") : t("opened")}
                </p>
                <p className="relative mt-3 text-sm text-sepia">
                  {t("opens")} {new Date(v.unlockDate).toLocaleDateString()}
                </p>
                {sealed && (
                  <>
                    <div className="relative mt-4 h-1.5 overflow-hidden rounded-full bg-secondary">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-brass to-primary transition-all duration-1000"
                        style={{ width: `${Math.max(6, 100 - dLeft / 8)}%` }}
                      />
                    </div>
                    <p className="relative mt-2 font-display text-2xl">
                      {dLeft} <span className="text-sm text-muted-foreground">{lang === "bn" ? "দিন বাকি" : "days left"}</span>
                    </p>
                  </>
                )}
                <div className="relative mt-4 flex gap-2">
                  {sealed && (
                    <>
                      <ActionButton
                        variant="ghost"
                        onClick={() => canUnlock && unlockVault.mutate(v.id)}
                      >
                        <LockOpen className="size-4" aria-hidden /> {t("opens")}
                      </ActionButton>
                      <ActionButton variant="ghost" onClick={() => cancelVault.mutate(v.id)}>
                        {t("cancel")}
                      </ActionButton>
                    </>
                  )}
                  {unlocked && (
                    <p className="text-xs text-muted-foreground">{t("opened")}</p>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}

      {modal && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-foreground/60 px-4 backdrop-blur-sm"
          onClick={() => setModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md space-y-4 rounded-lg border border-border bg-card p-6 shadow-warm animate-unfurl"
          >
            <h2 className="font-display text-2xl">{t("newVault")}</h2>
            <Field label={t("title")}>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </Field>
            <Field label={t("description")}>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </Field>
            <Field label={t("date")}>
              <input
                type="date"
                value={unlockDate}
                onChange={(e) => setUnlockDate(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </Field>
            <div className="flex justify-end gap-2">
              <ActionButton variant="ghost" onClick={() => setModal(false)}>
                {t("cancel")}
              </ActionButton>
              <ActionButton onClick={() => void handleCreate()}>{t("save")}</ActionButton>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
