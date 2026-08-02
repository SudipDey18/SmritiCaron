import { useEffect, useState, type ReactNode } from "react";
import {
  BadgeCheck,
  Check,
  Copy,
  Languages,
  Loader2,
  ScanText,
  Sparkles,
  TriangleAlert,
  Waves,
} from "lucide-react";

import { useLang, type Lang } from "@/lib/i18n";
import type { Bi } from "@/lib/mock-data";
import type { JobState } from "@/lib/mock-extras";

/* ---------------------------------- AIThinking --------------------------- */

export function AIThinking({ label }: { label?: string }) {
  const { t } = useLang();
  return (
    <div
      role="status"
      aria-live="polite"
      className="inline-flex items-center gap-2 rounded-full border border-brass/40 bg-brass/10 px-3 py-1.5 text-xs text-sepia"
    >
      <Sparkles className="size-3.5 animate-flicker" aria-hidden />
      <span>{label ?? t("aiThinking")}</span>
      <span className="flex gap-1" aria-hidden>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="size-1 animate-bounce rounded-full bg-sepia/70"
            style={{ animationDelay: `${i * 140}ms` }}
          />
        ))}
      </span>
    </div>
  );
}

export function TypingIndicator() {
  const { t } = useLang();
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
      <Loader2 className="size-3 animate-spin" aria-hidden />
      {t("typing")}
    </span>
  );
}

/* -------------------------------- Badges -------------------------------- */

const stateStyles: Record<JobState, string> = {
  processing: "border-brass/50 bg-brass/15 text-sepia",
  pending: "border-border bg-secondary text-secondary-foreground",
  completed: "border-accent/40 bg-accent/12 text-accent",
  failed: "border-destructive/45 bg-destructive/10 text-destructive",
};

export function ProcessingBadge({ state }: { state: JobState }) {
  const { t } = useLang();
  const label =
    state === "processing"
      ? t("processing")
      : state === "pending"
        ? t("pending")
        : state === "completed"
          ? t("completed")
          : t("failed");
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] ${stateStyles[state]}`}
    >
      {state === "processing" ? (
        <Loader2 className="size-3 animate-spin" aria-hidden />
      ) : state === "failed" ? (
        <TriangleAlert className="size-3" aria-hidden />
      ) : (
        <Check className="size-3" aria-hidden />
      )}
      {label}
    </span>
  );
}

const emotionHue: Record<string, string> = {
  joy: "bg-brass/20 text-sepia border-brass/40",
  nostalgia: "bg-primary/12 text-primary border-primary/35",
  love: "bg-destructive/10 text-destructive border-destructive/30",
  sadness: "bg-secondary text-secondary-foreground border-border",
  pride: "bg-accent/12 text-accent border-accent/35",
};

export function EmotionBadge({ emotion }: { emotion: string }) {
  const { t } = useLang();
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] ${
        emotionHue[emotion] ?? emotionHue['sadness']
      }`}
    >
      ❦ {t(emotion as "joy")}
    </span>
  );
}

export function LanguageBadge({ lang }: { lang: Lang }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-border bg-background/70 px-2.5 py-0.5 text-[11px] text-muted-foreground">
      <Languages className="size-3" aria-hidden />
      {lang === "bn" ? "বাংলা" : "English"}
    </span>
  );
}

