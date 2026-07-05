import type React from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Check,
  Clipboard,
  Database,
  Download,
  EyeOff,
  Github,
  History,
  Mail,
  Moon,
  QrCode,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Tags,
  Users,
} from "lucide-react";

const chromeUrl =
  "https://chromewebstore.google.com/detail/gmail-alias-toolkit/cbapjlppdfbnfbopdegobofmfijnlibl";
const githubUrl = "https://github.com/ePlus-DEV/gmail-alias-toolkit";

const features = [
  {
    title: "Random Alias Generator",
    desc: "Generate clean Gmail aliases with private-mail, random words, alphanumeric or timestamp formats.",
    icon: Sparkles,
    sample: "david+private-mail-q2ga@gmail.com",
  },
  {
    title: "Custom Tags & Presets",
    desc: "Save common tags for shopping, work, newsletters, testing and project-specific signups.",
    icon: Tags,
    sample: "shopping · github · newsletter",
  },
  {
    title: "Searchable History",
    desc: "Find generated aliases quickly by tag, date, account or purpose.",
    icon: History,
    sample: "24 aliases saved locally",
  },
  {
    title: "Favorites",
    desc: "Pin aliases you reuse often so they are always one click away.",
    icon: Star,
    sample: "3 favorite aliases",
  },
  {
    title: "QR Code Sharing",
    desc: "Turn aliases into QR-style sharing blocks for quick scan-and-share workflows.",
    icon: QrCode,
    sample: "QR preview ready",
  },
  {
    title: "CSV / JSON Export",
    desc: "Export aliases for backup, migration or reporting without leaving your browser.",
    icon: Download,
    sample: "CSV · JSON",
  },
  {
    title: "Multi-account Ready",
    desc: "Keep aliases separated by Gmail account for cleaner personal and work workflows.",
    icon: Users,
    sample: "Personal / Work",
  },
  {
    title: "Local-first Privacy",
    desc: "Your alias data stays in browser storage with no analytics and no tracking.",
    icon: ShieldCheck,
    sample: "No remote database",
  },
] as const;

const workflowSteps = [
  {
    number: "01",
    title: "Open extension",
    desc: "Choose your Gmail account and alias format.",
  },
  {
    number: "02",
    title: "Generate alias",
    desc: "Create a unique name+tag@gmail.com address instantly.",
  },
  {
    number: "03",
    title: "Copy & use",
    desc: "Paste it into sign-up forms and keep the source traceable.",
  },
] as const;

const aliasFormats = [
  "private-mail-q2ga",
  "shopping",
  "newsletter",
  "github-test",
  "happy-fox-42",
  "lk9x2m3n",
] as const;

const privacyItems = [
  { icon: EyeOff, text: "No analytics" },
  { icon: ShieldCheck, text: "No tracking" },
  { icon: Database, text: "Local storage" },
  { icon: Moon, text: "Light/Dark mode" },
] as const;

const historyItems = [
  { alias: "david+amazon-order@gmail.com", tag: "shopping" },
  { alias: "david+github-test@gmail.com", tag: "dev" },
  { alias: "david+newsletter@gmail.com", tag: "mailing" },
] as const;

/**
 * Renders an animated external-link button used for primary and secondary calls to action.
 */
function BeButton({
  href,
  children,
  variant = "primary",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
}) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noreferrer"
      whileHover={{ y: -2, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={getButtonClassName(variant)}
    >
      {children}
    </motion.a>
  );
}

/**
 * Returns the button class list for the selected visual variant.
 */
function getButtonClassName(variant: "primary" | "secondary") {
  if (variant === "primary") {
    return "inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-glow transition hover:bg-blue-700";
  }

  return "inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-900 transition hover:border-slate-300 hover:bg-slate-50";
}

/**
 * Renders a motion card with a subtle lift and tilt interaction on hover.
 */
function TiltCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -6, rotateX: 2, rotateY: -2 }}
      transition={{ type: "spring", stiffness: 260, damping: 18 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Renders the sticky top navigation.
 */
function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
        <Brand />
        <NavLinks />
        <BeButton href={chromeUrl}>
          Add to Chrome <ArrowRight className="h-4 w-4" />
        </BeButton>
      </div>
    </header>
  );
}

/**
 * Renders the extension brand mark.
 */
function Brand() {
  return (
    <a href="#" className="flex items-center gap-3">
      <div className="grid h-11 w-11 place-items-center rounded-2xl bg-blue-600 text-white shadow-glow">
        <Mail className="h-5 w-5" />
      </div>
      <div>
        <p className="text-sm font-black leading-none">Gmail Alias</p>
        <p className="text-xs font-medium text-slate-500">Toolkit</p>
      </div>
    </a>
  );
}

