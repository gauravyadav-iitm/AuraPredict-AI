import { useMemo, useState, useEffect } from 'react';
import { AlertTriangle, ArrowUpDown, Search, TrendingDown, TrendingUp, Minus, Send, CheckCircle2, MessageSquare, X, Loader2 } from 'lucide-react';
import type { CustomerRecord, RiskLevel } from '@/types';
import { formatCurrency } from '@/utils/csv';

interface ChurnRiskTableProps {
  customers: CustomerRecord[];
}

type SortKey = 'churnScore' | 'customerName' | 'monthlyRevenue' | 'lastLoginDays';
type SortDir = 'asc' | 'desc';

const riskConfig: Record<RiskLevel, {
  label: string;
  text: string;
  bg: string;
  border: string;
  dot: string;
}> = {
  High: {
    label: 'High',
    text: 'text-red-400',
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    dot: 'bg-red-500',
  },
  Medium: {
    label: 'Medium',
    text: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    dot: 'bg-amber-500',
  },
  Low: {
    label: 'Low',
    text: 'text-primary-400',
    bg: 'bg-primary-500/10',
    border: 'border-primary-500/20',
    dot: 'bg-primary-500',
  },
};

const trendIcon = {
  Up: { icon: TrendingUp, color: 'text-primary-400' },
  Down: { icon: TrendingDown, color: 'text-red-400' },
  Stable: { icon: Minus, color: 'text-ink-300' },
};

type FilterLevel = 'All' | RiskLevel;

type CampaignState = 'idle' | 'sending' | 'sent';
interface CampaignNotification {
  id: string;
  customerName: string;
  customerEmail: string;
}

