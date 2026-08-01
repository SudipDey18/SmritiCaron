import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { FileText, Headphones, Image as ImageIcon, UploadCloud, Video } from "lucide-react";

import { CapsuleTabs } from "./capsules.$id";
import { ActionButton, Field, PageHeader, Panel } from "@/components/Bits";
import { UploadQueue, type QueueItem } from "@/components/common/UploadQueue";
import { AppShell } from "@/components/layout/AppShell";
import { ApiError } from "@/lib/api/client";
import { uploadsApi } from "@/lib/api/endpoints";
import { qk } from "@/lib/api/hooks";
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

const MAX_BYTES = 200 * 1024 * 1024;

function humanSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  const units = ["KB", "MB", "GB"];
  let val = bytes / 1024;
  let i = 0;
  while (val >= 1024 && i < units.length - 1) {
    val /= 1024;
    i += 1;
  }
  return `${val.toFixed(1)} ${units[i]}`;
}

type PendingFile = { id: string; file: File };

function UploadPage() {
  const { id } = Route.useParams();
  const { t, lang } = useLang();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [over, setOver] = useState(false);
  const [pending, setPending] = useState<PendingFile[]>([]);
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  const addFiles = (list: FileList | File[]) => {
    const files = Array.from(list);
    const accepted: PendingFile[] = [];
    const rejected: string[] = [];
    for (const file of files) {
      if (file.size > MAX_BYTES) {
        rejected.push(file.name);
      } else {
        accepted.push({ id: crypto.randomUUID(), file });
      }
    }
    if (rejected.length > 0) {
      setError(`${rejected.join(", ")} — ${lang === "bn" ? "সর্বোচ্চ ২০০ মেগাবাইট" : "exceeds the 200MB limit"}`);
    }
    if (accepted.length > 0) {
      setPending((prev) => [...prev, ...accepted]);
      setQueue((prev) => [
        ...prev,
        ...accepted.map(({ id: fid, file }) => ({
          id: fid,
          file: file.name,
          size: humanSize(file.size),
          kind: "caption" as const,
          state: "pending" as const,
          progress: 0,
        })),
      ]);
    }
  };

  const uploadOne = async ({ id: fid, file }: PendingFile) => {
    setQueue((q) => q.map((x) => (x.id === fid ? { ...x, state: "processing", progress: 40 } : x)));
    try {
      await uploadsApi.single(id, file, {
        title: title || undefined,
        description: description || undefined,
        memoryDate: date || undefined,
      });
      setQueue((q) => q.map((x) => (x.id === fid ? { ...x, state: "completed", progress: 100 } : x)));
      return true;
    } catch (err) {
      const message = err instanceof ApiError ? err.message : t("errorTitle");
      setQueue((q) => q.map((x) => (x.id === fid ? { ...x, state: "failed", progress: 0 } : x)));
      setError(message);
      return false;
    }
  };

  const submit = async () => {
    if (pending.length === 0) {
      setError(lang === "bn" ? "অন্তত একটি ফাইল বেছে নিন" : "Choose at least one file");
      return;
    }
    setError(null);
    setSubmitting(true);
    let anySuccess = false;
    for (const item of pending) {
      const ok = await uploadOne(item);
      if (ok) anySuccess = true;
    }
    setSubmitting(false);
    setPending([]);
    if (anySuccess) {
      void qc.invalidateQueries({ queryKey: ["memories", id] });
      void qc.invalidateQueries({ queryKey: qk.timeline(id) });
      void qc.invalidateQueries({ queryKey: qk.dashboard });
      void navigate({ to: "/capsules/$id/memories", params: { id } });
    }
  };

  const retry = (fid: string) => {
    const item = pending.find((p) => p.id === fid);
    const fromQueue = queue.find((q) => q.id === fid);
    if (item) {
      void uploadOne(item);
    } else if (fromQueue) {
      // File object no longer retained after a failed batch submit; ask to re-pick.
      setError(lang === "bn" ? "ফাইলটি আবার বেছে নিন" : "Please re-select the file to retry");
    }
  };

  const cancel = (fid: string) => {
    setPending((p) => p.filter((x) => x.id !== fid));
    setQueue((q) => q.filter((x) => x.id !== fid));
  };

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
              if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
            }}
            onClick={() => inputRef.current?.click()}
            role="button"
            tabIndex={0}
            className={`grid cursor-pointer place-items-center rounded-lg border-2 border-dashed px-6 py-14 text-center transition-all duration-500 ${
              over
                ? "border-primary bg-primary/5 scale-[1.01] lamp-glow"
                : "border-border bg-card/70"
            }`}
          >
            <input
              ref={inputRef}
              type="file"
              multiple
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.length) addFiles(e.target.files);
                e.target.value = "";
              }}
            />
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

          {error && (
            <p className="rounded-md border border-destructive/40 bg-destructive/10 px-4 py-2 text-sm text-destructive">
              {error}
            </p>
          )}

          <Panel>
            {queue.length === 0 ? (
              <p className="text-sm text-muted-foreground">{t("queue")}: —</p>
            ) : (
              <UploadQueue items={queue} onCancel={cancel} onRetry={retry} simulate={false} />
            )}
          </Panel>
        </div>

        <Panel delay={140} className="h-fit space-y-5">
          <h2 className="font-display text-xl">{t("basicInfo")}</h2>
          <Field label={t("title")}>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </Field>
          <Field label={t("date")}>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </Field>
          <Field label={t("location")}>
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
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
          <ActionButton onClick={() => void submit()}>
            {submitting ? t("loading") : t("submitUpload")}
          </ActionButton>
        </Panel>
      </div>
    </AppShell>
  );
}
