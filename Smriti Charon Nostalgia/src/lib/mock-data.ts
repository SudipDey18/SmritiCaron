export type Bi = { bn: string; en: string };

export type Capsule = {
  id: string;
  name: Bi;
  subject: Bi;
  description: Bi;
  memoryCount: number;
  updated: string;
  status: "active" | "archived" | "shared";
  hue: number;
};

export const capsules: Capsule[] = [
  {
    id: "dida",
    name: { bn: "দিদার সিন্দুক", en: "Grandmother's capsule" },
    subject: { bn: "সরস্বতী দেবী", en: "Saraswati Devi" },
    description: {
      bn: "১৯৪২ সালের বরিশাল থেকে শুরু — চিঠি, রান্নার খাতা আর গানের কথা।",
      en: "Beginning in Barisal, 1942 — letters, recipe books and songs.",
    },
    memoryCount: 148,
    updated: "2026-07-24",
    status: "active",
    hue: 34,
  },
  {
    id: "baba",
    name: { bn: "বাবার দিনলিপি", en: "Father's diary" },
    subject: { bn: "অমিয় ভট্টাচার্য", en: "Amiya Bhattacharya" },
    description: {
      bn: "কলেজ স্ট্রিটের বইপাড়া, রেলের চাকরি আর ছোটবেলার পুজো।",
      en: "College Street bookshops, the railway job, childhood pujos.",
    },
    memoryCount: 92,
    updated: "2026-07-19",
    status: "active",
    hue: 74,
  },
  {
    id: "amader-bari",
    name: { bn: "আমাদের বাড়ি", en: "Our old house" },
    subject: { bn: "শ্যামবাজার, কলকাতা", en: "Shyambazar, Kolkata" },
    description: {
      bn: "লাল সিমেন্টের মেঝে, ছাদের আচার আর বর্ষার গন্ধ।",
      en: "Red cement floors, pickles on the roof, the smell of monsoon.",
    },
    memoryCount: 61,
    updated: "2026-06-30",
    status: "shared",
    hue: 176,
  },
  {
    id: "mamar-gaan",
    name: { bn: "মামার গান", en: "Uncle's songs" },
    subject: { bn: "সুবীর সেন", en: "Subir Sen" },
    description: {
      bn: "হারমোনিয়াম, রবীন্দ্রসংগীত আর শীতের আসর।",
      en: "Harmonium, Tagore songs and winter gatherings.",
    },
    memoryCount: 37,
    updated: "2026-05-11",
    status: "archived",
    hue: 265,
  },
];

export type Memory = {
  id: string;
  title: Bi;
  type: "photo" | "video" | "audio" | "document" | "text";
  date: string;
  place: Bi;
  emotion: "joy" | "nostalgia" | "love" | "sadness" | "pride";
  body: Bi;
};

