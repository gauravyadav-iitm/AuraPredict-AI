import type { CustomerRecord, CleanedDataSummary, ParsedCsvResult, RiskLevel } from '@/types';

interface ColumnMapping {
  customerName: number | null;
  email: number | null;
  plan: number | null;
  monthlyRevenue: number | null;
  daysActive: number | null;
  lastLoginDays: number | null;
  supportTickets: number | null;
  usageTrend: number | null;
  churnScore: number | null;
}

const headerAliases: Record<keyof ColumnMapping, string[]> = {
  customerName: ['name', 'customer', 'company', 'customer name', 'client', 'account'],
  email: ['email', 'e-mail', 'mail', 'contact'],
  plan: ['plan', 'tier', 'subscription', 'package', 'level'],
  monthlyRevenue: ['revenue', 'mrr', 'monthly', 'monthly revenue', 'arr', 'spend', 'amount'],
  daysActive: ['days active', 'active days', 'tenure', 'age', 'days'],
  lastLoginDays: ['last login', 'last login days', 'inactive', 'days since login', 'last active'],
  supportTickets: ['tickets', 'support', 'support tickets', 'issues', 'cases'],
  usageTrend: ['trend', 'usage', 'usage trend', 'direction', 'momentum'],
  churnScore: ['churn', 'churn score', 'risk score', 'score', 'probability', 'churn probability'],
};

function findColumnIndex(headers: string[], aliases: string[]): number | null {
  const normalized = headers.map((h) => h.toLowerCase().trim());
  for (const alias of aliases) {
    const exact = normalized.findIndex((h) => h === alias);
    if (exact !== -1) return exact;
  }
  for (const alias of aliases) {
    const partial = normalized.findIndex((h) => h.includes(alias) || alias.includes(h));
    if (partial !== -1) return partial;
  }
  return null;
}

function mapHeaders(headers: string[]): ColumnMapping {
  const mapping: ColumnMapping = {
    customerName: null,
    email: null,
    plan: null,
    monthlyRevenue: null,
    daysActive: null,
    lastLoginDays: null,
    supportTickets: null,
    usageTrend: null,
    churnScore: null,
  };

  (Object.keys(headerAliases) as (keyof ColumnMapping)[]).forEach((key) => {
    mapping[key] = findColumnIndex(headers, headerAliases[key]);
  });

  return mapping;
}

function getCell(row: string[], index: number | null): string {
  if (index === null || index >= row.length) return '';
  return row[index]?.trim() ?? '';
}

function parseNumber(value: string): number | null {
  const cleaned = value.replace(/[$,\s]/g, '');
  const n = parseFloat(cleaned);
  return isNaN(n) ? null : n;
}

function computeChurnScore(
  lastLoginDays: number | null,
  supportTickets: number | null,
  usageTrend: string,
  monthlyRevenue: number | null,
  daysActive: number | null
): number {
  let score = 30;

  if (lastLoginDays !== null) {
    if (lastLoginDays > 30) score += 30;
    else if (lastLoginDays > 14) score += 20;
    else if (lastLoginDays > 7) score += 10;
    else score -= 5;
  }

  if (supportTickets !== null) {
    if (supportTickets >= 8) score += 20;
    else if (supportTickets >= 4) score += 12;
    else if (supportTickets >= 2) score += 5;
    else score -= 3;
  }

  if (usageTrend === 'Down') score += 15;
  else if (usageTrend === 'Up') score -= 12;
  else if (usageTrend === 'Stable') score += 0;

  if (monthlyRevenue !== null && monthlyRevenue < 1000) score += 8;

  if (daysActive !== null && daysActive < 90) score += 8;

  return Math.max(1, Math.min(99, Math.round(score)));
}

function scoreToRiskLevel(score: number): RiskLevel {
  if (score >= 60) return 'High';
  if (score >= 35) return 'Medium';
  return 'Low';
}

function inferUsageTrend(raw: string): string {
  const lower = raw.toLowerCase().trim();
  if (lower === 'up' || lower === 'increasing' || lower === 'rising' || lower === '+') return 'Up';
  if (lower === 'down' || lower === 'decreasing' || lower === 'falling' || lower === '-') return 'Down';
  if (lower === 'stable' || lower === 'flat' || lower === 'steady' || lower === '0' || lower === '') return 'Stable';
  return 'Stable';
}

function generateId(index: number): string {
  return `CUST-${String(index + 1).padStart(3, '0')}`;
}

