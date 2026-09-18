// CIP Analysis Mock Data
// 40 days of historical CIP run data across 5 lines (CIP 1 to CIP 5)

export type CIPLine = 'CIP 1' | 'CIP 2' | 'CIP 3' | 'CIP 4' | 'CIP 5';

export const CIP_LINES: CIPLine[] = ['CIP 1', 'CIP 2', 'CIP 3', 'CIP 4', 'CIP 5'];

export interface CIPDayData {
  date: Date;
  dateLabel: string; // e.g. "Thu 09/10"
  lines: Record<CIPLine, CIPLineDay>;
  // Aggregated across all selected lines
  totalRuns: number;
  fullyCompleted: number;
  notCompleted: number;
  offTimeRate: number; // 0–100
}

export interface CIPLineDay {
  totalRuns: number;
  fullyCompleted: number;
  notCompleted: number;
  offTimeRate: number;
  avgDuration: number; // minutes
  skipped: number;
  aborted: number;
}

// Generate 40 days of mock data ending on Sept 18, 2026
function generateMockData(): CIPDayData[] {
  const days: CIPDayData[] = [];
  const endDate = new Date(2026, 8, 18); // Sept 18, 2026
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Seed random for deterministic results
  let seed = 12345;
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) & 0xffffffff;
    return (seed >>> 0) / 4294967296;
  };

  const lineOffsets: Record<CIPLine, number> = {
    'CIP 1': 0.05,
    'CIP 2': 0.12,
    'CIP 3': 0.08,
    'CIP 4': 0.22,
    'CIP 5': 0.15,
  };

  // Specific on-time targets for the last 7 days to match Figma's primary visual
  // Wed 09/09: 99%, Thu 09/10: 89%, Fri 09/11: 65%, Mon 09/14: 80%, Tue 09/15: 78%, Wed 09/16: 45%, Thu 09/17: 25% (testing <30% red)
  const targetOnTimes = [99, 89, 65, 80, 78, 45, 25];

  for (let i = 39; i >= 0; i--) {
    const date = new Date(endDate);
    date.setDate(date.getDate() - i);
    const dayName = dayNames[date.getDay()];
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const dateLabel = `${dayName} ${mm}/${dd}`;

    const lineData: Record<CIPLine, CIPLineDay> = {} as Record<CIPLine, CIPLineDay>;

    let totalRuns = 0;
    let fullyCompleted = 0;
    let notCompleted = 0;

    // Check if within the last 7 days
    const isTargetDay = i < 7;
    const targetOnTime = isTargetDay ? targetOnTimes[6 - i] : undefined;

    for (const line of CIP_LINES) {
      const baseOffTime = targetOnTime !== undefined
        ? (100 - targetOnTime) / 100
        : lineOffsets[line] + rand() * 0.25;

      const runs = Math.floor(rand() * 4) + 5; // 5–8 runs per line
      const skipped = rand() > 0.88 ? 1 : 0;
      const aborted = rand() > 0.92 ? 1 : 0;
      const offTime = Math.min(0.95, Math.max(0.01, baseOffTime + (rand() - 0.5) * 0.08));
      const fc = Math.max(0, Math.round(runs * (1 - offTime)));
      const nc = runs - fc;

      lineData[line] = {
        totalRuns: runs,
        fullyCompleted: fc,
        notCompleted: nc,
        offTimeRate: Math.round(offTime * 100),
        avgDuration: Math.round(28 + rand() * 25),
        skipped,
        aborted,
      };

      totalRuns += runs;
      fullyCompleted += fc;
      notCompleted += nc;
    }

    const calculatedOffTime = targetOnTime !== undefined
      ? (100 - targetOnTime)
      : (totalRuns > 0 ? Math.round((notCompleted / totalRuns) * 100) : 0);

    days.push({
      date,
      dateLabel,
      lines: lineData,
      totalRuns,
      fullyCompleted,
      notCompleted,
      offTimeRate: calculatedOffTime,
    });
  }

  return days;
}

export const ALL_DAYS: CIPDayData[] = generateMockData();

// Get aggregated data for selected lines
export function getAggregatedDays(
  days: CIPDayData[],
  selectedLines: CIPLine[]
): CIPDayData[] {
  if (selectedLines.length === 0 || selectedLines.length === CIP_LINES.length) {
    return days;
  }

  return days.map((day) => {
    let totalRuns = 0;
    let fullyCompleted = 0;
    let notCompleted = 0;

    for (const line of selectedLines) {
      const ld = day.lines[line];
      if (ld) {
        totalRuns += ld.totalRuns;
        fullyCompleted += ld.fullyCompleted;
        notCompleted += ld.notCompleted;
      }
    }

    return {
      ...day,
      totalRuns,
      fullyCompleted,
      notCompleted,
      offTimeRate: totalRuns > 0 ? Math.round((notCompleted / totalRuns) * 100) : 0,
    };
  });
}