/**
 * Renders desktop navigation links.
 */
function NavLinks() {
  return (
    <nav className="hidden items-center gap-7 text-sm font-semibold text-slate-600 md:flex">
      <a href="#demo" className="hover:text-slate-950">Demo</a>
      <a href="#features" className="hover:text-slate-950">Features</a>
      <a href="#workflow" className="hover:text-slate-950">Workflow</a>
      <a href="#privacy" className="hover:text-slate-950">Privacy</a>
    </nav>
  );
}

/**
 * Renders the hero section.
 */
function HeroSection() {
  return (
    <section className="relative">
      <HeroBackground />
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 lg:grid-cols-[1.02fr_.98fr] lg:py-28">
        <HeroCopy />
        <ExtensionMockup />
      </div>
    </section>
  );
}

/**
 * Renders the hero gradient background.
 */
function HeroBackground() {
  return (
    <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_25%_10%,rgba(37,99,235,.22),transparent_32%),radial-gradient(circle_at_78%_16%,rgba(20,184,166,.18),transparent_30%)]" />
  );
}

/**
 * Renders hero copy and calls to action.
 */
function HeroCopy() {
  return (
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
      <HeroBadge />
      <h1 className="max-w-4xl text-5xl font-black tracking-tight md:text-7xl">
        Create Gmail aliases before spam finds you.
      </h1>
      <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
        Gmail Alias Toolkit is a Chrome extension for generating, copying,
        organizing and exporting <strong className="text-slate-950">name+tag@gmail.com</strong> aliases.
        Track where emails come from without exposing your main inbox.
      </p>
      <HeroActions />
      <ProblemSolution />
    </motion.div>
  );
}

/**
 * Renders the hero badge.
 */
function HeroBadge() {
  return (
    <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-4 py-2 text-sm font-bold text-blue-700 shadow-sm">
      <BadgeCheck className="h-4 w-4" /> Chrome extension for Gmail plus addressing
    </div>
  );
}

/**
 * Renders hero action buttons.
 */
function HeroActions() {
  return (
    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
      <BeButton href={chromeUrl}>
        Install from Chrome Web Store <ArrowRight className="h-5 w-5" />
      </BeButton>
      <BeButton href={githubUrl} variant="secondary">
        <Github className="h-5 w-5" /> View source
      </BeButton>
    </div>
  );
}

/**
 * Renders problem and solution chips.
 */
function ProblemSolution() {
  return (
    <div className="mt-10 grid max-w-2xl gap-3 sm:grid-cols-2">
      <MiniPanel title="Without alias" items={["Unknown spam source", "Inbox clutter", "Manual typing"]} tone="bad" />
      <MiniPanel title="With Toolkit" items={["Trace every signup", "Copy in one click", "Local history"]} tone="good" />
    </div>
  );
}

/**
 * Renders one compact problem or solution panel.
 */
