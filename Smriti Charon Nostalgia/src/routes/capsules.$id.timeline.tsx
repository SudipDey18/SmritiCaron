import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";

import { CapsuleTabs } from "./capsules.$id";
import { ActionButton, EmptyState, Field, PageHeader } from "@/components/Bits";
import { SkeletonList } from "@/components/common/LoadingSkeletons";
import { AppShell } from "@/components/layout/AppShell";
import { useCreateTimelineEvent, useDeleteTimelineEvent, useTimeline } from "@/lib/api/hooks";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/capsules/$id/timeline")({
  head: () => ({
    meta: [
      { title: "জীবনরেখা — স্মৃতিচারণ | Life timeline" },
      {
        name: "description",
        content: "জন্ম থেকে শেষ শীত — বছরের পর বছর সাজানো একটি জীবনের ঘটনাপ্রবাহ।",
      },
      { property: "og:title", content: "জীবনরেখা — স্মৃতিচারণ" },
      {
        property: "og:description",
        content: "এক জীবনের গল্প, বছরের পর বছর।",
      },
    ],
  }),
  component: TimelinePage,
});

function TimelinePage() {
  const { id } = Route.useParams();
  const { t } = useLang();
  const [modal, setModal] = useState(false);
  const [title, setTitle] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [description, setDescription] = useState("");

  const { data: events, isLoading, isError } = useTimeline(id);
  const createEvent = useCreateTimelineEvent(id);
  const deleteEvent = useDeleteTimelineEvent(id);

  const groups = useMemo(() => {
    const list = [...(events ?? [])].sort(
      (a, b) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime(),
    );
    const byYear = new Map<number, typeof list>();
    for (const e of list) {
      const y = e.year ?? new Date(e.eventDate).getFullYear();
      const arr = byYear.get(y) ?? [];
      arr.push(e);
      byYear.set(y, arr);
    }
    return [...byYear.entries()].sort((a, b) => b[0] - a[0]);
  }, [events]);

  async function handleSave() {
    if (!title || !eventDate) return;
    await createEvent.mutateAsync({ capsuleId: id, title, eventDate, description: description || undefined });
    setModal(false);
    setTitle("");
    setEventDate("");
    setDescription("");
  }

  return (
    <AppShell>
      <PageHeader
        titleKey="timeline"
        subtitle={t("tagline")}
        action={
          <ActionButton onClick={() => setModal(true)}>
            <Plus className="size-4" aria-hidden /> {t("addEvent")}
          </ActionButton>
        }
      />
      <CapsuleTabs id={id} />

      {isLoading && <SkeletonList count={5} />}
      {isError && <EmptyState />}
      {!isLoading && !isError && groups.length === 0 && <EmptyState />}

      {!isLoading && !isError && groups.length > 0 && (
        <ol className="relative ml-4 border-l border-dashed border-border pl-8">
          {groups.map(([year, items], gi) => (
            <li key={year} className="mb-8">
              <p className="mb-2 font-display text-sm text-primary">{year}</p>
              {items.map((e, i) => (
                <div
                  key={e.id}
                  style={{ animationDelay: `${(gi + i) * 90}ms` }}
                  className="group relative mb-4 animate-rise"
                >
                  <span className="absolute -left-[42px] top-0 grid size-8 place-items-center rounded-full border border-brass/60 bg-card font-display text-[10px] text-sepia transition-transform duration-500 group-hover:scale-110">
                    ❦
                  </span>
                  <div className="rounded-lg border border-border bg-card/85 p-5 shadow-warm transition-transform duration-500 group-hover:-translate-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-display text-xl">{e.title}</h3>
                      <button
                        type="button"
                        aria-label={t("del")}
                        onClick={() => deleteEvent.mutate(e.id)}
                        className="text-muted-foreground transition hover:text-destructive"
                      >
                        <Trash2 className="size-4" aria-hidden />
                      </button>
                    </div>
                    {e.description && (
                      <p className="mt-1 text-sm text-muted-foreground">{e.description}</p>
                    )}
                    <p className="mt-2 text-xs uppercase tracking-widest text-sepia">
                      {new Date(e.eventDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </li>
          ))}
        </ol>
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
            <h2 className="font-display text-2xl">{t("addEvent")}</h2>
            <Field label={t("title")}>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </Field>
            <Field label={t("date")}>
              <input
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </Field>
            <Field label={t("description")}>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </Field>
            <div className="flex justify-end gap-2">
              <ActionButton variant="ghost" onClick={() => setModal(false)}>
                {t("cancel")}
              </ActionButton>
              <ActionButton onClick={() => void handleSave()}>{t("save")}</ActionButton>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
