import { createFileRoute, Link } from "@tanstack/react-router";

import { AuthShell } from "./sign-in";
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
  const { t } = useLang();
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
      {(
        [
          [t("displayName"), "text"],
          [t("email"), "email"],
          [t("password"), "password"],
        ] as const
      ).map(([label, type]) => (
        <label key={label} className="block">
          <span className="mb-1.5 block text-xs uppercase tracking-widest text-muted-foreground">
            {label}
          </span>
          <input
            type={type}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/30"
          />
        </label>
      ))}
      <Link
        to="/capsules/new"
        className="block rounded-md bg-primary py-2.5 text-center text-sm font-medium text-primary-foreground transition-all hover:-translate-y-0.5 hover:lamp-glow"
      >
        {t("create")}
      </Link>
    </AuthShell>
  );
}
