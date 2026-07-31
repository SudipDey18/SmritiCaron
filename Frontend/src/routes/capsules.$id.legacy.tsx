import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";

import { CapsuleTabs } from "./capsules.$id";
import { ActionButton, PageHeader } from "@/components/Bits";
import { AppShell } from "@/components/layout/AppShell";
import { useLang } from "@/lib/i18n";
import { letters } from "@/lib/mock-data";

export const Route = createFileRoute("/capsules/$id/legacy")({
  head: () => ({
    meta: [
      { title: "উত্তরাধিকার চিঠি — স্মৃতিচারণ | Legacy letters" },
      {
        name: "description",
        content: "প্রিয়জনের জন্য রেখে যাওয়া চিঠি লিখুন — নির্ধারিত দিনে পৌঁছে যাবে।",
      },
      { property: "og:title", content: "উত্তরাধিকার চিঠি — স্মৃতিচারণ" },
      {
        property: "og:description",
        content: "শেষ কথাগুলো, প্রিয়জনের নামে।",
      },
    ],
  }),
  component: LegacyMessagesPage,
});

function LegacyMessagesPage() {
  const { id } = Route.useParams();
  const { t, lang } = useLang();

  return (
    <AppShell>
      <PageHeader
        titleKey="legacy"
        subtitle={t("tagline")}
        action={
          <ActionButton>
            <Plus className="size-4" aria-hidden /> {t("newLetter")}
          </ActionButton>
        }
      />
      <CapsuleTabs id={id} />

      <div className="grid gap-6 lg:grid-cols-2">
        {letters.map((l, i) => (
          <article
            key={l.id}
            style={{ animationDelay: `${i * 110}ms` }}
            className="group relative rounded-lg border border-border bg-gradient-to-br from-card to-paper-deep p-7 shadow-warm animate-unfurl transition-transform duration-500 hover:-translate-y-1 hover:rotate-[-0.4deg]"
          >
            <span className="absolute right-6 top-6 text-2xl text-brass/60" aria-hidden>
              ❦
            </span>
            <p className="text-xs uppercase tracking-widest text-muted-foreground">
              {t("recipient")}
            </p>
            <h3 className="mt-1 font-display text-2xl">{l.to[lang]}</h3>
            <p className="mt-4 font-display text-base italic leading-relaxed text-foreground/90">
              “{l.excerpt[lang]}”
            </p>
            <div className="mt-6 flex items-center justify-between text-xs">
              <span
                className={`rounded-full px-2.5 py-1 ${
                  l.status === "delivered"
                    ? "bg-accent/15 text-accent"
                    : l.status === "scheduled"
                      ? "bg-brass/20 text-sepia"
                      : "bg-secondary text-secondary-foreground"
                }`}
              >
                {t(l.status)}
              </span>
              <span className="text-muted-foreground">
                {t("deliverOn")} {l.when}
              </span>
            </div>
          </article>
        ))}
      </div>
    </AppShell>
  );
}
