import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { BarChart3, Check, Clock, Mail, Tags } from "lucide-react";
import { AnimatedNumber } from "src/components/motion/animated-number";
import Button from "./Button";
import { getAccountStorageKey } from "../utils";
import { t } from "../../../lib/i18n";

interface Stats {
  totalGenerated: number;
  mostUsedTag: string;
  createdToday: number;
  createdThisWeek: number;
  createdThisMonth: number;
  totalTags: number;
  tags: Record<string, number>;
  recent: { timestamp: number }[];
}

interface StoredAccount {
  email: string;
  isActive: boolean;
}

interface RecentAlias {
  timestamp: number;
}

type StorageChanges = Record<
  string,
  { newValue?: unknown; oldValue?: unknown }
>;

interface StatCardProps {
  icon: ReactNode;
  value: ReactNode;
  label: string;
}

/** Displays a statistics card with icon, value, and label. */
function StatCard({ icon, value, label }: StatCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card/85 p-3 shadow-sm">
      <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
        {icon}
      </div>
      <div className="truncate text-lg font-bold text-foreground">{value}</div>
      <p className="mt-0.5 truncate text-[11px] font-medium text-muted-foreground">
        {label}
      </p>
    </div>
  );
}

/** Renders a bar chart comparing alias creation counts for today, week, and month. */
function TimelineChart({
  today,
  week,
  month,
}: {
  today: number;
  week: number;
  month: number;
}) {
  const max = Math.max(today, week, month, 1);
  const height = 80;
  const barWidth = 20;
  const spacing = 16;
  const padding = 12;

  return (
    <svg
      viewBox={`0 0 ${padding * 2 + barWidth * 3 + spacing * 2} ${height + padding * 2}`}
      className="w-full h-24"
    >
      <defs>
        <linearGradient id="barGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop
            offset="0%"
            stopColor="var(--color-primary)"
            stopOpacity="0.8"
          />
          <stop
            offset="100%"
            stopColor="var(--color-primary)"
            stopOpacity="0.4"
          />
        </linearGradient>
      </defs>

      {[
        { label: "Today", value: today, x: padding },
        {
          label: "Week",
          value: week,
          x: padding + barWidth + spacing,
        },
        {
          label: "Month",
          value: month,
          x: padding + (barWidth + spacing) * 2,
        },
      ].map((item) => {
        const barHeight = Math.max(10, (item.value / max) * (height - 10));
        const barY = height + padding - barHeight;
        return (
          <g key={item.label}>
            <rect
              x={item.x}
              y={barY}
              width={barWidth}
              height={barHeight}
              fill="url(#barGradient)"
              rx="4"
            />
            <text
              x={item.x + barWidth / 2}
              y={height + padding + 12}
              textAnchor="middle"
              fontSize="10"
              fill="var(--color-muted-foreground)"
            >
              {item.label}
            </text>
            <text
              x={item.x + barWidth / 2}
              y={barY - 4}
              textAnchor="middle"
              fontSize="11"
              fontWeight="bold"
              fill="var(--color-foreground)"
            >
              {item.value}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/** Renders a pie chart showing the top 5 most used tags with distribution percentages. */
function TagChart({ tags }: { tags: Record<string, number> }) {
  const topTags = Object.entries(tags)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  if (topTags.length === 0) {
    return (
      <div className="flex items-center justify-center h-24 text-xs text-muted-foreground">
        {t("noTagsYet")}
      </div>
    );
  }

  const total = topTags.reduce((sum, [, count]) => sum + count, 0);
  const colors = ["#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981"];

  let currentAngle = -90;
  const cx = 50;
  const cy = 50;
  const radius = 35;

  const slices = topTags.map(([tag, count], colorIndex) => {
    const sliceAngle = (count / total) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + sliceAngle;
    currentAngle = endAngle;

    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    const x1 = cx + radius * Math.cos(startRad);
    const y1 = cy + radius * Math.sin(startRad);
    const x2 = cx + radius * Math.cos(endRad);
    const y2 = cy + radius * Math.sin(endRad);

    const largeArc = sliceAngle > 180 ? 1 : 0;

    const pathData = [
      `M ${cx} ${cy}`,
      `L ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
      "Z",
    ].join(" ");

    const midAngle = (startAngle + endAngle) / 2;
    const midRad = (midAngle * Math.PI) / 180;
    const labelRadius = radius * 0.65;
    const labelX = cx + labelRadius * Math.cos(midRad);
    const labelY = cy + labelRadius * Math.sin(midRad);

    return (
      <g key={tag}>
        <path
          d={pathData}
          fill={colors[colorIndex % colors.length]}
          opacity="0.8"
        />
        <text
          x={labelX}
          y={labelY}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="9"
          fontWeight="bold"
          fill="white"
        >
          {Math.round((count / total) * 100)}%
        </text>
      </g>
    );
  });

  return (
    <div>
      <svg viewBox="0 0 120 110" className="w-full h-24 mx-auto">
        {slices}
      </svg>
      <div className="mt-2 space-y-1">
        {topTags.map(([tag, count], i) => (
          <div key={tag} className="flex items-center gap-2 text-xs">
            <div
              className="w-2 h-2 rounded"
              style={{ backgroundColor: colors[i % colors.length] }}
            />
            <span className="text-muted-foreground truncate">{tag}</span>
            <span className="text-foreground font-medium ml-auto">{count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Main statistics panel component with tabbed view for metrics, timeline, and tags. */
export default function Statistics() {
  const [stats, setStats] = useState<Stats>({
    totalGenerated: 0,
    mostUsedTag: "-",
    createdToday: 0,
    createdThisWeek: 0,
    createdThisMonth: 0,
    totalTags: 0,
    tags: {},
    recent: [],
  });
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"metrics" | "timeline" | "tags">(
    "metrics",
  );

  /** Loads active email account and fetches associated statistics from storage. */
  const loadActiveEmailAndStats = async () => {
    const accountResult = await browser.storage.local.get([
      "email_accounts",
      "base_email",
    ]);
    let email = "your.email@gmail.com";

    if (
      accountResult.email_accounts &&
      Array.isArray(accountResult.email_accounts)
    ) {
      const activeAccount = (
        accountResult.email_accounts as StoredAccount[]
      ).find((acc) => acc.isActive);
      if (activeAccount) {
        email = activeAccount.email;
      }
    } else if (accountResult.base_email) {
      email = accountResult.base_email as string;
    }

    const historyKey = getAccountStorageKey(email, "gmail_alias_recent");
    const statsKey = getAccountStorageKey(email, "alias_stats");

    const result = await browser.storage.local.get([historyKey, statsKey]);
    const recent = (result[historyKey] || []) as RecentAlias[];
    const savedStats = (result[statsKey] || { total: 0, tags: {} }) as {
      total: number;
      tags: Record<string, number>;
    };

    const now = new Date();
    const today = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    ).getTime();
    const weekAgo = today - 7 * 24 * 60 * 60 * 1000;
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();

    const createdToday = recent.filter((a) => a.timestamp >= today).length;
    const createdThisWeek = recent.filter((a) => a.timestamp >= weekAgo).length;
    const createdThisMonth = recent.filter(
      (a) => a.timestamp >= monthStart,
    ).length;

    const tags = savedStats.tags || {};
    const mostUsedTag =
      Object.keys(tags).length > 0
        ? Object.entries(tags).sort((a, b) => b[1] - a[1])[0][0]
        : "-";
    const totalTags = Object.keys(tags).length;

    setStats({
      totalGenerated: savedStats.total || 0,
      mostUsedTag,
      createdToday,
      createdThisWeek,
      createdThisMonth,
      totalTags,
      tags,
      recent,
    });
  };

  useEffect(() => {
    loadActiveEmailAndStats();

    /** Handles storage changes and reloads stats if relevant keys change. */
    const handleStorageChange = (changes: StorageChanges) => {
      if (changes.email_accounts) {
        loadActiveEmailAndStats();
      } else {
        const changedKeys = Object.keys(changes);
        const relevantChange = changedKeys.some(
          (key) =>
            key.startsWith("gmail_alias_recent_") ||
            key.startsWith("alias_stats_"),
        );
        if (relevantChange) {
          loadActiveEmailAndStats();
        }
      }
    };

    browser.storage.onChanged.addListener(handleStorageChange);
    return () => browser.storage.onChanged.removeListener(handleStorageChange);
  }, []);

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        variant="ghost"
        className="w-full p-3.5 flex items-center justify-between hover:bg-muted/40 dark:hover:bg-muted/50 transition-colors"
      >
        <span className="text-sm font-medium text-foreground">
          {t("viewStatistics")}
        </span>
        <BarChart3 className="h-4 w-4 text-muted-foreground" />
      </Button>
    );
  }

  return (
    <div className="p-3.5">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-foreground">
          {t("statistics")}
        </h2>
        <Button
          onClick={() => setIsOpen(false)}
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-muted-foreground"
          aria-label={t("close")}
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </Button>
      </div>

      <div className="flex gap-1 mb-3 bg-muted/70 p-1 rounded-lg border border-border/50">
        {(
          [
            { label: t("metricsTab"), value: "metrics" },
            { label: t("timelineTab"), value: "timeline" },
            { label: t("tagsTab"), value: "tags" },
          ] as const
        ).map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`flex-1 rounded-lg px-2 py-1.5 text-xs font-medium transition-colors ${
              activeTab === tab.value
                ? "bg-background text-primary shadow-sm"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "metrics" && (
        <div className="grid grid-cols-2 gap-2">
          <StatCard
            icon={<Mail className="h-4 w-4" />}
            value={<AnimatedNumber value={stats.totalGenerated} />}
            label={t("totalGenerated")}
          />
          <StatCard
            icon={<Check className="h-4 w-4" />}
            value={<AnimatedNumber value={stats.createdToday} />}
            label={t("createdToday")}
          />
          <StatCard
            icon={<Clock className="h-4 w-4" />}
            value={<AnimatedNumber value={stats.createdThisWeek} />}
            label={t("thisWeek")}
          />
          <StatCard
            icon={<BarChart3 className="h-4 w-4" />}
            value={<AnimatedNumber value={stats.createdThisMonth} />}
            label={t("thisMonth")}
          />
          <StatCard
            icon={<Tags className="h-4 w-4" />}
            value={stats.mostUsedTag}
            label={t("topTag")}
          />
          <StatCard
            icon={<BarChart3 className="h-4 w-4" />}
            value={<AnimatedNumber value={stats.totalTags} />}
            label={t("totalTags")}
          />
        </div>
      )}

      {activeTab === "timeline" && (
        <div className="bg-card/85 p-3 rounded-xl border border-border">
          <TimelineChart
            today={stats.createdToday}
            week={stats.createdThisWeek}
            month={stats.createdThisMonth}
          />
        </div>
      )}

      {activeTab === "tags" && (
        <div className="bg-card/85 p-3 rounded-xl border border-border">
          <TagChart tags={stats.tags} />
        </div>
      )}
    </div>
  );
}
