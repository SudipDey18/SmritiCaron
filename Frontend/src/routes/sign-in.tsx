import { createFileRoute, Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

import alpona from "@/assets/alpona-pattern.jpg";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useLang } from "@/lib/i18n";

export function AuthShell({
  title,
  children,
  footer,
}: {
  title: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  const { t } = useLang();
  return (
    <div className="relative grid min-h-screen place-items-center bg-background paper-grain px-5 py-12">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07] mix-blend-multiply"
        style={{ backgroundImage: `url(${alpona})`, backgroundSize: "300px" }}
        aria-hidden
      />
      <div className="relative w-full max-w-sm rounded-lg border border-border bg-card/90 p-8 shadow-warm backdrop-blur animate-unfurl">
        <Link to="/" className="block text-center font-display text-2xl text-primary">
          {t("brand")}
        </Link>
        <p className="mt-1 text-center text-[11px] text-muted-foreground">
          {t("tagline")}
        </p>
        <h1 className="mt-7 font-display text-2xl">{title}</h1>
        <div className="mt-5 space-y-4">{children}</div>
        <div className="mt-6 text-center text-sm text-muted-foreground">{footer}</div>
        <div className="mt-6 flex justify-center">
          <LanguageToggle />
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/sign-in")({
  head: () => ({
    meta: [
      { title: "প্রবেশ করুন — স্মৃতিচারণ | Sign in" },
      {
        name: "description",
        content: "স্মৃতিচারণে প্রবেশ করে আপনার স্মৃতির সিন্দুক খুলুন। Sign in to your memory capsules.",
      },
      { property: "og:title", content: "প্রবেশ করুন — স্মৃতিচারণ" },
      {
        property: "og:description",
        content: "আপনার পরিবারের স্মৃতির সিন্দুকে ফিরে আসুন।",
      },
    ],
  }),
  component: SignInPage,
});

function SignInPage() {
  const { t } = useLang();
  return (
    <AuthShell
      title={t("signIn")}
      footer={
        <>
          {t("signUp")} →{" "}
          <Link to="/sign-up" className="text-primary ink-underline">
            {t("getStarted")}
          </Link>
        </>
      }
    >
      <label className="block">
        <span className="mb-1.5 block text-xs uppercase tracking-widest text-muted-foreground">
          {t("email")}
        </span>
        <input
          type="email"
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/30"
        />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-xs uppercase tracking-widest text-muted-foreground">
          {t("password")}
        </span>
        <input
          type="password"
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/30"
        />
      </label>
      <Link
        to="/dashboard"
        className="block rounded-md bg-primary py-2.5 text-center text-sm font-medium text-primary-foreground transition-all hover:-translate-y-0.5 hover:lamp-glow"
      >
        {t("signIn")}
      </Link>
    </AuthShell>
  );
}
