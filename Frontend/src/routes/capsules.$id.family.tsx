import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Download, Plus, ZoomIn, ZoomOut } from "lucide-react";

import { CapsuleTabs } from "./capsules.$id";
import { ActionButton, PageHeader, Panel } from "@/components/Bits";
import { AppShell } from "@/components/layout/AppShell";
import { useLang } from "@/lib/i18n";
import { familyMembers } from "@/lib/mock-data";

export const Route = createFileRoute("/capsules/$id/family")({
  head: () => ({
    meta: [
      { title: "বংশলতিকা — স্মৃতিচারণ | Family tree" },
      {
        name: "description",
        content: "প্রজন্ম ধরে সাজানো পরিবারের বংশলতিকা — প্রতিটি সদস্যের স্মৃতির সঙ্গে জোড়া।",
      },
      { property: "og:title", content: "বংশলতিকা — স্মৃতিচারণ" },
      {
        property: "og:description",
        content: "পরিবারের সবাই এক ছবিতে।",
      },
    ],
  }),
  component: FamilyTreePage,
});

function FamilyTreePage() {
  const { id } = Route.useParams();
  const { t, lang } = useLang();
  const [zoom, setZoom] = useState(1);
  const [selected, setSelected] = useState(familyMembers[0]!);

  const gens = [0, 1, 2];

  return (
    <AppShell>
      <PageHeader
        titleKey="family"
        subtitle={t("tagline")}
        action={
          <div className="flex gap-2">
            <button
              onClick={() => setZoom((z) => Math.min(1.4, z + 0.1))}
              aria-label={t("zoomIn")}
              className="rounded-md border border-border bg-card p-2 transition hover:border-primary/50"
            >
              <ZoomIn className="size-4" aria-hidden />
            </button>
            <button
              onClick={() => setZoom((z) => Math.max(0.7, z - 0.1))}
              aria-label={t("zoomOut")}
              className="rounded-md border border-border bg-card p-2 transition hover:border-primary/50"
            >
              <ZoomOut className="size-4" aria-hidden />
            </button>
            <ActionButton variant="ghost">
              <Download className="size-4" aria-hidden /> {t("export")}
            </ActionButton>
            <ActionButton>
              <Plus className="size-4" aria-hidden /> {t("addMember")}
            </ActionButton>
          </div>
        }
      />
      <CapsuleTabs id={id} />

      <div className="grid gap-5 lg:grid-cols-[1fr_300px]">
        <div className="overflow-auto rounded-lg border border-border bg-card/70 p-8 animate-unfurl">
          <div
            className="mx-auto w-fit space-y-12 transition-transform duration-500"
            style={{ transform: `scale(${zoom})` }}
          >
            {gens.map((g) => (
              <div key={g} className="relative flex justify-center gap-8">
                {familyMembers
                  .filter((m) => m.gen === g)
                  .map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setSelected(m)}
                      className={`group w-40 rounded-lg border bg-card p-4 text-center shadow-warm transition-all duration-500 hover:-translate-y-1 ${
                        selected.id === m.id ? "border-primary" : "border-border"
                      }`}
                    >
                      <span className="mx-auto mb-2 grid size-12 place-items-center rounded-full bg-gradient-to-br from-brass/40 to-primary/30 font-display text-lg text-sepia">
                        {m.name[lang].charAt(0)}
                      </span>
                      <p className="font-display text-sm">{m.name[lang]}</p>
                      <p className="text-[11px] text-muted-foreground">{m.years}</p>
                      <p className="mt-1 text-[11px] text-sepia">{m.rel[lang]}</p>
                    </button>
                  ))}
                {g < 2 && (
                  <span className="absolute -bottom-6 left-1/2 h-6 w-px bg-border" aria-hidden />
                )}
              </div>
            ))}
          </div>
        </div>

        <Panel delay={100} className="h-fit">
          <span className="mx-auto mb-3 grid size-20 place-items-center rounded-full bg-gradient-to-br from-brass/40 to-primary/30 font-display text-2xl text-sepia">
            {selected.name[lang].charAt(0)}
          </span>
          <h2 className="text-center font-display text-xl">{selected.name[lang]}</h2>
          <p className="text-center text-xs text-muted-foreground">{selected.years}</p>
          <p className="mt-1 text-center text-xs text-sepia">{selected.rel[lang]}</p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            {lang === "bn"
              ? "পরিবারের গল্পে বারবার ফিরে আসা একটি নাম — চিঠি, ছবি আর গানের ভেতর দিয়ে।"
              : "A name that keeps returning in the family's stories — through letters, photos and songs."}
          </p>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {[0, 1, 2, 3, 4, 5].map((k) => (
              <span key={k} className="aspect-square rounded-sm bg-gradient-to-br from-secondary to-muted" />
            ))}
          </div>
          <ActionButton variant="ghost">{t("save")}</ActionButton>
        </Panel>
      </div>
    </AppShell>
  );
}
