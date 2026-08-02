import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";

import { useLang, type Key } from "@/lib/i18n";

export function PageHeader({
  titleKey,
  title,
  subtitle,
  action,
}: {
  titleKey?: Key;
  title?: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  const { t } = useLang();
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4 animate-rise">
      <div>
        <h1 className="font-display text-3xl text-foreground lg:text-4xl">
          {titleKey ? t(titleKey) : title}
        </h1>
        {subtitle && (
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">{subtitle}</p>
        )}
        <span className="mt-3 block h-px w-24 bg-gradient-to-r from-primary via-brass to-transparent" />
      </div>
      {action}
    </div>
  );
}

export function EmptyState({ icon }: { icon?: ReactNode }) {
  const { t } = useLang();
  return (
    <div className="rounded-lg border border-dashed border-border bg-card/50 px-6 py-16 text-center animate-unfurl">
      <div className="mx-auto mb-4 grid size-14 place-items-center rounded-full bg-primary/10 text-primary">
        {icon ?? "❦"}
      </div>
      <h3 className="font-display text-xl">{t("emptyTitle")}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{t("emptyBody")}</p>
    </div>
  );
}

export function Panel({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <section
      style={{ animationDelay: `${delay}ms` }}
      className={`rounded-lg border border-border bg-card/85 p-5 shadow-warm backdrop-blur animate-rise ${className}`}
    >
      {children}
    </section>
  );
}

export function ActionButton({
  to,
  params,
  children,
  variant = "solid",
  onClick,
  disabled = false,
}: {
  to?: string;
  params?: Record<string, string>;
  children: ReactNode;
  variant?: "solid" | "ghost";
  onClick?: () => void;
  disabled?: boolean;
}) {
  const cls =
    variant === "solid"
      ? "bg-primary text-primary-foreground hover:shadow-warm"
      : "border border-border bg-card text-foreground hover:border-primary/50";
  const base = `inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all duration-300 hover:-translate-y-0.5 ${cls} disabled:pointer-events-none disabled:opacity-60`;

  if (to) {
    return (
      <Link to={to} params={params} className={base}>
        {children}
      </Link>
    );
  }
  return (
    <button type="button" onClick={onClick} disabled={disabled} className={base}>
      {children}
    </button>
  );
}

export function Field({
  label,
  children,
}: {
  label: string;
  children?: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      {children ?? (
        <input className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/30" />
      )}
    </label>
  );
}
