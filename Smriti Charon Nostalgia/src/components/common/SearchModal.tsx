import { Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Archive,
  Clock,
  Image as ImageIcon,
  Mail,
  Search,
  Sparkles,
  TreeDeciduous,
} from "lucide-react";

import { Modal } from "./Modal";
import { AIThinking } from "@/components/ai/AIBits";
import { useLang } from "@/lib/i18n";
import { useCapsules, useMemorySearch } from "@/lib/api/hooks";
type Group = "capsules" | "memories" | "people" | "timeline" | "family" | "letters" | "vaults";

export type Hit = {
  id: string;
  group: Group;
  label: string;
  sub?: string;
  to?: string;
  params?: Record<string, string>;
  score?: number;
  thumbnailUrl?: string | null;
  type?: string;
};

const groupIcon: Record<Group, typeof Search> = {
  capsules: Archive,
  memories: ImageIcon,
  people: TreeDeciduous,
  timeline: Clock,
  family: TreeDeciduous,
  letters: Mail,
  vaults: Sparkles,
};

function useDebounced<T>(value: T, delay = 350) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setV(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return v;
}

/** Live hits from the API: capsules by title + semantic memory search. */
export function useGlobalHits(q: string, capsuleId?: string) {
  const query = useDebounced(q.trim());
  const enabled = query.length > 1;

  const capsulesQuery = useCapsules({ search: query, per_page: 5 }, { enabled });
  const memoriesQuery = useMemorySearch(
    capsuleId ? { q: query, capsuleId, per_page: 20 } : { q: query, per_page: 20 },
    { enabled },
  );

  const hits = useMemo<Hit[]>(() => {
    if (!enabled) return [];
    const capsuleHits: Hit[] = (capsulesQuery.data?.items ?? []).map((c) => ({
      id: `c-${c.id}`,
      group: "capsules",
      label: c.title,
      ...(c.description ? { sub: c.description } : {}),
      to: "/capsules/$id",
      params: { id: c.id },
    }));
    const memoryHits: Hit[] = (memoriesQuery.data?.items ?? []).map((m) => {
      const target = m.capsuleId ?? capsuleId;
      return {
        id: `m-${m.memoryId}`,
        group: "memories" as Group,
        label: m.title ?? m.snippet.slice(0, 60),
        sub: [m.memoryDate?.slice(0, 10), m.snippet].filter(Boolean).join(" · "),
        score: m.score,
        thumbnailUrl: m.thumbnailUrl,
        type: m.type,
        ...(target ? { to: "/capsules/$id/memories", params: { id: target } } : {}),
      };
    });
    return [...capsuleHits, ...memoryHits];
  }, [enabled, capsulesQuery.data, memoriesQuery.data, capsuleId]);

  return {
    hits,
    loading: enabled && (capsulesQuery.isLoading || memoriesQuery.isLoading),
    isFetching: capsulesQuery.isFetching || memoriesQuery.isFetching,
    enabled,
    error: memoriesQuery.error ?? capsulesQuery.error ?? null,
  };
}

export function HitList({ hits, onNavigate }: { hits: Hit[]; onNavigate?: () => void }) {
  const { t } = useLang();
  if (!hits.length) {
    return <p className="px-4 py-8 text-center text-sm text-muted-foreground">{t("noResults")}</p>;
  }
  return (
    <ul className="divide-y divide-border">
      {hits.map((h, i) => {
        const Icon = groupIcon[h.group];
        return (
          <li key={h.id} style={{ animationDelay: `${i * 40}ms` }} className="animate-rise">
            <Link
              to={h.to ?? "/dashboard"}
              params={h.params}
              onClick={onNavigate}
              className="flex items-center gap-3 px-4 py-2.5 text-sm transition hover:bg-secondary/50"
            >
              <Icon className="size-4 shrink-0 text-primary/80" aria-hidden />
              <span className="min-w-0 flex-1">
                <span className="block truncate">{h.label}</span>
                {h.sub && (
                  <span className="block truncate text-xs text-muted-foreground">{h.sub}</span>
                )}
              </span>
              <span className="shrink-0 text-[10px] uppercase tracking-widest text-sepia">
                {t(h.group)}
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

/** ⌘K / Ctrl+K global command palette + natural-language search. */
export function SearchModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useLang();
  const [q, setQ] = useState("");
  const { hits, loading } = useGlobalHits(q);
  const thinking = loading;

  return (
    <Modal open={open} onClose={onClose} title={t("globalSearch")} wide>
      <div className="flex items-center gap-3 rounded-md border border-input bg-background px-3 py-2 focus-within:border-primary">
        <Search className="size-4 text-muted-foreground" aria-hidden />
        <input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t("naturalSearch")}
          aria-label={t("globalSearch")}
          className="w-full bg-transparent text-sm outline-none"
        />
        <kbd className="hidden rounded border border-border px-1.5 py-0.5 text-[10px] text-muted-foreground sm:block">
          esc
        </kbd>
      </div>
      {thinking && (
        <div className="mt-4">
          <AIThinking />
        </div>
      )}
      <div className="scroll-alpona mt-4 max-h-80 overflow-y-auto rounded-lg border border-border">
        <HitList hits={hits} onNavigate={onClose} />
      </div>
    </Modal>
  );
}

/** Hook that wires the ⌘K shortcut for the palette. */
export function useCommandPalette() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  return { open, setOpen };
}