export const memories: Memory[] = [
  {
    id: "m1",
    title: { bn: "প্রথম দুর্গাপুজো", en: "The first Durga Puja" },
    type: "photo",
    date: "1968-10-02",
    place: { bn: "বাগবাজার", en: "Bagbazar" },
    emotion: "joy",
    body: {
      bn: "ঢাকের শব্দে ভোর হয়েছিল, নতুন জামার গন্ধ এখনও মনে আছে।",
      en: "Dawn broke with the dhak drums; I still remember the smell of new clothes.",
    },
  },
  {
    id: "m2",
    title: { bn: "দিদার চিঠি", en: "Grandmother's letter" },
    type: "document",
    date: "1971-03-18",
    place: { bn: "বরিশাল", en: "Barisal" },
    emotion: "nostalgia",
    body: {
      bn: "নীল কাগজে সাত পাতার চিঠি — শেষ লাইনে লেখা ছিল, ভালো থাকিস।",
      en: "Seven pages on blue paper, ending simply: stay well.",
    },
  },
  {
    id: "m3",
    title: { bn: "হারমোনিয়ামে রবীন্দ্রসংগীত", en: "Tagore song on harmonium" },
    type: "audio",
    date: "1984-01-22",
    place: { bn: "শ্যামবাজার", en: "Shyambazar" },
    emotion: "love",
    body: {
      bn: "রেকর্ডারে ধরা মামার কণ্ঠ, মাঝে চায়ের কাপের আওয়াজ।",
      en: "Uncle's voice on tape, teacups clinking in the background.",
    },
  },
  {
    id: "m4",
    title: { bn: "বিয়ের ভিডিও", en: "Wedding video" },
    type: "video",
    date: "1992-12-06",
    place: { bn: "হাওড়া", en: "Howrah" },
    emotion: "joy",
    body: {
      bn: "শাঁখ, উলুধ্বনি আর কাঁপা হাতে ক্যামেরা।",
      en: "Conch shells, ululation, and a trembling camera.",
    },
  },
  {
    id: "m5",
    title: { bn: "ছাদের আচার", en: "Pickles on the roof" },
    type: "text",
    date: "1979-04-14",
    place: { bn: "শ্যামবাজার", en: "Shyambazar" },
    emotion: "nostalgia",
    body: {
      bn: "বৈশাখের রোদে কাঁচের বয়াম, মা পাহারা দিতেন কাক তাড়িয়ে।",
      en: "Glass jars in the Boishakh sun, Ma guarding them from crows.",
    },
  },
  {
    id: "m6",
    title: { bn: "শেষ দেখা", en: "The last visit" },
    type: "photo",
    date: "2004-11-09",
    place: { bn: "কলকাতা", en: "Kolkata" },
    emotion: "sadness",
    body: {
      bn: "হাসপাতালের বারান্দায় শেষ হাসিটা তোলা ছিল।",
      en: "The last smile, photographed on a hospital verandah.",
    },
  },
  {
    id: "m7",
    title: { bn: "স্কুলের পুরস্কার", en: "School prize day" },
    type: "photo",
    date: "1963-02-11",
    place: { bn: "বহরমপুর", en: "Berhampore" },
    emotion: "pride",
    body: {
      bn: "প্রথম পুরস্কার — একটি সঞ্চয়িতা, নাম লেখা ছিল প্রথম পাতায়।",
      en: "First prize: a Sanchayita, with his name inked on page one.",
    },
  },
  {
    id: "m8",
    title: { bn: "রান্নার খাতা", en: "The recipe notebook" },
    type: "document",
    date: "1975-08-30",
    place: { bn: "বাগবাজার", en: "Bagbazar" },
    emotion: "love",
    body: {
      bn: "চিতল মাছের মুইঠ্যা, হাতে লেখা মাপ — এক চিমটি ভালোবাসা।",
      en: "Chital fish muithya, measured by hand — a pinch of love.",
    },
  },
];

export const timeline = [
  {
    year: "1942",
    cat: "other",
    title: { bn: "জন্ম, বরিশাল", en: "Born in Barisal" },
    body: {
      bn: "নদীর ধারে টিনের চালের বাড়িতে জন্ম।",
      en: "Born in a tin-roofed house by the river.",
    },
  },
  {
    year: "1958",
    cat: "education",
    title: { bn: "স্কুল শেষ", en: "Finished school" },
    body: {
      bn: "প্রথম বিভাগে উত্তীর্ণ, পাড়ায় মিষ্টি বিতরণ।",
      en: "First division — sweets for the whole neighbourhood.",
    },
  },
  {
    year: "1964",
    cat: "work",
    title: { bn: "রেলে চাকরি", en: "Joined the railways" },
    body: {
      bn: "শিয়ালদহ ডিভিশনে কেরানির কাজ শুরু।",
      en: "Began as a clerk in the Sealdah division.",
    },
  },
  {
    year: "1971",
    cat: "family",
    title: { bn: "বিবাহ", en: "Marriage" },
    body: {
      bn: "শ্যামবাজারের বাড়িতে সংসারের শুরু।",
      en: "A household begins in the Shyambazar house.",
    },
  },
  {
    year: "1986",
    cat: "travel",
    title: { bn: "দার্জিলিং ভ্রমণ", en: "Trip to Darjeeling" },
    body: {
      bn: "টয় ট্রেন, কাঞ্চনজঙ্ঘা আর কমলালেবু।",
      en: "The toy train, Kanchenjunga, and oranges.",
    },
  },
  {
    year: "2004",
    cat: "family",
    title: { bn: "শেষ শীত", en: "The last winter" },
    body: {
      bn: "ছাদে রোদ পোহানো শেষ দিনগুলো।",
      en: "Final days of sunning on the terrace.",
    },
  },
] as const;

export const familyMembers = [
  { id: "f1", name: { bn: "সরস্বতী দেবী", en: "Saraswati Devi" }, years: "1942–2011", rel: { bn: "দিদা", en: "Grandmother" }, gen: 0 },
  { id: "f2", name: { bn: "অমিয় ভট্টাচার্য", en: "Amiya Bhattacharya" }, years: "1940–2016", rel: { bn: "দাদু", en: "Grandfather" }, gen: 0 },
  { id: "f3", name: { bn: "রুমা ভট্টাচার্য", en: "Ruma Bhattacharya" }, years: "1968–", rel: { bn: "মা", en: "Mother" }, gen: 1 },
  { id: "f4", name: { bn: "সুবীর সেন", en: "Subir Sen" }, years: "1965–2019", rel: { bn: "মামা", en: "Uncle" }, gen: 1 },
  { id: "f5", name: { bn: "অনন্যা সেন", en: "Ananya Sen" }, years: "1994–", rel: { bn: "আমি", en: "Me" }, gen: 2 },
  { id: "f6", name: { bn: "ঋক সেন", en: "Rik Sen" }, years: "1998–", rel: { bn: "ভাই", en: "Brother" }, gen: 2 },
];

