import { Mail, MessageCircle, PenLine, Share2, Sparkles, Upload, type LucideIcon } from "lucide-react";

import { useLang } from "@/lib/i18n";
import type { ActivityItem } from "@/lib/api/types";

const icons: Record<string, LucideIcon> = {
  upload: Upload,
  edit: PenLine,
  chat: MessageCircle,
  vault: Sparkles,
  letter: Mail,
  share: Share2,
};

function relativeTime(iso: string, lang: "bn" | "en") {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return lang === "bn" ? "এইমাত্র" : "just now";
  if (mins < 60) return lang === "bn" ? `${mins} মিনিট আগে` : `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return lang === "bn" ? `${hours} ঘণ্টা আগে` : `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return lang === "bn" ? `${days} দিন আগে` : `${days}d ago`;
}

/** Vertical dashed activity rail matching the life-timeline styling. */
export function ActivityTimeline({ rows }: { rows: ActivityItem[] }) {
  const { lang } = useLang();
  return (
    <ol className="relative ml-4 border-l border-dashed border-border pl-8">
      {rows.map((r, i) => {
        const Icon = icons[r.type] ?? Sparkles;
        return (
          <li
            key={r.id}
            style={{ animationDelay: `${(i % 12) * 60}ms` }}
            className="group relative mb-6 animate-rise"
          >
            <span className="absolute -left-[42px] grid size-8 place-items-center rounded-full border border-brass/60 bg-card text-sepia transition-transform duration-500 group-hover:scale-110">
              <Icon className="size-3.5" aria-hidden />
            </span>
            <div className="rounded-lg border border-border bg-card/85 px-4 py-3 shadow-warm transition-transform duration-500 group-hover:-translate-y-0.5">
              <p className="text-sm">{r.message}</p>
              <p className="mt-1 flex items-center gap-2 text-[11px] uppercase tracking-widest text-muted-foreground">
                <span>{relativeTime(r.createdAt, lang)}</span>
                <span className="rounded-full bg-brass/20 px-2 py-0.5 text-[10px] normal-case tracking-normal text-sepia">
                  {r.type}
                </span>
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export function ActivityTimelineSkeleton() {
  return (
    <ol className="relative ml-4 border-l border-dashed border-border pl-8">
      {Array.from({ length: 5 }, (_, i) => (
        <li key={i} className="relative mb-6">
          <span className="absolute -left-[42px] size-8 animate-pulse rounded-full bg-secondary" />
          <div className="h-16 animate-pulse rounded-lg border border-border bg-secondary/50" />
        </li>
      ))}
    </ol>
  );
}