function MiniPanel({ title, items, tone }: { title: string; items: string[]; tone: "bad" | "good" }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="font-black text-slate-950">{title}</p>
      <div className="mt-3 space-y-2">
        {items.map((item) => (
          <div key={item} className="flex items-center gap-2 text-sm text-slate-600">
            <span className={tone === "good" ? "text-blue-600" : "text-slate-400"}>{tone === "good" ? "✓" : "×"}</span>
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Renders the animated extension popup mockup.
 */
function ExtensionMockup() {
  return (
    <TiltCard className="relative rounded-[2.2rem] border border-slate-200 bg-white p-4 shadow-2xl shadow-blue-950/10">
      <FloatingGlow />
      <div className="relative overflow-hidden rounded-[1.7rem] bg-slate-950 p-5 text-white">
        <MockupTopBar />
        <MockupGeneratePanel />
        <MockupFormatRail />
        <MockupHistory />
      </div>
    </TiltCard>
  );
}

/**
 * Renders decorative glow behind the product mockup.
 */
function FloatingGlow() {
  return <div className="absolute -inset-6 -z-10 rounded-[3rem] bg-blue-500/10 blur-3xl" />;
}

/**
 * Renders mockup top bar.
 */
function MockupTopBar() {
  return (
    <div className="mb-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-2xl bg-blue-500 text-white">
          <Mail className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-black">Gmail Alias Toolkit</p>
          <p className="text-xs text-slate-400">david@gmail.com</p>
        </div>
      </div>
      <motion.div animate={{ rotate: [0, 8, -8, 0] }} transition={{ duration: 2.6, repeat: Infinity }}>
        <Sparkles className="h-5 w-5 text-blue-300" />
      </motion.div>
    </div>
  );
}

/**
 * Renders the main generate alias panel.
 */
function MockupGeneratePanel() {
  return (
    <div className="rounded-3xl bg-white p-4 text-slate-950">
      <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
        <span>Generated alias</span>
        <span>Private Mail</span>
      </div>
      <motion.p
        className="mt-3 break-all text-lg font-black"
        animate={{ opacity: [0.75, 1, 0.75] }}
        transition={{ duration: 2.4, repeat: Infinity }}
      >
        david+private-mail-q2ga@gmail.com
      </motion.p>
      <div className="mt-4 grid grid-cols-[1fr_auto] gap-3">
        <div className="rounded-2xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-600">
          private-mail-q2ga
        </div>
        <motion.div
          className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-600 text-white"
          whileHover={{ scale: 1.05 }}
          animate={{ boxShadow: ["0 0 0 0 rgba(37,99,235,.35)", "0 0 0 10px rgba(37,99,235,0)"] }}
          transition={{ duration: 1.8, repeat: Infinity }}
        >
          <Clipboard className="h-5 w-5" />
        </motion.div>
      </div>
    </div>
  );
}

/**
 * Renders alias format chips in the mockup.
 */
function MockupFormatRail() {
  return (
    <div className="mt-4 flex gap-2 overflow-hidden">
      {aliasFormats.slice(0, 4).map((format) => (
        <motion.div
          key={format}
          className="whitespace-nowrap rounded-full bg-white/10 px-3 py-2 text-xs font-semibold text-slate-200"
          whileHover={{ y: -2 }}
        >
          +{format}
        </motion.div>
      ))}
    </div>
  );
}

/**
 * Renders mockup history list.
 */
function MockupHistory() {
  return (
    <div className="mt-5 rounded-3xl border border-white/10 bg-white/5 p-4">
      <div className="mb-3 flex items-center justify-between text-sm">
        <span className="font-bold text-slate-200">Recent aliases</span>
        <span className="text-blue-300">24 saved</span>
      </div>
      <div className="space-y-2">
        {historyItems.map((item) => (
          <HistoryRow key={item.alias} item={item} />
        ))}
      </div>
    </div>
  );
}

/**
 * Renders one history row in the mockup.
 */
function HistoryRow({ item }: { item: (typeof historyItems)[number] }) {
  return (
    <motion.div
      className="flex items-center justify-between rounded-2xl bg-white/10 px-3 py-2 text-sm"
      whileHover={{ x: 4 }}
    >
      <span className="truncate text-slate-200">{item.alias}</span>
      <span className="ml-3 rounded-full bg-blue-400/20 px-2 py-1 text-xs text-blue-200">{item.tag}</span>
    </motion.div>
  );
}

/**
 * Renders product demo section.
 */
function DemoSection() {
  return (
    <section id="demo" className="mx-auto max-w-7xl px-5 py-20">
      <SectionHeading
        eyebrow="Product demo"
        title="No screenshots needed — the page explains the product by simulating it."
        desc="Animated UI blocks show how alias generation, copy, history, favorites and export work."
      />
      <div className="mt-12 grid gap-5 lg:grid-cols-3">
        <GenerateDemo />
        <OrganizeDemo />
        <ExportDemo />
      </div>
    </section>
  );
}

/**
 * Renders alias generation demo card.
 */
function GenerateDemo() {
  return (
    <DemoCard icon={<Sparkles className="h-5 w-5" />} title="Generate">
      <div className="rounded-2xl bg-slate-100 p-4">
        <p className="text-xs font-bold uppercase text-slate-400">Format</p>
        <p className="mt-2 font-black text-slate-950">Random Words</p>
      </div>
      <motion.div className="mt-3 rounded-2xl bg-blue-600 p-4 text-white" animate={{ y: [0, -4, 0] }} transition={{ duration: 2, repeat: Infinity }}>
        david+happy-fox-42@gmail.com
      </motion.div>
    </DemoCard>
  );
}

/**
 * Renders alias organization demo card.
 */
function OrganizeDemo() {
  return (
    <DemoCard icon={<Search className="h-5 w-5" />} title="Organize">
      <div className="rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-500">Search: github</div>
      <div className="mt-3 space-y-2">
        <DemoListItem text="david+github-test@gmail.com" />
        <DemoListItem text="david+github-actions@gmail.com" />
      </div>
    </DemoCard>
  );
}

/**
 * Renders export and QR demo card.
 */
function ExportDemo() {
  return (
    <DemoCard icon={<Download className="h-5 w-5" />} title="Export & share">
      <div className="grid grid-cols-2 gap-3">
        <SquareAction icon={<QrCode className="h-6 w-6" />} label="QR" />
        <SquareAction icon={<Download className="h-6 w-6" />} label="CSV" />
      </div>
      <div className="mt-3 rounded-2xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-600">JSON backup ready</div>
    </DemoCard>
  );
}

/**
 * Renders a reusable demo card.
 */
function DemoCard({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <TiltCard className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-blue-50 text-blue-600">{icon}</div>
        <h3 className="text-xl font-black">{title}</h3>
      </div>
      {children}
    </TiltCard>
  );
}

/**
 * Renders one demo list item.
 */
function DemoListItem({ text }: { text: string }) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-slate-100 px-4 py-3 text-sm">
      <span className="truncate font-semibold text-slate-700">{text}</span>
      <Star className="ml-2 h-4 w-4 text-blue-600" />
    </div>
  );
}

/**
 * Renders one square action block.
 */
function SquareAction({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <motion.div whileHover={{ scale: 1.04 }} className="grid aspect-square place-items-center rounded-2xl bg-slate-100 text-slate-700">
      <div className="text-center">
        <div className="mx-auto mb-2 grid place-items-center">{icon}</div>
        <p className="text-sm font-black">{label}</p>
      </div>
    </motion.div>
  );
}

/**
 * Renders the feature card grid section.
 */
function FeaturesSection() {
  return (
    <section id="features" className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-5">
        <SectionHeading
          eyebrow="Feature set"
          title="Everything needed to control Gmail aliases"
          desc="Not a generic landing page: every section shows what the extension actually does."
        />
        <FeatureGrid />
      </div>
    </section>
  );
}

/**
 * Renders a centered section heading.
 */
function SectionHeading({ eyebrow, title, desc }: { eyebrow: string; title: string; desc: string }) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <p className="font-bold text-blue-600">{eyebrow}</p>
      <h2 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">{title}</h2>
      <p className="mt-4 text-slate-600">{desc}</p>
    </div>
  );
}

