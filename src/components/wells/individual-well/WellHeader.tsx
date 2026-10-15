import { Plus } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../../estimates/ui/button';
import { BarrierClassificationBadge } from '../status-components';
import type { MonitoringEntry } from '../well-data';

export function WellHeader({ latestEntry }: { latestEntry?: MonitoringEntry }) {
  const navigate = useNavigate();
  const location = useLocation();
  return <>
    <Link className='text-sm text-muted-foreground hover:text-foreground' to='/wells'>← Back to Wells</Link>
    <header className='flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between'>
      <div><div className='flex flex-wrap items-center gap-3'><h1 className='text-2xl font-bold tracking-tight'>F-120</h1>{latestEntry && <BarrierClassificationBadge label={latestEntry.barrierClassification}/>}</div><p className='mt-1 text-sm text-muted-foreground'>Fish · Gas Injection</p></div>
      <div className='flex flex-wrap gap-2'>
        <Button variant='ghost'>Add note</Button>
        <Button variant='ghost' onClick={() => navigate('/reports/new/production-impact')}>Create Mitigation Report</Button>
        <Button className='bg-orange-600 hover:bg-orange-700' onClick={() => navigate('/wells/f-120/status', { state: { returnTo: location.pathname } })}><Plus className='mr-2 h-4 w-4'/>Update Well Status</Button>
      </div>
    </header>
  </>;
}
