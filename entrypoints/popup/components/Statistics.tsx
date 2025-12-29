import { useState, useEffect } from 'react';

interface Stats {
  totalGenerated: number;
  mostUsedTag: string;
  createdToday: number;
  createdThisWeek: number;
}

export default function Statistics() {
  const [stats, setStats] = useState<Stats>({
    totalGenerated: 0,
    mostUsedTag: '-',
    createdToday: 0,
    createdThisWeek: 0,
  });
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const result = await browser.storage.local.get(['gmail_alias_recent', 'alias_stats']);
    const recent = (result.gmail_alias_recent || []) as any[];
    const savedStats = (result.alias_stats || { total: 0, tags: {} }) as { total: number; tags: Record<string, number> };

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const weekAgo = today - 7 * 24 * 60 * 60 * 1000;

    const createdToday = recent.filter((a: any) => a.timestamp >= today).length;
    const createdThisWeek = recent.filter((a: any) => a.timestamp >= weekAgo).length;

    // Find most used tag
    const tags = savedStats.tags || {};
    const mostUsedTag = Object.keys(tags).length > 0
      ? Object.entries(tags).sort((a: any, b: any) => b[1] - a[1])[0][0]
      : '-';

    setStats({
      totalGenerated: savedStats.total || 0,
      mostUsedTag,
      createdToday,
      createdThisWeek,
    });
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full bg-white rounded-lg shadow-sm border border-gray-200 p-3 hover:shadow-md transition-shadow"
      >
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">View Statistics</span>
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
      </button>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-gray-900">Statistics</h2>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-400 hover:text-gray-600"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-blue-50 rounded-lg p-3">
          <div className="text-2xl font-bold text-blue-600">{stats.totalGenerated}</div>
          <div className="text-xs text-blue-700 mt-1">Total Generated</div>
        </div>

        <div className="bg-purple-50 rounded-lg p-3">
          <div className="text-2xl font-bold text-purple-600">{stats.createdToday}</div>
          <div className="text-xs text-purple-700 mt-1">Created Today</div>
        </div>

        <div className="bg-green-50 rounded-lg p-3">
          <div className="text-2xl font-bold text-green-600">{stats.createdThisWeek}</div>
          <div className="text-xs text-green-700 mt-1">This Week</div>
        </div>

        <div className="bg-orange-50 rounded-lg p-3">
          <div className="text-sm font-bold text-orange-600 truncate">{stats.mostUsedTag}</div>
          <div className="text-xs text-orange-700 mt-1">Most Used Tag</div>
        </div>
      </div>
    </div>
  );
}
