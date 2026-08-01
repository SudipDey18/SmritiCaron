import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";

import {
  activityApi,
  capsulesApi,
  chatApi,
  dashboardApi,
  familyApi,
  lettersApi,
  memoriesApi,
  settingsApi,
  shareApi,
  storageApi,
  timelineApi,
  vaultsApi,
  type CapsuleInput,
  type FamilyMemberInput,
  type LetterInput,
  type MemoryInput,
  type TimelineInput,
} from "./endpoints";
import type {
  CapsuleStatus,
  LetterStatus,
  MemoryType,
  ShareTargetType,
} from "./types";

export const qk = {
  dashboard: ["dashboard", "summary"] as const,
  dashboardActivity: ["dashboard", "activity"] as const,
  capsules: (params?: unknown) => ["capsules", params ?? {}] as const,
  capsule: (id: string) => ["capsule", id] as const,
  memories: (capsuleId: string, params?: unknown) => ["memories", capsuleId, params ?? {}] as const,
  memory: (id: string) => ["memory", id] as const,
  search: (params: unknown) => ["search", params] as const,
  timeline: (capsuleId: string) => ["timeline", capsuleId] as const,
  family: ["family", "tree"] as const,
  chats: (params?: unknown) => ["chats", params ?? {}] as const,
  chat: (id: string) => ["chat", id] as const,
  vaults: (params?: unknown) => ["vaults", params ?? {}] as const,
  letters: (params?: unknown) => ["letters", params ?? {}] as const,
  notifications: (params?: unknown) => ["notifications", params ?? {}] as const,
  unread: ["notifications", "count"] as const,
  activity: (params?: unknown) => ["activity", params ?? {}] as const,
  settings: ["settings"] as const,
  storage: ["storage", "usage"] as const,
  shareLinks: (t: ShareTargetType, id: string) => ["share", "links", t, id] as const,
  shared: (token: string) => ["shared", token] as const,
};

type Opts = { enabled?: boolean };

/* ---------- dashboard ---------- */
export const useDashboard = (opts: Opts = {}) =>
  useQuery({ queryKey: qk.dashboard, queryFn: dashboardApi.summary, ...opts });

export const useRecentActivity = (opts: Opts = {}) =>
  useQuery({ queryKey: qk.dashboardActivity, queryFn: dashboardApi.recentActivity, ...opts });

/* ---------- capsules ---------- */
export const useCapsules = (
  params: { page?: number | undefined; per_page?: number | undefined; search?: string | undefined; status?: CapsuleStatus | undefined } = {},
  opts: Opts = {},
) =>
  useQuery({
    queryKey: qk.capsules(params),
    queryFn: () => capsulesApi.list(params),
    ...opts,
  });

export const useCapsule = (id: string, opts: Opts = {}) =>
  useQuery({ queryKey: qk.capsule(id), queryFn: () => capsulesApi.get(id), ...opts });

export function useCreateCapsule() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CapsuleInput) => capsulesApi.create(body),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["capsules"] });
      void qc.invalidateQueries({ queryKey: qk.dashboard });
    },
  });
}

export function useUpdateCapsule(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: Parameters<typeof capsulesApi.update>[1]) => capsulesApi.update(id, body),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: qk.capsule(id) });
      void qc.invalidateQueries({ queryKey: ["capsules"] });
    },
  });
}

export function useDeleteCapsule() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => capsulesApi.remove(id),
    onSuccess: () => void qc.invalidateQueries({ queryKey: ["capsules"] }),
  });
}

export function useToggleCapsuleFavorite() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => capsulesApi.toggleFavorite(id),
    onSuccess: (c) => {
      void qc.invalidateQueries({ queryKey: qk.capsule(c.id) });
      void qc.invalidateQueries({ queryKey: ["capsules"] });
    },
  });
}

/* ---------- memories ---------- */
export const useMemories = (
  capsuleId: string,
  params: { page?: number | undefined; per_page?: number | undefined; type?: MemoryType | undefined; search?: string | undefined } = {},
  opts: Opts = {},
) =>
  useQuery({
    queryKey: qk.memories(capsuleId, params),
    queryFn: () => memoriesApi.byCapsule(capsuleId, params),
    ...opts,
  });

