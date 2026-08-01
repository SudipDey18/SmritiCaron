import { useEffect, useState } from "react";
import { Ban, RotateCcw, Upload as UploadIcon } from "lucide-react";

import { ProcessingBadge } from "@/components/ai/AIBits";
import { useLang } from "@/lib/i18n";
import type { Job, JobState } from "@/lib/mock-extras";

export type QueueItem = Job & { size?: string };

const kindLabel: Record<Job["kind"], "ocr" | "transcript" | "caption" | "embedding"> = {
  ocr: "ocr",
  transcript: "transcript",
  caption: "caption",
  embedding: "embedding",
};

/** Upload / processing queue with progress, retry and cancel. */
export function UploadQueue({
  items,
  onRetry,
  onCancel,
  title,
  simulate = true,
}: {
  items: QueueItem[];
  onRetry?: (id: string) => void;
  onCancel?: (id: string) => void;
  title?: string;
  /** When false, `items` drive state directly (e.g. real upload lifecycle). */
  simulate?: boolean;
}) {
  const { t } = useLang();
  const [ticked, setTicked] = useState(items);

  useEffect(() => setTicked(items), [items]);

  // Background progress simulation — replace with query polling / SSE.
  useEffect(() => {
    if (!simulate) return;
    const id = setInterval(() => {
      setTicked((rows) =>
        rows.map((r) =>
          r.state === "processing"
            ? {
                ...r,
                progress: Math.min(100, r.progress + 3),
                state: (r.progress + 3 >= 100 ? "completed" : "processing") as JobState,
              }
            : r,
        ),
      );
    }, 900);
    return () => clearInterval(id);
  }, [simulate]);

  if (!ticked.length) return null;

  return (
    <div>
      <p className="mb-3 flex items-center gap-2 text-[11px] uppercase tracking-widest text-muted-foreground">
        <UploadIcon className="size-3.5" aria-hidden /> {title ?? t("queue")}
      </p>
      <ul className="space-y-3">
        {ticked.map((j) => (
          <li
            key={j.id}
            className="rounded-lg border border-border bg-background/60 p-3 animate-rise"
          >
            <div className="flex items-center gap-3">
              <span className="size-9 shrink-0 rounded-sm bg-gradient-to-br from-secondary to-muted" aria-hidden />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm">{j.file}</p>
                <p className="text-[11px] text-muted-foreground">
                  {t(kindLabel[j.kind])}
                  {j.size ? ` · ${j.size}` : ""}
                </p>
              </div>
              <ProcessingBadge state={j.state} />
              {j.state === "failed" && (
                <button
                  type="button"
                  aria-label={t("retry")}
                  onClick={() => onRetry?.(j.id)}
                  className="grid size-7 place-items-center rounded-md border border-border text-muted-foreground transition hover:border-primary/50 hover:text-primary"
                >
                  <RotateCcw className="size-3.5" aria-hidden />
                </button>
              )}
              {(j.state === "processing" || j.state === "pending") && (
                <button
                  type="button"
                  aria-label={t("cancelUpload")}
                  onClick={() => {
                    onCancel?.(j.id);
                    setTicked((rows) => rows.filter((r) => r.id !== j.id));
                  }}
                  className="grid size-7 place-items-center rounded-md border border-border text-muted-foreground transition hover:border-destructive/60 hover:text-destructive"
                >
                  <Ban className="size-3.5" aria-hidden />
                </button>
              )}
            </div>
            <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-secondary">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  j.state === "failed"
                    ? "bg-destructive/70"
                    : "bg-gradient-to-r from-brass to-primary"
                }`}
                style={{ width: `${j.progress}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Small labelled progress card used across dashboard + upload. */
export function ProgressCard({
  label,
  value,
  hint,
  delay = 0,
}: {
  label: string;
  value: number;
  hint?: string;
  delay?: number;
}) {
  return (
    <div
      style={{ animationDelay: `${delay}ms` }}
      className="rounded-lg border border-border bg-background/60 p-4 animate-rise"
    >
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">{label}</p>
        <p className="font-display text-lg text-sepia">{Math.round(value)}%</p>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full rounded-full bg-gradient-to-r from-brass to-primary transition-all duration-1000"
          style={{ width: `${value}%` }}
        />
      </div>
      {hint && <p className="mt-2 text-[11px] text-muted-foreground">{hint}</p>}
    </div>
  );
}
