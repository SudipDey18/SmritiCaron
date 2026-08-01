import { api } from "./client";
import type {
  ActivityItem,
  AuthResult,
  Capsule,
  CapsuleStatus,
  ChatConversation,
  ChatMessage,
  DashboardSummary,
  FamilyMember,
  FamilyRelationship,
  FamilyTree,
  Language,
  LegacyLetter,
  LetterStatus,
  Media,
  Memory,
  MemoryType,
  Notification,
  Paginated,
  Privacy,
  Profile,
  SearchResult,
  Settings,
  ShareLink,
  SharePermission,
  ShareTargetType,
  SharedAccess,
  SharedTarget,
  StorageUsage,
  TimeVault,
  TimelineEvent,
  UploadResult,
} from "./types";

type Page = { page?: number | undefined; per_page?: number | undefined };

export const authApi = {
  register: (body: { email: string; password: string; name: string; language?: Language | undefined }) =>
    api<AuthResult>("/api/auth/register", { method: "POST", body, auth: false }),
  login: (body: { email: string; password: string }) =>
    api<AuthResult>("/api/auth/login", { method: "POST", body, auth: false }),
  logout: (refreshToken?: string | null) =>
    api<void>("/api/auth/logout", {
      method: "POST",
      body: refreshToken ? { refreshToken } : {},
      auth: false,
    }),
  verifyEmail: (token: string) =>
    api<{ verified: boolean }>("/api/auth/verify-email", {
      method: "POST",
      body: { token },
      auth: false,
    }),
  forgotPassword: (email: string) =>
    api<{ sent: boolean }>("/api/auth/forgot-password", {
      method: "POST",
      body: { email },
      auth: false,
    }),
  resetPassword: (body: { token: string; password: string }) =>
    api<{ reset: boolean }>("/api/auth/reset-password", { method: "POST", body, auth: false }),
  changePassword: (body: { currentPassword: string; newPassword: string }) =>
    api<{ changed: boolean }>("/api/auth/change-password", { method: "POST", body }),
};

export const usersApi = {
  me: () => api<Profile>("/api/users/me"),
  update: (body: Partial<Pick<Profile, "name" | "bio" | "language" | "locale" | "timezone" | "theme">>) =>
    api<Partial<Profile>>("/api/users/me", { method: "PUT", body }),
  uploadAvatar: (file: File) => {
    const form = new FormData();
    form.append("avatar", file);
    return api<{ avatarUrl: string }>("/api/users/me/avatar", { method: "POST", form });
  },
  remove: (password: string) =>
    api<{ deleted: boolean }>("/api/users/me", { method: "DELETE", body: { password } }),
};

export const dashboardApi = {
  summary: () => api<DashboardSummary>("/api/dashboard/summary"),
  recentActivity: () => api<{ items: ActivityItem[] }>("/api/dashboard/recent-activity"),
};

export type CapsuleInput = {
  title: string;
  description?: string | undefined;
  coverColor?: string | undefined;
  privacy?: Privacy | undefined;
  relation?: string | undefined;
  tags?: string[] | undefined;
  theme?: string | undefined;
  unlockDate?: string | undefined;
};

export const capsulesApi = {
  list: (query: Page & { search?: string | undefined; status?: CapsuleStatus | undefined; favorite?: "true" | "false" | undefined } = {}) =>
    api<Paginated<Capsule>>("/api/capsules", { query }),
  get: (id: string) => api<Capsule>(`/api/capsules/${id}`),
  create: (body: CapsuleInput) => api<Capsule>("/api/capsules", { method: "POST", body }),
  update: (
    id: string,
    body: Partial<CapsuleInput> & { coverUrl?: string | undefined; isFavorite?: boolean | undefined; status?: CapsuleStatus | undefined },
  ) => api<Capsule>(`/api/capsules/${id}`, { method: "PUT", body }),
  remove: (id: string) => api<void>(`/api/capsules/${id}`, { method: "DELETE" }),
  toggleFavorite: (id: string) => api<Capsule>(`/api/capsules/${id}/favorite`, { method: "PATCH" }),
};

export type MemoryInput = {
  capsuleId: string;
  type: MemoryType;
  title?: string | undefined;
  description?: string | undefined;
  content?: string | undefined;
  location?: string | undefined;
  memoryDate?: string | undefined;
  tags?: string[] | undefined;
  language?: Language | undefined;
};

export const memoriesApi = {
  byCapsule: (capsuleId: string, query: Page & { type?: MemoryType | undefined; search?: string | undefined } = {}) =>
    api<Paginated<Memory>>(`/api/memories/capsule/${capsuleId}`, { query }),
  search: (query: { q: string; capsuleId?: string | undefined } & Page) =>
    api<Paginated<SearchResult>>("/api/memories/search", { query }),
  get: (id: string) => api<Memory>(`/api/memories/${id}`),
  create: (body: MemoryInput) => api<Memory>("/api/memories", { method: "POST", body }),
  update: (id: string, body: Partial<Omit<MemoryInput, "capsuleId" | "type">> & { isFavorite?: boolean | undefined }) =>
    api<Memory>(`/api/memories/${id}`, { method: "PUT", body }),
  remove: (id: string) => api<void>(`/api/memories/${id}`, { method: "DELETE" }),
  toggleFavorite: (id: string) => api<Memory>(`/api/memories/${id}/favorite`, { method: "PATCH" }),
  analyzeEmotion: (id: string) =>
    api<{ emotion: string }>(`/api/memories/${id}/analyze-emotion`, { method: "POST" }),
};

