import { useState } from "react";
import {
  AlertTriangle,
  Bell,
  CheckCheck,
  Handshake,
  Mail,
  Sparkles,
  Unlock,
  Upload,
  type LucideIcon,
} from "lucide-react";

import {
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useNotificationList,
  useUnreadCount,
} from "@/lib/api/hooks";
import type { Notification } from "@/lib/api/types";
import { useLang } from "@/lib/i18n";

const icons: Record<string, LucideIcon> = {
  vault_unlocked: Unlock,
  letter_delivered: Mail,
  ai_completed: Sparkles,
  upload_completed: Upload,
  share_accepted: Handshake,
  error: AlertTriangle,
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

/** Kept for backward compatibility with existing callers. */
export function useNotifications() {
  const { data } = useNotificationList({ per_page: 20 });
  const { data: unreadData } = useUnreadCount();
  const markAllMut = useMarkAllNotificationsRead();
  const markOneMut = useMarkNotificationRead();

  const items = data?.items ?? [];
  const unread = unreadData?.count ?? 0;
  const markAll = () => markAllMut.mutate();
  const markOne = (id: string) => markOneMut.mutate(id);

  return { items, unread, markAll, markOne };
}

export function NotificationList({
  items,
  onRead,
}: {
  items: Notification[];
  onRead?: (id: string) => void;
}) {
  const { lang, t } = useLang();
  if (items.length === 0) {
    return (
      <p className="px-4 py-8 text-center text-sm text-muted-foreground">{t("emptyTitle")}</p>
    );
  }
  return (
    <ul className="divide-y divide-border">
      {items.map((n, i) => {
        const Icon = icons[n.type] ?? Bell;
        const read = Boolean(n.readAt);
        return (
          <li key={n.id} style={{ animationDelay: `${i * 60}ms` }} className="animate-rise">
            <button
              type="button"
              onClick={() => onRead?.(n.id)}
              className={`flex w-full items-start gap-3 px-4 py-3 text-left transition hover:bg-secondary/50 ${
                read ? "" : "bg-primary/[0.04]"
              }`}
            >
              <span
                className={`mt-0.5 grid size-8 shrink-0 place-items-center rounded-full ${
                  n.type === "error"
                    ? "bg-destructive/12 text-destructive"
                    : "bg-primary/12 text-primary"
                }`}
              >
                <Icon className="size-4" aria-hidden />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2">
                  <span className="truncate font-display text-sm">{n.title}</span>
                  {!read && <span className="size-1.5 shrink-0 rounded-full bg-primary" />}
                </span>
                {n.body && (
                  <span className="mt-0.5 block text-xs text-muted-foreground">{n.body}</span>
                )}
                <span className="mt-1 block text-[10px] uppercase tracking-widest text-sepia">
                  {relativeTime(n.createdAt, lang)}
                </span>
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

/** Bell + dropdown panel for the top bar. */
export function NotificationCenter() {
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  const { items, unread, markAll, markOne } = useNotifications();

  return (
    <div className="relative">
      <button
        type="button"
        aria-label={t("notificationCenter")}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="relative grid size-9 place-items-center rounded-full border border-border text-muted-foreground transition hover:border-primary/50 hover:text-primary"
      >
        <Bell className="size-4" aria-hidden />
        {unread > 0 && (
          <span className="absolute -right-0.5 -top-0.5 grid min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] leading-4 text-primary-foreground">
            {unread}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} role="presentation" />
          <div className="absolute right-0 z-40 mt-2 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-lg border border-border bg-card shadow-warm animate-unfurl">
            <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
              <p className="font-display text-base">{t("notificationCenter")}</p>
              <button
                type="button"
                onClick={markAll}
                className="inline-flex items-center gap-1 text-[11px] text-primary transition hover:underline"
              >
                <CheckCheck className="size-3.5" aria-hidden /> {t("markAllRead")}
              </button>
            </div>
            <div className="scroll-alpona max-h-80 overflow-y-auto">
              <NotificationList items={items.slice(0, 6)} onRead={markOne} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
