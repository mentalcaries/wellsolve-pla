import { RotateCcw, XCircle } from 'lucide-react';
import { useFormContext, useWatch } from 'react-hook-form';
import { calculatePercentage, formatCurrency, formatNumber, parseNum } from './formatting';
import { ESTIMATE_UNITS, type EstimateItem, type EstimatesFormValues } from './estimate-data';
import { Input } from './ui/input';
import { TableCell, TableRow } from './ui/table';

export function EstimateItemRow({ item, index, categoryIndex, totalCost, onDelete }: { item: EstimateItem; index: number; categoryIndex: number; totalCost: number; onDelete?: () => void }) {
  const { control, setValue } = useFormContext<EstimatesFormValues>();
  const base = `estimates.${categoryIndex}.items.${index}` as const;
  const current = useWatch({ control, name: base });
  const total = parseNum(current.amount) * parseNum(current.days) * parseNum(current.unitCost);
  const hasValues = !!current.unit || total > 0;
  const reset = () => { setValue(`${base}.unit`, ''); setValue(`${base}.amount`, ''); setValue(`${base}.days`, ''); setValue(`${base}.unitCost`, ''); };
  return <TableRow className='group'>
    <TableCell className='relative p-2'>{onDelete && <button type='button' onClick={onDelete} className='absolute -left-6 top-1/2 -translate-y-1/2 text-destructive opacity-0 transition-opacity group-hover:opacity-100'><XCircle className='h-5 w-5'/></button>}{!item.isCustom && hasValues && <button type='button' onClick={reset} className='absolute -left-6 top-1/2 -translate-y-1/2 text-destructive opacity-0 transition-opacity group-hover:opacity-100'><RotateCcw className='h-3.5 w-3.5'/></button>}{item.isCustom ? <Input value={current.description} onChange={event => setValue(`${base}.description`, event.target.value)} placeholder='Enter description'/> : item.description}</TableCell>
    <TableCell className='p-2'><select className='h-10 min-w-[5.5rem] rounded-md border border-input bg-background px-2 text-sm' value={current.unit} onChange={event => setValue(`${base}.unit`, event.target.value)}><option value=''>Select</option>{ESTIMATE_UNITS.map(unit => <option key={unit}>{unit}</option>)}</select></TableCell>
    <TableCell className='p-2'><Input className='w-16' value={current.amount} onChange={event => setValue(`${base}.amount`, formatNumber(event.target.value))}/></TableCell>
    <TableCell className='p-2'><Input className='w-16' value={current.days} onChange={event => setValue(`${base}.days`, formatNumber(event.target.value))}/></TableCell>
    <TableCell className='p-2'><Input className='w-28' value={current.unitCost} onChange={event => setValue(`${base}.unitCost`, formatNumber(event.target.value))}/></TableCell>
    <TableCell className='p-2 text-right font-medium'>{formatCurrency(total)}</TableCell>
    <TableCell className='p-2 text-center'>{calculatePercentage(total,totalCost)}</TableCell>
  </TableRow>;
}
