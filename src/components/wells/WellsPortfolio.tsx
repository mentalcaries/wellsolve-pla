import { Search } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { Input } from '../estimates/ui/input';
import { Card, CardContent } from './ui/card';
import { BarrierClassificationBadge, ObservationStatusText } from './status-components';
import { BARRIER_CLASSIFICATIONS, formatWellDate, type PortfolioWell } from './well-data';

const CURRENT_DATE = new Date('2026-10-13T12:00:00Z');
const TODAY = '2026-10-13';
const CRITICAL_CONTAINED_FILTER = 'critical-contained';

function isOverdue(well: PortfolioWell) {
  return !well.recordedAt || Boolean(well.nextUpdateDue && well.nextUpdateDue < TODAY);
}

function isDueThisMonth(well: PortfolioWell) {
  return Boolean(well.nextUpdateDue?.startsWith(CURRENT_DATE.toISOString().slice(0, 7))) && !isOverdue(well);
}

export function WellsPortfolio({ wells }: { wells: PortfolioWell[] }) {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [field, setField] = useState('all');
  const [status, setStatus] = useState('all');
  const [updateStatus, setUpdateStatus] = useState('all');
  const fields = [...new Set(wells.map(item => item.fieldName))].sort();
  const metrics = {
    criticalOrContained: wells.filter(item => item.barrierClassification === 'Critical' || item.barrierClassification === '1B Contained').length,
    degraded: wells.filter(item => item.barrierClassification === 'Degraded').length,
    overdue: wells.filter(isOverdue).length,
    dueThisMonth: wells.filter(isDueThisMonth).length,
  };
  const metricCards = [
    { label: 'Critical / Contained', value: metrics.criticalOrContained, color: '#dc2626', dimension: 'barrier', filterValue: CRITICAL_CONTAINED_FILTER },
    { label: 'Degraded / Compromised', value: metrics.degraded, color: '#eab308', dimension: 'barrier', filterValue: 'Degraded' },
    { label: 'Overdue for Update', value: metrics.overdue, color: '#c52222', dimension: 'schedule', filterValue: 'overdue' },
    { label: 'Due This Month', value: metrics.dueThisMonth, color: '#d6a843', dimension: 'schedule', filterValue: 'due-this-month' },
  ];
  const filteredWells = wells.filter(item => {
    const query = search.trim().toLowerCase();
    const barrierMatches = status === 'all' || (status === CRITICAL_CONTAINED_FILTER ? item.barrierClassification === 'Critical' || item.barrierClassification === '1B Contained' : item.barrierClassification === status);
    const overdue = isOverdue(item);
    const scheduleMatches = updateStatus === 'all' || (updateStatus === 'overdue' ? overdue : updateStatus === 'due-this-month' ? isDueThisMonth(item) : !overdue);
    return (!query || item.name.toLowerCase().includes(query) || item.fieldName.toLowerCase().includes(query)) && (field === 'all' || item.fieldName === field) && barrierMatches && scheduleMatches;
  });

  return <div className='space-y-4'>
    <div className='grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border lg:grid-cols-4'>
      {metricCards.map(metric => {
        const selected = metric.dimension === 'barrier' ? status === metric.filterValue : updateStatus === metric.filterValue;
        return <button aria-label={`Filter wells by ${metric.label}`} aria-pressed={selected} className={cn('flex min-h-16 items-center justify-start gap-3 bg-[#fbfcfe] px-4 py-2.5 text-left transition-colors hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring', selected && 'bg-primary/5 ring-2 ring-inset ring-primary/40')} key={metric.label} onClick={() => metric.dimension === 'barrier' ? setStatus(current => current === metric.filterValue ? 'all' : metric.filterValue) : setUpdateStatus(current => current === metric.filterValue ? 'all' : metric.filterValue)} type='button'>
          <p className='shrink-0 text-3xl font-bold leading-none' style={{ color: metric.color }}>{metric.value}</p>
          <p className='text-xs font-semibold uppercase tracking-[0.05em] text-muted-foreground'>{metric.label}</p>
        </button>;
      })}
    </div>

    <Card><CardContent className='p-4'><div className='grid gap-3 sm:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_12rem_14rem_14rem]'>
      <div className='relative sm:col-span-2 xl:col-span-1'><Search className='absolute left-3 top-3 h-4 w-4 text-muted-foreground'/><Input type='search' value={search} onChange={event => setSearch(event.target.value)} placeholder='Search by well or field...' className='pl-9'/></div>
      <FilterSelect value={field} onChange={setField} label='Field'><option value='all'>All fields</option>{fields.map(name => <option key={name} value={name}>{name}</option>)}</FilterSelect>
      <FilterSelect value={status} onChange={setStatus} label='Barrier status'><option value='all'>All barrier statuses</option><option value={CRITICAL_CONTAINED_FILTER}>Critical / 1B Contained</option>{BARRIER_CLASSIFICATIONS.map(item => <option key={item.key} value={item.label}>{item.label}</option>)}</FilterSelect>
      <FilterSelect value={updateStatus} onChange={setUpdateStatus} label='Update status'><option value='all'>All update statuses</option><option value='overdue'>Overdue / not reported</option><option value='due-this-month'>Due this month</option><option value='up-to-date'>Up to date</option></FilterSelect>
    </div></CardContent></Card>

    <Card><CardContent className='p-0'><div className='max-h-[67dvh] overflow-x-scroll overflow-y-auto'>
      <table className='min-w-[1500px] border-separate border-spacing-0 text-sm'><thead className='sticky top-0 z-20 bg-muted/95 backdrop-blur'><tr>{['Well','Overall Barrier Status','Visual Leaks','Annulus Status','Corrosion Profile','Missing Component','Well Integrity Testing Status','Mitigation Status','Logged by'].map((heading,index) => <th key={heading} className={cn('whitespace-nowrap border-b border-border px-4 py-3 text-left font-semibold text-muted-foreground', index === 0 && 'sticky left-0 z-30 min-w-56 border-r bg-muted')}>{heading}</th>)}</tr></thead>
        <tbody>{filteredWells.map(item => {
          const overdue = isOverdue(item);
          const monitoringStatus = item.recordedAt ? overdue ? 'Overdue' : 'Up to date' : 'Not reported';
          const cells = [
            { field: 'visualLeaks' as const, value: item.visualLeaks }, { field: 'annulusStatus' as const, value: item.annulusStatus }, { field: 'corrosion' as const, value: item.corrosion }, { field: 'missingDamagedComponents' as const, value: item.missingDamagedComponents }, { field: 'valveIntegrityTestingStatus' as const, value: item.valveIntegrityTestingStatus },
          ];
          return <tr key={item.id} tabIndex={0} className='group cursor-pointer hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring' onClick={() => navigate('/wells/f-120')} onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') navigate('/wells/f-120'); }}>
            <td className='sticky left-0 z-10 min-w-56 border-b border-r border-border bg-background px-4 py-4 group-hover:bg-muted'><p className='font-semibold'>{item.name}</p><div className='mt-2 flex flex-wrap items-center gap-2'><span className={cn('inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold', monitoringStatus === 'Up to date' ? 'bg-green-100 text-green-700' : monitoringStatus === 'Overdue' ? 'bg-red-100 text-red-700' : 'bg-muted text-muted-foreground')}>{monitoringStatus}</span><span className='text-xs font-normal text-muted-foreground'>{item.recordedAt ? `Updated ${formatWellDate(item.recordedAt)}` : 'No monitoring entry'}</span></div></td>
            <td className='min-w-44 border-b border-border px-4 py-4'>{item.barrierClassification ? <BarrierClassificationBadge label={item.barrierClassification}/> : '—'}</td>
            {cells.map(({field: observationField,value},index) => <td className={cn('min-w-40 border-b border-border px-4 py-4 text-muted-foreground',index===4&&'min-w-[220px]')} key={observationField}>{value ? <ObservationStatusText field={observationField} value={value}/> : '—'}</td>)}
            <td className='min-w-[200px] border-b border-border px-4 py-4 text-muted-foreground'>{item.mitigationStatus ?? '—'}</td><td className='min-w-40 border-b border-border px-4 py-4 text-muted-foreground'>{item.loggedBy ?? '—'}</td>
          </tr>;
        })}</tbody>
      </table>
      {filteredWells.length === 0 && <div className='py-16 text-center text-muted-foreground'>No wells match these filters.</div>}
    </div></CardContent></Card>
  </div>;
}

function FilterSelect({ value, onChange, label, children }: { value: string; onChange: (value: string) => void; label: string; children: React.ReactNode }) {
  return <select aria-label={label} className='h-10 rounded-md border border-input bg-background px-3 text-sm' value={value} onChange={event => onChange(event.target.value)}>{children}</select>;
}
