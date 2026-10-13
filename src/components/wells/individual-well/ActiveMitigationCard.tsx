import { ExternalLink, MessageSquarePlus, Pencil } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../estimates/ui/button';
import { BarrierClassificationBadge } from '../status-components';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { activeMitigation, formatWellDate } from '../well-data';

export function ActiveMitigationCard() {
  const navigate=useNavigate();
  return <Card className='scroll-mt-24 border-primary/30 bg-primary/[0.03]' id='active-mitigation'><CardHeader className='gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0'><div className='flex flex-wrap items-center gap-3'><CardTitle className='text-lg leading-6'>Active Mitigation</CardTitle><span className='rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary'>In Progress</span><BarrierClassificationBadge label='Degraded'/></div><Button size='sm' variant='outline'><MessageSquarePlus className='mr-2 h-4 w-4'/>Update mitigation status</Button></CardHeader><CardContent className='grid gap-5 p-4 pt-0'>
    <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'><div className='sm:col-span-2'><div className='flex items-center gap-1'><p className='text-xs font-medium uppercase tracking-wide text-muted-foreground'>Failure identified</p><Button className='h-auto px-2 py-1 text-xs' variant='ghost'><Pencil className='mr-1 h-3.5 w-3.5'/>Edit</Button></div><p className='mt-1 text-sm'>{activeMitigation.failureIdentified}</p></div><div><p className='text-xs font-medium uppercase tracking-wide text-muted-foreground'>Case opened</p><p className='mt-1 text-sm'>{formatWellDate(activeMitigation.dateOfFailure)}</p><p className='text-xs text-muted-foreground'>Open for 12 days</p></div><div><p className='text-xs font-medium uppercase tracking-wide text-muted-foreground'>Mitigation Planning Report</p><Button className='mt-1 h-auto p-0' variant='link' onClick={()=>navigate('/reports/new/production-impact')}>View linked report<ExternalLink className='ml-1 h-3.5 w-3.5'/></Button></div></div>
    <div><p className='text-xs font-medium uppercase tracking-wide text-muted-foreground'>Mitigation status</p><p className='mt-1 text-sm'>{activeMitigation.remedialAction}</p><p className='mt-1 text-xs text-muted-foreground'>Updated through mitigation progress notes.</p></div>
    <div><p className='text-xs font-medium uppercase tracking-wide text-muted-foreground'>Progress notes</p><ol className='mt-2 divide-y divide-border rounded-md border border-border bg-background/70'>{activeMitigation.notes.map(note=><li className='p-3 text-sm' key={note.id}><p>{note.content}</p><p className='mt-1 text-xs text-muted-foreground'>{formatWellDate(note.noteDate)} · {note.mitigationStatus}</p><p className='mt-1 text-xs text-muted-foreground'>{note.authorName} · recorded 10 Oct 2026, 09:30</p></li>)}</ol></div>
  </CardContent></Card>;
}