export const vaults = [
  {
    id: "v1",
    title: { bn: "অনন্যার ২১তম জন্মদিন", en: "Ananya's 21st birthday" },
    opens: "2026-09-14",
    state: "sealed" as const,
  },
  {
    id: "v2",
    title: { bn: "পঁচিশ বছরের বিবাহবার্ষিকী", en: "Silver anniversary" },
    opens: "2027-12-06",
    state: "sealed" as const,
  },
  {
    id: "v3",
    title: { bn: "দিদার শেষ কথা", en: "Grandmother's last words" },
    opens: "2024-11-02",
    state: "opened" as const,
  },
];

export const letters = [
  {
    id: "l1",
    to: { bn: "ঋক-কে", en: "To Rik" },
    status: "scheduled" as const,
    when: "2030-01-01",
    excerpt: {
      bn: "যখন এই চিঠি পড়বি, আমি হয়তো পাশে থাকব না — তবু…",
      en: "When you read this I may not be beside you — and yet…",
    },
  },
  {
    id: "l2",
    to: { bn: "মায়ের জন্য", en: "To Ma" },
    status: "draft" as const,
    when: "—",
    excerpt: {
      bn: "তোমার হাতের রান্নার গন্ধটা লিখে রাখতে চাই।",
      en: "I want to write down the smell of your cooking.",
    },
  },
  {
    id: "l3",
    to: { bn: "নাতি-নাতনিদের", en: "To my grandchildren" },
    status: "delivered" as const,
    when: "2025-04-15",
    excerpt: {
      bn: "আমাদের বাড়ির ছাদটা মনে রাখবে, ওটাই ছিল আমাদের আকাশ।",
      en: "Remember our terrace — that was our whole sky.",
    },
  },
];

export const chatSessions = [
  { id: "c1", title: { bn: "দিদার ছোটবেলা", en: "Grandmother's childhood" }, date: "2026-07-24" },
  { id: "c2", title: { bn: "দেশভাগের গল্প", en: "Stories of Partition" }, date: "2026-07-11" },
  { id: "c3", title: { bn: "রান্নার রেসিপি", en: "Family recipes" }, date: "2026-06-28" },
];

export const chatMessages = [
  {
    role: "user" as const,
    text: { bn: "দিদা ছোটবেলায় কোথায় থাকতেন?", en: "Where did grandmother live as a child?" },
  },
  {
    role: "ai" as const,
    text: {
      bn: "বরিশালের নদীর ধারে একটি টিনের চালের বাড়িতে, ১৯৪২ থেকে ১৯৫৮ সাল পর্যন্ত। তাঁর চিঠিতে সেই বাড়ির উঠোনের পেয়ারা গাছের কথা বারবার এসেছে।",
      en: "In a tin-roofed house by the river in Barisal, from 1942 to 1958. Her letters keep returning to the guava tree in that courtyard.",
    },
    cites: [
      { bn: "দিদার চিঠি", en: "Grandmother's letter" },
      { bn: "জন্ম, বরিশাল", en: "Born in Barisal" },
    ],
  },
];

export const suggestedPrompts = [
  { bn: "প্রথম চাকরির গল্প বলো", en: "Tell me about the first job" },
  { bn: "পুজোর দিনগুলো কেমন ছিল?", en: "What were the puja days like?" },
  { bn: "রান্নার খাতায় কী কী আছে?", en: "What's in the recipe notebook?" },
];

export const activity = [
  { when: { bn: "২ ঘণ্টা আগে", en: "2 hours ago" }, what: { bn: "১২টি ছবি যোগ হয়েছে", en: "12 photos added" } },
  { when: { bn: "গতকাল", en: "Yesterday" }, what: { bn: "মামার কণ্ঠ রেকর্ড আপলোড", en: "Uncle's voice recording uploaded" } },
  { when: { bn: "৩ দিন আগে", en: "3 days ago" }, what: { bn: "জীবনরেখায় নতুন ঘটনা", en: "New timeline event" } },
  { when: { bn: "১ সপ্তাহ আগে", en: "1 week ago" }, what: { bn: "নতুন সিন্দুক তৈরি", en: "New capsule created" } },
];
