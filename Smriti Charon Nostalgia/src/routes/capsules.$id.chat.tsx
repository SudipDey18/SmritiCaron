import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Plus, RotateCcw, Send, Sparkles, Trash2 } from "lucide-react";

import { CapsuleTabs } from "./capsules.$id";
import { AIThinking } from "@/components/ai/AIBits";
import { CitationCard } from "@/components/ai/AIBits";
import { AppShell } from "@/components/layout/AppShell";
import { useCapsule } from "@/lib/api/hooks";
import {
  useConversation,
  useConversations,
  useCreateConversation,
  useRegenerateMessage,
  useSendMessage,
} from "@/lib/api/hooks";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/capsules/$id/chat")({
  head: () => ({
    meta: [
      { title: "AI আলাপ — স্মৃতিচারণ | Memory chat" },
      {
        name: "description",
        content:
          "সিন্দুকের স্মৃতির উপর ভিত্তি করে AI-এর সঙ্গে আলাপ করুন — প্রতিটি উত্তরে সূত্র উল্লেখ থাকে।",
      },
      { property: "og:title", content: "AI আলাপ — স্মৃতিচারণ" },
      {
        property: "og:description",
        content: "স্মৃতির সঙ্গে আবার কথা বলুন, সূত্র সহ।",
      },
    ],
  }),
  component: ChatPage,
});

function ChatPage() {
  const { id } = Route.useParams();
  const capsule = useCapsule(id);
  const { t } = useLang();

  const { data: conversations } = useConversations({ per_page: 50 });
  const scoped = (conversations?.items ?? []).filter((c) => c.capsuleId === id);

  const [activeId, setActiveId] = useState<string | undefined>(undefined);
  useEffect(() => {
    if (!activeId && scoped.length > 0) setActiveId(scoped[0]?.id);
  }, [scoped, activeId]);

  const { data: conv } = useConversation(activeId);
  const createConversation = useCreateConversation();
  const sendMessage = useSendMessage(activeId);
  const regenerate = useRegenerateMessage(activeId);

  const [draft, setDraft] = useState("");
  const [pendingText, setPendingText] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [conv?.messages, pendingText]);

  const ensureConversation = async (): Promise<string> => {
    if (activeId) return activeId;
    const created = await createConversation.mutateAsync({ capsuleId: id });
    setActiveId(created.id);
    return created.id;
  };

  const send = async (value: string) => {
    const text = value.trim();
    if (!text) return;
    setDraft("");
    setPendingText(text);
    try {
      const convId = await ensureConversation();
      await sendMessage.mutateAsync(text);
    } finally {
      setPendingText(null);
    }
  };

  const messages = conv?.messages ?? [];

  return (
    <AppShell>
      <CapsuleTabs id={id} />
      <div className="grid gap-5 lg:grid-cols-[240px_1fr]">
        <aside className="h-fit rounded-lg border border-border bg-card/80 p-4 animate-rise">
          <button
            onClick={() => setActiveId(undefined)}
            className="mb-4 flex w-full items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground transition hover:lamp-glow"
          >
            <Plus className="size-4" aria-hidden /> {t("newChat")}
          </button>
          <p className="mb-2 text-[11px] uppercase tracking-widest text-muted-foreground">
            {t("sessions")}
          </p>
          <ul className="space-y-1">
            {scoped.map((s) => (
              <li key={s.id}>
                <button
                  onClick={() => setActiveId(s.id)}
                  className={`w-full rounded-md px-3 py-2 text-left text-sm transition hover:bg-secondary/60 ${
                    activeId === s.id ? "bg-secondary/70" : ""
                  }`}
                >
                  {s.title ?? t("newChat")}
                  <span className="block text-[11px] text-muted-foreground">
                    {new Date(s.updatedAt).toLocaleDateString()}
                  </span>
                </button>
              </li>
            ))}
          </ul>
          {activeId && (
            <button
              onClick={() => setActiveId(undefined)}
              className="mt-4 flex w-full items-center gap-2 rounded-md border border-border px-3 py-2 text-xs text-muted-foreground transition hover:border-destructive/50 hover:text-destructive"
            >
              <Trash2 className="size-3.5" aria-hidden /> {t("clearHistory")}
            </button>
          )}
        </aside>

        <section className="flex min-h-[70vh] flex-col rounded-lg border border-border bg-card/80 animate-unfurl">
          <header className="flex items-center gap-2 border-b border-border px-5 py-3 text-sm text-muted-foreground">
            <Sparkles className="size-4 text-brass" aria-hidden /> {t("chattingWith")}{" "}
            <span className="font-display text-foreground">{capsule.data?.title ?? "…"}</span>
          </header>

          <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-5 py-6">
            {messages.length === 0 && !pendingText && (
              <div className="mx-auto max-w-md text-center">
                <p className="font-display text-lg">{t("askSomething")}</p>
              </div>
            )}
            {messages.map((m, i) => (
              <div
                key={m.id}
                className={`flex animate-rise ${m.role === "USER" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-3 text-sm leading-relaxed ${
                    m.role === "USER"
                      ? "bg-primary text-primary-foreground"
                      : "border border-border bg-background"
                  }`}
                >
                  {m.content}
                  {m.citations && m.citations.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {m.citations.map((c, ci) => (
                        <CitationCard key={c.memoryId} label={`${t("basedOn")} ${c.title ?? c.snippet}`} index={ci} />
                      ))}
                    </div>
                  )}
                  {m.role === "ASSISTANT" && i === messages.length - 1 && (
                    <button
                      type="button"
                      onClick={() => regenerate.mutate()}
                      disabled={regenerate.isPending}
                      className="mt-3 inline-flex items-center gap-1.5 text-[11px] text-muted-foreground transition hover:text-primary disabled:opacity-50"
                    >
                      <RotateCcw className="size-3" aria-hidden /> {t("regenerate")}
                    </button>
                  )}
                </div>
              </div>
            ))}
            {pendingText && (
              <div className="flex justify-end animate-rise">
                <div className="max-w-[80%] rounded-lg bg-primary/70 px-4 py-3 text-sm leading-relaxed text-primary-foreground">
                  {pendingText}
                </div>
              </div>
            )}
            {(sendMessage.isPending || createConversation.isPending) && (
              <AIThinking />
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              void send(draft);
            }}
            className="flex items-end gap-3 border-t border-border px-5 py-4"
          >
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              rows={1}
              maxLength={500}
              placeholder={t("askSomething")}
              className="max-h-32 flex-1 resize-none rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/30"
            />
            <span className="pb-2 text-[11px] text-muted-foreground">{draft.length}/500</span>
            <button
              type="submit"
              disabled={sendMessage.isPending}
              className="grid size-10 shrink-0 place-items-center rounded-md bg-primary text-primary-foreground transition hover:lamp-glow disabled:opacity-60"
              aria-label={t("chat")}
            >
              <Send className="size-4" aria-hidden />
            </button>
          </form>
        </section>
      </div>
    </AppShell>
  );
}
