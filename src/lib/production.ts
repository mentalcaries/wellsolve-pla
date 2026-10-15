import type { ProductionInterval, ProductionStatus } from '../types';

export const toDateKey = (value: Date) => value.toISOString().slice(0, 10);

export function dateKeys(startDate: string, endDate: string) {
  const dates: string[] = [];
  const cursor = new Date(`${startDate}T12:00:00Z`);
  const end = new Date(`${endDate}T12:00:00Z`);
  while (cursor <= end) {
    dates.push(toDateKey(cursor));
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return dates;
}

export function productionForDate(intervals: ProductionInterval[], date: string) {
  return intervals.findLast(interval => interval.startDate <= date && interval.endDate >= date);
}

export function intervalSeries(intervals: ProductionInterval[], startDate: string, endDate: string) {
  return dateKeys(startDate, endDate).map(date => ({ date, interval: productionForDate(intervals, date) }));
}

export function calculateLossTotals(intervals: ProductionInterval[], startDate: string, endDate: string) {
  const totals = intervalSeries(intervals, startDate, endDate).reduce((sum, day) => {
    if (!day.interval || day.interval.status === 'Normal Production' || day.interval.lossContext === 'None') return sum;
    sum.oil += Math.max(0, day.interval.oilPotential - day.interval.oil);
    sum.condensate += Math.max(0, day.interval.condensatePotential - day.interval.condensate);
    sum.gas += Math.max(0, day.interval.gasPotential - day.interval.gas);
    return sum;
  }, { oil: 0, condensate: 0, gas: 0 });
  return { ...totals, revenue: totals.oil * 60 + totals.condensate * 55 + totals.gas * 0.00325 };
}

export interface ChartStatusBand {
  label: string;
  shortLabel: string;
  status?: ProductionStatus;
  days: number;
  tone: 'baseline' | 'reduced' | 'intervention' | 'recovery';
}

function statusTone(status?: ProductionStatus): ChartStatusBand['tone'] {
  if (status === 'Normal Production') return 'baseline';
  if (status === 'Intervention' || status === 'Shut-in / No Production') return 'intervention';
  if (status === 'Recovery / Ramp-up') return 'recovery';
  return 'reduced';
}

function shortStatus(status?: ProductionStatus) {
  if (status === 'Normal Production') return 'Base';
  if (status === 'Intervention' || status === 'Shut-in / No Production') return 'Shut-in';
  if (status === 'Recovery / Ramp-up') return 'Recovery';
  if (status === 'Reduced Rates') return 'Reduced';
  return status ?? 'No data';
}

const dayMonth = (date: string) => new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' }).format(new Date(`${date}T12:00:00Z`));

export function statusBands(intervals: ProductionInterval[], startDate: string, endDate: string): ChartStatusBand[] {
  const series = intervalSeries(intervals, startDate, endDate);
  return series.reduce<ChartStatusBand[]>((bands, day) => {
    const status = day.interval?.status;
    const previous = bands.at(-1);
    if (previous && previous.status === status) {
      previous.days += 1;
      previous.label = `${previous.label.split(' · ')[0].split('–')[0]}–${dayMonth(day.date)} · ${status ?? 'No data'}`;
      return bands;
    }
    bands.push({ label: `${dayMonth(day.date)} · ${status ?? 'No data'}`, shortLabel: shortStatus(status), status, days: 1, tone: statusTone(status) });
    return bands;
  }, []);
}
