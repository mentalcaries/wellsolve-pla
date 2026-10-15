import { Download, Link2, Plus, Upload } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { calculateLossTotals, intervalSeries, statusBands } from '../../../lib/production';
import type { ProductionInterval, ProductionRates, ProductionReading } from '../../../types';
import { Button } from '../../estimates/ui/button';
import { Card, CardContent } from '../ui/card';
import { WellHeader } from '../individual-well/WellHeader';
import { WellProfileCard } from '../individual-well/WellProfileCard';
import { WellWorkspaceTabs } from '../individual-well/WellWorkspaceTabs';
import type { MonitoringEntry } from '../well-data';
import { ProductionRateChart } from './ProductionRateChart';

const number = (value: number) => new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(value);
const dateTime = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', hour12: false });
const displayDate = (date: string) => new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${date}T12:00:00Z`));

const shiftDate = (date: string, days: number) => {
  const value = new Date(`${date}T12:00:00Z`);
  value.setUTCDate(value.getUTCDate() + days);
  return value.toISOString().slice(0, 10);
};

export function ProductionAnalyticsPage({ rates, readings, intervals, latestStatus }: { rates: ProductionRates; readings: ProductionReading[]; intervals: ProductionInterval[]; latestStatus: MonitoringEntry }) {
  const navigate = useNavigate();
  const [period, setPeriod] = useState('Event');
  const [customStart, setCustomStart] = useState('2026-10-01');
  const [customEnd, setCustomEnd] = useState('2026-10-13');
  const [status, setStatus] = useState('All statuses');
  const [source, setSource] = useState('All sources');
  const latestDate = useMemo(() => [
    ...intervals.map(interval => interval.endDate),
    ...readings.map(reading => reading.recordedAt.slice(0, 10)),
  ].sort().at(-1) ?? '2026-10-13', [intervals, readings]);
  const ranges: Record<string, [string, string]> = {
    Event: ['2026-09-28', latestDate],
    Week: [shiftDate(latestDate, -6), latestDate],
    Month: [`${latestDate.slice(0, 7)}-01`, latestDate],
    Quarter: ['2026-09-28', latestDate],
    Year: ['2026-09-28', latestDate],
  };
  const [startDate, endDate] = period === 'Custom' ? [customStart, customEnd] : ranges[period];
  const safeStart = startDate <= endDate ? startDate : endDate;
  const safeEnd = startDate <= endDate ? endDate : startDate;
  const series = useMemo(() => intervalSeries(intervals, safeStart, safeEnd), [intervals, safeStart, safeEnd]);
  const bands = useMemo(() => statusBands(intervals, safeStart, safeEnd), [intervals, safeStart, safeEnd]);
  const totalsStart = period === 'Event' ? '2026-10-01' : safeStart;
  const totals = useMemo(() => calculateLossTotals(intervals, totalsStart, safeEnd), [intervals, totalsStart, safeEnd]);
  const records = useMemo(() => readings.filter(reading => {
    const date = reading.recordedAt.slice(0, 10);
    return date >= safeStart && date <= safeEnd &&
      (status === 'All statuses' || reading.status === status) &&
      (source === 'All sources' || reading.source === source);
  }), [readings, safeStart, safeEnd, source, status]);
  const valueSeries = (stream: 'oil' | 'condensate' | 'gas') => series.map(day => day.interval?.[stream] ?? 0);

  return <div className='space-y-4'>
    <WellHeader latestEntry={latestStatus}/>
    <WellWorkspaceTabs/>
    <WellProfileCard/>
    <section className='production-workspace'>
      <header className='production-workspace-heading'>
        <div><h2>Production history & loss accounting</h2><p>Well-level readings, production status, and linked interventions for F-120.</p></div>
        <div className='header-actions'><Button variant='outline' onClick={() => navigate('/wells/f-120/production/import')}><Upload className='mr-2 h-4 w-4'/>Import CSV</Button><Button onClick={() => navigate('/wells/f-120/production/update')}><Plus className='mr-2 h-4 w-4'/>Add production reading</Button></div>
      </header>
      <div className='event-context-bar'><div><span><Link2 size={13}/> Active loss event</span><strong>1 Oct 2026 → present · Well integrity · Linked mitigation</strong></div><div><span>Enhanced monitoring</span><strong>Daily · Next reading due {displayDate(shiftDate(latestDate, 1))}, 08:00</strong></div></div>
      <div className='production-toolbar'>
        <div className='period-tabs' role='group' aria-label='Production period'>{['Event','Week','Month','Quarter','Year','Custom'].map(value => <button key={value} className={period === value ? 'active' : ''} onClick={() => setPeriod(value)}>{value}</button>)}</div>
        {period === 'Custom' ? <div className='custom-period'><label>From<input aria-label='Custom period start' type='date' value={customStart} onChange={event => setCustomStart(event.target.value)}/></label><label>To<input aria-label='Custom period end' type='date' value={customEnd} onChange={event => setCustomEnd(event.target.value)}/></label></div> : <div className='selected-period'><span>{displayDate(safeStart)} – {displayDate(safeEnd)}</span><select aria-label='Chart aggregation' defaultValue='Daily'><option>Daily</option><option>Reading</option><option>Weekly average</option></select></div>}
      </div>
      <p className='chart-guidance'>{period === 'Event' ? 'Event view includes 3 pre-event baseline days.' : `${period} view uses records available in the selected period.`} Chart values are daily interval rates; the table retains every timestamped reading.</p>
      <Card className='production-charts-card'><CardContent className='p-5'>
        <ProductionRateChart name='Oil' unit='bbl/day' potential={rates.oilPotential} latest={rates.oilActual} values={valueSeries('oil')} color='var(--chart-1)' bands={bands}/>
        <ProductionRateChart name='Condensate' unit='bbl/day' potential={rates.condensatePotential} latest={rates.condensateActual} values={valueSeries('condensate')} color='var(--chart-4)' bands={bands}/>
        <ProductionRateChart name='Natural gas' unit='Scf/day' potential={rates.gasPotential} latest={rates.gasActual} values={valueSeries('gas')} color='var(--chart-2)' bands={bands}/>
        <div className='chart-legend'><span><i className='actual'/>Actual</span><span><i className='potential'/>Potential</span><span><i className='loss'/>Production loss</span><span>Background bands show production status</span></div>
      </CardContent></Card>
      <div className='production-summary-strip'><div><span>Cumulative oil loss</span><strong>{number(totals.oil)} bbl</strong></div><div><span>Cumulative condensate loss</span><strong>{number(totals.condensate)} bbl</strong></div><div><span>Cumulative gas loss</span><strong>{number(totals.gas)} Scf</strong></div><div><span>Gross revenue loss</span><strong>${number(totals.revenue)}</strong></div><p>Calculated for {displayDate(totalsStart)} – {displayDate(safeEnd)}</p></div>
      <Card><CardContent className='p-5'>
        <header className='records-heading'><div><h2>Readings & intervals</h2><p>{records.length} timestamped readings · {intervals.filter(item => item.startDate <= safeEnd && item.endDate >= safeStart).length} operating intervals</p></div><div><select aria-label='Filter by status' value={status} onChange={event => setStatus(event.target.value)}><option>All statuses</option>{[...new Set(readings.map(item => item.status))].map(value => <option key={value}>{value}</option>)}</select><select aria-label='Filter by source' value={source} onChange={event => setSource(event.target.value)}><option>All sources</option><option>Manual</option><option>CSV import</option></select><Button variant='outline' size='sm'><Download className='mr-2 h-4 w-4'/>Export</Button></div></header>
        <div className='production-table-wrap'><table className='production-table'><thead><tr><th>Recorded</th><th>Production status</th><th>Oil <small>bbl/day</small></th><th>Condensate <small>bbl/day</small></th><th>Gas <small>Scf/day</small></th><th>Source</th></tr></thead><tbody>{records.map(reading => <tr key={reading.id}><td><strong>{dateTime.format(new Date(reading.recordedAt))}</strong><small>{reading.author ?? 'Imported record'}</small></td><td><span className={`production-status ${reading.status.toLowerCase().replaceAll(/[^a-z]+/g, '-')}`}>{reading.status}</span></td><td>{number(reading.oil)}</td><td>{number(reading.condensate)}</td><td>{number(reading.gas)}</td><td>{reading.source}</td></tr>)}</tbody></table>{records.length === 0 && <p className='empty-records'>No readings match this period and filter.</p>}</div>
        <footer className='records-footer'>Timestamped observations remain separate from production-status intervals so enhanced monitoring does not fragment loss accounting.</footer>
      </CardContent></Card>
    </section>
  </div>;
}
