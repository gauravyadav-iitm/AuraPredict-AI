import ChurnRiskTable from '@/components/ChurnRiskTable';
import { Users, Mail, Building2, AlertTriangle } from 'lucide-react';
import type { CustomerRecord } from '@/types';
import { formatCurrency, formatNumber } from '@/utils/csv';
import { useMemo } from 'react';

interface CustomersViewProps {
  customers: CustomerRecord[];
}

export default function CustomersView({ customers }: CustomersViewProps) {
  const stats = useMemo(() => {
    const totalRevenue = customers.reduce((sum, c) => sum + c.monthlyRevenue, 0);
    const plans = new Set(customers.map((c) => c.plan)).size;
    const highRisk = customers.filter((c) => c.riskLevel === 'High').length;
    return { totalRevenue, plans, highRisk };
  }, [customers]);

  const miniCards = [
    { label: 'Total Customers', value: formatNumber(customers.length), icon: Users, color: 'text-accent-400', bg: 'bg-accent-500/10', border: 'border-accent-500/20' },
    { label: 'Total MRR', value: formatCurrency(stats.totalRevenue), icon: Building2, color: 'text-primary-400', bg: 'bg-primary-500/10', border: 'border-primary-500/20' },
    { label: 'Plan Tiers', value: formatNumber(stats.plans), icon: Mail, color: 'text-ink-200', bg: 'bg-ink-700/40', border: 'border-ink-600' },
    { label: 'High-Risk', value: formatNumber(stats.highRisk), icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {miniCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className={`glass-panel rounded-xl p-4 lg:p-5 border ${card.border}`}>
              <div className="flex items-start justify-between mb-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${card.bg}`}>
                  <Icon className={`h-5 w-5 ${card.color}`} strokeWidth={1.8} />
                </div>
                <span className={`text-xl font-bold font-mono ${card.color}`}>{card.value}</span>
              </div>
              <p className="text-sm font-medium text-ink-100">{card.label}</p>
            </div>
          );
        })}
      </div>

      <ChurnRiskTable customers={customers} />
    </div>
  );
}