// Returns data for a given preset
export function getDaysForPreset(preset: '1D' | '3D' | '7D' | '30D' | 'Custom', customDays?: number): CIPDayData[] {
  const counts: Record<string, number> = { '1D': 1, '3D': 3, '7D': 7, '30D': 30 };
  const n = preset === 'Custom' ? (customDays ?? 7) : (counts[preset] ?? 7);
  return ALL_DAYS.slice(Math.max(0, ALL_DAYS.length - n));
}

// KPI Summary computation
export interface CIPKPISummary {
  totalRuns: number;
  fullyCompleted: number;
  fullyCompletedPct: number;
  notCompleted: number;
  offTimeRate: number;
  avgDuration: number;
  skipped: number;
  aborted: number;
  onTimeRate: number;
}

export function getKPISummary(days: CIPDayData[], selectedLines: CIPLine[]): CIPKPISummary {
  const lines = selectedLines.length === 0 ? CIP_LINES : selectedLines;

  let totalRuns = 0;
  let fullyCompleted = 0;
  let notCompleted = 0;
  let totalDuration = 0;
  let durationCount = 0;
  let skipped = 0;
  let aborted = 0;

  for (const day of days) {
    for (const line of lines) {
      const ld = day.lines[line];
      if (!ld) continue;
      totalRuns += ld.totalRuns;
      fullyCompleted += ld.fullyCompleted;
      notCompleted += ld.notCompleted;
      totalDuration += ld.avgDuration * ld.totalRuns;
      durationCount += ld.totalRuns;
      skipped += ld.skipped;
      aborted += ld.aborted;
    }
  }

  const fullyCompletedPct = totalRuns > 0 ? Math.round((fullyCompleted / totalRuns) * 100) : 0;
  const offTimeRate = totalRuns > 0 ? Math.round((notCompleted / totalRuns) * 100) : 0;
  const onTimeRate = 100 - offTimeRate;

  return {
    totalRuns,
    fullyCompleted,
    fullyCompletedPct,
    notCompleted,
    offTimeRate,
    onTimeRate,
    avgDuration: durationCount > 0 ? Math.round(totalDuration / durationCount) : 0,
    skipped,
    aborted,
  };
}

// Pareto data for breakdown
export interface ParetoItem {
  label: string;
  value: number;
  pct: number;
  color: string;
}

export function getParetoByLine(days: CIPDayData[]): ParetoItem[] {
  const totals: Partial<Record<CIPLine, { notCompleted: number; total: number }>> = {};

  for (const day of days) {
    for (const line of CIP_LINES) {
      if (!totals[line]) totals[line] = { notCompleted: 0, total: 0 };
      totals[line]!.notCompleted += day.lines[line]?.notCompleted ?? 0;
      totals[line]!.total += day.lines[line]?.totalRuns ?? 0;
    }
  }

  const total = Object.values(totals).reduce((s, v) => s + (v?.notCompleted ?? 0), 0);
  const LINE_COLORS: Record<CIPLine, string> = {
    'CIP 1': 'var(--blue-400, #4484f4)',
    'CIP 2': 'var(--orange-400, #e78710)',
    'CIP 3': 'var(--green-400, #3db97a)',
    'CIP 4': 'var(--purple-400, #9f75e8)',
    'CIP 5': 'var(--blue-300, #70a6ff)',
  };

  return CIP_LINES.map((line) => ({
    label: line,
    value: totals[line]?.notCompleted ?? 0,
    pct: total > 0 ? Math.round(((totals[line]?.notCompleted ?? 0) / total) * 100) : 0,
    color: LINE_COLORS[line] || 'var(--blue-400, #4484f4)',
  })).sort((a, b) => b.value - a.value);
}

// Deviation share across time (for area chart)
export interface DeviationPoint {
  dateLabel: string;
  offTime: number;
  onTime: number;
}

export function getDeviationTimeSeries(days: CIPDayData[], selectedLines: CIPLine[]): DeviationPoint[] {
  const lines = selectedLines.length === 0 ? CIP_LINES : selectedLines;
  return days.map((day) => {
    let notCompleted = 0;
    let totalRuns = 0;
    for (const line of lines) {
      if (day.lines[line]) {
        notCompleted += day.lines[line].notCompleted;
        totalRuns += day.lines[line].totalRuns;
      }
    }
    const offTimePct = totalRuns > 0 ? Math.round((notCompleted / totalRuns) * 100) : 0;
    return {
      dateLabel: day.dateLabel,
      offTime: offTimePct,
      onTime: 100 - offTimePct,
    };
  });
}
