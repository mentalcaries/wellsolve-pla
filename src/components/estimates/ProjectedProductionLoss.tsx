import { Link2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { formatCurrency } from './formatting';
import { Input } from './ui/input';

export interface ProductionLossTotals {
  total: number;
  dailyAvoidedLoss: number;
  oilPrice: number;
  condensatePrice: number;
  gasPrice: number;
}

export function ProjectedProductionLoss({ onChange }: { onChange: (totals: ProductionLossTotals) => void }) {
  const [oilPrice, setOilPrice] = useState(60);
  const [condensatePrice, setCondensatePrice] = useState(55);
  const [gasPrice, setGasPrice] = useState(0.00325);
  const [reducedDays, setReducedDays] = useState(4);
  const [shutInDays, setShutInDays] = useState(3);
  const [recoveryDays, setRecoveryDays] = useState(5);
  const totals = useMemo(() => {
    const reducedDaily = 750 * oilPrice + 120 * condensatePrice + 1300000 * gasPrice;
    const shutInDaily = 2400 * oilPrice + 300 * condensatePrice + 8200000 * gasPrice;
    const recoveryDaily = 300 * oilPrice + 40 * condensatePrice + 500000 * gasPrice;
    return {
      reducedDaily,
      shutInDaily,
      recoveryDaily,
      reduced: reducedDaily * reducedDays,
      shutIn: shutInDaily * shutInDays,
      recovery: recoveryDaily * recoveryDays,
      total: reducedDaily * reducedDays + shutInDaily * shutInDays + recoveryDaily * recoveryDays,
    };
  }, [oilPrice, condensatePrice, gasPrice, reducedDays, shutInDays, recoveryDays]);

  useEffect(() => onChange({ total: totals.total, dailyAvoidedLoss: totals.reducedDaily, oilPrice, condensatePrice, gasPrice }), [totals, onChange, oilPrice, condensatePrice, gasPrice]);

  return <section className='mt-10 rounded-lg border border-border bg-[#fbfcfe] p-5 shadow-sm'>
    <div className='mb-4 flex items-start justify-between gap-4'><div><h2 className='text-xl font-semibold'>Projected Production Loss</h2><p className='font-light'>Estimate deferred revenue across reduced rates, intervention shut-in, and recovery.</p></div><span className='inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-800'><Link2 className='h-3 w-3'/>Linked loss event</span></div>
    <div className='mb-4 grid grid-cols-2 gap-3 md:grid-cols-3'>{[['Oil','2,400 potential · 1,650 actual bbl/day'],['Condensate','300 potential · 180 actual bbl/day'],['Natural gas','8,200,000 potential · 6,900,000 actual Scf/day']].map(([label,value])=><div className='rounded-md bg-muted p-3' key={label}><p className='text-[10px] font-semibold uppercase tracking-wide text-muted-foreground'>{label}</p><p className='font-semibold'>{value}</p></div>)}</div>
    <div className='mb-4 grid grid-cols-2 gap-3 md:grid-cols-5'><label className='text-sm font-medium'>Pricing basis<select className='mt-1 h-10 w-full rounded-md border border-input bg-background px-3'><option>Gross</option><option>Net</option></select></label><Price label='Oil (USD/bbl)' value={oilPrice} onChange={setOilPrice}/><Price label='Condensate (USD/bbl)' value={condensatePrice} onChange={setCondensatePrice}/><Price label='Gas (USD/Scf)' value={gasPrice} step='.00001' onChange={setGasPrice}/><div className='rounded-md border border-orange-200 bg-orange-50 p-3'><p className='text-[10px] font-semibold uppercase text-orange-800'>Current loss</p><p className='font-bold text-orange-900'>{formatCurrency(totals.reducedDaily)} / day</p></div></div>
    <div className='overflow-hidden rounded-md border border-border'><div className='grid grid-cols-[1.4fr_.7fr_1fr_1fr] gap-3 bg-muted px-3 py-2 text-[10px] font-semibold uppercase text-muted-foreground'><span>Phase and period</span><span className='text-right'>Duration</span><span className='text-right'>Daily revenue loss</span><span className='text-right'>Projected loss</span></div><Phase label='Reduced Rates' period='14–17 Oct 2026' days={reducedDays} setDays={setReducedDays} daily={totals.reducedDaily} total={totals.reduced}/><Phase label='Intervention shut-in' period='18–20 Oct 2026' days={shutInDays} setDays={setShutInDays} daily={totals.shutInDaily} total={totals.shutIn}/><Phase label='Recovery / Ramp-up' period='21–25 Oct 2026' days={recoveryDays} setDays={setRecoveryDays} daily={totals.recoveryDaily} total={totals.recovery}/><div className='grid grid-cols-[1.4fr_.7fr_1fr_1fr] gap-3 bg-orange-50 px-3 py-3 text-orange-900'><strong>Projected gross revenue loss · 14–25 Oct 2026</strong><span/><span/><strong className='text-right'>{formatCurrency(totals.total)}</strong></div></div>
  </section>;
}

function Price({label,value,step,onChange}:{label:string;value:number;step?:string;onChange:(value:number)=>void}){return <label className='text-sm font-medium'>{label}<Input className='mt-1' type='number' step={step} value={value} onChange={event=>onChange(Number(event.target.value)||0)}/></label>}
function Phase({label,period,days,setDays,daily,total}:{label:string;period:string;days:number;setDays:(value:number)=>void;daily:number;total:number}){return <div className='grid grid-cols-[1.4fr_.7fr_1fr_1fr] items-center gap-3 border-t border-border px-3 py-2'><div><strong>{label}</strong><p className='text-xs text-muted-foreground'>{period}</p></div><label className='flex items-center justify-end gap-1'><Input className='h-8 w-16 text-right' type='number' value={days} onChange={event=>setDays(Number(event.target.value)||0)}/><span className='text-xs text-muted-foreground'>days</span></label><span className='text-right'>{formatCurrency(daily)}</span><strong className='text-right'>{formatCurrency(total)}</strong></div>}
