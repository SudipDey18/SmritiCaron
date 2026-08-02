import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { Loader2 } from "lucide-react";

import alpona from "@/assets/alpona-pattern.jpg";
import { LanguageToggle } from "@/components/LanguageToggle";
import { ApiError } from "@/lib/api/client";
import { useAuth } from "@/lib/auth";
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
  const { signIn, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  useEffect(() => {
    if (!loading && isAuthenticated) void navigate({ to: "/dashboard", replace: true });
  }, [loading, isAuthenticated, navigate]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setFieldErrors({});
    setSubmitting(true);
    try {
      await signIn(email, password);
      void navigate({ to: "/dashboard" });
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
        setFieldErrors(err.fields ?? {});
      } else {
        setError(t("errorTitle"));
      }
    } finally {
      setSubmitting(false);
    }
  }

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
      <form className="space-y-4" onSubmit={onSubmit}>
        {error && (
          <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive">
            {error}
          </p>
        )}
        <label className="block">
          <span className="mb-1.5 block text-xs uppercase tracking-widest text-muted-foreground">
            {t("email")}
          </span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/30"
          />
          {fieldErrors["email"] && (
            <span className="mt-1 block text-xs text-destructive">{fieldErrors["email"][0]}</span>
          )}
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs uppercase tracking-widest text-muted-foreground">
            {t("password")}
          </span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/30"
          />
          {fieldErrors["password"] && (
            <span className="mt-1 block text-xs text-destructive">{fieldErrors["password"][0]}</span>
          )}
        </label>
        <button
          type="submit"
          disabled={submitting}
          className="flex w-full items-center justify-center gap-2 rounded-md bg-primary py-2.5 text-center text-sm font-medium text-primary-foreground transition-all hover:-translate-y-0.5 hover:lamp-glow disabled:pointer-events-none disabled:opacity-70"
        >
          {submitting && <Loader2 className="size-4 animate-spin" aria-hidden />}
          {t("signIn")}
        </button>
      </form>
    </AuthShell>
  );
}
