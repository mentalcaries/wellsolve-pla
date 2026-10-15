import type { ReactNode } from 'react';
import { BarrierClassificationBadge } from '../status-components';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { formatWellDate, type MonitoringEntry } from '../well-data';

interface TimelineItem { id: string; type: string; date: string; color: string; content: ReactNode }

export function WellTimeline({ entries }: { entries: MonitoringEntry[] }) {
  const statusItems: TimelineItem[] = entries.map(entry => ({
    id: entry.id,
    type: 'Status Update',
    date: entry.recordedAt,
    color: 'bg-orange-500',
    content: <><span className='mt-2 flex flex-wrap items-center gap-2'><BarrierClassificationBadge label={entry.barrierClassification}/><span className='text-sm text-muted-foreground'>{entry.visualLeaks} · {entry.annulusStatus}</span></span><span className='mt-1 block text-xs text-muted-foreground'>{entry.authorName}</span></>,
  }));
  const fixedItems: TimelineItem[] = [
    {id:'report-1',type:'Mitigation Planning Report',date:'2026-10-05',color:'bg-blue-500',content:<span className='mt-1 block text-sm font-medium'>F-120 5 Oct 2026</span>},
    {id:'note-1',type:'Note',date:'2026-10-03',color:'bg-gray-400',content:<><span className='mt-1 block text-sm'>Production restriction confirmed and linked to current mitigation.</span><span className='text-xs text-muted-foreground'>Devin James</span></>},
  ];
  const items = [...statusItems, ...fixedItems].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 7);
  return <Card className='scroll-mt-24' id='timeline'><CardHeader className='p-4 pb-3'><CardTitle className='text-base font-semibold uppercase leading-6'>Timeline</CardTitle></CardHeader><CardContent className='px-4 pb-4'><div className='space-y-1'>{items.map(item=><button className='flex w-full gap-3 rounded-md p-2.5 text-left hover:bg-muted' key={item.id} type='button'><span className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${item.color}`}/><span className='min-w-0 flex-1'><span className='flex flex-wrap items-center gap-x-2 gap-y-1'><span className='rounded bg-muted px-1.5 py-0.5 text-xs font-medium'>{item.type}</span><span className='text-xs text-muted-foreground'>{formatWellDate(item.date)}</span></span>{item.content}</span></button>)}</div></CardContent></Card>;
}
