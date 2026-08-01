import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check } from "lucide-react";

import { ActionButton, Field, PageHeader, Panel } from "@/components/Bits";
import { AppShell } from "@/components/layout/AppShell";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/capsules/new")({
  head: () => ({
    meta: [
      { title: "নতুন সিন্দুক — স্মৃতিচারণ | New capsule" },
      {
        name: "description",
        content:
          "তিন ধাপে নতুন স্মৃতির সিন্দুক তৈরি করুন — নাম, কার স্মৃতি ও সেটিংস।",
      },
      { property: "og:title", content: "নতুন সিন্দুক — স্মৃতিচারণ" },
      {
        property: "og:description",
        content: "তিন ধাপে পরিবারের নতুন স্মৃতির সিন্দুক।",
      },
    ],
  }),
  component: CreateCapsulePage,
});

function CreateCapsulePage() {
  const { t, lang } = useLang();
  const [step, setStep] = useState(1);
  const steps = [t("basicInfo"), t("personInfo"), t("capsuleSettings")];

  return (
    <AppShell>
      <PageHeader titleKey="newCapsule" subtitle={t("tagline")} />

      <ol className="mb-8 flex flex-wrap items-center gap-4">
        {steps.map((s, i) => {
          const n = i + 1;
          const done = n < step;
          const active = n === step;
          return (
            <li key={s} className="flex items-center gap-3">
              <span
                className={`grid size-9 place-items-center rounded-full border font-display text-sm transition-all duration-500 ${
                  active
                    ? "border-primary bg-primary text-primary-foreground scale-110"
                    : done
                      ? "border-brass bg-brass/20 text-sepia"
                      : "border-border text-muted-foreground"
                }`}
              >
                {done ? <Check className="size-4" aria-hidden /> : lang === "bn" ? ["১", "২", "৩"][i] : n}
              </span>
              <span className={active ? "text-sm" : "text-sm text-muted-foreground"}>{s}</span>
              {i < 2 && <span className="hidden h-px w-10 bg-border sm:block" />}
            </li>
          );
        })}
      </ol>

      <Panel className="max-w-2xl">
        {step === 1 && (
          <div key="s1" className="space-y-5 animate-rise">
            <Field label={t("capsuleName")} />
            <Field label={t("description")}>
              <textarea
                rows={3}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/30"
              />
            </Field>
            <Field label={t("coverImage")}>
              <div className="grid h-28 place-items-center rounded-md border border-dashed border-border bg-background/60 text-sm text-muted-foreground transition hover:border-primary/50">
                {t("orBrowse")}
              </div>
            </Field>
            <Field label={t("privacy")}>
              <div className="flex gap-2">
                {[t("privateOnly"), t("withFamily")].map((p, i) => (
                  <span
                    key={p}
                    className={`cursor-pointer rounded-md border px-3 py-1.5 text-sm transition ${
                      i === 0 ? "border-primary bg-primary/10" : "border-border"
                    }`}
                  >
                    {p}
                  </span>
                ))}
              </div>
            </Field>
          </div>
        )}

        {step === 2 && (
          <div key="s2" className="space-y-5 animate-rise">
            <Field label={t("subjectName")} />
            <Field label={t("dob")}>
              <input
                type="date"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </Field>
            <Field label={t("relationship")}>
              <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary">
                {(lang === "bn"
                  ? ["দিদা", "দাদু", "মা", "বাবা", "মামা", "নিজে"]
                  : ["Grandmother", "Grandfather", "Mother", "Father", "Uncle", "Myself"]
                ).map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>
            </Field>
          </div>
        )}

        {step === 3 && (
          <div key="s3" className="space-y-5 animate-rise">
            <Field label={t("language")}>
              <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary">
                <option>বাংলা</option>
                <option>English</option>
              </select>
            </Field>
            <label className="flex items-center justify-between rounded-md border border-border bg-background/60 px-4 py-3 text-sm">
              {t("aiChat")}
              <span className="relative h-5 w-10 rounded-full bg-primary/30">
                <span className="absolute right-0.5 top-0.5 size-4 rounded-full bg-primary transition-all" />
              </span>
            </label>
          </div>
        )}

        <div className="mt-8 flex items-center justify-between">
          <ActionButton variant="ghost" onClick={() => setStep((s) => Math.max(1, s - 1))}>
            {t("back")}
          </ActionButton>
          {step < 3 ? (
            <ActionButton onClick={() => setStep((s) => Math.min(3, s + 1))}>
              {t("next")}
            </ActionButton>
          ) : (
            <ActionButton to="/capsules/$id" params={{ id: "dida" }}>
              {t("create")}
            </ActionButton>
          )}
        </div>
      </Panel>
    </AppShell>
  );
}