/**
 * Renders all feature cards.
 */
function FeatureGrid() {
  return (
    <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
      {features.map((feature) => (
        <FeatureCard key={feature.title} feature={feature} />
      ))}
    </div>
  );
}

/**
 * Renders one feature card.
 */
function FeatureCard({ feature }: { feature: (typeof features)[number] }) {
  const Icon = feature.icon;

  return (
    <TiltCard className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
      <div className="mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-blue-50 text-blue-600">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-lg font-black">{feature.title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{feature.desc}</p>
      <div className="mt-5 rounded-2xl bg-white px-3 py-2 text-xs font-bold text-blue-700 shadow-sm">
        {feature.sample}
      </div>
    </TiltCard>
  );
}

/**
 * Renders the supported alias formats section.
 */
function FormatSection() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-20">
      <SectionHeading
        eyebrow="Alias formats"
        title="Pick a format, generate, copy, done."
        desc="Use random aliases for privacy or custom tags when you want a memorable address."
      />
      <div className="mx-auto mt-10 flex max-w-4xl flex-wrap justify-center gap-3">
        {aliasFormats.map((format) => (
          <motion.div key={format} whileHover={{ y: -4 }} className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 shadow-sm">
            david+{format}@gmail.com
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/**
 * Renders the workflow section.
 */
function WorkflowSection() {
  return (
    <section id="workflow" className="bg-slate-950 py-20 text-white">
      <div className="mx-auto max-w-7xl px-5">
        <div className="grid gap-10 lg:grid-cols-[.75fr_1.25fr]">
          <WorkflowIntro />
          <WorkflowCards />
        </div>
      </div>
    </section>
  );
}

/**
 * Renders workflow intro copy.
 */
function WorkflowIntro() {
  return (
    <div>
      <p className="font-bold text-blue-300">Workflow</p>
      <h2 className="mt-3 text-4xl font-black tracking-tight">From signup problem to traceable alias</h2>
      <p className="mt-4 leading-7 text-slate-300">
        The extension turns Gmail plus addressing into a repeatable workflow:
        generate, copy, use, then track.
      </p>
    </div>
  );
}

/**
 * Renders workflow cards.
 */
function WorkflowCards() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {workflowSteps.map((step) => (
        <WorkflowCard key={step.number} step={step} />
      ))}
    </div>
  );
}

/**
 * Renders one workflow card.
 */
function WorkflowCard({ step }: { step: (typeof workflowSteps)[number] }) {
  return (
    <motion.div whileHover={{ y: -5 }} className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <p className="text-sm font-black text-blue-300">{step.number}</p>
      <h3 className="mt-4 text-xl font-black">{step.title}</h3>
      <p className="mt-3 text-sm leading-6 text-slate-300">{step.desc}</p>
    </motion.div>
  );
}

/**
 * Renders the privacy section.
 */
function PrivacySection() {
  return (
    <section id="privacy" className="mx-auto max-w-7xl px-5 py-20">
      <div className="rounded-[2rem] bg-white p-8 shadow-sm md:p-12">
        <div className="grid gap-10 lg:grid-cols-2">
          <PrivacyIntro />
          <PrivacyGrid />
        </div>
      </div>
    </section>
  );
}

/**
 * Renders privacy intro copy.
 */
function PrivacyIntro() {
  return (
    <div>
      <p className="font-bold text-blue-600">Privacy by design</p>
      <h2 className="mt-3 text-4xl font-black tracking-tight">Your aliases stay in your browser.</h2>
      <p className="mt-4 leading-7 text-slate-600">
        Gmail Alias Toolkit is designed as a local-first extension: generate
        aliases without a remote database, tracking script or analytics layer.
      </p>
    </div>
  );
}

/**
 * Renders privacy cards.
 */
function PrivacyGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {privacyItems.map((item) => (
        <PrivacyCard key={item.text} item={item} />
      ))}
    </div>
  );
}

