import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Clock,
  Image as ImageIcon,
  MessageCircleHeart,
  ScrollText,
  Sparkles,
  TreeDeciduous,
} from "lucide-react";

import hero from "@/assets/hero-nostalgia.jpg";
import alpona from "@/assets/alpona-pattern.jpg";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useLang, type Key } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "স্মৃতিচারণ — স্মৃতির সিন্দুক | Smritocharon" },
      {
        name: "description",
        content:
          "পুরোনো ছবি, চিঠি ও কণ্ঠস্বর এক সিন্দুকে রাখুন, আর AI-এর সঙ্গে স্মৃতিচারণ করুন। A bilingual Bengali memory capsule for families.",
      },
      { property: "og:title", content: "স্মৃতিচারণ — স্মৃতির সিন্দুক" },
      {
        property: "og:description",
        content:
          "যা হারিয়ে যায়, তা এখানে থেকে যায় — পরিবারের স্মৃতি সংরক্ষণের দ্বিভাষিক আশ্রয়।",
      },
    ],
  }),
  component: LandingPage,
});

const featureKeys: [Key, Key, typeof ImageIcon][] = [
  ["featMemories", "featMemoriesD", ImageIcon],
  ["featChat", "featChatD", MessageCircleHeart],
  ["featTimeline", "featTimelineD", Clock],
  ["featFamily", "featFamilyD", TreeDeciduous],
  ["featVault", "featVaultD", Sparkles],
  ["featLegacy", "featLegacyD", ScrollText],
];

const quotes = [
  {
    bn: "দিদার কণ্ঠ আবার শুনতে পেলাম — চোখ ভিজে গেল।",
    en: "I heard my grandmother's voice again — my eyes welled up.",
    who: { bn: "অনন্যা, কলকাতা", en: "Ananya, Kolkata" },
  },
  {
    bn: "বাবার দিনলিপি ভাইবোনদের সঙ্গে ভাগ করে নিলাম, একসঙ্গে কাঁদলাম আর হাসলাম।",
    en: "We shared father's diary among siblings — cried and laughed together.",
    who: { bn: "সৌম্য, ঢাকা", en: "Soumya, Dhaka" },
  },
  {
    bn: "পুরোনো অ্যালবামের ছবিগুলো এখন আর নষ্ট হবে না।",
    en: "The old album photographs will never rot away now.",
    who: { bn: "রুমা, শিলিগুড়ি", en: "Ruma, Siliguri" },
  },
];

