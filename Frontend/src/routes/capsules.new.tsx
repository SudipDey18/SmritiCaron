import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { ActionButton, Field, PageHeader, Panel } from "@/components/Bits";
import { AppShell } from "@/components/layout/AppShell";
import { useCreateCapsule } from "@/lib/api/hooks";
import type { Privacy } from "@/lib/api/types";
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

const relationOptions = [
  { value: "grandmother", bn: "দিদা", en: "Grandmother" },
  { value: "grandfather", bn: "দাদু", en: "Grandfather" },
  { value: "mother", bn: "মা", en: "Mother" },
  { value: "father", bn: "বাবা", en: "Father" },
  { value: "uncle", bn: "মামা", en: "Uncle" },
  { value: "self", bn: "নিজে", en: "Myself" },
];

const privacyOptions: { value: Privacy; key: "privateOnly" | "withFamily" }[] = [
  { value: "PRIVATE", key: "privateOnly" },
  { value: "FAMILY", key: "withFamily" },
];

function CreateCapsulePage() {
  const { t, lang } = useLang();
  const navigate = useNavigate();
  const create = useCreateCapsule();

  const [step, setStep] = useState(1);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [privacy, setPrivacy] = useState<Privacy>("PRIVATE");
  const [subject, setSubject] = useState("");
  const [dob, setDob] = useState("");
  const [relation, setRelation] = useState(relationOptions[0]!.value);
  const [capsuleLang, setCapsuleLang] = useState<"bn" | "en">(lang);
  const [aiChat, setAiChat] = useState(true);

  const steps = [t("basicInfo"), t("personInfo"), t("capsuleSettings")];
  const inputCls =
    "w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/30";

  const submit = () => {
    if (!title.trim()) {
      setStep(1);
      toast.error(lang === "bn" ? "সিন্দুকের নাম দিন" : "Please enter a capsule name");
      return;
    }
    const tags = [`lang:${capsuleLang}`, aiChat ? "ai:on" : "ai:off"];
    if (subject.trim()) tags.push(`subject:${subject.trim()}`);
    if (dob) tags.push(`dob:${dob}`);

    create.mutate(
      { title: title.trim(), description: description.trim() || undefined, privacy, relation, tags },
      {
        onSuccess: (capsule) => {
          toast.success(lang === "bn" ? "সিন্দুক তৈরি হয়েছে" : "Capsule created");
          void navigate({ to: "/capsules/$id", params: { id: capsule.id } });
        },
        onError: (err: unknown) => {
          toast.error(err instanceof Error ? err.message : "Could not create capsule");
        },
      },
    );
  };

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
              <button
                type="button"
                onClick={() => setStep(n)}
                aria-current={active ? "step" : undefined}
                className={`grid size-9 place-items-center rounded-full border font-display text-sm transition-all duration-500 ${
                  active
                    ? "border-primary bg-primary text-primary-foreground scale-110"
                    : done
                      ? "border-brass bg-brass/20 text-sepia"
                      : "border-border text-muted-foreground"
                }`}
              >
                {done ? <Check className="size-4" aria-hidden /> : lang === "bn" ? ["১", "২", "৩"][i] : n}
              </button>
              <button
                type="button"
                onClick={() => setStep(n)}
                className={active ? "text-sm" : "text-sm text-muted-foreground hover:text-foreground"}
              >
                {s}
              </button>
              {i < 2 && <span className="hidden h-px w-10 bg-border sm:block" />}
            </li>
          );
        })}
      </ol>

      <Panel className="max-w-2xl">
        {step === 1 && (
          <div key="s1" className="space-y-5 animate-rise">
            <Field label={t("capsuleName")}>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={lang === "bn" ? "দিদার সিন্দুক" : "Dida's capsule"}
                className={inputCls}
              />
            </Field>
            <Field label={t("description")}>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={inputCls}
              />
            </Field>
            <Field label={t("coverImage")}>
              <div className="grid h-28 place-items-center rounded-md border border-dashed border-border bg-background/60 text-sm text-muted-foreground transition hover:border-primary/50">
                {t("orBrowse")}
              </div>
            </Field>
            <Field label={t("privacy")}>
              <div className="flex gap-2">
                {privacyOptions.map((p) => (
                  <button
                    key={p.value}
                    type="button"
                    aria-pressed={privacy === p.value}
                    onClick={() => setPrivacy(p.value)}
                    className={`rounded-md border px-3 py-1.5 text-sm transition ${
                      privacy === p.value
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/40"
                    }`}
                  >
                    {t(p.key)}
                  </button>
                ))}
              </div>
            </Field>
          </div>
        )}

        {step === 2 && (
          <div key="s2" className="space-y-5 animate-rise">
            <Field label={t("subjectName")}>
              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className={inputCls}
              />
            </Field>
            <Field label={t("dob")}>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className={inputCls}
              />
            </Field>
            <Field label={t("relationship")}>
              <select
                value={relation}
                onChange={(e) => setRelation(e.target.value)}
                className={inputCls}
              >
                {relationOptions.map((r) => (
                  <option key={r.value} value={r.value}>
                    {lang === "bn" ? r.bn : r.en}
                  </option>
                ))}
              </select>
            </Field>
          </div>
        )}

        {step === 3 && (
          <div key="s3" className="space-y-5 animate-rise">
            <Field label={t("language")}>
              <select
                value={capsuleLang}
                onChange={(e) => setCapsuleLang(e.target.value as "bn" | "en")}
                className={inputCls}
              >
                <option value="bn">বাংলা</option>
                <option value="en">English</option>
              </select>
            </Field>
            <label className="flex cursor-pointer items-center justify-between rounded-md border border-border bg-background/60 px-4 py-3 text-sm">
              {t("aiChat")}
              <input
                type="checkbox"
                checked={aiChat}
                onChange={(e) => setAiChat(e.target.checked)}
                className="sr-only"
              />
              <span
                className={`relative h-5 w-10 rounded-full transition-colors ${
                  aiChat ? "bg-primary/30" : "bg-muted"
                }`}
              >
                <span
                  className={`absolute top-0.5 size-4 rounded-full transition-all ${
                    aiChat ? "right-0.5 bg-primary" : "left-0.5 bg-muted-foreground"
                  }`}
                />
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
            <ActionButton onClick={submit} disabled={create.isPending}>
              {create.isPending && <Loader2 className="mr-2 size-4 animate-spin" aria-hidden />}
              {t("create")}
            </ActionButton>
          )}
        </div>
      </Panel>
    </AppShell>
  );
}