export const useMemory = (id: string, opts: Opts = {}) =>
  useQuery({ queryKey: qk.memory(id), queryFn: () => memoriesApi.get(id), ...opts });

export const useMemorySearch = (
  params: { q: string; capsuleId?: string | undefined; page?: number | undefined; per_page?: number | undefined },
  opts: Opts = {},
) =>
  useQuery({
    queryKey: qk.search(params),
    queryFn: () => memoriesApi.search(params),
    ...opts,
  } as UseQueryOptions<Awaited<ReturnType<typeof memoriesApi.search>>>);

export function useCreateMemory(capsuleId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: MemoryInput) => memoriesApi.create(body),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["memories", capsuleId] });
      void qc.invalidateQueries({ queryKey: qk.timeline(capsuleId) });
      void qc.invalidateQueries({ queryKey: qk.dashboard });
    },
  });
}

export function useDeleteMemory(capsuleId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => memoriesApi.remove(id),
    onSuccess: () => void qc.invalidateQueries({ queryKey: ["memories", capsuleId] }),
  });
}

export function useToggleMemoryFavorite(capsuleId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => memoriesApi.toggleFavorite(id),
    onSuccess: (m) => {
      void qc.invalidateQueries({ queryKey: qk.memory(m.id) });
      void qc.invalidateQueries({ queryKey: ["memories", capsuleId] });
    },
  });
}

/* ---------- timeline ---------- */
export const useTimeline = (capsuleId: string, opts: Opts = {}) =>
  useQuery({
    queryKey: qk.timeline(capsuleId),
    queryFn: () => timelineApi.byCapsule(capsuleId),
    ...opts,
  });

export function useCreateTimelineEvent(capsuleId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: TimelineInput) => timelineApi.create(body),
    onSuccess: () => void qc.invalidateQueries({ queryKey: qk.timeline(capsuleId) }),
  });
}

export function useDeleteTimelineEvent(capsuleId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => timelineApi.remove(id),
    onSuccess: () => void qc.invalidateQueries({ queryKey: qk.timeline(capsuleId) }),
  });
}

/* ---------- family ---------- */
export const useFamilyTree = (opts: Opts = {}) =>
  useQuery({ queryKey: qk.family, queryFn: familyApi.tree, ...opts });

export function useAddFamilyMember() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: FamilyMemberInput) => familyApi.addMember(body),
    onSuccess: () => void qc.invalidateQueries({ queryKey: qk.family }),
  });
}

export function useDeleteFamilyMember() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => familyApi.removeMember(id),
    onSuccess: () => void qc.invalidateQueries({ queryKey: qk.family }),
  });
}

export function useAddFamilyRelationship() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: Parameters<typeof familyApi.addRelationship>[0]) =>
      familyApi.addRelationship(body),
    onSuccess: () => void qc.invalidateQueries({ queryKey: qk.family }),
  });
}

/* ---------- chat ---------- */
export const useConversations = (params: { page?: number | undefined; per_page?: number | undefined } = {}, opts: Opts = {}) =>
  useQuery({ queryKey: qk.chats(params), queryFn: () => chatApi.list(params), ...opts });

export const useConversation = (id: string | undefined, opts: Opts = {}) =>
  useQuery({
    queryKey: qk.chat(id ?? "none"),
    queryFn: () => chatApi.get(id as string),
    enabled: Boolean(id) && (opts.enabled ?? true),
  });

export function useCreateConversation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: { capsuleId?: string | undefined; title?: string | undefined; language?: "bn" | "en" | undefined }) =>
      chatApi.create(body),
    onSuccess: () => void qc.invalidateQueries({ queryKey: ["chats"] }),
  });
}

export function useSendMessage(conversationId: string | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (content: string) => chatApi.send(conversationId as string, content),
    onSuccess: () => {
      if (conversationId) void qc.invalidateQueries({ queryKey: qk.chat(conversationId) });
    },
  });
}

export function useRegenerateMessage(conversationId: string | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => chatApi.regenerate(conversationId as string),
    onSuccess: () => {
      if (conversationId) void qc.invalidateQueries({ queryKey: qk.chat(conversationId) });
    },
  });
}

/* ---------- vaults ---------- */
export const useVaults = (params: { page?: number | undefined; per_page?: number | undefined } = {}, opts: Opts = {}) =>
  useQuery({ queryKey: qk.vaults(params), queryFn: () => vaultsApi.list(params), ...opts });

