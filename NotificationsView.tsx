import { AlertTriangle, Bell, Clock, X } from 'lucide-react';
import type { CustomerRecord } from '@/types';
import { formatCurrency } from '@/utils/csv';
import { useMemo } from 'react';

interface NotificationsViewProps {
  customers: CustomerRecord[];
}

export default function NotificationsView({ customers }: NotificationsViewProps) {
  const alerts = useMemo(() => {
    const highRisk = customers
      .filter((c) => c.riskLevel === 'High')
      .sort((a, b) => b.churnScore - a.churnScore)
      .slice(0, 8);

    return highRisk.map((c) => ({
      id: c.id,
      customerName: c.customerName,
      churnScore: c.churnScore,
      monthlyRevenue: c.monthlyRevenue,
      lastLoginDays: c.lastLoginDays,
      supportTickets: c.supportTickets,
    }));
  }, [customers]);

  const systemAlerts = [
    { id: 'sys-1', title: 'Data quality score dropped below 90%', time: '2 hours ago', severity: 'warning' as const },
    { id: 'sys-2', title: 'CSV processing pipeline updated to v2.4', time: '1 day ago', severity: 'info' as const },
    { id: 'sys-3', title: '3 new customers crossed the high-risk threshold', time: '3 hours ago', severity: 'critical' as const },
  ];

  const severityConfig = {
    critical: { color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30', dot: 'bg-red-500' },
    warning: { color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30', dot: 'bg-amber-500' },
    info: { color: 'text-accent-400', bg: 'bg-accent-500/10', border: 'border-accent-500/20', dot: 'bg-accent-500' },
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-panel rounded-2xl p-5 lg:p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-500/10 border border-red-500/20">
                <AlertTriangle className="h-4.5 w-4.5 text-red-400" strokeWidth={1.8} />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">Churn Risk Alerts</h3>
                <p className="text-xs text-ink-400">High-risk customers requiring attention</p>
              </div>
            </div>
            <span className="rounded-full bg-red-500/15 border border-red-500/30 px-2.5 py-0.5 text-xs font-bold text-red-400">
              {alerts.length}
            </span>
          </div>

          <div className="space-y-3">
            {alerts.map((alert) => (
              <div key={alert.id} className="flex items-center gap-3 rounded-xl border border-ink-700/40 bg-ink-850/40 p-4 hover:border-red-500/30 transition-colors">
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-red-500/10 border border-red-500/20 text-[10px] font-bold text-red-400">
                  {alert.customerName.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-ink-100 truncate">{alert.customerName}</p>
                  <p className="text-[11px] text-ink-400 mt-0.5">
                    Score: <span className="font-mono text-red-400">{alert.churnScore}</span> · {formatCurrency(alert.monthlyRevenue)}/mo · {alert.lastLoginDays}d inactive · {alert.supportTickets} tickets
                  </p>
                </div>
                <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse-glow flex-shrink-0" />
              </div>
            ))}
            {alerts.length === 0 && (
              <div className="flex flex-col items-center justify-center py-8">
                <Bell className="h-8 w-8 text-ink-500 mb-3" strokeWidth={1.5} />
                <p className="text-sm text-ink-400">No high-risk alerts</p>
              </div>
            )}
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-5 lg:p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-500/10 border border-accent-500/20">
                <Clock className="h-4.5 w-4.5 text-accent-400" strokeWidth={1.8} />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">System Activity</h3>
                <p className="text-xs text-ink-400">Recent pipeline and system events</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {systemAlerts.map((alert) => {
              const config = severityConfig[alert.severity];
              return (
                <div key={alert.id} className={`flex items-start gap-3 rounded-xl border ${config.border} ${config.bg} p-4`}>
                  <div className={`h-2 w-2 rounded-full ${config.dot} mt-1.5 flex-shrink-0`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-ink-100">{alert.title}</p>
                    <p className="text-[11px] text-ink-400 mt-0.5">{alert.time}</p>
                  </div>
                  <button className="text-ink-500 hover:text-ink-300 transition-colors flex-shrink-0">
                    <X className="h-3.5 w-3.5" strokeWidth={1.8} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
