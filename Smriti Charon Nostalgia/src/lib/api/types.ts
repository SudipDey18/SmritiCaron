/** Types mirroring the Smritocharon backend API (see API reference). */

export type Language = "bn" | "en";
export type Theme = "light" | "dark" | "sepia";

export type MemoryType =
  | "PHOTO"
  | "VIDEO"
  | "AUDIO"
  | "DOCUMENT"
  | "JOURNAL"
  | "NOTE"
  | "LINK";
export type MediaKind = "PHOTO" | "VIDEO" | "AUDIO" | "DOCUMENT";
export type ProcessingStatus = "PENDING" | "PROCESSING" | "READY" | "FAILED";
export type CapsuleStatus = "ACTIVE" | "ARCHIVED" | "LOCKED";
export type Privacy = "PRIVATE" | "FAMILY" | "PUBLIC";
export type ChatRole = "USER" | "ASSISTANT" | "SYSTEM";
export type VaultStatus = "LOCKED" | "UNLOCKED" | "RELEASED" | "CANCELLED";
export type LetterStatus = "DRAFT" | "SCHEDULED" | "SENT" | "DELIVERED" | "FAILED";
export type SharePermission = "VIEW" | "COMMENT" | "EDIT";
export type ShareTargetType = "CAPSULE" | "MEMORY" | "TIMELINE" | "TREE" | "LETTER";
export type RelationType = "parent" | "spouse" | "sibling" | "child";

export type Paginated<T> = {
  items: T[];
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
};

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  role: string;
  avatarUrl: string | null;
  language: Language;
  isEmailVerified: boolean;
};

export type AuthTokens = { accessToken: string; refreshToken: string };
export type AuthResult = { user: AuthUser; tokens: AuthTokens };

export type Profile = {
  id: string;
  email: string;
  name: string;
  bio: string | null;
  avatarUrl: string | null;
  coverUrl: string | null;
  role: string;
  language: Language;
  locale: string | null;
  timezone: string | null;
  theme: string | null;
  isEmailVerified: boolean;
  createdAt: string;
  lastLoginAt: string | null;
  storageBytes: number;
  unreadNotifications: number;
};

export type Capsule = {
  id: string;
  ownerId: string;
  title: string;
  description: string | null;
  coverUrl: string | null;
  coverColor: string | null;
  theme: string | null;
  privacy: Privacy;
  status: CapsuleStatus;
  relation: string | null;
  tags: string[];
  isFavorite: boolean;
  unlockDate: string | null;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  _count?: { memories?: number };
};

