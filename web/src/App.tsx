import { motion } from 'framer-motion';
import {
  ArrowRight,
  BadgeCheck,
  Clipboard,
  Database,
  Download,
  EyeOff,
  Github,
  Mail,
  Moon,
  QrCode,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Tags,
  Users,
} from 'lucide-react';

const chromeUrl =
  'https://chromewebstore.google.com/detail/gmail-alias-toolkit/cbapjlppdfbnfbopdegobofmfijnlibl';
const githubUrl = 'https://github.com/ePlus-DEV/gmail-alias-toolkit';

const features = [
  ['Random Alias Generator', 'Create secure aliases with private-mail, alphanumeric, random words and timestamp formats.', Sparkles],
  ['Custom Tags & Presets', 'Save common tags for shopping, work, newsletters, testing and project-specific aliases.', Tags],
  ['Searchable History', 'Find generated aliases quickly with history, tags and account-based organization.', Search],
  ['Favorites', 'Pin aliases you reuse often so they are always one click away.', Star],
  ['QR Code Sharing', 'Turn aliases into QR codes for quick scan-and-share workflows.', QrCode],
  ['CSV / JSON Export', 'Export aliases for backup, migration or reporting.', Download],
  ['Multi-account Ready', 'Keep aliases separated by Gmail account for cleaner workflows.', Users],
  ['Local-first Privacy', 'Alias data stays in browser storage with no tracking or analytics.', ShieldCheck],
] as const;

const steps = [
  ['01', 'Choose a format', 'Pick random words, alphanumeric, timestamp or private-mail style.'],
  ['02', 'Generate alias', 'Create name+tag@gmail.com instantly and copy it to your clipboard.'],
  ['03', 'Organize later', 'Search history, favorite important aliases, export data when needed.'],
] as const;

function BeButton({ href, children, variant = 'primary' }: { href: string; children: React.ReactNode; variant?: 'primary' | 'secondary' }) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noreferrer"
      whileHover={{ y: -2, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={
        variant === 'primary'
          ? 'inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-glow transition hover:bg-blue-700'
          : 'inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-900 transition hover:border-slate-300 hover:bg-slate-50'
      }
    >
      {children}
    </motion.a>
  );
}

function TiltCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      whileHover={{ y: -6, rotateX: 2, rotateY: -2 }}
      transition={{ type: 'spring', stiffness: 260, damping: 18 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function App() {
  return (
    <main className="min-h-screen overflow-hidden bg-slate-50 text-slate-950">
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <a href="#" className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-blue-600 text-white shadow-glow">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-black leading-none">Gmail Alias</p>
              <p className="text-xs font-medium text-slate-500">Toolkit</p>
            </div>
          </a>

          <nav className="hidden items-center gap-7 text-sm font-semibold text-slate-600 md:flex">
            <a href="#features" className="hover:text-slate-950">Features</a>
            <a href="#workflow" className="hover:text-slate-950">Workflow</a>
            <a href="#privacy" className="hover:text-slate-950">Privacy</a>
          </nav>

          <BeButton href={chromeUrl}>Add to Chrome <ArrowRight className="h-4 w-4" /></BeButton>
        </div>
      </header>

      <section className="relative">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_25%_10%,rgba(37,99,235,.22),transparent_32%),radial-gradient(circle_at_78%_16%,rgba(20,184,166,.18),transparent_30%)]" />
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 lg:grid-cols-[1.05fr_.95fr] lg:py-28">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-4 py-2 text-sm font-bold text-blue-700 shadow-sm">
              <BadgeCheck className="h-4 w-4" /> Gmail plus addressing made simple
            </div>
            <h1 className="max-w-4xl text-5xl font-black tracking-tight md:text-7xl">
              Generate & manage Gmail aliases in seconds.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              Gmail Alias Toolkit helps you create <strong className="text-slate-950">name+tag@gmail.com</strong> aliases, save presets, manage history, favorite important aliases and export your data — directly in your browser.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <BeButton href={chromeUrl}>Install Extension <ArrowRight className="h-5 w-5" /></BeButton>
              <BeButton href={githubUrl} variant="secondary"><Github className="h-5 w-5" /> View GitHub</BeButton>
            </div>
            <div className="mt-10 grid max-w-xl grid-cols-3 gap-4">
              {['Local storage', 'No tracking', 'CSV/JSON export'].map((item) => (
                <div key={item} className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                  <p className="text-2xl font-black">{item.split(' ')[0]}</p>
                  <p className="text-sm text-slate-500">{item.split(' ').slice(1).join(' ')}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <TiltCard className="rounded-[2rem] border border-slate-200 bg-white p-4 shadow-2xl shadow-blue-950/10">
            <div className="rounded-[1.5rem] bg-slate-950 p-5 text-white">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">New alias</p>
                  <p className="text-xl font-black">private-mail-q2ga</p>
                </div>
                <Clipboard className="h-5 w-5 text-blue-300" />
              </div>
              <div className="rounded-2xl bg-white p-4 text-slate-950">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Generated Gmail</p>
                <p className="mt-2 break-all text-lg font-black">david+private-mail-q2ga@gmail.com</p>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {['shopping', 'work', 'newsletter', 'testing'].map((tag) => (
                  <div key={tag} className="rounded-2xl bg-white/10 px-4 py-3 text-sm font-semibold">#{tag}</div>
                ))}
              </div>
              <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="mb-3 flex items-center justify-between text-sm">
                  <span className="text-slate-300">Alias history</span>
                  <span className="font-bold text-blue-300">24 saved</span>
                </div>
                <div className="space-y-2">
                  {['david+shop-2026@gmail.com', 'david+github-test@gmail.com', 'david+newsletter@gmail.com'].map((item) => (
                    <div key={item} className="rounded-xl bg-white/10 px-3 py-2 text-sm text-slate-200">{item}</div>
                  ))}
                </div>
              </div>
            </div>
          </TiltCard>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-7xl px-5 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-bold text-blue-600">Feature set</p>
          <h2 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">Everything needed to control Gmail aliases</h2>
          <p className="mt-4 text-slate-600">A focused browser extension for faster alias creation, cleaner history and local-first privacy.</p>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {features.map(([title, desc, Icon]) => (
            <TiltCard key={title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-blue-50 text-blue-600"><Icon className="h-6 w-6" /></div>
              <h3 className="text-lg font-black">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{desc}</p>
            </TiltCard>
          ))}
        </div>
      </section>

      <section id="workflow" className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-5">
          <div className="grid gap-10 lg:grid-cols-[.75fr_1.25fr]">
            <div>
              <p className="font-bold text-blue-600">Workflow</p>
              <h2 className="mt-3 text-4xl font-black tracking-tight">From idea to usable alias</h2>
              <p className="mt-4 leading-7 text-slate-600">Use aliases to track signups, test forms, separate newsletters, protect your main email and identify who leaked your address.</p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {steps.map(([number, title, desc]) => (
                <motion.div key={number} whileHover={{ y: -5 }} className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                  <p className="text-sm font-black text-blue-600">{number}</p>
                  <h3 className="mt-4 text-xl font-black">{title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="privacy" className="mx-auto max-w-7xl px-5 py-20">
        <div className="rounded-[2rem] bg-slate-950 p-8 text-white md:p-12">
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <p className="font-bold text-blue-300">Privacy by design</p>
              <h2 className="mt-3 text-4xl font-black tracking-tight">Your aliases stay in your browser.</h2>
              <p className="mt-4 leading-7 text-slate-300">The extension is built around local browser storage. Generate aliases quickly without a remote API, analytics or tracking.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[[EyeOff, 'No analytics'], [ShieldCheck, 'No tracking'], [Database, 'Local storage'], [Moon, 'Light/Dark mode']].map(([Icon, text]) => {
                const PrivacyIcon = Icon as typeof ShieldCheck;
                return <div key={text as string} className="rounded-3xl border border-white/10 bg-white/5 p-5"><PrivacyIcon className="mb-4 h-6 w-6 text-blue-300" /><p className="font-black">{text as string}</p></div>;
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 pb-24 text-center">
        <h2 className="text-4xl font-black tracking-tight md:text-5xl">Ready to clean up your Gmail workflow?</h2>
        <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-600">Install Gmail Alias Toolkit to generate aliases faster, organize history and keep your email workflow under control.</p>
        <div className="mt-8 flex justify-center"><BeButton href={chromeUrl}>Add to Chrome <ArrowRight className="h-5 w-5" /></BeButton></div>
      </section>
    </main>
  );
}
