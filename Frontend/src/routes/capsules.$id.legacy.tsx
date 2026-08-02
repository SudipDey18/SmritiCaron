import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

import { CapsuleTabs } from "./capsules.$id";
import { ActionButton, EmptyState, Field, PageHeader } from "@/components/Bits";
import { SkeletonGrid } from "@/components/common/LoadingSkeletons";
import { AppShell } from "@/components/layout/AppShell";
import { useCreateLetter, useDeleteLetter, useLetters } from "@/lib/api/hooks";
import type { LetterStatus } from "@/lib/api/types";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/capsules/$id/legacy")({
  head: () => ({
    meta: [
      { title: "উত্তরাধিকার চিঠি — স্মৃতিচারণ | Legacy letters" },
      {
        name: "description",
        content: "প্রিয়জনের জন্য রেখে যাওয়া চিঠি লিখুন — নির্ধারিত দিনে পৌঁছে যাবে।",
      },
      { property: "og:title", content: "উত্তরাধিকার চিঠি — স্মৃতিচারণ" },
      { property: "og:description", content: "শেষ কথাগুলো, প্রিয়জনের নামে।" },
    ],
  }),
  component: LegacyMessagesPage,
});

const statuses: (LetterStatus | "ALL")[] = ["ALL", "DRAFT", "SCHEDULED", "SENT", "DELIVERED"];

function statusKey(s: LetterStatus) {
  if (s === "DRAFT") return "draft" as const;
  if (s === "SCHEDULED") return "scheduled" as const;
  return "delivered" as const;
}

function LegacyMessagesPage() {
  const { id } = Route.useParams();
  const { t } = useLang();
  const [status, setStatus] = useState<LetterStatus | "ALL">("ALL");
  const [modal, setModal] = useState(false);
  const [recipientName, setRecipientName] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");

  const { data, isLoading, isError } = useLetters(status === "ALL" ? {} : { status });
  const createLetter = useCreateLetter();
  const deleteLetter = useDeleteLetter();

  const letters = data?.items ?? [];

  async function handleSave() {
    if (!recipientName || !subject || !body) return;
    await createLetter.mutateAsync({
      recipientName,
      recipientEmail: recipientEmail || undefined,
      subject,
      body,
      deliveryDate: deliveryDate || undefined,
    });
    setModal(false);
    setRecipientName("");
    setRecipientEmail("");
    setSubject("");
    setBody("");
    setDeliveryDate("");
  }

  return (
    <AppShell>
      <PageHeader
        titleKey="legacy"
        subtitle={t("tagline")}
        action={
          <ActionButton onClick={() => setModal(true)}>
            <Plus className="size-4" aria-hidden /> {t("newLetter")}
          </ActionButton>
        }
      />
      <CapsuleTabs id={id} />

      <div className="mb-8 flex flex-wrap gap-2">
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={`rounded-full border px-3 py-1.5 text-xs transition-all duration-300 ${
              status === s
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border text-muted-foreground hover:border-primary/40"
            }`}
          >
            {s === "ALL" ? t("all") : t(statusKey(s))}
          </button>
        ))}
      </div>

      {isLoading && <SkeletonGrid count={4} />}
      {isError && <EmptyState />}
      {!isLoading && !isError && letters.length === 0 && <EmptyState />}

      {!isLoading && !isError && letters.length > 0 && (
        <div className="grid gap-6 lg:grid-cols-2">
          {letters.map((l, i) => (
            <article
              key={l.id}
              style={{ animationDelay: `${i * 110}ms` }}
              className="group relative rounded-lg border border-border bg-gradient-to-br from-card to-paper-deep p-7 shadow-warm animate-unfurl transition-transform duration-500 hover:-translate-y-1 hover:rotate-[-0.4deg]"
            >
              <span className="absolute right-6 top-6 text-2xl text-brass/60" aria-hidden>
                ❦
              </span>
              <button
                type="button"
                aria-label={t("del")}
                onClick={() => deleteLetter.mutate(l.id)}
                className="absolute right-6 bottom-6 text-muted-foreground transition hover:text-destructive"
              >
                <Trash2 className="size-4" aria-hidden />
              </button>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">{t("recipient")}</p>
              <h3 className="mt-1 font-display text-2xl">{l.recipientName}</h3>
              <p className="mt-2 text-sm font-medium">{l.subject}</p>
              <p className="mt-4 font-display text-base italic leading-relaxed text-foreground/90">
                "{l.body.slice(0, 160)}{l.body.length > 160 ? "…" : ""}"
              </p>
              <div className="mt-6 flex items-center justify-between text-xs">
                <span
                  className={`rounded-full px-2.5 py-1 ${
                    l.status === "DELIVERED" || l.status === "SENT"
                      ? "bg-accent/15 text-accent"
                      : l.status === "SCHEDULED"
                        ? "bg-brass/20 text-sepia"
                        : "bg-secondary text-secondary-foreground"
                  }`}
                >
                  {t(statusKey(l.status))}
                </span>
                {l.deliveryDate && (
                  <span className="text-muted-foreground">
                    {t("deliverOn")} {new Date(l.deliveryDate).toLocaleDateString()}
                  </span>
                )}
              </div>
            </article>
          ))}
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
            <h2 className="font-display text-2xl">{t("newLetter")}</h2>
            <Field label={t("recipient")}>
              <input
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </Field>
            <Field label={t("email")}>
              <input
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </Field>
            <Field label={t("title")}>
              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </Field>
            <Field label={t("description")}>
              <textarea
                rows={4}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </Field>
            <Field label={t("deliverOn")}>
              <input
                type="date"
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </Field>
            <div className="flex justify-end gap-2">
              <ActionButton variant="ghost" onClick={() => setModal(false)}>
                {t("cancel")}
              </ActionButton>
              <ActionButton onClick={() => void handleSave()}>{t("save")}</ActionButton>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