export type Media = {
  id: string;
  memoryId: string;
  kind: MediaKind;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  thumbnailUrl: string | null;
  width: number | null;
  height: number | null;
  durationMs: number | null;
  ocrText: string | null;
  caption: string | null;
  transcription: string | null;
  transcriptLang: string | null;
  language: string | null;
  processingStatus: ProcessingStatus;
  error: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Memory = {
  id: string;
  capsuleId: string;
  ownerId: string;
  type: MemoryType;
  title: string | null;
  description: string | null;
  content: string | null;
  location: string | null;
  memoryDate: string | null;
  year: number | null;
  tags: string[];
  language: string | null;
  processing: ProcessingStatus;
  isFavorite: boolean;
  viewCount: number;
  metadata?: { summary?: string; translation?: string; emotion?: string } | null;
  createdAt: string;
  updatedAt: string;
  media?: Media[];
};

export type SearchResult = {
  memoryId: string;
  /** Optional: lets the UI deep-link a hit to its capsule. */
  capsuleId?: string;
  title: string | null;
  type: MemoryType;
  snippet: string;
  score: number;
  memoryDate: string | null;
  thumbnailUrl: string | null;
};

export type DashboardSummary = {
  capsuleCount: number;
  memoryCount: number;
  photoCount: number;
  videoCount: number;
  audioCount: number;
  documentCount: number;
  favoriteCount: number;
  storageBytes: number;
  storageHuman: string;
  storageQuotaBytes: number;
  storageUsagePercent: number;
  chatCount: number;
  vaultCount: number;
  recentMemories: {
    id: string;
    capsuleId: string;
    type: MemoryType;
    title: string | null;
    memoryDate: string | null;
    thumbnailUrl: string | null;
    createdAt: string;
  }[];
  memoriesByMonth: { month: string; count: number }[];
};

export type ActivityItem = {
  id: string;
  type: string;
  message: string;
  metadata?: Record<string, unknown> | null;
  createdAt: string;
};

export type TimelineEvent = {
  id: string;
  capsuleId: string;
  memoryId: string | null;
  userId: string;
  title: string;
  description: string | null;
  eventDate: string;
  type: string | null;
  icon: string | null;
  color: string | null;
  year: number | null;
  order: number;
  createdAt: string;
};

export type FamilyMember = {
  id: string;
  userId: string;
  name: string;
  relation: string | null;
  gender: string | null;
  birthDate: string | null;
  deathDate: string | null;
  avatarUrl: string | null;
  bio: string | null;
  isDeceased: boolean;
  treeLevel: number;
  createdAt: string;
  updatedAt: string;
};

export type FamilyRelationship = {
  id: string;
  fromMemberId: string;
  toMemberId: string;
  relationType: RelationType;
  fromName?: string;
  toName?: string;
};

export type FamilyTree = {
  members: FamilyMember[];
  relationships: FamilyRelationship[];
};

export type ChatConversation = {
  id: string;
  userId: string;
  capsuleId: string | null;
  title: string | null;
  language: Language;
  createdAt: string;
  updatedAt: string;
};

export type ChatCitation = {
  memoryId: string;
  title: string | null;
  type: MemoryType;
  snippet: string;
  date: string | null;
};

export type ChatMessage = {
  id: string;
  conversationId: string;
  role: ChatRole;
  content: string;
  language: Language | null;
  citations: ChatCitation[] | null;
  sources: { memoryId: string; score: number }[] | null;
  tokensUsed: number | null;
  createdAt: string;
};

export type VaultItem = {
  id: string;
  vaultId: string;
  type: MediaKind | null;
  title: string | null;
  content: string | null;
  fileUrl: string | null;
  mimeType: string | null;
  size: number | null;
  memoryId: string | null;
};

export type TimeVault = {
  id: string;
  userId: string;
  capsuleId: string | null;
  title: string;
  description: string | null;
  unlockDate: string;
  status: VaultStatus;
  coverUrl: string | null;
  coverColor: string | null;
  isReleased: boolean;
  releasedAt: string | null;
  createdAt: string;
  updatedAt: string;
  unlocked?: boolean;
  items?: VaultItem[];
};

export type LegacyLetter = {
  id: string;
  userId: string;
  capsuleId: string | null;
  recipientName: string;
  recipientEmail: string | null;
  recipientRelation: string | null;
  subject: string;
  body: string;
  deliveryDate: string | null;
  status: LetterStatus;
  isPublic: boolean;
  deliveredAt: string | null;
  error: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ShareLink = {
  id: string;
  token: string;
  targetType: ShareTargetType;
  targetId: string;
  capsuleId: string | null;
  createdBy: string;
  permission: SharePermission;
  expiresAt: string | null;
  maxViews: number | null;
  views: number;
  isActive: boolean;
  createdAt: string;
  lastAccessedAt: string | null;
  url?: string;
};

export type SharedAccess = {
  id: string;
  capsuleId: string;
  userId: string | null;
  email: string | null;
  permission: SharePermission;
  status: "PENDING" | "ACCEPTED" | "REVOKED";
  createdAt: string;
};

export type SharedTarget = {
  link: { permission: SharePermission; targetType: ShareTargetType };
  target: unknown;
};

export type Settings = Record<string, string>;

export type Notification = {
  id: string;
  type: string;
  title: string;
  body: string | null;
  data?: Record<string, unknown> | null;
  readAt: string | null;
  createdAt: string;
};

export type StorageUsage = {
  totalBytes: number;
  photoBytes: number;
  videoBytes: number;
  audioBytes: number;
  documentBytes: number;
  fileCount: number;
  byKind: unknown[];
  quota: number;
  quotaHuman?: string;
  usagePercent: number;
};

export type UploadResult = {
  mediaId: string;
  memoryId: string;
  url: string;
  kind: MediaKind;
  processing: ProcessingStatus;
};
