import type { Bi } from "./mock-data";

/* ------------------------------------------------------------------ *
 * Additive mock data for the extended frontend surfaces.
 * Shapes mirror the API contract documented in README.md so each list
 * can be swapped for a TanStack Query fetch without UI changes.
 * ------------------------------------------------------------------ */

export type NotificationKind =
  | "vault_unlocked"
  | "letter_delivered"
  | "ai_completed"
  | "upload_completed"
  | "share_accepted"
  | "error";

export type Notification = {
  id: string;
  kind: NotificationKind;
  title: Bi;
  body: Bi;
  when: Bi;
  read: boolean;
};

export const notifications: Notification[] = [
  {
    id: "n1",
    kind: "vault_unlocked",
    title: { bn: "সময়-সিন্দুক খুলেছে", en: "Time vault unlocked" },
    body: { bn: "“দিদার শেষ কথা” এখন পড়া যাবে।", en: "“Grandmother's last words” is now readable." },
    when: { bn: "১০ মিনিট আগে", en: "10 minutes ago" },
    read: false,
  },
  {
    id: "n2",
    kind: "ai_completed",
    title: { bn: "AI প্রক্রিয়া সম্পন্ন", en: "AI processing completed" },
    body: { bn: "১২টি ছবির বিবরণী ও সূচি তৈরি হয়েছে।", en: "Captions and embeddings ready for 12 photos." },
    when: { bn: "১ ঘণ্টা আগে", en: "1 hour ago" },
    read: false,
  },
  {
    id: "n3",
    kind: "letter_delivered",
    title: { bn: "চিঠি পৌঁছেছে", en: "Letter delivered" },
    body: { bn: "“নাতি-নাতনিদের” চিঠি ইমেইলে পাঠানো হয়েছে।", en: "“To my grandchildren” was emailed successfully." },
    when: { bn: "গতকাল", en: "Yesterday" },
    read: false,
  },
  {
    id: "n4",
    kind: "upload_completed",
    title: { bn: "আপলোড সম্পন্ন", en: "Upload completed" },
    body: { bn: "মামার কণ্ঠ রেকর্ড জমা হয়েছে।", en: "Uncle's voice recording saved." },
    when: { bn: "২ দিন আগে", en: "2 days ago" },
    read: true,
  },
  {
    id: "n5",
    kind: "share_accepted",
    title: { bn: "ভাগ করা লিংক গৃহীত", en: "Share accepted" },
    body: { bn: "রুমা ভট্টাচার্য সিন্দুকটি দেখেছেন।", en: "Ruma Bhattacharya opened the capsule." },
    when: { bn: "৩ দিন আগে", en: "3 days ago" },
    read: true,
  },
  {
    id: "n6",
    kind: "error",
    title: { bn: "প্রতিলিপি ব্যর্থ", en: "Transcription failed" },
    body: { bn: "একটি অডিও ফাইল পড়া যায়নি — আবার চেষ্টা করুন।", en: "One audio file could not be read — retry." },
    when: { bn: "১ সপ্তাহ আগে", en: "1 week ago" },
    read: true,
  },
];

export type JobKind = "ocr" | "transcript" | "caption" | "embedding";
export type JobState = "processing" | "pending" | "completed" | "failed";

export type Job = {
  id: string;
  file: string;
  kind: JobKind;
  state: JobState;
  progress: number;
};

export const processingQueue: Job[] = [
  { id: "j1", file: "puja-1968.jpg", kind: "caption", state: "processing", progress: 62 },
  { id: "j2", file: "chithi-1971.pdf", kind: "ocr", state: "processing", progress: 38 },
  { id: "j3", file: "harmonium.m4a", kind: "transcript", state: "pending", progress: 0 },
  { id: "j4", file: "biye-1992.mp4", kind: "embedding", state: "completed", progress: 100 },
  { id: "j5", file: "chhad.wav", kind: "transcript", state: "failed", progress: 47 },
];

