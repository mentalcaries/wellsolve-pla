import { useMemo, useState } from 'react';
import type { ProductionRates, ProductionStatus, ProductionStream, ProductionUpdate } from '../types';
import { Button, Field, Modal } from './ui';

const format = (value: number) => new Intl.NumberFormat('en-US').format(Math.max(0, value));
const daysBetween = (start: string, end: string) => {
  if (!start || !end) return 0;
  const startDate = new Date(`${start}T00:00:00`);
  const endDate = new Date(`${end}T00:00:00`);
  return endDate < startDate ? 0 : Math.round((endDate.getTime() - startDate.getTime()) / 86400000) + 1;
};

export function ProductionDialog({ mode, streams, initialRates, initialDate, onClose, onSave }: { mode: 'baseline' | 'update'; streams: ProductionStream[]; initialRates: ProductionRates; initialDate?: string; onClose: () => void; onSave: (update: ProductionUpdate) => void }) {
  const [rates, setRates] = useState(initialRates);
  const [start, setStart] = useState(initialDate ?? (mode === 'baseline' ? '2026-10-13' : '2026-10-10'));
  const [end, setEnd] = useState(initialDate ?? '2026-10-13');
  const [status, setStatus] = useState<ProductionStatus>(mode === 'baseline' ? 'Normal Production' : 'Reduced Rates');
  const [lossContext, setLossContext] = useState('Well integrity');
  const days = daysBetween(start, end);
  const validRates = streams.every(stream => {
    if (stream === 'oil') return rates.oilPotential > 0 && rates.oilActual >= 0;
    if (stream === 'condensate') return rates.condensatePotential > 0 && rates.condensateActual >= 0;
    return rates.gasPotential > 0 && rates.gasActual >= 0;
  });
  const impact = useMemo(() => ({ oilRate: Math.max(0, rates.oilPotential - rates.oilActual), condensateRate: Math.max(0, rates.condensatePotential - rates.condensateActual), gasRate: Math.max(0, rates.gasPotential - rates.gasActual) }), [rates]);
  const update = (key: keyof ProductionRates, value: string) => setRates(current => ({ ...current, [key]: Number(value) || 0 }));

  return (
    <Modal title={mode === 'baseline' ? 'Record production baseline' : 'Update production'} description={mode === 'baseline' ? 'F-121 · Establish potential and current production' : 'F-120 · Update the existing production loss record'} onClose={onClose} size='large'>
      {mode === 'update' && <div className='event-banner'><strong>Active loss event · Reduced Rates</strong><span>Started 1 Oct 2026 · Well integrity related · Mitigation case linked</span></div>}
      <form onSubmit={event => { event.preventDefault(); if (days > 0 && validRates) onSave({ rates, startDate: start, endDate: end, status, lossContext }); }}>
        <h3>Production period</h3><div className='form-grid four'><Field label='Production Status'><select value={status} onChange={event => setStatus(event.target.value as ProductionStatus)}>{['Normal Production','Reduced Rates','Shut-in / No Production','Intervention','Recovery / Ramp-up','Permanently Ceased / Abandoned'].map(value => <option key={value}>{value}</option>)}</select></Field><Field label='Start Date'><input type='date' value={start} onChange={event => setStart(event.target.value)} /></Field><Field label='End Date'><input type='date' value={end} onChange={event => setEnd(event.target.value)} /></Field><Field label='Total Days'><input disabled value={days ? `${days} days` : '—'} /></Field></div>
        <h3>Production rates</h3><div className='rate-table'><div className='rate-head'><span>Stream</span><span>Potential production</span><span>Actual production</span></div>{streams.includes('oil') && <RateRow name='Oil' unit='bbl/day' potential={rates.oilPotential} actual={rates.oilActual} onPotential={value => update('oilPotential', value)} onActual={value => update('oilActual', value)} />}{streams.includes('condensate') && <RateRow name='Condensate' unit='bbl/day' potential={rates.condensatePotential} actual={rates.condensateActual} onPotential={value => update('condensatePotential', value)} onActual={value => update('condensateActual', value)} />}{streams.includes('gas') && <RateRow name='Natural gas' unit='Scf/day' potential={rates.gasPotential} actual={rates.gasActual} onPotential={value => update('gasPotential', value)} onActual={value => update('gasActual', value)} />}</div>
        {mode === 'update' && <><h3>Loss context</h3><div className='form-grid two'><Field label='High-level cause'><select value={lossContext} onChange={event => setLossContext(event.target.value)}><option>None</option><option>Well integrity</option><option>Downhole</option><option>Reservoir</option><option>Surface equipment</option><option>Transport facilities</option><option>Plant</option></select></Field><Field label='Linked event or mitigation' hint='Optional, including when the loss context is None'><select><option>F-120 · Active mitigation</option><option>Loss event only · 1 Oct 2026</option><option>Not linked</option></select></Field></div>{lossContext === 'None' ? <p className='inline-note'>No production loss is assigned to this period. You can still link the reading to an event for operational context.</p> : <div className='calculation-preview'><header><strong>Estimated impact for this interval</strong><span>Auto-calculated · {start} to {end}</span></header><div className='preview-grid'>{streams.includes('oil') && <div><span>Oil volume loss</span><strong>{format(impact.oilRate * days)} bbl</strong><small>{format(impact.oilRate)} bbl/day</small></div>}{streams.includes('condensate') && <div><span>Condensate volume loss</span><strong>{format(impact.condensateRate * days)} bbl</strong><small>{format(impact.condensateRate)} bbl/day</small></div>}{streams.includes('gas') && <div><span>Gas volume loss</span><strong>{format(impact.gasRate * days)} Scf</strong><small>{format(impact.gasRate)} Scf/day</small></div>}<div><span>Total days</span><strong>{days}</strong><small>{status}</small></div></div></div>}<label className='check-line'><input type='checkbox' defaultChecked /> Keep this event open for the next production update</label></>}
        {days === 0 && <p className='field-error'>Start Date and End Date are required, and End Date must not be before Start Date.</p>}
        {!validRates && <p className='field-error'>Potential rates must be greater than zero and actual rates cannot be negative.</p>}
        <footer className='modal-actions'><Button type='button' variant='secondary' onClick={onClose}>Cancel</Button><Button type='submit' disabled={!days || !validRates}>{mode === 'baseline' ? 'Save baseline' : 'Save update'}</Button></footer>
      </form>
    </Modal>
  );
}

function RateRow({ name, unit, potential, actual, onPotential, onActual }: { name: string; unit: string; potential: number; actual: number; onPotential: (value: string) => void; onActual: (value: string) => void }) {
  return <div className='rate-row'><strong>{name}</strong><UnitInput value={potential} unit={unit} onChange={onPotential} /><UnitInput value={actual} unit={unit} onChange={onActual} /></div>;
}
function UnitInput({ value, unit, onChange }: { value: number; unit: string; onChange: (value: string) => void }) {
  return <div className='unit-input'><input type='number' min='0' value={value} onChange={event => onChange(event.target.value)} /><span>{unit}</span></div>;
}
