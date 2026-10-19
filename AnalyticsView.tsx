import { useMemo } from 'react';
import { TrendingUp, TrendingDown, Users, DollarSign, Activity, AlertCircle } from 'lucide-react';
import RiskDistribution from '@/components/RiskDistribution';
import type { CustomerRecord, RiskLevel } from '@/types';
import { formatCurrency, formatNumber } from '@/utils/csv';

interface AnalyticsViewProps {
  customers: CustomerRecord[];
}

const riskColors: Record<RiskLevel, string> = {
  High: 'text-red-400',
  Medium: 'text-amber-400',
  Low: 'text-primary-400',
};

const riskBg: Record<RiskLevel, string> = {
  High: 'bg-red-500',
  Medium: 'bg-amber-500',
  Low: 'bg-primary-500',
};

export default function AnalyticsView({ customers }: AnalyticsViewProps) {
  const metrics = useMemo(() => {
    const total = customers.length;
    const totalRevenue = customers.reduce((sum, c) => sum + c.monthlyRevenue, 0);
    const avgChurnScore = total > 0 ? customers.reduce((sum, c) => sum + c.churnScore, 0) / total : 0;
    const highRisk = customers.filter((c) => c.riskLevel === 'High').length;
    const atRiskRevenue = customers.filter((c) => c.riskLevel !== 'Low').reduce((sum, c) => sum + c.monthlyRevenue, 0);
    const avgLastLogin = total > 0 ? customers.reduce((sum, c) => sum + c.lastLoginDays, 0) / total : 0;
    const avgTickets = total > 0 ? customers.reduce((sum, c) => sum + c.supportTickets, 0) / total : 0;

    const planCounts = customers.reduce<Record<string, number>>((acc, c) => {
      acc[c.plan] = (acc[c.plan] ?? 0) + 1;
      return acc;
    }, {});

    const trendCounts = {
      Up: customers.filter((c) => c.usageTrend === 'Up').length,
      Down: customers.filter((c) => c.usageTrend === 'Down').length,
      Stable: customers.filter((c) => c.usageTrend === 'Stable').length,
    };

    return {
      total,
      totalRevenue,
      avgChurnScore,
      highRisk,
      atRiskRevenue,
      avgLastLogin,
      avgTickets,
      planCounts,
      trendCounts,
    };
  }, [customers]);

  const insightCards = [
    {
      label: 'Total Revenue',
      value: formatCurrency(metrics.totalRevenue),
      icon: DollarSign,
      color: 'text-primary-400',
      bg: 'bg-primary-500/10',
      border: 'border-primary-500/20',
    },
    {
      label: 'Avg Churn Score',
      value: metrics.avgChurnScore.toFixed(1),
      icon: Activity,
      color: metrics.avgChurnScore >= 50 ? 'text-red-400' : metrics.avgChurnScore >= 30 ? 'text-amber-400' : 'text-primary-400',
      bg: metrics.avgChurnScore >= 50 ? 'bg-red-500/10' : metrics.avgChurnScore >= 30 ? 'bg-amber-500/10' : 'bg-primary-500/10',
      border: metrics.avgChurnScore >= 50 ? 'border-red-500/20' : metrics.avgChurnScore >= 30 ? 'border-amber-500/20' : 'border-primary-500/20',
    },
    {
      label: 'High-Risk Customers',
      value: formatNumber(metrics.highRisk),
      icon: AlertCircle,
      color: 'text-red-400',
      bg: 'bg-red-500/10',
      border: 'border-red-500/20',
    },
    {
      label: 'Revenue at Risk',
      value: formatCurrency(metrics.atRiskRevenue),
      icon: TrendingDown,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
    },
    {
      label: 'Avg Days Since Login',
      value: `${metrics.avgLastLogin.toFixed(0)}d`,
      icon: Users,
      color: 'text-accent-400',
      bg: 'bg-accent-500/10',
      border: 'border-accent-500/20',
    },
    {
      label: 'Avg Support Tickets',
      value: metrics.avgTickets.toFixed(1),
      icon: Activity,
      color: 'text-ink-200',
      bg: 'bg-ink-700/40',
      border: 'border-ink-600',
    },
  ];

  const planEntries = Object.entries(metrics.planCounts).sort((a, b) => b[1] - a[1]);
  const maxPlanCount = Math.max(...planEntries.map((e) => e[1]), 1);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {insightCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className={`glass-panel rounded-xl p-5 border ${card.border} transition-all duration-300 hover:scale-[1.02]`}>
              <div className="flex items-center gap-3 mb-3">
                <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${card.bg}`}>
                  <Icon className={`h-4.5 w-4.5 ${card.color}`} strokeWidth={1.8} />
                </div>
                <span className="text-xs text-ink-400">{card.label}</span>
              </div>
              <p className={`text-2xl font-bold font-mono ${card.color}`}>{card.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-1">
          <RiskDistribution customers={customers} />
        </div>

        <div className="xl:col-span-2 space-y-6">
          <div className="glass-panel rounded-2xl p-5 lg:p-6 animate-slide-up">
            <h3 className="text-base font-semibold text-white mb-1">Plan Distribution</h3>
            <p className="text-xs text-ink-400 mb-5">Customer breakdown by subscription tier</p>
            <div className="space-y-3">
              {planEntries.map(([plan, count]) => (
                <div key={plan} className="flex items-center gap-4">
                  <span className="text-sm text-ink-200 w-24 flex-shrink-0">{plan}</span>
                  <div className="flex-1 h-6 rounded-lg bg-ink-700/40 overflow-hidden">
                    <div
                      className="h-full rounded-lg bg-gradient-to-r from-primary-500 to-accent-400 transition-all duration-700"
                      style={{ width: `${(count / maxPlanCount) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-mono text-ink-300 w-10 text-right">{count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel rounded-2xl p-5 lg:p-6 animate-slide-up" style={{ animationDelay: '60ms' }}>
            <h3 className="text-base font-semibold text-white mb-1">Usage Trend Signals</h3>
            <p className="text-xs text-ink-400 mb-5">Behavioral momentum across the customer base</p>
            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-xl border border-primary-500/20 bg-primary-500/5 p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <TrendingUp className="h-5 w-5 text-primary-400" strokeWidth={1.8} />
                </div>
                <p className="text-2xl font-bold font-mono text-primary-400">{metrics.trendCounts.Up}</p>
                <p className="text-xs text-ink-400 mt-1">Trending Up</p>
              </div>
              <div className="rounded-xl border border-ink-600 bg-ink-700/20 p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Activity className="h-5 w-5 text-ink-300" strokeWidth={1.8} />
                </div>
                <p className="text-2xl font-bold font-mono text-ink-200">{metrics.trendCounts.Stable}</p>
                <p className="text-xs text-ink-400 mt-1">Stable</p>
              </div>
              <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <TrendingDown className="h-5 w-5 text-red-400" strokeWidth={1.8} />
                </div>
                <p className="text-2xl font-bold font-mono text-red-400">{metrics.trendCounts.Down}</p>
                <p className="text-xs text-ink-400 mt-1">Trending Down</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