export const storageSeries = [
  { label: { bn: "ফেব", en: "Feb" }, mb: 96 },
  { label: { bn: "মার্চ", en: "Mar" }, mb: 148 },
  { label: { bn: "এপ্রিল", en: "Apr" }, mb: 203 },
  { label: { bn: "মে", en: "May" }, mb: 262 },
  { label: { bn: "জুন", en: "Jun" }, mb: 341 },
  { label: { bn: "জুলাই", en: "Jul" }, mb: 412 },
];

export const aiActivity = [
  { id: "a1", what: { bn: "১২টি ছবির বিবরণী তৈরি", en: "Captioned 12 photos" }, when: { bn: "১ ঘণ্টা আগে", en: "1 hour ago" } },
  { id: "a2", what: { bn: "চিঠি থেকে লেখা শনাক্ত", en: "Extracted text from a letter" }, when: { bn: "৪ ঘণ্টা আগে", en: "4 hours ago" } },
  { id: "a3", what: { bn: "৩টি আলাপে উত্তর দেওয়া", en: "Answered 3 conversations" }, when: { bn: "গতকাল", en: "Yesterday" } },
  { id: "a4", what: { bn: "কণ্ঠ রেকর্ডের প্রতিলিপি", en: "Transcribed a voice recording" }, when: { bn: "২ দিন আগে", en: "2 days ago" } },
];

export const recentUploads = [
  { id: "u1", name: "puja-1968.jpg", type: "photo" as const, size: "2.4 MB", when: { bn: "আজ", en: "Today" } },
  { id: "u2", name: "harmonium.m4a", type: "audio" as const, size: "8.1 MB", when: { bn: "আজ", en: "Today" } },
  { id: "u3", name: "chithi-1971.pdf", type: "document" as const, size: "1.2 MB", when: { bn: "গতকাল", en: "Yesterday" } },
  { id: "u4", name: "biye-1992.mp4", type: "video" as const, size: "64 MB", when: { bn: "গতকাল", en: "Yesterday" } },
];

export const weeklySummary = {
  headline: { bn: "এই সপ্তাহে ২৩টি নতুন স্মৃতি", en: "23 new memories this week" },
  body: {
    bn: "সবচেয়ে বেশি এসেছে ১৯৬০-এর দশকের ছবি। AI নতুন করে ৪১টি স্মৃতি সূচিবদ্ধ করেছে এবং দুটি সম্ভাব্য প্রতিলিপি চিহ্নিত করেছে।",
    en: "Most additions came from the 1960s. The AI indexed 41 memories and flagged two possible duplicates.",
  },
  stats: [
    { label: { bn: "নতুন স্মৃতি", en: "New memories" }, value: "23" },
    { label: { bn: "AI আলাপ", en: "AI chats" }, value: "9" },
    { label: { bn: "সূচিবদ্ধ", en: "Indexed" }, value: "41" },
  ],
};

export const capsuleStats = [
  { label: { bn: "ছবি", en: "Photos" }, value: 96 },
  { label: { bn: "ভিডিও", en: "Videos" }, value: 14 },
  { label: { bn: "কণ্ঠ", en: "Audio" }, value: 21 },
  { label: { bn: "নথি", en: "Documents" }, value: 17 },
];

export type MemoryDetail = {
  summary: Bi;
  caption: Bi;
  ocr?: Bi;
  transcript?: { at: string; text: Bi }[];
  embedding: "embedded" | "processing" | "failed";
  processing: JobState;
  language: "bn" | "en";
  duplicateOf?: string;
  relevance: number;
  people: Bi[];
  versions: { id: string; when: string; by: Bi; note: Bi }[];
};

