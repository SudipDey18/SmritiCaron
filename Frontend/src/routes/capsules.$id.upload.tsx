import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { FileText, Headphones, Image as ImageIcon, UploadCloud, Video, X } from "lucide-react";

import { CapsuleTabs } from "./capsules.$id";
import { ActionButton, Field, PageHeader, Panel } from "@/components/Bits";
import { AppShell } from "@/components/layout/AppShell";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/capsules/$id/upload")({
  head: () => ({
    meta: [
      { title: "স্মৃতি আপলোড — স্মৃতিচারণ | Upload" },
      {
        name: "description",
        content: "ছবি, ভিডিও, কণ্ঠ বা নথি আপলোড করুন, অথবা নিজের হাতে গল্প লিখুন।",
      },
      { property: "og:title", content: "স্মৃতি আপলোড — স্মৃতিচারণ" },
      {
        property: "og:description",
        content: "নতুন স্মৃতি যোগ করুন — ছবি, কণ্ঠ বা লেখা।",
      },
    ],
  }),
  component: UploadPage,
});

const emotions = ["joy", "nostalgia", "love", "sadness", "pride"] as const;

function UploadPage() {
  const { id } = Route.useParams();
  const { t, lang } = useLang();
  const [over, setOver] = useState(false);
  const [emotion, setEmotion] = useState<(typeof emotions)[number]>("nostalgia");
  const [queue, setQueue] = useState([
    { name: "dida-1968.jpg", size: "2.4 MB", pct: 100 },
    { name: "harmonium.m4a", size: "8.1 MB", pct: 62 },
    { name: "chithi-scan.pdf", size: "1.2 MB", pct: 18 },
  ]);

  return (
    <AppShell>
      <PageHeader titleKey="upload" subtitle={t("tagline")} />
      <CapsuleTabs id={id} />

      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <div className="space-y-6">
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setOver(true);
            }}
            onDragLeave={() => setOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setOver(false);
            }}
            className={`grid place-items-center rounded-lg border-2 border-dashed px-6 py-14 text-center transition-all duration-500 ${
              over
                ? "border-primary bg-primary/5 scale-[1.01] lamp-glow"
                : "border-border bg-card/70"
            }`}
          >
            <UploadCloud
              className={`mb-4 size-10 text-primary transition-transform duration-500 ${over ? "scale-125" : "animate-float-slow"}`}
              aria-hidden
            />
            <p className="font-display text-xl">{t("dropFiles")}</p>
            <p className="mt-1 text-sm text-muted-foreground">{t("orBrowse")}</p>
            <div className="mt-5 flex gap-4 text-muted-foreground">
              {[ImageIcon, Video, Headphones, FileText].map((Icon, i) => (
                <Icon key={i} className="size-5" aria-hidden />
              ))}
            </div>
          </div>

          <Panel>
            <h2 className="font-display text-xl">{t("queue")}</h2>
            <ul className="mt-4 space-y-3">
              {queue.map((f) => (
                <li key={f.name} className="rounded-md border border-border bg-background/60 p-3">
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="truncate">{f.name}</span>
                    <span className="shrink-0 text-xs text-muted-foreground">{f.size}</span>
                    <button
                      onClick={() => setQueue((q) => q.filter((x) => x.name !== f.name))}
                      aria-label={t("cancel")}
                    >
                      <X className="size-4 text-muted-foreground transition hover:text-destructive" />
                    </button>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary to-brass transition-all duration-700"
                      style={{ width: `${f.pct}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel delay={80}>
            <h2 className="font-display text-xl">{t("writeStory")}</h2>
            <div className="mt-4 flex gap-2 border-b border-border pb-2 text-sm text-muted-foreground">
              <span className="font-bold">B</span>
              <span className="italic">I</span>
              <span className="underline">U</span>
              <span>❝</span>
            </div>
            <textarea
              rows={6}
              placeholder={
                lang === "bn"
                  ? "সেই দিনটার কথা লিখুন…"
                  : "Write down how that day felt…"
              }
              className="mt-3 w-full resize-y rounded-md border border-input bg-background px-3 py-2 font-display text-sm leading-relaxed outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/30"
            />
          </Panel>
        </div>

        <Panel delay={140} className="h-fit space-y-5">
          <h2 className="font-display text-xl">{t("basicInfo")}</h2>
          <Field label={t("title")} />
          <Field label={t("date")}>
            <input
              type="date"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </Field>
          <Field label={t("location")} />
          <Field label={t("tags")}>
            <div className="flex flex-wrap gap-2 rounded-md border border-input bg-background px-3 py-2">
              {(lang === "bn" ? ["পুজো", "শৈশব"] : ["puja", "childhood"]).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground"
                >
                  {tag}
                </span>
              ))}
              <input className="min-w-16 flex-1 bg-transparent text-sm outline-none" />
            </div>
          </Field>
          <Field label={t("description")}>
            <textarea
              rows={3}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </Field>
          <Field label={t("emotion")}>
            <div className="flex flex-wrap gap-2">
              {emotions.map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => setEmotion(e)}
                  className={`rounded-full border px-3 py-1 text-xs transition-all duration-300 ${
                    emotion === e
                      ? "border-primary bg-primary text-primary-foreground scale-105"
                      : "border-border text-muted-foreground hover:border-primary/40"
                  }`}
                >
                  {t(e)}
                </button>
              ))}
            </div>
          </Field>
          <ActionButton to="/capsules/$id/memories" params={{ id }}>
            {t("submitUpload")}
          </ActionButton>
        </Panel>
      </div>
    </AppShell>
  );
}
