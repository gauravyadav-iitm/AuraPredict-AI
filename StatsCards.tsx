import { Database, Copy, AlertTriangle, CheckCircle2, Sparkles, TrendingUp } from 'lucide-react';
import type { CleanedDataSummary } from '@/types';
import { formatNumber } from '@/utils/csv';

interface StatsCardsProps {
  summary: CleanedDataSummary;
}

export default function StatsCards({ summary }: StatsCardsProps) {
  const cards = [
    {
      label: 'Total Records',
      value: summary.totalRecords,
      icon: Database,
      color: 'text-accent-400',
      bg: 'bg-accent-500/10',
      border: 'border-accent-500/20',
      hint: 'Raw rows ingested',
    },
    {
      label: 'Cleaned Records',
      value: summary.cleanedRecords,
      icon: CheckCircle2,
      color: 'text-primary-400',
      bg: 'bg-primary-500/10',
      border: 'border-primary-500/20',
      hint: 'Valid & deduplicated',
    },
    {
      label: 'Duplicates Removed',
      value: summary.duplicatesRemoved,
      icon: Copy,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
      hint: 'Exact-match dedup',
    },
    {
      label: 'Invalid Rows Dropped',
      value: summary.invalidRowsDropped,
      icon: AlertTriangle,
      color: 'text-red-400',
      bg: 'bg-red-500/10',
      border: 'border-red-500/20',
      hint: 'Missing critical fields',
    },
  ];

  return (
    <div className="space-y-4 animate-slide-up" style={{ animationDelay: '60ms' }}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-white">Cleaned Data Records</h3>
          <p className="text-xs text-ink-400 mt-0.5">AI-powered data quality summary after processing</p>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-primary-500/20 bg-primary-500/5 px-3 py-1.5">
          <Sparkles className="h-3.5 w-3.5 text-primary-400" strokeWidth={1.8} />
          <span className="text-xs font-medium text-primary-400">Auto-Cleaned</span>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className={`glass-panel rounded-xl p-4 lg:p-5 border ${card.border} transition-all duration-300 hover:scale-[1.02]`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${card.bg}`}>
                  <Icon className={`h-5 w-5 ${card.color}`} strokeWidth={1.8} />
                </div>
                <span className={`text-2xl font-bold font-mono ${card.color}`}>
                  {formatNumber(card.value)}
                </span>
              </div>
              <p className="text-sm font-medium text-ink-100">{card.label}</p>
              <p className="text-[11px] text-ink-400 mt-0.5">{card.hint}</p>
            </div>
          );
        })}
      </div>

      <div className="glass-panel rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary-400" strokeWidth={1.8} />
            <span className="text-sm font-medium text-ink-100">Data Quality Score</span>
          </div>
          <span className="text-lg font-bold font-mono text-primary-400">{summary.dataQualityScore.toFixed(1)}%</span>
        </div>
        <div className="relative h-2.5 rounded-full bg-ink-700/60 overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-primary-500 to-accent-400 transition-all duration-700 ease-out"
            style={{ width: `${summary.dataQualityScore}%` }}
          >
            <div className="absolute inset-0 shimmer-bg animate-shimmer" />
          </div>
        </div>
        <div className="mt-2 flex items-center justify-between text-[11px] text-ink-400">
          <span>{formatNumber(summary.missingValuesFilled)} missing values auto-filled</span>
          <span>Target: 95%+</span>
        </div>
      </div>
    </div>
  );
}
