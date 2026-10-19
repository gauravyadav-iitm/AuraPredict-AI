import { useMemo } from 'react';
import type { CustomerRecord, RiskLevel } from '@/types';

interface RiskDistributionProps {
  customers: CustomerRecord[];
}

const riskConfig: Record<RiskLevel, { color: string; bg: string; label: string; ring: string }> = {
  High: { color: 'text-red-400', bg: 'bg-red-500', label: 'High Risk', ring: 'shadow-red-500/30' },
  Medium: { color: 'text-amber-400', bg: 'bg-amber-500', label: 'Medium Risk', ring: 'shadow-amber-500/30' },
  Low: { color: 'text-primary-400', bg: 'bg-primary-500', label: 'Low Risk', ring: 'shadow-primary-500/30' },
};

export default function RiskDistribution({ customers }: RiskDistributionProps) {
  const distribution = useMemo(() => {
    const counts = { High: 0, Medium: 0, Low: 0 };
    customers.forEach((c) => {
      counts[c.riskLevel]++;
    });
    return counts;
  }, [customers]);

  const total = customers.length;
  const highPct = total > 0 ? (distribution.High / total) * 100 : 0;
  const medPct = total > 0 ? (distribution.Medium / total) * 100 : 0;
  const lowPct = total > 0 ? (distribution.Low / total) * 100 : 0;

  const barData = [
    { level: 'High' as RiskLevel, count: distribution.High, pct: highPct },
    { level: 'Medium' as RiskLevel, count: distribution.Medium, pct: medPct },
    { level: 'Low' as RiskLevel, count: distribution.Low, pct: lowPct },
  ];

  return (
    <div className="glass-panel rounded-2xl p-5 lg:p-6 animate-slide-up" style={{ animationDelay: '120ms' }}>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-base font-semibold text-white">Risk Distribution</h3>
          <p className="text-xs text-ink-400 mt-0.5">Customer churn risk breakdown</p>
        </div>
        <span className="text-xs font-mono text-ink-400">{total} total</span>
      </div>

      <div className="flex items-end justify-around gap-4 h-40 mb-5">
        {barData.map((bar) => {
          const config = riskConfig[bar.level];
          const height = Math.max(bar.pct, 2);
          return (
            <div key={bar.level} className="flex-1 flex flex-col items-center justify-end h-full group">
              <span className={`text-sm font-bold font-mono mb-2 ${config.color}`}>
                {bar.count}
              </span>
              <div className="relative w-full max-w-[60px] flex items-end justify-center" style={{ height: '100%' }}>
                <div
                  className={`w-full rounded-t-lg ${config.bg} shadow-lg ${config.ring} transition-all duration-500 group-hover:opacity-90`}
                  style={{ height: `${height}%`, minHeight: '8px' }}
                />
              </div>
              <span className="text-[11px] text-ink-300 mt-2 text-center">{config.label}</span>
            </div>
          );
        })}
      </div>

      <div className="relative h-3 rounded-full overflow-hidden bg-ink-700/60 flex">
        <div className="bg-red-500 transition-all duration-700" style={{ width: `${highPct}%` }} />
        <div className="bg-amber-500 transition-all duration-700" style={{ width: `${medPct}%` }} />
        <div className="bg-primary-500 transition-all duration-700" style={{ width: `${lowPct}%` }} />
      </div>

      <div className="mt-3 flex items-center justify-between text-[11px]">
        <span className="flex items-center gap-1.5 text-red-400">
          <span className="h-2 w-2 rounded-full bg-red-500" /> {highPct.toFixed(0)}% High
        </span>
        <span className="flex items-center gap-1.5 text-amber-400">
          <span className="h-2 w-2 rounded-full bg-amber-500" /> {medPct.toFixed(0)}% Medium
        </span>
        <span className="flex items-center gap-1.5 text-primary-400">
          <span className="h-2 w-2 rounded-full bg-primary-500" /> {lowPct.toFixed(0)}% Low
        </span>
      </div>
    </div>
  );
}
