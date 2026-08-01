import { createFileRoute, Link } from "@tanstack/react-router";
import { Lock } from "lucide-react";

import alpona from "@/assets/alpona-pattern.jpg";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useLang } from "@/lib/i18n";
import { mediaUrl } from "@/lib/api/client";
import { useSharedTarget } from "@/lib/api/hooks";
import type { Capsule, Memory } from "@/lib/api/types";
import { SkeletonCard } from "@/components/common/LoadingSkeletons";

export const Route = createFileRoute("/shared/$token")({
  head: () => ({
    meta: [
      { title: "ভাগ করা সিন্দুক — স্মৃতিচারণ | Shared capsule" },
      {
        name: "description",
        content: "পরিবারের সঙ্গে ভাগ করা স্মৃতির সিন্দুক — শুধু পড়ার জন্য উন্মুক্ত।",
      },
      { property: "og:title", content: "ভাগ করা সিন্দুক — স্মৃতিচারণ" },
      {
        property: "og:description",
        content: "একটি পরিবারের স্মৃতি, ভাগ করে নেওয়া।",
      },
    ],
  }),
  component: SharedCapsuleView,
});

function SharedCapsuleView() {
  const { token } = Route.useParams();
  const { t } = useLang();
  const { data, isLoading, error } = useSharedTarget(token);

  const target = data?.target as { capsule?: Capsule; memories?: Memory[] } | Capsule | undefined;
  const capsule =
    target && "capsule" in (target as object)
      ? ((target as { capsule?: Capsule }).capsule ?? null)
      : ((target as Capsule | undefined) ?? null);
  const memories =
    target && "memories" in (target as object)
      ? ((target as { memories?: Memory[] }).memories ?? [])
      : [];

  return (
    <div className="min-h-screen bg-background paper-grain">
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.06] mix-blend-multiply"
        style={{ backgroundImage: `url(${alpona})`, backgroundSize: "340px" }}
        aria-hidden
      />
      <header className="relative mx-auto flex max-w-5xl items-center justify-between px-5 py-5">
        <Link to="/" className="font-display text-2xl text-primary">
          {t("brand")}
        </Link>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
            <Lock className="size-3" aria-hidden /> {t("readOnly")}
          </span>
          <LanguageToggle compact />
        </div>
      </header>

      <main className="relative mx-auto max-w-5xl px-5 pb-20">
        <p className="text-xs uppercase tracking-widest text-sepia">{t("sharedView")}</p>
        <h1 className="mt-2 font-display text-4xl animate-rise">
          {capsule?.title ?? t("sharedView")}
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
          {capsule?.description ?? ""}
        </p>
        {error && (
          <p className="mt-4 rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error.message}
          </p>
        )}
        <p className="mt-2 text-xs text-muted-foreground">#{token}</p>
        <span className="mt-4 block h-px w-28 bg-gradient-to-r from-primary via-brass to-transparent" />

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading && [0, 1, 2].map((i) => <SkeletonCard key={i} delay={i * 80} />)}
          {memories.map((m, i) => (
            <article
              key={m.id}
              style={{ animationDelay: `${i * 70}ms` }}
              className="frame-photo rounded-sm animate-unfurl transition-transform duration-500 hover:-translate-y-1 hover:rotate-[0.5deg]"
            >
              {mediaUrl(m.media?.[0]?.thumbnailUrl ?? m.media?.[0]?.url, token) ? (
                <img
                  src={mediaUrl(m.media?.[0]?.thumbnailUrl ?? m.media?.[0]?.url, token)}
                  alt={m.title ?? ""}
                  loading="lazy"
                  className="h-32 w-full rounded-sm object-cover"
                />
              ) : (
                <div className="h-32 rounded-sm bg-gradient-to-br from-secondary to-muted" />
              )}
              <div className="pt-3">
                <h2 className="font-display text-base">{m.title ?? ""}</h2>
                <p className="text-xs text-muted-foreground">
                  {[m.memoryDate?.slice(0, 10), m.location].filter(Boolean).join(" · ")}
                </p>
                <p className="mt-2 text-xs leading-relaxed text-foreground/80">
                  {m.description ?? m.content ?? ""}
                </p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-14 rounded-lg border border-border bg-card/80 p-8 text-center shadow-warm">
          <p className="font-display text-xl">{t("heroTitle")}</p>
          <Link
            to="/sign-up"
            className="mt-5 inline-block rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-all hover:-translate-y-0.5 hover:lamp-glow"
          >
            {t("getStarted")}
          </Link>
        </div>
      </main>
    </div>
  );
}
