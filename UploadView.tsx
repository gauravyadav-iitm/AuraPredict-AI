import UploadZone from '@/components/UploadZone';
import StatsCards from '@/components/StatsCards';
import type { CleanedDataSummary, ParsedCsvResult } from '@/types';

interface UploadViewProps {
  summary: CleanedDataSummary;
  onFileProcessed: (result: ParsedCsvResult, fileName: string, fileSize: number) => void;
}

export default function UploadView({ summary, onFileProcessed }: UploadViewProps) {
  return (
    <div className="space-y-6 animate-fade-in">
      <UploadZone onFileProcessed={onFileProcessed} />

      <StatsCards summary={summary} />

      <div className="glass-panel rounded-2xl p-6 animate-slide-up" style={{ animationDelay: '120ms' }}>
        <h3 className="text-base font-semibold text-white mb-2">How CSV Processing Works</h3>
        <p className="text-sm text-ink-400 mb-4">
          When you upload a CSV file, AuraPredict.AI automatically parses, validates, and cleans your data
          before populating the dashboard with real-time analytics.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { step: '1', title: 'Parse & Map', desc: 'Column headers are auto-matched to customer fields using fuzzy name recognition.' },
            { step: '2', title: 'Clean & Deduplicate', desc: 'Invalid rows are dropped, exact duplicates removed, and missing values auto-filled.' },
            { step: '3', title: 'Score & Visualize', desc: 'Churn risk is computed from behavioral signals and the dashboard updates instantly.' },
          ].map((item) => (
            <div key={item.step} className="rounded-xl border border-ink-700/40 bg-ink-850/40 p-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-500/10 border border-primary-500/20 text-sm font-bold text-primary-400 mb-3">
                {item.step}
              </div>
              <p className="text-sm font-medium text-ink-100">{item.title}</p>
              <p className="text-xs text-ink-400 mt-1 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
