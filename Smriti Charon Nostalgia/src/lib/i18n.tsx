import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Lang = "bn" | "en";

type Entry = { bn: string; en: string };

export const dict = {
  brand: { bn: "স্মৃতিচারণ", en: "Smritocharon" },
  tagline: {
    bn: "স্মৃতির সিন্দুক — প্রজন্মের পর প্রজন্ম",
    en: "A vault of memories — across generations",
  },
  heroTitle: {
    bn: "যা হারিয়ে যায়, তা এখানে থেকে যায়",
    en: "What time takes away, we keep here",
  },
  heroBody: {
    bn: "পুরোনো ছবি, চিঠি, কণ্ঠস্বর আর গল্প — সব এক জায়গায়। কৃত্রিম বুদ্ধিমত্তা সেই স্মৃতির সঙ্গে আবার আপনাকে কথা বলাবে।",
    en: "Old photographs, letters, voices and stories in one place — and an AI that lets you talk to those memories again.",
  },
  getStarted: { bn: "শুরু করুন", en: "Get started" },
  seeDemo: { bn: "ডেমো দেখুন", en: "See demo" },
  howItWorks: { bn: "কীভাবে কাজ করে", en: "How it works" },
  features: { bn: "বৈশিষ্ট্য", en: "Features" },
  testimonials: { bn: "যাঁরা বলেছেন", en: "Voices" },
  pricing: { bn: "মূল্য", en: "Pricing" },
  step1: { bn: "সিন্দুক তৈরি করুন", en: "Create a capsule" },
  step1d: {
    bn: "পরিবারের একজনের নামে একটি স্মৃতির সিন্দুক খুলুন।",
    en: "Open a memory capsule in a loved one's name.",
  },
  step2: { bn: "স্মৃতি জমা দিন", en: "Add memories" },
  step2d: {
    bn: "ছবি, ভিডিও, কণ্ঠ, চিঠি বা লেখা — যা খুশি তুলে দিন।",
    en: "Upload photos, video, audio, letters or written stories.",
  },
  step3: { bn: "স্মৃতির সঙ্গে কথা বলুন", en: "Talk to the memories" },
  step3d: {
    bn: "AI সেই স্মৃতি পড়ে উত্তর দেয় — সূত্র সহ।",
    en: "The AI answers from those memories, with citations.",
  },
  featMemories: { bn: "স্মৃতি সংগ্রহ", en: "Memory archive" },
  featMemoriesD: {
    bn: "ছবি, ভিডিও, অডিও ও নথি — আবেগের ট্যাগ সহ সাজানো।",
    en: "Photos, video, audio and documents, tagged by emotion.",
  },
  featChat: { bn: "AI আলাপ", en: "AI conversations" },
  featChatD: {
    bn: "স্মৃতির উপর ভিত্তি করে প্রশ্নের উত্তর, সূত্র উল্লেখ সহ।",
    en: "Grounded answers drawn straight from your archive.",
  },
  featTimeline: { bn: "জীবনরেখা", en: "Life timeline" },
  featTimelineD: {
    bn: "বছরের পর বছর সাজানো এক জীবনের গল্প।",
    en: "One life, laid out year by year.",
  },
  featFamily: { bn: "বংশলতিকা", en: "Family tree" },
  featFamilyD: {
    bn: "পরিবারের সকলকে এক ছবিতে বেঁধে রাখুন।",
    en: "Everyone in the family, in one living map.",
  },
  featVault: { bn: "সময়-সিন্দুক", en: "Time vault" },
  featVaultD: {
    bn: "ভবিষ্যতের কোনো দিনে খুলবে — তালাবন্ধ স্মৃতি।",
    en: "Sealed memories that unlock on a future date.",
  },
  featLegacy: { bn: "উত্তরাধিকার চিঠি", en: "Legacy letters" },
  featLegacyD: {
    bn: "প্রিয়জনের জন্য রেখে যাওয়া শেষ কথাগুলো।",
    en: "Words left behind for the people you love.",
  },
  free: { bn: "বিনামূল্যে", en: "Free" },
  pro: { bn: "প্রো", en: "Pro" },
  perMonth: { bn: "/ মাস", en: "/ month" },
  choose: { bn: "বেছে নিন", en: "Choose" },
  dashboard: { bn: "ড্যাশবোর্ড", en: "Dashboard" },
  capsules: { bn: "সিন্দুক", en: "Capsules" },
  memories: { bn: "স্মৃতি", en: "Memories" },
  upload: { bn: "আপলোড", en: "Upload" },
  chat: { bn: "আলাপ", en: "Chat" },
  timeline: { bn: "জীবনরেখা", en: "Timeline" },
  family: { bn: "বংশলতিকা", en: "Family" },
  vault: { bn: "সময়-সিন্দুক", en: "Time vault" },
  legacy: { bn: "উত্তরাধিকার", en: "Legacy" },
  profile: { bn: "প্রোফাইল", en: "Profile" },
  settings: { bn: "সেটিংস", en: "Settings" },
  signIn: { bn: "প্রবেশ করুন", en: "Sign in" },
  signUp: { bn: "নিবন্ধন", en: "Sign up" },
  signOut: { bn: "বেরিয়ে যান", en: "Sign out" },
  welcome: { bn: "স্বাগতম", en: "Welcome back" },
  newCapsule: { bn: "নতুন সিন্দুক", en: "New capsule" },
  totalMemories: { bn: "মোট স্মৃতি", en: "Total memories" },
  totalCapsules: { bn: "সিন্দুক সংখ্যা", en: "Capsules" },
  storageUsed: { bn: "ব্যবহৃত জায়গা", en: "Storage used" },
  recentActivity: { bn: "সাম্প্রতিক কাজ", en: "Recent activity" },
  upcomingVaults: { bn: "খুলবে শীঘ্রই", en: "Opening soon" },
  search: { bn: "খুঁজুন", en: "Search" },
  all: { bn: "সব", en: "All" },
  active: { bn: "সক্রিয়", en: "Active" },
  archived: { bn: "সংরক্ষিত", en: "Archived" },
  shared: { bn: "ভাগ করা", en: "Shared" },
  emptyTitle: { bn: "এখনও কিছু নেই", en: "Nothing here yet" },
  emptyBody: {
    bn: "প্রথম স্মৃতিটি যোগ করে শুরু করুন।",
    en: "Start by adding your first memory.",
  },
  create: { bn: "তৈরি করুন", en: "Create" },
  next: { bn: "পরবর্তী", en: "Next" },
  back: { bn: "পিছনে", en: "Back" },
  save: { bn: "সংরক্ষণ", en: "Save" },
  cancel: { bn: "বাতিল", en: "Cancel" },
  step: { bn: "ধাপ", en: "Step" },
  basicInfo: { bn: "মূল তথ্য", en: "Basic info" },
  personInfo: { bn: "কার স্মৃতি", en: "Whose memories" },
  capsuleSettings: { bn: "সিন্দুকের সেটিংস", en: "Capsule settings" },
  capsuleName: { bn: "সিন্দুকের নাম", en: "Capsule name" },
  description: { bn: "বিবরণ", en: "Description" },
  coverImage: { bn: "কভার ছবি", en: "Cover image" },
  privacy: { bn: "গোপনীয়তা", en: "Privacy" },
  privateOnly: { bn: "শুধু আমি", en: "Only me" },
  withFamily: { bn: "পরিবারের সঙ্গে", en: "With family" },
  subjectName: { bn: "নাম", en: "Name" },
  dob: { bn: "জন্মতারিখ", en: "Date of birth" },
  relationship: { bn: "সম্পর্ক", en: "Relationship" },
  language: { bn: "ভাষা", en: "Language" },
  aiChat: { bn: "AI আলাপ চালু", en: "Enable AI chat" },
  memoryCount: { bn: "টি স্মৃতি", en: "memories" },
  lastUpdated: { bn: "শেষ পরিবর্তন", en: "Last updated" },
  share: { bn: "ভাগ করুন", en: "Share" },
  copyLink: { bn: "লিংক কপি", en: "Copy link" },
  dangerZone: { bn: "ঝুঁকিপূর্ণ", en: "Danger zone" },
  archive: { bn: "সংরক্ষণ করুন", en: "Archive" },
  del: { bn: "মুছে ফেলুন", en: "Delete" },
  filter: { bn: "ছাঁকনি", en: "Filter" },
  sort: { bn: "সাজান", en: "Sort" },
  newest: { bn: "নতুন আগে", en: "Newest" },
  oldest: { bn: "পুরোনো আগে", en: "Oldest" },
  grid: { bn: "গ্রিড", en: "Grid" },
  list: { bn: "তালিকা", en: "List" },
  photo: { bn: "ছবি", en: "Photo" },
  video: { bn: "ভিডিও", en: "Video" },
  audio: { bn: "কণ্ঠ", en: "Audio" },
  document: { bn: "নথি", en: "Document" },
  text: { bn: "লেখা", en: "Text" },
  emotion: { bn: "আবেগ", en: "Emotion" },
  joy: { bn: "আনন্দ", en: "Joy" },
  nostalgia: { bn: "স্মৃতিমেদুর", en: "Nostalgia" },
  love: { bn: "ভালোবাসা", en: "Love" },
  sadness: { bn: "বিষাদ", en: "Sadness" },
  pride: { bn: "গর্ব", en: "Pride" },
  dropFiles: {
    bn: "ফাইল এখানে টেনে আনুন",
    en: "Drag your files here",
  },
  orBrowse: { bn: "অথবা বেছে নিন", en: "or browse" },
  queue: { bn: "অপেক্ষমাণ", en: "Upload queue" },
  title: { bn: "শিরোনাম", en: "Title" },
  date: { bn: "তারিখ", en: "Date" },
  location: { bn: "স্থান", en: "Location" },
  tags: { bn: "ট্যাগ", en: "Tags" },
  writeStory: { bn: "গল্প লিখুন", en: "Write a story" },
  submitUpload: { bn: "স্মৃতি জমা দিন", en: "Save memories" },
  sessions: { bn: "আলাপের তালিকা", en: "Sessions" },
  newChat: { bn: "নতুন আলাপ", en: "New chat" },
  clearHistory: { bn: "ইতিহাস মুছুন", en: "Clear history" },
  askSomething: { bn: "কিছু জিজ্ঞেস করুন…", en: "Ask something…" },
  basedOn: { bn: "সূত্র:", en: "Based on:" },
  chattingWith: { bn: "আলাপ চলছে:", en: "Chatting with:" },
  addEvent: { bn: "ঘটনা যোগ করুন", en: "Add event" },
  work: { bn: "কর্মজীবন", en: "Work" },
  education: { bn: "শিক্ষা", en: "Education" },
  travel: { bn: "ভ্রমণ", en: "Travel" },
  other: { bn: "অন্যান্য", en: "Other" },
  addMember: { bn: "সদস্য যোগ", en: "Add member" },
  zoomIn: { bn: "বড় করুন", en: "Zoom in" },
  zoomOut: { bn: "ছোট করুন", en: "Zoom out" },
  export: { bn: "রপ্তানি", en: "Export" },
  sealed: { bn: "তালাবন্ধ", en: "Sealed" },
  opens: { bn: "খুলবে", en: "Opens" },
  opened: { bn: "খোলা হয়েছে", en: "Opened" },
  newVault: { bn: "নতুন সময়-সিন্দুক", en: "New time vault" },
  recipient: { bn: "প্রাপক", en: "Recipient" },
  newLetter: { bn: "নতুন চিঠি", en: "New letter" },
  deliverOn: { bn: "পৌঁছবে", en: "Deliver on" },
  draft: { bn: "খসড়া", en: "Draft" },
  scheduled: { bn: "নির্ধারিত", en: "Scheduled" },
  delivered: { bn: "পৌঁছেছে", en: "Delivered" },
  displayName: { bn: "প্রদর্শিত নাম", en: "Display name" },
  email: { bn: "ইমেইল", en: "Email" },
  password: { bn: "পাসওয়ার্ড", en: "Password" },
  plan: { bn: "পরিকল্পনা", en: "Plan" },
  notifications: { bn: "বিজ্ঞপ্তি", en: "Notifications" },
  theme: { bn: "সাজ", en: "Theme" },
  sharedView: { bn: "ভাগ করা সিন্দুক", en: "Shared capsule" },
  readOnly: { bn: "শুধু পড়ার জন্য", en: "Read only" },
  footerNote: {
    bn: "স্মৃতি কখনও পুরোনো হয় না।",
    en: "Memory never grows old.",
  },

  // --- added: AI + processing ---
  aiActivity: { bn: "AI-এর সাম্প্রতিক কাজ", en: "Recent AI activity" },
  aiStatus: { bn: "AI অবস্থা", en: "AI status" },
  aiUsage: { bn: "AI ব্যবহার", en: "AI usage" },
  aiPrefs: { bn: "AI পছন্দ", en: "AI preferences" },
  aiThinking: { bn: "স্মৃতি ঘেঁটে দেখছি…", en: "Searching the memories…" },
  indexing: { bn: "সূচি তৈরি হচ্ছে", en: "AI indexing" },
  processing: { bn: "প্রক্রিয়াধীন", en: "Processing" },
  processingQueue: { bn: "প্রক্রিয়ার তালিকা", en: "Processing queue" },
  completed: { bn: "সম্পন্ন", en: "Completed" },
  failed: { bn: "ব্যর্থ", en: "Failed" },
  pending: { bn: "অপেক্ষায়", en: "Pending" },
  retry: { bn: "আবার চেষ্টা", en: "Retry" },
  summary: { bn: "সারসংক্ষেপ", en: "AI summary" },
  caption: { bn: "AI বিবরণী", en: "AI caption" },
  ocr: { bn: "লেখা শনাক্ত (OCR)", en: "OCR text" },
  transcript: { bn: "প্রতিলিপি", en: "Transcript" },
  embedding: { bn: "এমবেডিং", en: "Embedding" },
  embedded: { bn: "সূচিবদ্ধ", en: "Indexed" },
  suggestedTags: { bn: "প্রস্তাবিত ট্যাগ", en: "Suggested tags" },
  suggestedEmotion: { bn: "প্রস্তাবিত আবেগ", en: "Suggested emotion" },
  suggestedPrompt: { bn: "প্রস্তাবিত প্রশ্ন", en: "Suggested prompts" },
  relatedMemories: { bn: "সম্পর্কিত স্মৃতি", en: "Related memories" },
  citations: { bn: "সূত্র", en: "Citations" },
  duplicateWarn: { bn: "একই রকম স্মৃতি আছে", en: "Possible duplicate" },
  naturalSearch: {
    bn: "স্বাভাবিক ভাষায় খুঁজুন — “দিদার পুজোর ছবি”",
    en: "Search naturally — “grandma's puja photos”",
  },
  relevance: { bn: "প্রাসঙ্গিকতা", en: "AI relevance" },
  advancedFilters: { bn: "বিস্তারিত ছাঁকনি", en: "Advanced filters" },
  dateRange: { bn: "সময়সীমা", en: "Date range" },
  person: { bn: "ব্যক্তি", en: "Person" },
  regenerate: { bn: "আবার তৈরি করুন", en: "Regenerate" },
  copy: { bn: "কপি", en: "Copy" },
  copied: { bn: "কপি হয়েছে", en: "Copied" },
  typing: { bn: "লিখছে…", en: "Typing…" },
  rename: { bn: "নাম বদলান", en: "Rename" },
  pin: { bn: "পিন", en: "Pin" },
  pinned: { bn: "পিন করা", en: "Pinned" },

  // --- added: versions / stats / capsule ops ---
  versionHistory: { bn: "সংস্করণের ইতিহাস", en: "Version history" },
  restoreVersion: { bn: "পুরোনো সংস্করণ ফেরান", en: "Restore version" },
  restore: { bn: "ফিরিয়ে আনুন", en: "Restore" },
  duplicate: { bn: "প্রতিলিপি", en: "Duplicate" },
  statistics: { bn: "পরিসংখ্যান", en: "Statistics" },
  permissions: { bn: "অনুমতি", en: "Sharing permissions" },
  recentUploads: { bn: "সাম্প্রতিক আপলোড", en: "Recent uploads" },
  weeklySummary: { bn: "সাপ্তাহিক সারসংক্ষেপ", en: "Weekly summary" },
  storageGraph: { bn: "জায়গার ব্যবহার", en: "Storage usage" },
  countdown: { bn: "বাকি সময়", en: "Countdown" },
  unlockProgress: { bn: "খোলার প্রস্তুতি", en: "Unlock progress" },
  recipients: { bn: "প্রাপকগণ", en: "Recipients" },
  deliveryStatus: { bn: "পৌঁছনোর অবস্থা", en: "Delivery status" },
  vaultHistory: { bn: "সিন্দুকের ইতিহাস", en: "Vault history" },
  preview: { bn: "ঝলক", en: "Preview" },
  attachments: { bn: "সংযুক্তি", en: "Attachments" },
  emailStatus: { bn: "ইমেইল অবস্থা", en: "Email status" },
  deliveryTimeline: { bn: "পৌঁছনোর ধারা", en: "Delivery timeline" },

  // --- added: new surfaces ---
  notificationCenter: { bn: "বিজ্ঞপ্তি কেন্দ্র", en: "Notifications" },
  unread: { bn: "অপঠিত", en: "Unread" },
  markAllRead: { bn: "সব পড়া হিসেবে", en: "Mark all read" },
  activityLog: { bn: "কার্যবিবরণী", en: "Activity" },
  globalSearch: { bn: "সব কিছু খুঁজুন", en: "Global search" },
  results: { bn: "ফলাফল", en: "Results" },
  noResults: { bn: "কিছু পাওয়া যায়নি", en: "No results" },
  loadMore: { bn: "আরও দেখুন", en: "Load more" },
  page: { bn: "পৃষ্ঠা", en: "Page" },
  people: { bn: "মানুষজন", en: "People" },
  letters: { bn: "চিঠি", en: "Letters" },
  vaults: { bn: "সিন্দুকসমূহ", en: "Vaults" },
  shares: { bn: "ভাগ করা লিংক", en: "Shares" },
  edits: { bn: "সম্পাদনা", en: "Edits" },
  uploads: { bn: "আপলোড", en: "Uploads" },
  chats: { bn: "আলাপ", en: "Chats" },
  commandPalette: { bn: "কমান্ড প্যালেট", en: "Command palette" },

  // --- added: sharing / export / viewer ---
  passwordProtect: { bn: "পাসওয়ার্ড দিন", en: "Password protect" },
  expiry: { bn: "মেয়াদ শেষ", en: "Expiry date" },
  revoke: { bn: "বাতিল করুন", en: "Revoke link" },
  qrCode: { bn: "QR কোড", en: "QR code" },
  exportZip: { bn: "ZIP সংরক্ষণ", en: "ZIP archive" },
  exportJson: { bn: "JSON তথ্য", en: "JSON data" },
  exportMd: { bn: "Markdown", en: "Markdown" },
  exportPdf: { bn: "PDF বই", en: "PDF book" },
  download: { bn: "নামান", en: "Download" },
  rotate: { bn: "ঘোরান", en: "Rotate" },
  fullscreen: { bn: "পূর্ণ পর্দা", en: "Fullscreen" },
  metadata: { bn: "তথ্যাবলি", en: "Metadata" },
  close: { bn: "বন্ধ", en: "Close" },
  zoom: { bn: "জুম", en: "Zoom" },
  year: { bn: "বছর", en: "Year" },
  generation: { bn: "প্রজন্ম", en: "Generation" },
  editRelationship: { bn: "সম্পর্ক সম্পাদনা", en: "Edit relationship" },
  connectedMemories: { bn: "যুক্ত স্মৃতি", en: "Connected memories" },
  exportTree: { bn: "গাছ রপ্তানি (PNG)", en: "Export tree (PNG)" },
  exportAccount: { bn: "অ্যাকাউন্ট রপ্তানি", en: "Export account" },
  deleteAccount: { bn: "অ্যাকাউন্ট মুছুন", en: "Delete account" },
  confirmDelete: {
    bn: "নিশ্চিত? এটি ফেরানো যাবে না।",
    en: "Are you sure? This cannot be undone.",
  },
  confirm: { bn: "নিশ্চিত করুন", en: "Confirm" },
  storageSettings: { bn: "জায়গার সেটিংস", en: "Storage settings" },
  notifyPrefs: { bn: "বিজ্ঞপ্তির পছন্দ", en: "Notification preferences" },
  loading: { bn: "আসছে…", en: "Loading…" },
  errorTitle: { bn: "কিছু ভুল হয়েছে", en: "Something went wrong" },
  cancelUpload: { bn: "বাতিল", en: "Cancel" },
} satisfies Record<string, Entry>;

export type Key = keyof typeof dict;

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggle: () => void;
  t: (k: Key) => string;
};

const LangContext = createContext<Ctx | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("bn");

  useEffect(() => {
    const stored = window.localStorage.getItem("smriti-lang");
    if (stored === "bn" || stored === "en") setLang(stored);
  }, []);

  useEffect(() => {
    window.localStorage.setItem("smriti-lang", lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const t = useCallback((k: Key) => dict[k][lang], [lang]);
  const toggle = useCallback(
    () => setLang((l) => (l === "bn" ? "en" : "bn")),
    [],
  );

  const value = useMemo(() => ({ lang, setLang, toggle, t }), [lang, toggle, t]);

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used inside LanguageProvider");
  return ctx;
}

/** Pick a bn/en value from any bilingual data object. */
export function bi(entry: Entry, lang: Lang) {
  return entry[lang];
}
