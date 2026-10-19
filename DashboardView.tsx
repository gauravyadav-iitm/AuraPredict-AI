import StatsCards from '@/components/StatsCards';
import RiskDistribution from '@/components/RiskDistribution';
import ChurnRiskTable from '@/components/ChurnRiskTable';
import type { CleanedDataSummary, CustomerRecord } from '@/types';

interface DashboardViewProps {
  customers: CustomerRecord[];
  summary: CleanedDataSummary;
}

export default function DashboardView({ customers, summary }: DashboardViewProps) {
  return (
    <div className="space-y-6 animate-fade-in">
      <StatsCards summary={summary} />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-1">
          <RiskDistribution customers={customers} />
        </div>
        <div className="xl:col-span-2">
          <ChurnRiskTable customers={customers} />
        </div>
      </div>
    </div>
  );
}
