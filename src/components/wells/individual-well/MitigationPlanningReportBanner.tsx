import { FileWarning, X } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../estimates/ui/button';

export function MitigationPlanningReportBanner({ classification }: { classification: string }) {
  const navigate=useNavigate(); const [hidden,setHidden]=useState(false); if(hidden)return null;
  return <section className='relative flex flex-col gap-3 rounded-lg border border-primary/30 bg-primary/[0.06] p-4 pr-12 sm:flex-row sm:items-center sm:justify-between'><div className='flex gap-3'><FileWarning className='mt-0.5 h-5 w-5 shrink-0 text-primary'/><div><h2 className='text-sm font-semibold'>Mitigation Planning Report Recommended</h2><p className='mt-1 text-sm text-muted-foreground'>This well&apos;s barrier classification is {classification}. Consider completing a Mitigation Planning Report to document it.</p></div></div><Button className='shrink-0' size='sm' onClick={()=>navigate('/reports/new/production-impact')}>Create Mitigation Report</Button><Button aria-label='Dismiss reminder' className='absolute right-2 top-2 h-8 w-8' onClick={()=>setHidden(true)} size='icon' variant='ghost'><X className='h-4 w-4'/></Button></section>;
}
