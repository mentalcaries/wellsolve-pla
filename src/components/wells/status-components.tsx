import { cn } from '../../lib/utils';
import { getBarrierClassification, observationTone, type ObservationField } from './well-data';

export function BarrierClassificationBadge({ label }: { label: string }) {
  const classification = getBarrierClassification(label);
  if (!classification) return null;
  return <span className='inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold' style={{ color: classification.textColor, backgroundColor: classification.bg }}>{classification.label}</span>;
}

export function ObservationStatusText({ className, field, value }: { className?: string; field: ObservationField; value: string }) {
  return <span className={cn('inline-flex max-w-full items-start gap-2 text-left text-sm font-medium leading-5 text-foreground', className)}><span aria-hidden='true' className='mt-1.5 h-2 w-2 shrink-0 rounded-full' style={{ backgroundColor: observationTone(field, value) }}/><span>{value}</span></span>;
}
