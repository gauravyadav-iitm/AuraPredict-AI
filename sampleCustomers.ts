import type { CustomerRecord, RiskLevel } from '@/types';

export const sampleCustomers: CustomerRecord[] = [
  { id: 'CUST-001', customerName: 'Acme Corp', email: 'ops@acme.io', plan: 'Enterprise', monthlyRevenue: 12400, daysActive: 312, lastLoginDays: 1, supportTickets: 2, usageTrend: 'Up', churnScore: 12, riskLevel: 'Low' },
  { id: 'CUST-002', customerName: 'Globex Inc', email: 'admin@globex.com', plan: 'Pro', monthlyRevenue: 3200, daysActive: 189, lastLoginDays: 28, supportTickets: 7, usageTrend: 'Down', churnScore: 78, riskLevel: 'High' },
  { id: 'CUST-003', customerName: 'Stark LLC', email: 'hello@stark.dev', plan: 'Pro', monthlyRevenue: 2800, daysActive: 156, lastLoginDays: 5, supportTickets: 1, usageTrend: 'Stable', churnScore: 24, riskLevel: 'Low' },
  { id: 'CUST-004', customerName: 'Wayne Tech', email: 'contact@wayne.ai', plan: 'Enterprise', monthlyRevenue: 15800, daysActive: 401, lastLoginDays: 14, supportTickets: 4, usageTrend: 'Down', churnScore: 55, riskLevel: 'Medium' },
  { id: 'CUST-005', customerName: 'Umbrella Co', email: 'it@umbrella.org', plan: 'Starter', monthlyRevenue: 800, daysActive: 67, lastLoginDays: 42, supportTickets: 11, usageTrend: 'Down', churnScore: 89, riskLevel: 'High' },
  { id: 'CUST-006', customerName: 'Cyberdyne', email: 'eng@cyberdyne.io', plan: 'Pro', monthlyRevenue: 4100, daysActive: 223, lastLoginDays: 3, supportTickets: 0, usageTrend: 'Up', churnScore: 8, riskLevel: 'Low' },
  { id: 'CUST-007', customerName: 'Initech', email: 'support@initech.com', plan: 'Starter', monthlyRevenue: 600, daysActive: 92, lastLoginDays: 19, supportTickets: 5, usageTrend: 'Stable', churnScore: 47, riskLevel: 'Medium' },
  { id: 'CUST-008', customerName: 'Soylent Labs', email: 'team@soylent.bio', plan: 'Pro', monthlyRevenue: 3600, daysActive: 178, lastLoginDays: 35, supportTickets: 9, usageTrend: 'Down', churnScore: 72, riskLevel: 'High' },
  { id: 'CUST-009', customerName: 'Hooli Inc', email: 'dev@hooli.tech', plan: 'Enterprise', monthlyRevenue: 19200, daysActive: 503, lastLoginDays: 2, supportTickets: 3, usageTrend: 'Up', churnScore: 6, riskLevel: 'Low' },
  { id: 'CUST-010', customerName: 'Pied Piper', email: 'admin@piedpiper.app', plan: 'Pro', monthlyRevenue: 2400, daysActive: 134, lastLoginDays: 11, supportTickets: 2, usageTrend: 'Stable', churnScore: 38, riskLevel: 'Medium' },
  { id: 'CUST-011', customerName: 'Vandelay Ind', email: 'info@vandelay.co', plan: 'Starter', monthlyRevenue: 500, daysActive: 45, lastLoginDays: 51, supportTickets: 8, usageTrend: 'Down', churnScore: 91, riskLevel: 'High' },
  { id: 'CUST-012', customerName: 'Wonka AI', email: 'ops@wonka.ml', plan: 'Pro', monthlyRevenue: 3800, daysActive: 201, lastLoginDays: 4, supportTickets: 1, usageTrend: 'Up', churnScore: 15, riskLevel: 'Low' },
  { id: 'CUST-013', customerName: 'Nakatomi', email: 'it@nakatomi.jp', plan: 'Enterprise', monthlyRevenue: 21000, daysActive: 612, lastLoginDays: 1, supportTickets: 0, usageTrend: 'Up', churnScore: 4, riskLevel: 'Low' },
  { id: 'CUST-014', customerName: 'Oscorp Labs', email: 'dev@oscorp.science', plan: 'Pro', monthlyRevenue: 3200, daysActive: 167, lastLoginDays: 22, supportTickets: 6, usageTrend: 'Down', churnScore: 63, riskLevel: 'Medium' },
  { id: 'CUST-015', customerName: 'Tyrell Corp', email: 'admin@tyrell.bio', plan: 'Enterprise', monthlyRevenue: 17600, daysActive: 389, lastLoginDays: 7, supportTickets: 2, usageTrend: 'Stable', churnScore: 19, riskLevel: 'Low' },
  { id: 'CUST-016', customerName: 'Massive Dyn', email: 'contact@massivedyn.com', plan: 'Pro', monthlyRevenue: 2900, daysActive: 143, lastLoginDays: 38, supportTickets: 10, usageTrend: 'Down', churnScore: 84, riskLevel: 'High' },
  { id: 'CUST-017', customerName: 'Delos Inc', email: 'team@delos.park', plan: 'Starter', monthlyRevenue: 700, daysActive: 78, lastLoginDays: 16, supportTickets: 3, usageTrend: 'Stable', churnScore: 44, riskLevel: 'Medium' },
  { id: 'CUST-018', customerName: 'Aperture Sci', email: 'ops@aperture.test', plan: 'Enterprise', monthlyRevenue: 22500, daysActive: 721, lastLoginDays: 1, supportTickets: 1, usageTrend: 'Up', churnScore: 3, riskLevel: 'Low' },
  { id: 'CUST-019', customerName: 'Black Mesa', email: 'it@blackmesa.org', plan: 'Pro', monthlyRevenue: 4500, daysActive: 256, lastLoginDays: 25, supportTickets: 7, usageTrend: 'Down', churnScore: 67, riskLevel: 'Medium' },
  { id: 'CUST-020', customerName: 'LexCorp', email: 'admin@lexcorp.io', plan: 'Pro', monthlyRevenue: 3100, daysActive: 112, lastLoginDays: 47, supportTickets: 12, usageTrend: 'Down', churnScore: 86, riskLevel: 'High' },
];
