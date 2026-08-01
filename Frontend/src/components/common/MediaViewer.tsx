import { useEffect, useState } from "react";
import {
  Download,
  FileText,
  Heart,
  Loader2,
  Maximize2,
  RotateCw,
  Trash2,
  ZoomIn,
  ZoomOut,
} from "lucide-react";

import { Modal } from "./Modal";
import { EmotionBadge, LanguageBadge, OCRPreview, RelatedMemories, SummaryCard } from "@/components/ai/AIBits";
import { useLang } from "@/lib/i18n";

export type MediaKind = "photo" | "video" | "audio" | "document" | "text";

/** Reusable viewer for images, video, audio, PDFs and documents. */
export function MediaViewer({
  open,
  onClose,
  kind,
  title,
  meta,
  emotion,
  body,
  loading = false,
  mediaSrc,
  downloadUrl,
  ocrText,
  transcription,
  summary,
  favorite,
  onToggleFavorite,
  onDelete,
  related = [],
  onSelectRelated,
}: {
  open: boolean;
  onClose: () => void;
  kind: MediaKind;
  title: string;
  meta?: { label: string; value: string }[] | undefined;
  emotion?: string | undefined;
  body?: string | undefined;
  loading?: boolean;
  mediaSrc?: string | undefined;
  downloadUrl?: string | undefined;
  ocrText?: string | undefined;
  transcription?: string | undefined;
  summary?: string | undefined;
  favorite?: boolean | undefined;
  onToggleFavorite?: (() => void) | undefined;
  onDelete?: (() => void) | undefined;
  related?: { id: string; title: string; sub?: string }[];
  onSelectRelated?: (id: string) => void;
}) {
  const { t, lang } = useLang();
  const [zoom, setZoom] = useState(1);
  const [rot, setRot] = useState(0);

  useEffect(() => {
    if (open) {
      setZoom(1);
      setRot(0);
    }
  }, [open]);

  return (
    <Modal open={open} onClose={onClose} title={title} wide>
      {loading ? (
        <div className="grid place-items-center py-24 text-muted-foreground">
          <Loader2 className="size-6 animate-spin" aria-hidden />
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <div className="relative grid min-h-64 place-items-center overflow-hidden rounded-lg border border-border bg-gradient-to-br from-secondary to-muted">
              <div
                className="grid max-h-96 w-full place-items-center transition-transform duration-500"
                style={{ transform: `scale(${zoom}) rotate(${rot}deg)` }}
              >
                {kind === "photo" && mediaSrc ? (
                  <img src={mediaSrc} alt={title} loading="lazy" className="max-h-96 w-full object-contain" />
                ) : kind === "video" && mediaSrc ? (
                  <video src={mediaSrc} controls className="max-h-96 w-full" />
                ) : kind === "audio" ? (
                  mediaSrc ? (
                    <audio src={mediaSrc} controls className="w-full" />
                  ) : (
                    <div className="flex items-end gap-1" aria-hidden>
                      {Array.from({ length: 22 }, (_, i) => (
                        <span
                          key={i}
                          className="w-1.5 animate-bounce rounded-full bg-sepia/70"
                          style={{
                            height: `${12 + ((i * 7) % 46)}px`,
                            animationDelay: `${i * 70}ms`,
                          }}
                        />
                      ))}
                    </div>
                  )
                ) : kind === "document" || kind === "text" ? (
                  <FileText className="size-14 text-sepia" aria-hidden />
                ) : (
                  <span className="font-display text-5xl text-sepia/70" aria-hidden>
                    ❦
                  </span>
                )}
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <button
                type="button"
                aria-label={t("zoomIn")}
                onClick={() => setZoom((z) => Math.min(2.5, z + 0.2))}
                className="grid size-8 place-items-center rounded-md border border-border transition hover:border-primary/50 hover:text-primary"
              >
                <ZoomIn className="size-4" aria-hidden />
              </button>
              <button
                type="button"
                aria-label={t("zoomOut")}
                onClick={() => setZoom((z) => Math.max(0.6, z - 0.2))}
                className="grid size-8 place-items-center rounded-md border border-border transition hover:border-primary/50 hover:text-primary"
              >
                <ZoomOut className="size-4" aria-hidden />
              </button>
              <button
                type="button"
                aria-label={t("rotate")}
                onClick={() => setRot((r) => r + 90)}
                className="grid size-8 place-items-center rounded-md border border-border transition hover:border-primary/50 hover:text-primary"
              >
                <RotateCw className="size-4" aria-hidden />
              </button>
              <button
                type="button"
                aria-label={t("fullscreen")}
                onClick={() => document.documentElement.requestFullscreen?.()}
                className="grid size-8 place-items-center rounded-md border border-border transition hover:border-primary/50 hover:text-primary"
              >
                <Maximize2 className="size-4" aria-hidden />
              </button>
              {onToggleFavorite && (
                <button
                  type="button"
                  aria-label={t("pin")}
                  onClick={onToggleFavorite}
                  className={`grid size-8 place-items-center rounded-md border transition ${
                    favorite
                      ? "border-destructive/50 text-destructive"
                      : "border-border text-muted-foreground hover:border-destructive/50 hover:text-destructive"
                  }`}
                >
                  <Heart className={`size-4 ${favorite ? "fill-current" : ""}`} aria-hidden />
                </button>
              )}
              {downloadUrl && (
                <a
                  href={downloadUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="ml-auto inline-flex items-center gap-2 rounded-md border border-border px-3 py-1.5 text-xs transition hover:border-primary/50 hover:text-primary"
                >
                  <Download className="size-3.5" aria-hidden /> {t("download")}
                </a>
              )}
              {onDelete && (
                <button
                  type="button"
                  onClick={onDelete}
                  className={`inline-flex items-center gap-2 rounded-md border border-border px-3 py-1.5 text-xs text-destructive transition hover:border-destructive/50 ${downloadUrl ? "" : "ml-auto"}`}
                >
                  <Trash2 className="size-3.5" aria-hidden /> {t("del")}
                </button>
              )}
            </div>

            {body && <p className="mt-4 text-sm leading-relaxed text-foreground/85">{body}</p>}
            {summary && (
              <div className="mt-4">
                <SummaryCard text={summary} />
              </div>
            )}
            {ocrText && (
              <div className="mt-4">
                <OCRPreview text={ocrText} />
              </div>
            )}
            {transcription && (
              <div className="mt-4 rounded-lg border border-border bg-background/60 p-4">
                <p className="mb-2 text-[11px] uppercase tracking-widest text-muted-foreground">
                  {t("transcript")}
                </p>
                <p className="text-sm leading-relaxed text-foreground/85">{transcription}</p>
              </div>
            )}
          </div>

          <div className="space-y-5">
            <div className="flex flex-wrap gap-2">
              {emotion && <EmotionBadge emotion={emotion} />}
              <LanguageBadge lang={lang} />
            </div>

            {meta && meta.length > 0 && (
              <div className="rounded-lg border border-border bg-background/60 p-4">
                <p className="mb-2 text-[11px] uppercase tracking-widest text-muted-foreground">
                  {t("metadata")}
                </p>
                <dl className="space-y-1.5 text-xs">
                  {meta.map((m) => (
                    <div key={m.label} className="flex justify-between gap-3">
                      <dt className="text-muted-foreground">{m.label}</dt>
                      <dd className="text-right">{m.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            {related.length > 0 && <RelatedMemories items={related} onSelect={onSelectRelated} />}
          </div>
        </div>
      )}
    </Modal>
  );
}
