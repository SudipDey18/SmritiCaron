import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Plus, Send, Sparkles, Trash2 } from "lucide-react";

import { CapsuleTabs, useCapsule } from "./capsules.$id";
import { AppShell } from "@/components/layout/AppShell";
import { useLang } from "@/lib/i18n";
import { chatMessages, chatSessions, suggestedPrompts } from "@/lib/mock-data";

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

type Msg = {
  role: "user" | "ai";
  text: { bn: string; en: string };
  cites?: { bn: string; en: string }[];
};

function ChatPage() {
  const { id } = Route.useParams();
  const capsule = useCapsule(id);
  const { t, lang } = useLang();
  const [msgs, setMsgs] = useState<Msg[]>(chatMessages as Msg[]);
  const [draft, setDraft] = useState("");
  const [typing, setTyping] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const send = (value: string) => {
    const text = value.trim();
    if (!text) return;
    setMsgs((m) => [...m, { role: "user", text: { bn: text, en: text } }]);
    setDraft("");
    setTyping(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setTyping(false);
      setMsgs((m) => [
        ...m,
        {
          role: "ai",
          text: {
            bn: "এই সিন্দুকের স্মৃতি ঘেঁটে দেখলাম — সেই দিনের কথা চিঠিতে ও ছবিতে দুইভাবেই আছে। বিস্তারিত জানতে সূত্রগুলো দেখুন।",
            en: "I looked through this capsule — that day appears both in a letter and a photograph. See the citations for details.",
          },
          cites: [{ bn: "দিদার চিঠি", en: "Grandmother's letter" }],
        },
      ]);
    }, 1200);
  };

  return (
    <AppShell>
      <CapsuleTabs id={id} />
      <div className="grid gap-5 lg:grid-cols-[240px_1fr]">
        <aside className="h-fit rounded-lg border border-border bg-card/80 p-4 animate-rise">
          <button className="mb-4 flex w-full items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground transition hover:lamp-glow">
            <Plus className="size-4" aria-hidden /> {t("newChat")}
          </button>
          <p className="mb-2 text-[11px] uppercase tracking-widest text-muted-foreground">
            {t("sessions")}
          </p>
          <ul className="space-y-1">
            {chatSessions.map((s) => (
              <li key={s.id}>
                <button className="w-full rounded-md px-3 py-2 text-left text-sm transition hover:bg-secondary/60">
                  {s.title[lang]}
                  <span className="block text-[11px] text-muted-foreground">{s.date}</span>
                </button>
              </li>
            ))}
          </ul>
          <button
            onClick={() => setMsgs([])}
            className="mt-4 flex w-full items-center gap-2 rounded-md border border-border px-3 py-2 text-xs text-muted-foreground transition hover:border-destructive/50 hover:text-destructive"
          >
            <Trash2 className="size-3.5" aria-hidden /> {t("clearHistory")}
          </button>
        </aside>

        <section className="flex min-h-[70vh] flex-col rounded-lg border border-border bg-card/80 animate-unfurl">
          <header className="flex items-center gap-2 border-b border-border px-5 py-3 text-sm text-muted-foreground">
            <Sparkles className="size-4 text-brass" aria-hidden /> {t("chattingWith")}{" "}
            <span className="font-display text-foreground">{capsule.name[lang]}</span>
          </header>

          <div className="flex-1 space-y-4 overflow-y-auto px-5 py-6">
            {msgs.length === 0 && (
              <div className="mx-auto max-w-md text-center">
                <p className="font-display text-lg">{t("askSomething")}</p>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  {suggestedPrompts.map((p) => (
                    <button
                      key={p.en}
                      onClick={() => send(p[lang])}
                      className="rounded-full border border-border bg-background px-3 py-1.5 text-xs transition hover:border-primary/50 hover:-translate-y-0.5"
                    >
                      {p[lang]}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {msgs.map((m, i) => (
              <div
                key={i}
                className={`flex animate-rise ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-3 text-sm leading-relaxed ${
                    m.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "border border-border bg-background"
                  }`}
                >
                  {m.text[lang]}
                  {m.cites && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {m.cites.map((c) => (
                        <span
                          key={c.en}
                          className="rounded-full bg-brass/20 px-2 py-0.5 text-[11px] text-sepia"
                        >
                          {t("basedOn")} {c[lang]}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex gap-1.5 px-2">
                {[0, 1, 2].map((d) => (
                  <span
                    key={d}
                    className="size-2 animate-bounce rounded-full bg-primary/60"
                    style={{ animationDelay: `${d * 140}ms` }}
                  />
                ))}
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(draft);
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
              className="grid size-10 shrink-0 place-items-center rounded-md bg-primary text-primary-foreground transition hover:lamp-glow"
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
