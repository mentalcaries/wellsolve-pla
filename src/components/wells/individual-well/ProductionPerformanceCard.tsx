import { useNavigate } from 'react-router-dom';
import type { ProductionInterval, ProductionRates } from '../../../types';
import { calculateLossTotals } from '../../../lib/production';
import { Button } from '../../estimates/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

const number = (value: number) => new Intl.NumberFormat('en-US').format(value);
const displayDate = (value: string) => new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${value}T12:00:00Z`));
const nextDate = (value: string) => {
  const date = new Date(`${value}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + 1);
  return date.toISOString().slice(0, 10);
};

export function ProductionPerformanceCard({
  rates,
  intervals,
}: {
  rates: ProductionRates;
  intervals: ProductionInterval[];
}) {
  const navigate = useNavigate();
  const calculatedThrough = intervals.map(interval => interval.endDate).sort().at(-1) ?? '2026-10-13';
  const totals = calculateLossTotals(
    intervals,
    '2026-10-01',
    calculatedThrough,
  );
  return (
    <Card>
      <CardHeader className="gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-primary">
            Well-level record
          </p>
          <CardTitle className="text-lg leading-6">
            Production Performance
          </CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            Latest reading · {displayDate(calculatedThrough)}, 16:00
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-orange-100 px-2.5 py-1 text-xs font-semibold text-orange-800">
            Reduced Rates
          </span>
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate('/wells/f-120/production')}
          >
            View production details
          </Button>
          <Button
            size="sm"
            onClick={() => navigate('/wells/f-120/production/update')}
          >
            Update Production
          </Button>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4 p-4 pt-0">
        <div className="grid gap-3 sm:grid-cols-3">
          <StreamMetric
            label="Oil actual"
            actual={rates.oilActual}
            potential={rates.oilPotential}
            unit="bbl/day"
          />
          <StreamMetric
            label="Condensate actual"
            actual={rates.condensateActual}
            potential={rates.condensatePotential}
            unit="bbl/day"
          />
          <StreamMetric
            label="Natural gas actual"
            actual={rates.gasActual}
            potential={rates.gasPotential}
            unit="Scf/day"
          />
        </div>
        <div className="grid gap-px overflow-hidden rounded-md border border-orange-200 bg-orange-200 sm:grid-cols-2 xl:grid-cols-4">
          <Impact
            label="Cumulative oil loss"
            value={`${number(totals.oil)} bbl`}
          />
          <Impact
            label="Cumulative condensate loss"
            value={`${number(totals.condensate)} bbl`}
          />
          <Impact
            label="Cumulative gas loss"
            value={`${number(totals.gas)} Scf`}
          />
          <Impact
            label="Gross revenue loss"
            value={`$${number(totals.revenue)}`}
          />
        </div>
        <div className="flex flex-col justify-between gap-2 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <span>
            Loss period: 1 Oct–{displayDate(calculatedThrough)} · Well integrity · Linked mitigation ·
            Daily monitoring
          </span>
          <span>Next reading due {displayDate(nextDate(calculatedThrough))}, 08:00</span>
        </div>
      </CardContent>
    </Card>
  );
}
function StreamMetric({
  label,
  actual,
  potential,
  unit,
}: {
  label: string;
  actual: number;
  potential: number;
  unit: string;
}) {
  return (
    <div className="rounded-md border border-border bg-background p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-lg font-semibold">
        {number(actual)} <span className="text-xs">{unit}</span>
      </p>
      <p className="mt-1 text-xs text-muted-foreground">
        Potential {number(potential)} {unit}
      </p>
    </div>
  );
}
function Impact({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-orange-50 p-3">
      <p className="text-xs font-medium uppercase tracking-wide text-orange-800">
        {label}
      </p>
      <p className="mt-1 font-semibold text-orange-900">{value}</p>
    </div>
  );
}
