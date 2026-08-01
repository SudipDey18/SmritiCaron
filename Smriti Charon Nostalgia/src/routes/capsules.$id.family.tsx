import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Download, Plus, Trash2, ZoomIn, ZoomOut } from "lucide-react";

import { CapsuleTabs } from "./capsules.$id";
import { ActionButton, EmptyState, Field, PageHeader, Panel } from "@/components/Bits";
import { SkeletonGrid } from "@/components/common/LoadingSkeletons";
import { AppShell } from "@/components/layout/AppShell";
import { mediaUrl } from "@/lib/api/client";
import {
  useAddFamilyMember,
  useAddFamilyRelationship,
  useDeleteFamilyMember,
  useFamilyTree,
} from "@/lib/api/hooks";
import type { FamilyMember, RelationType } from "@/lib/api/types";
import { useLang } from "@/lib/i18n";

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

const relationTypes: RelationType[] = ["parent", "spouse", "sibling", "child"];

function FamilyTreePage() {
  const { id } = Route.useParams();
  const { t, lang } = useLang();
  const [zoom, setZoom] = useState(1);
  const [selected, setSelected] = useState<FamilyMember | null>(null);
  const [modal, setModal] = useState(false);
  const [relModal, setRelModal] = useState(false);

  const [name, setName] = useState("");
  const [relation, setRelation] = useState("");
  const [birthDate, setBirthDate] = useState("");

  const [fromId, setFromId] = useState("");
  const [toId, setToId] = useState("");
  const [relType, setRelType] = useState<RelationType>("parent");

  const { data, isLoading, isError } = useFamilyTree();
  const addMember = useAddFamilyMember();
  const addRelationship = useAddFamilyRelationship();
  const removeMember = useDeleteFamilyMember();

  const members = data?.members ?? [];
  const relationships = data?.relationships ?? [];

  const gens = useMemo(() => {
    const levels = new Set(members.map((m) => m.treeLevel ?? 0));
    return [...levels].sort((a, b) => a - b);
  }, [members]);

  const activeMember = selected ?? members[0] ?? null;

  async function handleAddMember() {
    if (!name) return;
    await addMember.mutateAsync({ name, relation: relation || undefined, birthDate: birthDate || undefined });
    setModal(false);
    setName("");
    setRelation("");
    setBirthDate("");
  }

  async function handleAddRelationship() {
    if (!fromId || !toId) return;
    await addRelationship.mutateAsync({ fromMemberId: fromId, toMemberId: toId, relationType: relType });
    setRelModal(false);
    setFromId("");
    setToId("");
  }

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
            <ActionButton variant="ghost" onClick={() => setRelModal(true)}>
              <Download className="size-4" aria-hidden /> {t("editRelationship")}
            </ActionButton>
            <ActionButton onClick={() => setModal(true)}>
              <Plus className="size-4" aria-hidden /> {t("addMember")}
            </ActionButton>
          </div>
        }
      />
      <CapsuleTabs id={id} />

      {isLoading && <SkeletonGrid count={6} />}
      {isError && <EmptyState />}
      {!isLoading && !isError && members.length === 0 && <EmptyState />}

      {!isLoading && !isError && members.length > 0 && (
        <div className="grid gap-5 lg:grid-cols-[1fr_300px]">
          <div className="overflow-auto rounded-lg border border-border bg-card/70 p-8 animate-unfurl">
            <div
              className="mx-auto w-fit space-y-12 transition-transform duration-500"
              style={{ transform: `scale(${zoom})` }}
            >
              {gens.map((g) => (
                <div key={g} className="relative flex flex-wrap justify-center gap-8">
                  {members
                    .filter((m) => (m.treeLevel ?? 0) === g)
                    .map((m) => (
                      <button
                        key={m.id}
                        onClick={() => setSelected(m)}
                        className={`group w-40 rounded-lg border bg-card p-4 text-center shadow-warm transition-all duration-500 hover:-translate-y-1 ${
                          activeMember?.id === m.id ? "border-primary" : "border-border"
                        }`}
                      >
                        {m.avatarUrl ? (
                          <img
                            src={mediaUrl(m.avatarUrl)}
                            alt={m.name}
                            className="mx-auto mb-2 size-12 rounded-full object-cover"
                          />
                        ) : (
                          <span className="mx-auto mb-2 grid size-12 place-items-center rounded-full bg-gradient-to-br from-brass/40 to-primary/30 font-display text-lg text-sepia">
                            {m.name.charAt(0)}
                          </span>
                        )}
                        <p className="font-display text-sm">{m.name}</p>
                        <p className="text-[11px] text-muted-foreground">
                          {m.birthDate ? new Date(m.birthDate).getFullYear() : ""}
                          {m.deathDate ? ` – ${new Date(m.deathDate).getFullYear()}` : ""}
                        </p>
                        {m.relation && <p className="mt-1 text-[11px] text-sepia">{m.relation}</p>}
                      </button>
                    ))}
                </div>
              ))}
            </div>
          </div>

          {activeMember && (
            <Panel delay={100} className="h-fit">
              {activeMember.avatarUrl ? (
                <img
                  src={mediaUrl(activeMember.avatarUrl)}
                  alt={activeMember.name}
                  className="mx-auto mb-3 size-20 rounded-full object-cover"
                />
              ) : (
                <span className="mx-auto mb-3 grid size-20 place-items-center rounded-full bg-gradient-to-br from-brass/40 to-primary/30 font-display text-2xl text-sepia">
                  {activeMember.name.charAt(0)}
                </span>
              )}
              <h2 className="text-center font-display text-xl">{activeMember.name}</h2>
              {activeMember.relation && (
                <p className="mt-1 text-center text-xs text-sepia">{activeMember.relation}</p>
              )}
              {activeMember.bio && (
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{activeMember.bio}</p>
              )}
              <p className="mt-4 text-xs uppercase tracking-widest text-muted-foreground">
                {lang === "bn" ? "সম্পর্ক" : "Relationships"}
              </p>
              <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                {relationships
                  .filter((r) => r.fromMemberId === activeMember.id || r.toMemberId === activeMember.id)
                  .map((r) => (
                    <li key={r.id}>
                      {r.fromName ?? r.fromMemberId} → {r.relationType} → {r.toName ?? r.toMemberId}
                    </li>
                  ))}
              </ul>
              <ActionButton
                variant="ghost"
                onClick={() => removeMember.mutate(activeMember.id)}
              >
                <Trash2 className="size-4" aria-hidden /> {t("del")}
              </ActionButton>
            </Panel>
          )}
        </div>
      )}

      {modal && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-foreground/60 px-4 backdrop-blur-sm"
          onClick={() => setModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md space-y-4 rounded-lg border border-border bg-card p-6 shadow-warm animate-unfurl"
          >
            <h2 className="font-display text-2xl">{t("addMember")}</h2>
            <Field label={t("subjectName")}>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </Field>
            <Field label={t("relationship")}>
              <input
                value={relation}
                onChange={(e) => setRelation(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </Field>
            <Field label={t("dob")}>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </Field>
            <div className="flex justify-end gap-2">
              <ActionButton variant="ghost" onClick={() => setModal(false)}>
                {t("cancel")}
              </ActionButton>
              <ActionButton onClick={() => void handleAddMember()}>{t("save")}</ActionButton>
            </div>
          </div>
        </div>
      )}

      {relModal && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-foreground/60 px-4 backdrop-blur-sm"
          onClick={() => setRelModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md space-y-4 rounded-lg border border-border bg-card p-6 shadow-warm animate-unfurl"
          >
            <h2 className="font-display text-2xl">{t("editRelationship")}</h2>
            <Field label={t("subjectName")}>
              <select
                value={fromId}
                onChange={(e) => setFromId(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              >
                <option value="">—</option>
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label={t("relationship")}>
              <select
                value={relType}
                onChange={(e) => setRelType(e.target.value as RelationType)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              >
                {relationTypes.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </Field>
            <Field label={t("subjectName")}>
              <select
                value={toId}
                onChange={(e) => setToId(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              >
                <option value="">—</option>
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </Field>
            <div className="flex justify-end gap-2">
              <ActionButton variant="ghost" onClick={() => setRelModal(false)}>
                {t("cancel")}
              </ActionButton>
              <ActionButton onClick={() => void handleAddRelationship()}>{t("save")}</ActionButton>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