export function EmbeddingBadge({
  state,
}: {
  state: "embedded" | "processing" | "failed";
}) {
  const { t } = useLang();
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] ${
        state === "embedded"
          ? "border-accent/40 bg-accent/12 text-accent"
          : state === "processing"
            ? "border-brass/50 bg-brass/15 text-sepia"
            : "border-destructive/45 bg-destructive/10 text-destructive"
      }`}
      title={t("embedding")}
    >
      <BadgeCheck className="size-3" aria-hidden />
      {state === "embedded" ? t("embedded") : state === "processing" ? t("processing") : t("failed")}
    </span>
  );
}

export function DuplicateWarning({ of }: { of: string }) {
  const { t } = useLang();
  return (
    <p className="flex items-start gap-2 rounded-md border border-destructive/35 bg-destructive/8 px-3 py-2 text-xs text-destructive">
      <TriangleAlert className="mt-0.5 size-3.5 shrink-0" aria-hidden />
      <span>
        {t("duplicateWarn")} — <span className="font-medium">{of}</span>
      </span>
    </p>
  );
}

/* ------------------------------ Content cards ---------------------------- */

export function SummaryCard({ text, title }: { text: string; title?: string }) {
  const { t } = useLang();
  return (
    <div className="rounded-lg border border-brass/35 bg-gradient-to-br from-brass/10 to-transparent p-4">
      <p className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-sepia">
        <Sparkles className="size-3.5" aria-hidden /> {title ?? t("summary")}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-foreground/90">{text}</p>
    </div>
  );
}

export function OCRPreview({ text }: { text: string }) {
  const { t } = useLang();
  return (
    <div className="rounded-lg border border-border bg-background/60 p-4">
      <p className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-muted-foreground">
        <ScanText className="size-3.5" aria-hidden /> {t("ocr")}
      </p>
      <p className="mt-2 font-display text-sm italic leading-relaxed text-foreground/85">
        {text}
      </p>
    </div>
  );
}

export function TranscriptViewer({
  lines,
}: {
  lines: { at: string; text: Bi }[];
}) {
  const { t, lang } = useLang();
  return (
    <div className="rounded-lg border border-border bg-background/60 p-4">
      <p className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-muted-foreground">
        <Waves className="size-3.5" aria-hidden /> {t("transcript")}
      </p>
      <ol className="scroll-alpona mt-3 max-h-44 space-y-2 overflow-y-auto pr-2 text-sm">
        {lines.map((l) => (
          <li key={l.at} className="flex gap-3">
            <span className="shrink-0 font-mono text-[11px] text-sepia">{l.at}</span>
            <span className="text-foreground/85">{l.text[lang]}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function CitationCard({
  label,
  onClick,
  index,
}: {
  label: string;
  onClick?: () => void;
  index?: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full items-center gap-2 rounded-md border border-border bg-card/80 px-3 py-2 text-left text-xs transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/50"
    >
      {index !== undefined && (
        <span className="grid size-5 shrink-0 place-items-center rounded-full bg-primary/12 text-[10px] text-primary">
          {index + 1}
        </span>
      )}
      <span className="truncate group-hover:text-primary">{label}</span>
    </button>
  );
}

export function SuggestedTags({
  tags,
  onPick,
}: {
  tags: string[];
  onPick?: (tag: string) => void;
}) {
  const { t } = useLang();
  return (
    <div>
      <p className="mb-2 text-[11px] uppercase tracking-widest text-muted-foreground">
        {t("suggestedTags")}
      </p>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => onPick?.(tag)}
            className="rounded-full border border-brass/40 bg-brass/10 px-3 py-1 text-xs text-sepia transition hover:-translate-y-0.5 hover:border-primary/50"
          >
            + {tag}
          </button>
        ))}
      </div>
    </div>
  );
}

export function SuggestedPrompts({
  prompts,
  onPick,
}: {
  prompts: string[];
  onPick?: (p: string) => void;
}) {
  const { t } = useLang();
  return (
    <div>
      <p className="mb-2 text-[11px] uppercase tracking-widest text-muted-foreground">
        {t("suggestedPrompt")}
      </p>
      <div className="flex flex-wrap gap-2">
        {prompts.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onPick?.(p)}
            className="rounded-full border border-border bg-card px-3 py-1.5 text-xs transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/50 hover:text-primary"
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}

export function RelatedMemories({
  items,
  onSelect,
}: {
  items: { id: string; title: string; sub?: string }[];
  onSelect?: ((id: string) => void) | undefined;
}) {
  const { t } = useLang();
  return (
    <div>
      <p className="mb-2 flex items-center gap-2 text-[11px] uppercase tracking-widest text-muted-foreground">
        <Sparkles className="size-3.5 text-brass" aria-hidden /> {t("relatedMemories")}
      </p>
      <ul className="space-y-2">
        {items.map((m) => (
          <li key={m.id}>
            <button
              type="button"
              onClick={() => onSelect?.(m.id)}
              className="flex w-full items-center gap-3 rounded-md border border-border bg-background/60 px-3 py-2 text-left text-sm transition hover:border-primary/45 hover:bg-card"
            >
              <span className="size-8 shrink-0 rounded-sm bg-gradient-to-br from-secondary to-muted" />
              <span className="min-w-0">
                <span className="block truncate">{m.title}</span>
                {m.sub && (
                  <span className="block truncate text-xs text-muted-foreground">{m.sub}</span>
                )}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ------------------------------ Copy button ------------------------------ */

export function CopyButton({ text, children }: { text: string; children?: ReactNode }) {
  const { t } = useLang();
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!done) return;
    const id = setTimeout(() => setDone(false), 1600);
    return () => clearTimeout(id);
  }, [done]);

  return (
    <button
      type="button"
      aria-label={t("copy")}
      onClick={() => {
        void navigator.clipboard?.writeText(text);
        setDone(true);
      }}
      className="inline-flex items-center gap-1.5 rounded-md border border-border px-2 py-1 text-[11px] text-muted-foreground transition hover:border-primary/50 hover:text-primary"
    >
      {done ? <Check className="size-3" aria-hidden /> : <Copy className="size-3" aria-hidden />}
      {children ?? (done ? t("copied") : t("copy"))}
    </button>
  );
}

/* ------------------------------ Relevance ------------------------------- */

export function RelevanceMeter({ value }: { value: number }) {
  const { t } = useLang();
  return (
    <div className="w-28" title={t("relevance")}>
      <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full rounded-full bg-gradient-to-r from-brass to-primary transition-all duration-700"
          style={{ width: `${Math.round(value * 100)}%` }}
        />
      </div>
      <p className="mt-1 text-[10px] text-muted-foreground">
        {t("relevance")} {Math.round(value * 100)}%
      </p>
    </div>
  );
}