export const uploadsApi = {
  toCapsule: (
    capsuleId: string,
    files: File[],
    query: { title?: string | undefined; description?: string | undefined; memoryDate?: string | undefined } = {},
  ) => {
    const form = new FormData();
    files.forEach((f) => form.append("files", f));
    return api<{ items: UploadResult[]; count: number }>(`/api/uploads/capsule/${capsuleId}`, {
      method: "POST",
      form,
      query,
    });
  },
  single: (
    capsuleId: string,
    file: File,
    query: { title?: string | undefined; description?: string | undefined; memoryDate?: string | undefined } = {},
  ) => {
    const form = new FormData();
    form.append("file", file);
    return api<UploadResult>(`/api/uploads/capsule/${capsuleId}/single`, {
      method: "POST",
      form,
      query,
    });
  },
  cover: (capsuleId: string, file: File) => {
    const form = new FormData();
    form.append("cover", file);
    return api<{ coverUrl: string }>(`/api/uploads/cover/${capsuleId}`, { method: "POST", form });
  },
};

export const mediaApi = {
  get: (id: string) => api<Media>(`/api/media/id/${id}`),
  byMemory: (memoryId: string) => api<Media[]>(`/api/media/memory/${memoryId}`),
};

export type TimelineInput = {
  capsuleId: string;
  title: string;
  description?: string | undefined;
  eventDate: string;
  memoryId?: string | undefined;
  type?: string | undefined;
  icon?: string | undefined;
  color?: string | undefined;
};

export const timelineApi = {
  byCapsule: (capsuleId: string) => api<TimelineEvent[]>(`/api/timeline/capsule/${capsuleId}`),
  create: (body: TimelineInput) => api<TimelineEvent>("/api/timeline", { method: "POST", body }),
  update: (id: string, body: Partial<Omit<TimelineInput, "capsuleId">>) =>
    api<TimelineEvent>(`/api/timeline/${id}`, { method: "PUT", body }),
  remove: (id: string) => api<void>(`/api/timeline/${id}`, { method: "DELETE" }),
};

export type FamilyMemberInput = {
  name: string;
  relation?: string | undefined;
  gender?: string | undefined;
  birthDate?: string | undefined;
  deathDate?: string | null | undefined;
  avatarUrl?: string | null | undefined;
  bio?: string | undefined;
  isDeceased?: boolean | undefined;
  treeLevel?: number | undefined;
};

export const familyApi = {
  tree: () => api<FamilyTree>("/api/family/tree"),
  addMember: (body: FamilyMemberInput) =>
    api<FamilyMember>("/api/family/members", { method: "POST", body }),
  updateMember: (id: string, body: Partial<FamilyMemberInput>) =>
    api<FamilyMember>(`/api/family/members/${id}`, { method: "PUT", body }),
  removeMember: (id: string) => api<void>(`/api/family/members/${id}`, { method: "DELETE" }),
  addRelationship: (body: Pick<FamilyRelationship, "fromMemberId" | "toMemberId" | "relationType">) =>
    api<FamilyRelationship>("/api/family/relationships", { method: "POST", body }),
  removeRelationship: (id: string) =>
    api<void>(`/api/family/relationships/${id}`, { method: "DELETE" }),
};

export const chatApi = {
  list: (query: Page = {}) => api<Paginated<ChatConversation>>("/api/chat", { query }),
  create: (body: { capsuleId?: string | undefined; title?: string | undefined; language?: Language | undefined }) =>
    api<ChatConversation>("/api/chat", { method: "POST", body }),
  get: (id: string) =>
    api<{ conversation: ChatConversation; messages: ChatMessage[] }>(`/api/chat/${id}`),
  send: (id: string, content: string) =>
    api<{ userMessage: ChatMessage; assistantMessage: ChatMessage }>(`/api/chat/${id}/messages`, {
      method: "POST",
      body: { content },
    }),
  regenerate: (id: string) =>
    api<{ message: ChatMessage }>(`/api/chat/${id}/regenerate`, { method: "POST" }),
  remove: (id: string) => api<void>(`/api/chat/${id}`, { method: "DELETE" }),
};

export type VaultItemInput = {
  type?: "PHOTO" | "VIDEO" | "AUDIO" | "DOCUMENT" | undefined;
  title?: string | undefined;
  content?: string | undefined;
  fileUrl?: string | undefined;
  mimeType?: string | undefined;
  size?: number | undefined;
  memoryId?: string | undefined;
};

