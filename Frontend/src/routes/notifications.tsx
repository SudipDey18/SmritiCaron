import { createFileRoute } from "@tanstack/react-router";
import { CheckCheck } from "lucide-react";

import { EmptyState, PageHeader, Panel } from "@/components/Bits";
import { NotificationList } from "@/components/common/NotificationCenter";
import { AppShell } from "@/components/layout/AppShell";
import {
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useNotificationList,
  useUnreadCount,
} from "@/lib/api/hooks";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/notifications")({
  head: () => ({
    meta: [
      { title: "খবরাখবর — স্মৃতিচারণ | Notifications" },
      {
        name: "description",
        content:
          "সময়-সিন্দুক খোলা, চিঠি পৌঁছানো ও AI প্রক্রিয়ার সব খবর এক জায়গায়।",
      },
      { property: "og:title", content: "খবরাখবর — স্মৃতিচারণ" },
      { property: "og:description", content: "সিন্দুক, চিঠি ও AI-এর সব খবর।" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: NotificationsPage,
});

function NotificationsPage() {
  const { t } = useLang();
  const { data, isLoading, isError } = useNotificationList({ per_page: 50 });
  const { data: unreadData } = useUnreadCount();
  const markAllMut = useMarkAllNotificationsRead();
  const markOneMut = useMarkNotificationRead();

  const items = data?.items ?? [];
  const unread = unreadData?.count ?? 0;

  return (
    <AppShell>
      <PageHeader
        titleKey="notifications"
        subtitle={`${unread} ${t("unread")}`}
        action={
          <button
            type="button"
            onClick={() => markAllMut.mutate()}
            className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm transition hover:border-primary/50 hover:text-primary"
          >
            <CheckCheck className="size-4" aria-hidden /> {t("markAllRead")}
          </button>
        }
      />
      <Panel className="overflow-hidden p-0">
        {isLoading ? (
          <p className="px-4 py-8 text-center text-sm text-muted-foreground">{t("loading")}</p>
        ) : isError ? (
          <p className="px-4 py-8 text-center text-sm text-destructive">{t("errorTitle")}</p>
        ) : items.length === 0 ? (
          <EmptyState />
        ) : (
          <NotificationList items={items} onRead={(id) => markOneMut.mutate(id)} />
        )}
      </Panel>
    </AppShell>
  );
}
