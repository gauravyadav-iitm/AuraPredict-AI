export type RiskLevel = 'High' | 'Medium' | 'Low';

export interface CustomerRecord {
  id: string;
  customerName: string;
  email: string;
  plan: string;
  monthlyRevenue: number;
  daysActive: number;
  lastLoginDays: number;
  supportTickets: number;
  usageTrend: string;
  churnScore: number;
  riskLevel: RiskLevel;
}

export interface CleanedDataSummary {
  totalRecords: number;
  cleanedRecords: number;
  duplicatesRemoved: number;
  missingValuesFilled: number;
  invalidRowsDropped: number;
  dataQualityScore: number;
}

export interface ParsedCsvResult {
  headers: string[];
  rows: string[][];
  rowCount: number;
}