export const memoryDetail: MemoryDetail = {
  summary: {
    bn: "১৯৬৮ সালের দুর্গাপুজোয় বাগবাজারের বাড়ির উঠোনে তোলা ছবি — পরিবারের সাত জন, নতুন জামা আর ঢাকির দল।",
    en: "A 1968 Durga Puja photograph in the Bagbazar courtyard — seven family members, new clothes and the dhak players.",
  },
  caption: {
    bn: "উঠোনে সারিবদ্ধ পরিবার, পিছনে আলপনা আঁকা মেঝে।",
    en: "The family lined up in the courtyard, alpona drawn on the floor behind them.",
  },
  ocr: {
    bn: "ছবির পিছনে লেখা: “পুজো ১৩৭৫, বাগবাজার — সবাই একসাথে”",
    en: "Written on the back: “Pujo 1375, Bagbazar — all of us together”",
  },
  transcript: [
    { at: "00:04", text: { bn: "ঢাকের বাদ্যি শুরু হলো।", en: "The dhak begins." } },
    { at: "00:21", text: { bn: "দিদা বললেন, সবাই একটু কাছে দাঁড়া।", en: "Grandmother said: stand a little closer." } },
    { at: "00:48", text: { bn: "ছবিটা তখনই তোলা হয়।", en: "The photo was taken right then." } },
  ],
  embedding: "embedded",
  processing: "completed",
  language: "bn",
  relevance: 0.94,
  people: [
    { bn: "সরস্বতী দেবী", en: "Saraswati Devi" },
    { bn: "অমিয় ভট্টাচার্য", en: "Amiya Bhattacharya" },
    { bn: "রুমা ভট্টাচার্য", en: "Ruma Bhattacharya" },
  ],
  versions: [
    { id: "v3", when: "2026-07-24", by: { bn: "অনন্যা", en: "Ananya" }, note: { bn: "শিরোনাম ও তারিখ সংশোধন", en: "Fixed title and date" } },
    { id: "v2", when: "2026-05-02", by: { bn: "রুমা", en: "Ruma" }, note: { bn: "স্থান যোগ করা হয়েছে", en: "Added location" } },
    { id: "v1", when: "2026-02-14", by: { bn: "অনন্যা", en: "Ananya" }, note: { bn: "প্রথম আপলোড", en: "First upload" } },
  ],
};

export const vaultRecipients = [
  { id: "r1", name: { bn: "ঋক সেন", en: "Rik Sen" }, email: "rik@example.com", status: "pending" as const },
  { id: "r2", name: { bn: "রুমা ভট্টাচার্য", en: "Ruma Bhattacharya" }, email: "ruma@example.com", status: "delivered" as const },
];

export const vaultHistory = [
  { id: "vh1", what: { bn: "সিন্দুক তালাবন্ধ করা হয়েছে", en: "Vault sealed" }, when: "2025-09-14" },
  { id: "vh2", what: { bn: "প্রাপক যোগ করা হয়েছে", en: "Recipient added" }, when: "2025-10-02" },
  { id: "vh3", what: { bn: "স্মৃতি যোগ করা হয়েছে", en: "Memories added" }, when: "2026-03-11" },
];

export const shareLinks = [
  {
    id: "s1",
    token: "dida-a91f",
    scope: { bn: "শুধু পড়ার জন্য", en: "Read only" },
    password: true,
    expires: "2026-12-31",
    views: 14,
  },
  {
    id: "s2",
    token: "baba-77bc",
    scope: { bn: "শুধু পড়ার জন্য", en: "Read only" },
    password: false,
    expires: "—",
    views: 3,
  },
];

export type ActivityKind = "upload" | "edit" | "chat" | "vault" | "letter" | "share";

export const activityLog: {
  id: string;
  kind: ActivityKind;
  what: Bi;
  when: string;
}[] = Array.from({ length: 34 }, (_, i) => {
  const kinds: ActivityKind[] = ["upload", "edit", "chat", "vault", "letter", "share"];
  const kind = kinds[i % kinds.length]!;
  const labels: Record<ActivityKind, Bi> = {
    upload: { bn: "নতুন স্মৃতি আপলোড হয়েছে", en: "A memory was uploaded" },
    edit: { bn: "স্মৃতির বিবরণ সম্পাদিত", en: "A memory was edited" },
    chat: { bn: "AI-এর সঙ্গে আলাপ", en: "Chatted with the AI" },
    vault: { bn: "সময়-সিন্দুকে পরিবর্তন", en: "Time vault updated" },
    letter: { bn: "উত্তরাধিকার চিঠি নির্ধারিত", en: "Legacy letter scheduled" },
    share: { bn: "ভাগ করার লিংক তৈরি", en: "Share link created" },
  };
  const d = new Date(Date.UTC(2026, 6, 30 - i));
  return { id: `al${i}`, kind, what: labels[kind], when: d.toISOString().slice(0, 10) };
});
