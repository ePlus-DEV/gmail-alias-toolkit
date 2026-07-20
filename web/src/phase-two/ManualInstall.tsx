import { useState } from "react";
import { motion } from "framer-motion";
import { Download, ExternalLink } from "lucide-react";
import { TEXT, URLS, type Locale } from "./content";

interface ManualInstallProps {
  locale: Locale;
}

/** Renders tabbed manual-install instructions for Chromium and Firefox. */
export function ManualInstall({ locale }: ManualInstallProps) {
  const text = TEXT[locale];
  const [platform, setPlatform] = useState<"chromium" | "firefox">("chromium");
  const steps =
    platform === "chromium" ? text.chromiumSteps : text.firefoxSteps;

  return (
    <section
      id="manual-install"
      className="border-b border-slate-200 bg-white py-20"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <p className="font-black text-blue-600">{text.installEyebrow}</p>
          <h2 className="mt-3 text-4xl font-black tracking-normal text-slate-950 md:text-5xl">
            {text.installTitle}
          </h2>
          <p className="mt-4 leading-7 text-slate-600">{text.installDesc}</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <a
              href={URLS.releases}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-black text-white"
            >
              <Download className="h-4 w-4" /> {text.release}
            </a>
            <a
              href={URLS.install}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-700 transition hover:border-blue-300 hover:text-blue-700"
            >
              <ExternalLink className="h-4 w-4" /> {text.guide}
            </a>
          </div>
          <p className="mt-4 text-xs font-bold text-slate-500">
            {text.warning}
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-blue-950/10">
          <InstallTabs
            locale={locale}
            active={platform}
            onChange={setPlatform}
          />
          <motion.ol
            key={platform}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-1 p-5"
          >
            {steps.map((step, index) => (
              <li
                key={step}
                className="grid grid-cols-[auto_minmax(0,1fr)] gap-3 rounded-xl p-3 hover:bg-slate-50"
              >
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-blue-100 text-xs font-black text-blue-700">
                  {index + 1}
                </span>
                <p className="pt-1 text-sm leading-6 text-slate-600">{step}</p>
              </li>
            ))}
          </motion.ol>
        </div>
      </div>
    </section>
  );
}

/** Renders platform tabs for the manual-install guide. */
function InstallTabs({
  locale,
  active,
  onChange,
}: {
  locale: Locale;
  active: "chromium" | "firefox";
  onChange: (platform: "chromium" | "firefox") => void;
}) {
  const text = TEXT[locale];
  return (
    <div className="grid grid-cols-2 gap-2 border-b border-slate-200 bg-slate-50 p-2">
      <button
        type="button"
        aria-pressed={active === "chromium"}
        onClick={() => onChange("chromium")}
        className={`h-11 rounded-xl text-xs font-black ${active === "chromium" ? "bg-white text-blue-700 shadow" : "text-slate-500"}`}
      >
        {text.chromium}
      </button>
      <button
        type="button"
        aria-pressed={active === "firefox"}
        onClick={() => onChange("firefox")}
        className={`h-11 rounded-xl text-xs font-black ${active === "firefox" ? "bg-white text-blue-700 shadow" : "text-slate-500"}`}
      >
        {text.firefox}
      </button>
    </div>
  );
}