function LandingPage() {
  const { t, lang } = useLang();

  return (
    <div className="min-h-screen overflow-x-hidden bg-background paper-grain">
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.06] mix-blend-multiply"
        style={{ backgroundImage: `url(${alpona})`, backgroundSize: "360px" }}
        aria-hidden
      />

      <header className="relative z-20 mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
        <Link to="/" className="font-display text-2xl text-primary">
          {t("brand")}
        </Link>
        <nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
          <a href="#how" className="ink-underline hover:text-foreground">
            {t("howItWorks")}
          </a>
          <a href="#features" className="ink-underline hover:text-foreground">
            {t("features")}
          </a>
          <a href="#voices" className="ink-underline hover:text-foreground">
            {t("testimonials")}
          </a>
          <a href="#pricing" className="ink-underline hover:text-foreground">
            {t("pricing")}
          </a>
        </nav>
        <div className="flex items-center gap-3">
          <LanguageToggle compact />
          <Link
            to="/sign-in"
            className="hidden rounded-md border border-border bg-card px-3 py-1.5 text-sm transition hover:border-primary/50 sm:inline-block"
          >
            {t("signIn")}
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 pb-24 pt-10 lg:grid-cols-2 lg:pt-16">
        <div className="animate-rise">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-brass/40 bg-brass/10 px-3 py-1 text-xs tracking-wide text-sepia">
            ❦ {t("tagline")}
          </p>
          <h1 className="font-display text-4xl leading-[1.15] text-foreground sm:text-5xl lg:text-6xl">
            {t("heroTitle")}
          </h1>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground">
            {t("heroBody")}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              to="/sign-up"
              className="group inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-warm transition-all duration-300 hover:-translate-y-0.5 hover:lamp-glow"
            >
              {t("getStarted")}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
            </Link>
            <Link
              to="/dashboard"
              className="rounded-md border border-border bg-card px-6 py-3 text-sm font-medium transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/50"
            >
              {t("seeDemo")}
            </Link>
          </div>
          <p className="mt-8 font-display text-sm italic text-sepia">
            {lang === "bn"
              ? "“আমার সকল দুখের প্রদীপ জ্বেলে দিবস গেলে…”"
              : "“Lighting every lamp of my sorrow, as the day departs…”"}
          </p>
        </div>

        <div className="relative animate-unfurl">
          <div className="absolute -inset-6 animate-flicker rounded-full bg-brass/25" aria-hidden />
          <div className="relative frame-photo rotate-[-1.5deg] rounded-sm transition-transform duration-700 hover:rotate-0">
            <img
              src={hero}
              alt="পুরোনো পারিবারিক ছবি, চিঠি ও পিতলের প্রদীপ / Old family photographs, letters and a brass lamp"
              width={1600}
              height={1104}
              className="h-auto w-full rounded-sm sepia-[0.15] saturate-[0.95]"
            />
            <p className="absolute bottom-2 left-0 right-0 text-center font-display text-sm text-sepia">
              {lang === "bn" ? "শ্রাবণ, ১৩৬৬" : "Shrabon, 1366"}
            </p>
          </div>
          <div className="absolute -bottom-8 -left-6 hidden w-40 animate-float-slow frame-photo rotate-6 rounded-sm bg-card p-2 text-center sm:block">
            <div className="h-24 rounded-sm bg-gradient-to-br from-secondary to-muted" />
            <p className="pt-1 text-[11px] text-muted-foreground">
              {lang === "bn" ? "১৪৮টি স্মৃতি" : "148 memories"}
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="relative border-y border-border bg-paper-deep/50 py-20">
        <div className="mx-auto max-w-6xl px-5">
          <h2 className="text-center font-display text-3xl">{t("howItWorks")}</h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {(
              [
                ["step1", "step1d"],
                ["step2", "step2d"],
                ["step3", "step3d"],
              ] as [Key, Key][]
            ).map(([title, body], i) => (
              <div
                key={title}
                style={{ animationDelay: `${i * 140}ms` }}
                className="group relative rounded-lg border border-border bg-card/80 p-6 shadow-warm animate-rise transition-transform duration-500 hover:-translate-y-1"
              >
                <span className="mb-4 grid size-11 place-items-center rounded-full border border-brass/50 bg-brass/15 font-display text-lg text-sepia">
                  {lang === "bn" ? ["১", "২", "৩"][i] : i + 1}
                </span>
                <h3 className="font-display text-xl">{t(title)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {t(body)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative py-20">
        <div className="mx-auto max-w-6xl px-5">
          <h2 className="text-center font-display text-3xl">{t("features")}</h2>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featureKeys.map(([title, body, Icon], i) => (
              <article
                key={title}
                style={{ animationDelay: `${i * 90}ms` }}
                className="group rounded-lg border border-border bg-card/80 p-6 animate-rise transition-all duration-500 hover:-translate-y-1 hover:border-primary/40 hover:shadow-warm"
              >
                <Icon className="mb-4 size-6 text-primary transition-transform duration-500 group-hover:scale-110" aria-hidden />
                <h3 className="font-display text-lg">{t(title)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {t(body)}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Voices */}
      <section id="voices" className="relative border-y border-border bg-paper-deep/50 py-20">
        <div className="mx-auto max-w-6xl px-5">
          <h2 className="text-center font-display text-3xl">{t("testimonials")}</h2>
          <div className="mt-12 flex snap-x gap-5 overflow-x-auto pb-4">
            {quotes.map((q, i) => (
              <figure
                key={q.who.en}
                style={{ animationDelay: `${i * 120}ms` }}
                className="min-w-[280px] flex-1 snap-center rounded-lg border border-border bg-card/85 p-6 animate-rise"
              >
                <blockquote className="font-display text-lg leading-relaxed text-foreground">
                  “{q[lang]}”
                </blockquote>
                <figcaption className="mt-4 text-xs uppercase tracking-widest text-sepia">
                  {q.who[lang]}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="relative py-20">
        <div className="mx-auto max-w-4xl px-5">
          <h2 className="text-center font-display text-3xl">{t("pricing")}</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <div className="rounded-lg border border-border bg-card/80 p-7 animate-rise">
              <h3 className="font-display text-2xl">{t("free")}</h3>
              <p className="mt-2 font-display text-3xl">
                ৩০০ MB
                <span className="text-sm text-muted-foreground"> {t("storageUsed")}</span>
              </p>
              <ul className="mt-5 space-y-2 text-sm text-muted-foreground">
                <li>❦ {lang === "bn" ? "১টি সিন্দুক" : "1 capsule"}</li>
                <li>❦ {lang === "bn" ? "৫০টি স্মৃতি" : "50 memories"}</li>
                <li>❦ {lang === "bn" ? "সীমিত AI আলাপ" : "Limited AI chat"}</li>
              </ul>
              <Link
                to="/sign-up"
                className="mt-7 block rounded-md border border-border bg-background py-2.5 text-center text-sm transition hover:border-primary/50"
              >
                {t("choose")}
              </Link>
            </div>
            <div className="relative rounded-lg border border-primary/40 bg-card p-7 shadow-warm animate-rise" style={{ animationDelay: "120ms" }}>
              <span className="absolute right-5 top-5 rounded-full bg-brass/20 px-2 py-0.5 text-[11px] text-sepia">
                ❦
              </span>
              <h3 className="gold-text font-display text-2xl">{t("pro")}</h3>
              <p className="mt-2 font-display text-3xl">
                ৳ ২৯৯<span className="text-sm text-muted-foreground">{t("perMonth")}</span>
              </p>
              <ul className="mt-5 space-y-2 text-sm text-muted-foreground">
                <li>❦ {lang === "bn" ? "অসীম সিন্দুক ও স্মৃতি" : "Unlimited capsules & memories"}</li>
                <li>❦ {lang === "bn" ? "সময়-সিন্দুক ও উত্তরাধিকার চিঠি" : "Time vaults & legacy letters"}</li>
                <li>❦ {lang === "bn" ? "১০ GB সংরক্ষণ" : "10 GB storage"}</li>
              </ul>
              <Link
                to="/sign-up"
                className="mt-7 block rounded-md bg-primary py-2.5 text-center text-sm font-medium text-primary-foreground transition hover:lamp-glow"
              >
                {t("choose")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="relative border-t border-border bg-paper-deep/60 py-12">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-5 text-center">
          <p className="font-display text-2xl text-primary">{t("brand")}</p>
          <p className="text-sm text-muted-foreground">{t("footerNote")}</p>
          <div className="flex flex-wrap justify-center gap-5 text-sm text-muted-foreground">
            <Link to="/dashboard" className="ink-underline hover:text-foreground">
              {t("dashboard")}
            </Link>
            <Link to="/capsules" className="ink-underline hover:text-foreground">
              {t("capsules")}
            </Link>
            <Link to="/settings" className="ink-underline hover:text-foreground">
              {t("settings")}
            </Link>
          </div>
          <LanguageToggle />
        </div>
      </footer>
    </div>
  );
}