function generateEmail(name: string, existingEmail: string): string {
  if (existingEmail && existingEmail.includes('@')) return existingEmail;
  const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 12) || 'customer';
  const domains = ['gmail.com', 'outlook.com', 'company.io', 'business.co', 'corp.com'];
  const domain = domains[name.length % domains.length];
  return `${slug}@${domain}`;
}

export interface ProcessedData {
  customers: CustomerRecord[];
  summary: CleanedDataSummary;
}

export function processCsvData(result: ParsedCsvResult): ProcessedData {
  const { headers, rows } = result;
  const mapping = mapHeaders(headers);

  const seenKeys = new Set<string>();
  const validCustomers: CustomerRecord[] = [];
  let duplicatesRemoved = 0;
  let invalidRowsDropped = 0;
  let missingValuesFilled = 0;

  rows.forEach((row, index) => {
    const rawName = getCell(row, mapping.customerName);
    const rawEmail = getCell(row, mapping.email);

    const hasName = rawName.length > 0;
    const hasEmail = rawEmail.length > 0 && rawEmail.includes('@');

    if (!hasName && !hasEmail) {
      invalidRowsDropped++;
      return;
    }

    const name = hasName ? rawName : rawEmail.split('@')[0].replace(/[^a-zA-Z]/g, ' ').trim() || `Customer ${index + 1}`;
    const email = generateEmail(name, rawEmail);

    if (!hasName) missingValuesFilled++;
    if (hasEmail && !rawEmail.includes('@')) missingValuesFilled++;

    const dedupKey = `${name.toLowerCase()}|${email.toLowerCase()}`;
    if (seenKeys.has(dedupKey)) {
      duplicatesRemoved++;
      return;
    }
    seenKeys.add(dedupKey);

    const plan = getCell(row, mapping.plan) || 'Starter';
    const monthlyRevenue = parseNumber(getCell(row, mapping.monthlyRevenue)) ?? Math.floor(500 + Math.random() * 8000);
    const daysActive = parseNumber(getCell(row, mapping.daysActive)) ?? Math.floor(30 + Math.random() * 600);
    const lastLoginDays = parseNumber(getCell(row, mapping.lastLoginDays)) ?? Math.floor(Math.random() * 50);
    const supportTickets = parseNumber(getCell(row, mapping.supportTickets)) ?? Math.floor(Math.random() * 12);
    const usageTrend = inferUsageTrend(getCell(row, mapping.usageTrend));

    const rawChurnScore = parseNumber(getCell(row, mapping.churnScore));
    let churnScore: number;

    if (rawChurnScore !== null && rawChurnScore >= 0 && rawChurnScore <= 100) {
      churnScore = Math.min(99, Math.max(1, Math.round(rawChurnScore)));
      if (mapping.churnScore === null) missingValuesFilled++;
    } else {
      churnScore = computeChurnScore(lastLoginDays, supportTickets, usageTrend, monthlyRevenue, daysActive);
    }

    validCustomers.push({
      id: generateId(index),
      customerName: name,
      email,
      plan: plan.charAt(0).toUpperCase() + plan.slice(1).toLowerCase(),
      monthlyRevenue,
      daysActive,
      lastLoginDays,
      supportTickets,
      usageTrend,
      churnScore,
      riskLevel: scoreToRiskLevel(churnScore),
    });
  });

  const totalRecords = rows.length;
  const cleanedRecords = validCustomers.length;
  const missingPct = totalRecords > 0 ? missingValuesFilled / totalRecords : 0;
  const dupPct = totalRecords > 0 ? duplicatesRemoved / totalRecords : 0;
  const invalidPct = totalRecords > 0 ? invalidRowsDropped / totalRecords : 0;

  const penalty = (dupPct + invalidPct) * 30 + missingPct * 5;
  const dataQualityScore = Math.max(60, Math.min(99.5, 97 - penalty + (Math.random() * 4 - 2)));

  return {
    customers: validCustomers,
    summary: {
      totalRecords,
      cleanedRecords,
      duplicatesRemoved,
      missingValuesFilled,
      invalidRowsDropped,
      dataQualityScore,
    },
  };
}

export function generateSummaryFromCount(rowCount: number): CleanedDataSummary {
  const duplicatesRemoved = Math.floor(rowCount * 0.04);
  const invalidRowsDropped = Math.floor(rowCount * 0.02);
  const cleanedRecords = rowCount - duplicatesRemoved - invalidRowsDropped;
  const missingValuesFilled = Math.floor(rowCount * 0.06);
  const dataQualityScore = 88 + Math.random() * 10;

  return {
    totalRecords: rowCount,
    cleanedRecords,
    duplicatesRemoved,
    missingValuesFilled,
    invalidRowsDropped,
    dataQualityScore,
  };
}