export const vaultsApi = {
  list: (query: Page = {}) => api<Paginated<TimeVault>>("/api/vaults", { query }),
  get: (id: string) => api<TimeVault>(`/api/vaults/${id}`),
  create: (body: {
    title: string;
    description?: string | undefined;
    unlockDate: string;
    capsuleId?: string | undefined;
    coverColor?: string | undefined;
    items?: VaultItemInput[] | undefined;
  }) => api<TimeVault>("/api/vaults", { method: "POST", body }),
  update: (
    id: string,
    body: { title?: string | undefined; description?: string | undefined; unlockDate?: string | undefined; coverColor?: string | undefined },
  ) => api<TimeVault>(`/api/vaults/${id}`, { method: "PUT", body }),
  remove: (id: string) => api<void>(`/api/vaults/${id}`, { method: "DELETE" }),
  unlock: (id: string) => api<TimeVault>(`/api/vaults/${id}/unlock`, { method: "POST" }),
  cancel: (id: string) => api<TimeVault>(`/api/vaults/${id}/cancel`, { method: "POST" }),
  addItem: (id: string, body: VaultItemInput) =>
    api<TimeVault["items"]>(`/api/vaults/${id}/items`, { method: "POST", body }),
  removeItem: (id: string, itemId: string) =>
    api<void>(`/api/vaults/${id}/items/${itemId}`, { method: "DELETE" }),
};

export type LetterInput = {
  recipientName: string;
  recipientEmail?: string | undefined;
  recipientRelation?: string | undefined;
  subject: string;
  body: string;
  deliveryDate?: string | undefined;
  capsuleId?: string | undefined;
  isPublic?: boolean | undefined;
  attachmentMemoryIds?: string[] | undefined;
};

export const lettersApi = {
  list: (query: Page & { status?: LetterStatus | undefined } = {}) =>
    api<Paginated<LegacyLetter>>("/api/letters", { query }),
  get: (id: string) => api<LegacyLetter>(`/api/letters/${id}`),
  create: (body: LetterInput) => api<LegacyLetter>("/api/letters", { method: "POST", body }),
  update: (id: string, body: Partial<LetterInput>) =>
    api<LegacyLetter>(`/api/letters/${id}`, { method: "PUT", body }),
  remove: (id: string) => api<void>(`/api/letters/${id}`, { method: "DELETE" }),
};

export const shareApi = {
  resolve: (token: string) => api<SharedTarget>(`/api/share/${token}`, { auth: false }),
  createLink: (body: {
    targetType: ShareTargetType;
    targetId: string;
    capsuleId?: string | undefined;
    permission?: SharePermission | undefined;
    expiresAt?: string | undefined;
    maxViews?: number | undefined;
  }) => api<ShareLink>("/api/share/links", { method: "POST", body }),
  linksForTarget: (targetType: ShareTargetType, targetId: string) =>
    api<ShareLink[]>(`/api/share/links/target/${targetType}/${targetId}`),
  revokeLink: (id: string) => api<void>(`/api/share/links/${id}`, { method: "DELETE" }),
  accessList: (capsuleId: string) => api<SharedAccess[]>(`/api/share/capsule/${capsuleId}/access`),
  grantAccess: (body: {
    capsuleId: string;
    email?: string | undefined;
    userId?: string | undefined;
    permission?: SharePermission | undefined;
  }) => api<SharedAccess>("/api/share/access", { method: "POST", body }),
  revokeAccess: (id: string) => api<void>(`/api/share/access/${id}`, { method: "DELETE" }),
};

export const settingsApi = {
  get: () => api<Settings>("/api/settings"),
  update: (body: Record<string, string | boolean>) =>
    api<Settings>("/api/settings", { method: "PUT", body }),
  notifications: (query: Page & { unreadOnly?: "true" | "false" | undefined } = {}) =>
    api<Paginated<Notification>>("/api/settings/notifications", { query }),
  unreadCount: () => api<{ count: number }>("/api/settings/notifications/count"),
  readAll: () => api<{ read: boolean }>("/api/settings/notifications/read-all", { method: "POST" }),
  readOne: (id: string) =>
    api<{ read: boolean }>(`/api/settings/notifications/${id}/read`, { method: "POST" }),
  removeNotification: (id: string) =>
    api<{ deleted: boolean }>(`/api/settings/notifications/${id}`, { method: "DELETE" }),
};

export const activityApi = {
  list: (query: Page = {}) => api<Paginated<ActivityItem>>("/api/activity", { query }),
};

export const storageApi = {
  usage: () => api<StorageUsage>("/api/storage/usage"),
  refresh: () => api<StorageUsage>("/api/storage/usage/refresh", { method: "POST" }),
  export: () =>
    api<{ exportUrl: string; items: number; bytes: number }>("/api/storage/export", {
      method: "POST",
    }),
};

export const healthApi = {
  check: () =>
    api<{ status: string; uptime: number; timestamp: string; dependencies: Record<string, unknown> }>(
      "/api/health",
      { auth: false },
    ),
};
