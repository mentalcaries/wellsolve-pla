import { ObservationStatusText } from '../status-components';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { formatWellDate, type MonitoringEntry } from '../well-data';

export function LastEntrySummary({ entries }: { entries: MonitoringEntry[] }) {
  const latestEntry=entries[0]; if(!latestEntry)return null;
  const observations=[{field:'visualLeaks' as const,label:'Visual leaks',value:latestEntry.visualLeaks},{field:'annulusStatus' as const,label:'Annulus status',value:latestEntry.annulusStatus},{field:'corrosion' as const,label:'Corrosion',value:latestEntry.corrosion},{field:'missingDamagedComponents' as const,label:'Missing components',value:latestEntry.missingDamagedComponents}];
  return <Card className='h-full'><CardHeader className='p-4 pb-3'><CardTitle className='text-base font-semibold leading-6'>Last entry summary · {formatWellDate(latestEntry.recordedAt)}</CardTitle></CardHeader><CardContent className='px-4 pb-4'><div className='grid gap-3 sm:grid-cols-2'>{observations.map(({field,label,value})=><div className='rounded-md bg-muted p-2.5' key={label}><p className='text-xs text-muted-foreground'>{label}</p><ObservationStatusText className='mt-1' field={field} value={value}/></div>)}</div><div className='mt-3 flex flex-col items-start gap-1 border-t border-border pt-3 text-sm sm:flex-row sm:justify-between'><span className='text-muted-foreground'>Well Integrity Testing Status</span><ObservationStatusText className='sm:max-w-[65%]' field='valveIntegrityTestingStatus' value={latestEntry.valveIntegrityTestingStatus}/></div></CardContent></Card>;
}