/**
 * Renders one privacy card.
 */
function PrivacyCard({ item }: { item: (typeof privacyItems)[number] }) {
  const Icon = item.icon;

  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
      <Icon className="mb-4 h-6 w-6 text-blue-600" />
      <p className="font-black">{item.text}</p>
    </div>
  );
}

/**
 * Renders comparison section.
 */
function ComparisonSection() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-5xl px-5">
        <SectionHeading
          eyebrow="Why not manual?"
          title="Manual aliases are useful. Toolkit makes them manageable."
          desc="Gmail already supports plus addressing; this extension adds generation, organization and export."
        />
        <div className="mt-10 overflow-hidden rounded-3xl border border-slate-200">
          {[
            ["Random alias", true, false],
            ["History", true, false],
            ["Favorites", true, false],
            ["Export CSV / JSON", true, false],
            ["QR sharing", true, false],
          ].map(([label, toolkit, manual]) => (
            <ComparisonRow key={label as string} label={label as string} toolkit={Boolean(toolkit)} manual={Boolean(manual)} />
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Renders one comparison row.
 */
function ComparisonRow({ label, toolkit, manual }: { label: string; toolkit: boolean; manual: boolean }) {
  return (
    <div className="grid grid-cols-3 border-b border-slate-200 bg-white last:border-b-0">
      <div className="p-4 font-bold text-slate-700">{label}</div>
      <div className="grid place-items-center p-4 text-blue-600">{toolkit ? <Check className="h-5 w-5" /> : "—"}</div>
      <div className="grid place-items-center p-4 text-slate-400">{manual ? <Check className="h-5 w-5" /> : "—"}</div>
    </div>
  );
}

/**
 * Renders the final call to action section.
 */
function CtaSection() {
  return (
    <section className="mx-auto max-w-5xl px-5 py-24 text-center">
      <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-bold text-blue-700">
        <BarChart3 className="h-4 w-4" /> Generate · Copy · Track · Export
      </div>
      <h2 className="text-4xl font-black tracking-tight md:text-5xl">Ready to control your Gmail aliases?</h2>
      <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-600">
        Install Gmail Alias Toolkit to create traceable aliases for signups,
        newsletters, testing and everyday inbox protection.
      </p>
      <div className="mt-8 flex justify-center">
        <BeButton href={chromeUrl}>
          Add to Chrome <ArrowRight className="h-5 w-5" />
        </BeButton>
      </div>
    </section>
  );
}

/**
 * Renders the GitHub Pages landing page for Gmail Alias Toolkit.
 */
export function App() {
  return (
    <main className="min-h-screen overflow-hidden bg-slate-50 text-slate-950">
      <Header />
      <HeroSection />
      <DemoSection />
      <FeaturesSection />
      <FormatSection />
      <WorkflowSection />
      <PrivacySection />
      <ComparisonSection />
      <CtaSection />
    </main>
  );
}