export default function ChurnRiskTable({ customers }: ChurnRiskTableProps) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterLevel>('All');
  const [sortKey, setSortKey] = useState<SortKey>('churnScore');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [campaignStates, setCampaignStates] = useState<Record<string, CampaignState>>({});
  const [notifications, setNotifications] = useState<CampaignNotification[]>([]);
  const [visibleNotification, setVisibleNotification] = useState<CampaignNotification | null>(null);
  const [notificationExiting, setNotificationExiting] = useState(false);

  const triggerCampaign = (customer: CustomerRecord) => {
    if (campaignStates[customer.id] === 'sending' || campaignStates[customer.id] === 'sent') return;
    setCampaignStates((prev) => ({ ...prev, [customer.id]: 'sending' }));

    setTimeout(() => {
      setCampaignStates((prev) => ({ ...prev, [customer.id]: 'sent' }));
      const notif: CampaignNotification = {
        id: customer.id,
        customerName: customer.customerName,
        customerEmail: customer.email,
      };
      setNotifications((prev) => [...prev, notif]);
    }, 2200);
  };

  useEffect(() => {
    if (notifications.length > 0 && !visibleNotification) {
      setVisibleNotification(notifications[0]);
      setNotificationExiting(false);
    }
  }, [notifications, visibleNotification]);

  const dismissNotification = () => {
    setNotificationExiting(true);
    setTimeout(() => {
      setVisibleNotification(null);
      setNotificationExiting(false);
      setNotifications((prev) => prev.slice(1));
    }, 300);
  };

  useEffect(() => {
    if (visibleNotification && !notificationExiting) {
      const timer = setTimeout(() => dismissNotification(), 6000);
      return () => clearTimeout(timer);
    }
  }, [visibleNotification, notificationExiting]);

  const filtered = useMemo(() => {
    let result = [...customers];

    if (filter !== 'All') {
      result = result.filter((c) => c.riskLevel === filter);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.customerName.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.id.toLowerCase().includes(q)
      );
    }

    result.sort((a, b) => {
      let cmp: number;
      switch (sortKey) {
        case 'customerName':
          cmp = a.customerName.localeCompare(b.customerName);
          break;
        case 'monthlyRevenue':
          cmp = a.monthlyRevenue - b.monthlyRevenue;
          break;
        case 'lastLoginDays':
          cmp = a.lastLoginDays - b.lastLoginDays;
          break;
        default:
          cmp = a.churnScore - b.churnScore;
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });

    return result;
  }, [customers, search, filter, sortKey, sortDir]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  };

  const filterButtons: { label: string; value: FilterLevel; activeClass: string }[] = [
    { label: 'All', value: 'All', activeClass: 'bg-ink-700 text-ink-100 border-ink-600' },
    { label: 'High', value: 'High', activeClass: 'bg-red-500/15 text-red-400 border-red-500/30' },
    { label: 'Medium', value: 'Medium', activeClass: 'bg-amber-500/15 text-amber-400 border-amber-500/30' },
    { label: 'Low', value: 'Low', activeClass: 'bg-primary-500/15 text-primary-400 border-primary-500/30' },
  ];

  const headerStyle = 'px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-ink-400 cursor-pointer hover:text-ink-200 transition-colors select-none';

  return (
    <div className="glass-panel rounded-2xl overflow-hidden animate-slide-up" style={{ animationDelay: '180ms' }}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 border-b border-ink-700/40">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-500/10 border border-red-500/20">
            <AlertTriangle className="h-4.5 w-4.5 text-red-400" strokeWidth={1.8} />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">Customer Churn Risk Alert</h3>
            <p className="text-xs text-ink-400 mt-0.5">AI-scored risk levels across your customer base</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-lg border border-ink-700/60 bg-ink-850/60 px-3 py-2">
            <Search className="h-3.5 w-3.5 text-ink-400" strokeWidth={1.8} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-28 sm:w-36 bg-transparent text-sm text-ink-100 placeholder:text-ink-400 outline-none"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 px-5 py-3 border-b border-ink-700/40 overflow-x-auto">
        {filterButtons.map((btn) => (
          <button
            key={btn.value}
            onClick={() => setFilter(btn.value)}
            className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
              filter === btn.value
                ? btn.activeClass
                : 'border-ink-700/40 text-ink-400 hover:text-ink-200 hover:border-ink-600'
            }`}
          >
            {btn.label}
          </button>
        ))}
        <span className="ml-auto text-xs font-mono text-ink-400 whitespace-nowrap">
          {filtered.length} {filtered.length === 1 ? 'result' : 'results'}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[960px]">
          <thead>
            <tr className="border-b border-ink-700/40 bg-ink-850/40">
              <th className={headerStyle}>Customer</th>
              <th className={headerStyle}>Plan</th>
              <th
                className={`${headerStyle} tabular-nums`}
                onClick={() => toggleSort('monthlyRevenue')}
              >
                <span className="inline-flex items-center gap-1">
                  MRR
                  <ArrowUpDown className="h-3 w-3" />
                </span>
              </th>
              <th className={`${headerStyle} tabular-nums hidden lg:table-cell`}>Last Login</th>
              <th className={`${headerStyle} hidden lg:table-cell`}>Usage</th>
              <th
                className={`${headerStyle} tabular-nums`}
                onClick={() => toggleSort('churnScore')}
              >
                <span className="inline-flex items-center gap-1">
                  Churn Score
                  <ArrowUpDown className="h-3 w-3" />
                </span>
              </th>
              <th className={headerStyle}>Risk Level</th>
              <th className={`${headerStyle} text-right`}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((customer, idx) => {
              const risk = riskConfig[customer.riskLevel];
              const Trend = trendIcon[customer.usageTrend as keyof typeof trendIcon];
              const TrendIcon = Trend.icon;
              return (
                <tr
                  key={customer.id}
                  className="border-b border-ink-700/30 hover:bg-ink-700/20 transition-colors group"
                  style={{ animationDelay: `${idx * 20}ms` }}
                >
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg text-[10px] font-bold ${risk.bg} ${risk.text} ${risk.border} border`}>
                        {customer.customerName.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-ink-100 truncate group-hover:text-white transition-colors">
                          {customer.customerName}
                        </p>
                        <p className="text-[11px] text-ink-400 truncate font-mono">{customer.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`rounded-md px-2 py-0.5 text-[11px] font-medium border ${
                      customer.plan === 'Enterprise'
                        ? 'bg-accent-500/10 text-accent-400 border-accent-500/20'
                        : customer.plan === 'Pro'
                        ? 'bg-primary-500/10 text-primary-400 border-primary-500/20'
                        : 'bg-ink-700/60 text-ink-300 border-ink-600'
                    }`}>
                      {customer.plan}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-sm font-mono text-ink-100 tabular-nums">
                    {formatCurrency(customer.monthlyRevenue)}
                  </td>
                  <td className="px-4 py-3.5 hidden lg:table-cell">
                    <span className={`text-sm font-mono tabular-nums ${
                      customer.lastLoginDays > 30
                        ? 'text-red-400'
                        : customer.lastLoginDays > 14
                        ? 'text-amber-400'
                        : 'text-ink-100'
                    }`}>
                      {customer.lastLoginDays}d ago
                    </span>
                  </td>
                  <td className="px-4 py-3.5 hidden lg:table-cell">
                    <span className={`inline-flex items-center gap-1 text-sm ${Trend.color}`}>
                      <TrendIcon className="h-3.5 w-3.5" strokeWidth={2} />
                      {customer.usageTrend}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="relative w-16 h-1.5 rounded-full bg-ink-700/60 overflow-hidden">
                        <div
                          className={`absolute inset-y-0 left-0 rounded-full ${
                            customer.churnScore >= 60 ? 'bg-red-500'
                            : customer.churnScore >= 35 ? 'bg-amber-500'
                            : 'bg-primary-500'
                          }`}
                          style={{ width: `${customer.churnScore}%` }}
                        />
                      </div>
                      <span className={`text-sm font-bold font-mono tabular-nums ${
                        customer.churnScore >= 60 ? 'text-red-400'
                        : customer.churnScore >= 35 ? 'text-amber-400'
                        : 'text-primary-400'
                      }`}>
                        {customer.churnScore}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${risk.bg} ${risk.text} ${risk.border}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${risk.dot} ${customer.riskLevel === 'High' ? 'animate-pulse-glow' : ''}`} />
                      {risk.label}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    {customer.riskLevel === 'High' ? (
                      (() => {
                        const state = campaignStates[customer.id] ?? 'idle';
                        if (state === 'sent') {
                          return (
                            <span className="inline-flex items-center gap-1.5 rounded-lg border border-primary-500/30 bg-primary-500/10 px-3 py-1.5 text-xs font-semibold text-primary-400">
                              <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={2} />
                              Sent
                            </span>
                          );
                        }
                        if (state === 'sending') {
                          return (
                            <span className="inline-flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-400">
                              <Loader2 className="h-3.5 w-3.5 animate-spin" strokeWidth={2} />
                              Sending...
                            </span>
                          );
                        }
                        return (
                          <button
                            onClick={() => triggerCampaign(customer)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-400 hover:bg-amber-500/20 hover:border-amber-500/50 transition-all duration-200 hover:scale-105 active:scale-95"
                          >
                            <Send className="h-3.5 w-3.5" strokeWidth={1.8} />
                            Trigger Retention Campaign
                          </button>
                        );
                      })()
                    ) : (
                      <span className="text-xs text-ink-400">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <Search className="h-8 w-8 text-ink-500 mb-3" strokeWidth={1.5} />
            <p className="text-sm text-ink-400">No customers match your filters</p>
          </div>
        )}
      </div>

      {visibleNotification && (
        <div
          className={`px-5 py-4 border-t border-ink-700/40 transition-all duration-300 ${
            notificationExiting
              ? 'opacity-0 -translate-y-2'
              : 'opacity-100 translate-y-0 animate-slide-up'
          }`}
        >
          <div className="flex items-start gap-3 rounded-xl border border-primary-500/30 bg-gradient-to-r from-primary-500/15 via-primary-500/10 to-transparent p-4">
            <div className="relative flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary-500/20 border border-primary-500/30">
              <CheckCircle2 className="h-5 w-5 text-primary-400" strokeWidth={2} />
              <div className="absolute -inset-1 rounded-lg bg-primary-500/10 blur-md -z-10" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white">
                Automated Retention Message with 20% discount coupon successfully sent to {visibleNotification.customerName} via WhatsApp/SMS Gateway via aurapredictai@gmail.com tracking logic
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-md border border-primary-500/20 bg-primary-500/10 px-2 py-0.5 text-[11px] font-medium text-primary-400">
                  <MessageSquare className="h-3 w-3" strokeWidth={1.8} />
                  WhatsApp/SMS
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-md border border-accent-500/20 bg-accent-500/10 px-2 py-0.5 text-[11px] font-medium text-accent-400">
                  20% Discount Applied
                </span>
                <span className="text-[11px] text-ink-400 font-mono">
                  Tracked via aurapredictai@gmail.com
                </span>
              </div>
            </div>
            <button
              onClick={dismissNotification}
              className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md text-ink-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <X className="h-4 w-4" strokeWidth={1.8} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
