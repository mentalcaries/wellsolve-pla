import { useNavigate } from 'react-router-dom';
import type { ProductionRates } from '../../../types';
import { lossEvent } from '../../../data/mock-data';
import { Button } from '../../estimates/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

const number = (value: number) => new Intl.NumberFormat('en-US').format(value);

export function ProductionPerformanceCard({ rates }: { rates: ProductionRates }) {
  const navigate = useNavigate();
  return <Card>
    <CardHeader className='gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0'><div><p className='text-xs font-medium uppercase tracking-wide text-primary'>Well-level record</p><CardTitle className='text-lg leading-6'>Production Performance</CardTitle><p className='mt-1 text-sm text-muted-foreground'>Latest production update · 12 Oct 2026</p></div><div className='flex items-center gap-2'><span className='rounded-full bg-orange-100 px-2.5 py-1 text-xs font-semibold text-orange-800'>Active loss</span><Button size='sm' onClick={() => navigate('/wells/f-120/production/update')}>Update production</Button></div></CardHeader>
    <CardContent className='grid gap-4 p-4 pt-0'><div className='grid gap-3 sm:grid-cols-2 xl:grid-cols-4'><Metric label='Potential oil' value={number(rates.oilPotential)} unit='bbl/day' note='Baseline 1 Oct'/><Metric label='Actual oil' value={number(rates.oilActual)} unit='bbl/day' note='Reduced production'/><Metric label='Potential gas' value={number(rates.gasPotential)} unit='Mscf/day' note='Standard conditions'/><Metric label='Actual gas' value={number(rates.gasActual)} unit='Mscf/day' note='Measured 12 Oct'/></div>
      <div className='grid gap-px overflow-hidden rounded-md border border-orange-200 bg-orange-200 sm:grid-cols-2 xl:grid-cols-4'><Impact label='Cumulative oil loss' value={`${number(lossEvent.cumulativeOilLoss)} bbl`}/><Impact label='Cumulative gas loss' value={`${number(lossEvent.cumulativeGasLoss)} Mscf`}/><Impact label='Gross revenue loss' value='$1.62M'/><Impact label='Calculated through' value='13 Oct 2026'/></div>
      <div className='flex flex-col justify-between gap-2 text-xs text-muted-foreground sm:flex-row sm:items-center'><span>Reduced production · Well integrity related · Linked to active mitigation</span><Button className='h-auto p-0' variant='link' onClick={() => navigate('/wells/f-120/production')}>View production history →</Button></div>
    </CardContent>
  </Card>;
}
function Metric({label,value,unit,note}:{label:string;value:string;unit:string;note:string}) { return <div className='rounded-md border border-border bg-background p-3'><p className='text-xs text-muted-foreground'>{label}</p><p className='mt-1 text-lg font-semibold'>{value} <span className='text-xs'>{unit}</span></p><p className='mt-1 text-xs text-muted-foreground'>{note}</p></div>; }
function Impact({label,value}:{label:string;value:string}) { return <div className='bg-orange-50 p-3'><p className='text-xs font-medium uppercase tracking-wide text-orange-800'>{label}</p><p className='mt-1 font-semibold text-orange-900'>{value}</p></div>; }
