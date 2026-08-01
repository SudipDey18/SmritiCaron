import { Link, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";
import {
  Archive,
  Bell,
  Clock,
  History as HistoryIcon,
  Home,
  Image,
  MessageCircleHeart,
  ScrollText,
  Search,
  Settings,
  Sparkles,
  TreeDeciduous,
  Upload,
  UserRound,
} from "lucide-react";

import alpona from "@/assets/alpona-pattern.jpg";
import { LanguageToggle } from "@/components/LanguageToggle";
import { NotificationCenter } from "@/components/common/NotificationCenter";
import { SearchModal, useCommandPalette } from "@/components/common/SearchModal";
import { mediaUrl } from "@/lib/api/client";
import { useAuth } from "@/lib/auth";
import { useLang, type Key } from "@/lib/i18n";

const CAPSULE = "dida";

type NavItem = { to: string; params?: Record<string, string>; key: Key; icon: typeof Home };

const primaryNav: NavItem[] = [
  { to: "/dashboard", key: "dashboard", icon: Home },
  { to: "/capsules", key: "capsules", icon: Archive },
];

const capsuleNav: NavItem[] = [
  { to: "/capsules/$id/memories", key: "memories", icon: Image },
  { to: "/capsules/$id/upload", key: "upload", icon: Upload },
  { to: "/capsules/$id/chat", key: "chat", icon: MessageCircleHeart },
  { to: "/capsules/$id/timeline", key: "timeline", icon: Clock },
  { to: "/capsules/$id/family", key: "family", icon: TreeDeciduous },
  { to: "/capsules/$id/time-vault", key: "vault", icon: Sparkles },
  { to: "/capsules/$id/legacy", key: "legacy", icon: ScrollText },
];

const accountNav: NavItem[] = [
  { to: "/activity", key: "activityLog", icon: HistoryIcon },
  { to: "/notifications", key: "notifications", icon: Bell },
  { to: "/profile", key: "profile", icon: UserRound },
  { to: "/settings", key: "settings", icon: Settings },
];


function NavLinks({ items, id }: { items: NavItem[]; id: string }) {
  const { t } = useLang();
  return (
    <ul className="space-y-1">
      {items.map(({ to, key, icon: Icon }) => (
        <li key={to}>
          <Link
            to={to}
            params={to.includes("$id") ? { id } : undefined}
            activeProps={{
              className:
                "bg-sidebar-accent text-sidebar-accent-foreground border-primary/60",
            }}
            className="group flex items-center gap-3 rounded-md border border-transparent px-3 py-2 text-sm transition-all duration-300 hover:border-primary/30 hover:bg-sidebar-accent/60 hover:translate-x-0.5"
          >
            <Icon className="size-4 text-primary/80 transition-transform duration-300 group-hover:scale-110" aria-hidden />
            <span>{t(key)}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const { t } = useLang();
  const params = useRouterState({
    select: (s) => s.matches.at(-1)?.params as { id?: string } | undefined,
  });
  const id = params?.id ?? CAPSULE;
  const { open: palette, setOpen: setPalette } = useCommandPalette();
  const { user, signOut } = useAuth();
  const avatarUrl = user && "avatarUrl" in user ? mediaUrl(user.avatarUrl) : undefined;
  const initial = user?.name?.charAt(0) || "অ";

  return (
    <div className="min-h-screen bg-background paper-grain">
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.05] mix-blend-multiply"
        style={{ backgroundImage: `url(${alpona})`, backgroundSize: "340px" }}
        aria-hidden
      />
      <div className="relative flex">
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar/80 px-4 py-6 backdrop-blur lg:flex">
          <Link to="/" className="mb-8 block">
            <span className="font-display text-2xl text-primary">{t("brand")}</span>
            <span className="mt-1 block text-[11px] tracking-wide text-muted-foreground">
              {t("tagline")}
            </span>
          </Link>
          <nav className="scroll-alpona flex-1 space-y-6 overflow-y-auto pr-1">
            <NavLinks items={primaryNav} id={id} />
            <div>
              <p className="mb-2 px-3 text-[11px] uppercase tracking-widest text-muted-foreground">
                {t("capsules")}
              </p>
              <NavLinks items={capsuleNav} id={id} />
            </div>
            <NavLinks items={accountNav} id={id} />
          </nav>
          <div className="mt-6 space-y-3">
            <LanguageToggle />
            <button
              type="button"
              onClick={() => void signOut()}
              className="w-full rounded-md border border-border px-3 py-2 text-left text-sm text-muted-foreground transition hover:border-destructive/50 hover:text-destructive"
            >
              {t("signOut")}
            </button>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-border bg-background/85 px-4 py-3 backdrop-blur lg:px-8">
            <Link to="/" className="font-display text-xl text-primary lg:hidden">
              {t("brand")}
            </Link>
            <button
              type="button"
              onClick={() => setPalette(true)}
              className="hidden min-w-64 items-center gap-3 rounded-full border border-border bg-card/70 px-4 py-2 text-sm text-muted-foreground transition hover:border-primary/45 hover:text-foreground lg:flex"
            >
              <Search className="size-4" aria-hidden />
              <span className="flex-1 text-left">{t("search")}</span>
              <kbd className="rounded border border-border px-1.5 py-0.5 text-[10px]">⌘K</kbd>
            </button>
            <div className="flex items-center gap-3">
              <button
                type="button"
                aria-label={t("search")}
                onClick={() => setPalette(true)}
                className="grid size-9 place-items-center rounded-full border border-border text-muted-foreground transition hover:border-primary/50 hover:text-primary lg:hidden"
              >
                <Search className="size-4" aria-hidden />
              </button>
              <NotificationCenter />
              <LanguageToggle compact />
              <Link
                to="/profile"
                className="grid size-9 place-items-center overflow-hidden rounded-full bg-primary/10 font-display text-sm text-primary ring-1 ring-primary/25 transition hover:ring-primary"
              >
                {avatarUrl ? (
                  <img src={avatarUrl} alt={user?.name ?? ""} className="size-full object-cover" />
                ) : (
                  initial
                )}
              </Link>
            </div>
          </header>
          <main className="px-4 pb-28 pt-6 lg:px-8 lg:pb-14">{children}</main>
        </div>
      </div>

      <SearchModal open={palette} onClose={() => setPalette(false)} />


      <nav className="fixed bottom-0 left-0 right-0 z-30 flex items-center justify-around border-t border-border bg-card/95 px-2 py-2 backdrop-blur lg:hidden">
        {[primaryNav[0], capsuleNav[0], capsuleNav[2], capsuleNav[3], accountNav[1]].map(
          (item) => {
            const { to, key, icon: Icon } = item as NavItem;
            return (
              <Link
                key={to}
                to={to}
                params={to.includes("$id") ? { id } : undefined}
                activeProps={{ className: "text-primary" }}
                className="flex flex-col items-center gap-1 px-2 py-1 text-[10px] text-muted-foreground transition hover:text-primary"
              >
                <Icon className="size-5" aria-hidden />
                {t(key)}
              </Link>
            );
          },
        )}

      </nav>
    </div>
  );
}