export function useCreateVault() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: Parameters<typeof vaultsApi.create>[0]) => vaultsApi.create(body),
    onSuccess: () => void qc.invalidateQueries({ queryKey: ["vaults"] }),
  });
}

export function useUnlockVault() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => vaultsApi.unlock(id),
    onSuccess: () => void qc.invalidateQueries({ queryKey: ["vaults"] }),
  });
}

export function useCancelVault() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => vaultsApi.cancel(id),
    onSuccess: () => void qc.invalidateQueries({ queryKey: ["vaults"] }),
  });
}

export function useDeleteVault() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => vaultsApi.remove(id),
    onSuccess: () => void qc.invalidateQueries({ queryKey: ["vaults"] }),
  });
}

/* ---------- letters ---------- */
export const useLetters = (
  params: { page?: number | undefined; per_page?: number | undefined; status?: LetterStatus | undefined } = {},
  opts: Opts = {},
) => useQuery({ queryKey: qk.letters(params), queryFn: () => lettersApi.list(params), ...opts });

export function useCreateLetter() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: LetterInput) => lettersApi.create(body),
    onSuccess: () => void qc.invalidateQueries({ queryKey: ["letters"] }),
  });
}

export function useDeleteLetter() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => lettersApi.remove(id),
    onSuccess: () => void qc.invalidateQueries({ queryKey: ["letters"] }),
  });
}

/* ---------- notifications / activity / settings / storage ---------- */
export const useNotificationList = (
  params: { page?: number | undefined; per_page?: number | undefined; unreadOnly?: "true" | "false" | undefined } = {},
  opts: Opts = {},
) =>
  useQuery({
    queryKey: qk.notifications(params),
    queryFn: () => settingsApi.notifications(params),
    ...opts,
  });

export const useUnreadCount = (opts: Opts = {}) =>
  useQuery({
    queryKey: qk.unread,
    queryFn: settingsApi.unreadCount,
    refetchInterval: 60_000,
    ...opts,
  });

export function useMarkNotificationRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => settingsApi.readOne(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

export function useMarkAllNotificationsRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => settingsApi.readAll(),
    onSuccess: () => void qc.invalidateQueries({ queryKey: ["notifications"] }),
  });
}

export const useActivity = (params: { page?: number | undefined; per_page?: number | undefined } = {}, opts: Opts = {}) =>
  useQuery({ queryKey: qk.activity(params), queryFn: () => activityApi.list(params), ...opts });

export const useSettings = (opts: Opts = {}) =>
  useQuery({ queryKey: qk.settings, queryFn: settingsApi.get, ...opts });

export function useUpdateSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: Record<string, string | boolean>) => settingsApi.update(body),
    onSuccess: () => void qc.invalidateQueries({ queryKey: qk.settings }),
  });
}

export const useStorageUsage = (opts: Opts = {}) =>
  useQuery({ queryKey: qk.storage, queryFn: storageApi.usage, ...opts });

export function useExportData() {
  return useMutation({ mutationFn: () => storageApi.export() });
}

/* ---------- share ---------- */
export const useShareLinks = (targetType: ShareTargetType, targetId: string, opts: Opts = {}) =>
  useQuery({
    queryKey: qk.shareLinks(targetType, targetId),
    queryFn: () => shareApi.linksForTarget(targetType, targetId),
    ...opts,
  });

export function useCreateShareLink(targetType: ShareTargetType, targetId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body?: { permission?: "VIEW" | "COMMENT" | "EDIT" | undefined; expiresAt?: string | undefined; maxViews?: number | undefined }) =>
      shareApi.createLink({ targetType, targetId, ...(body ?? {}) }),
    onSuccess: () => void qc.invalidateQueries({ queryKey: qk.shareLinks(targetType, targetId) }),
  });
}

export function useRevokeShareLink(targetType: ShareTargetType, targetId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => shareApi.revokeLink(id),
    onSuccess: () => void qc.invalidateQueries({ queryKey: qk.shareLinks(targetType, targetId) }),
  });
}

export const useSharedTarget = (token: string, opts: Opts = {}) =>
  useQuery({ queryKey: qk.shared(token), queryFn: () => shareApi.resolve(token), ...opts });
