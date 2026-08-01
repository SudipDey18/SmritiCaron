import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { Loader2 } from "lucide-react";

import { AuthShell } from "./sign-in";
import { ApiError } from "@/lib/api/client";
import { useAuth } from "@/lib/auth";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/sign-up")({
  head: () => ({
    meta: [
      { title: "নিবন্ধন — স্মৃতিচারণ | Create account" },
      {
        name: "description",
        content:
          "বিনামূল্যে স্মৃতিচারণে নিবন্ধন করুন এবং পরিবারের প্রথম স্মৃতির সিন্দুক তৈরি করুন.",
      },
      { property: "og:title", content: "নিবন্ধন — স্মৃতিচারণ" },
      {
        property: "og:description",
        content: "প্রথম স্মৃতির সিন্দুক তৈরি করুন, বিনামূল্যে।",
      },
    ],
  }),
  component: SignUpPage,
});

function SignUpPage() {
  const { t, lang } = useLang();
  const { signUp, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
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
      await signUp({ name, email, password, language: lang });
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
      title={t("signUp")}
      footer={
        <>
          {t("signIn")} →{" "}
          <Link to="/sign-in" className="text-primary ink-underline">
            {t("signIn")}
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
        {(
          [
            [t("displayName"), "text", name, setName, "name"],
            [t("email"), "email", email, setEmail, "email"],
            [t("password"), "password", password, setPassword, "password"],
          ] as const
        ).map(([label, type, value, setter, field]) => (
          <label key={field} className="block">
            <span className="mb-1.5 block text-xs uppercase tracking-widest text-muted-foreground">
              {label}
            </span>
            <input
              type={type}
              value={value}
              onChange={(e) => setter(e.target.value)}
              required
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/30"
            />
            {fieldErrors[field] && (
              <span className="mt-1 block text-xs text-destructive">{fieldErrors[field][0]}</span>
            )}
          </label>
        ))}
        <button
          type="submit"
          disabled={submitting}
          className="flex w-full items-center justify-center gap-2 rounded-md bg-primary py-2.5 text-center text-sm font-medium text-primary-foreground transition-all hover:-translate-y-0.5 hover:lamp-glow disabled:pointer-events-none disabled:opacity-70"
        >
          {submitting && <Loader2 className="size-4 animate-spin" aria-hidden />}
          {t("create")}
        </button>
      </form>
    </AuthShell>
  );
}
