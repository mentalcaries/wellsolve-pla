import { useMemo, useState } from 'react';
import type { ProductionRates, ProductionStream } from '../types';
import { Button, Field, Modal } from './ui';

const format = (value: number) => new Intl.NumberFormat('en-US').format(Math.max(0, value));
const daysBetween = (start: string, end: string) => {
  const startDate = new Date(`${start}T00:00:00`);
  const endDate = new Date(`${end}T00:00:00`);
  return endDate < startDate ? 0 : Math.round((endDate.getTime() - startDate.getTime()) / 86400000) + 1;
};

export function ProductionDialog({ mode, streams, initialRates, onClose, onSave }: { mode: 'baseline' | 'update'; streams: ProductionStream[]; initialRates: ProductionRates; onClose: () => void; onSave: (rates: ProductionRates) => void }) {
  const [rates, setRates] = useState(initialRates);
  const [start, setStart] = useState(mode === 'baseline' ? '2026-10-13' : '2026-10-10');
  const [end, setEnd] = useState('2026-10-13');
  const days = daysBetween(start, end);
  const impact = useMemo(() => ({ oilRate: Math.max(0, rates.oilPotential - rates.oilActual), gasRate: Math.max(0, rates.gasPotential - rates.gasActual) }), [rates]);
  const update = (key: keyof ProductionRates, value: string) => setRates(current => ({ ...current, [key]: Number(value) || 0 }));

  return (
    <Modal title={mode === 'baseline' ? 'Record production baseline' : 'Update production'} description={mode === 'baseline' ? 'F-121 · Establish potential and current production' : 'F-120 · Update the existing production loss record'} onClose={onClose} size='large'>
      {mode === 'update' && <div className='event-banner'><strong>Active loss event · Reduced production</strong><span>Started 1 Oct 2026 · Well integrity related · Mitigation case linked</span></div>}
      <form onSubmit={event => { event.preventDefault(); if (days > 0) onSave(rates); }}>
        <h3>Measurement period</h3><div className='form-grid three'><Field label='Start date'><input type='date' value={start} onChange={event => setStart(event.target.value)} /></Field><Field label='Through date'><input type='date' value={end} onChange={event => setEnd(event.target.value)} /></Field><Field label='Operating phase'><select defaultValue={mode === 'baseline' ? 'Normal production' : 'Reduced production'}><option>Normal production</option><option>Reduced production</option><option>Intervention shut-in</option><option>Recovery</option></select></Field></div>
        <h3>Production rates</h3><div className='rate-table'><div className='rate-head'><span>Stream</span><span>Potential production</span><span>Actual production</span></div>{streams.includes('oil') && <RateRow name='Oil' unit='bbl/day' potential={rates.oilPotential} actual={rates.oilActual} onPotential={value => update('oilPotential', value)} onActual={value => update('oilActual', value)} />}{streams.includes('gas') && <RateRow name='Natural gas' unit='Mscf/day' potential={rates.gasPotential} actual={rates.gasActual} onPotential={value => update('gasPotential', value)} onActual={value => update('gasActual', value)} />}</div>
        {mode === 'update' && <><h3>Loss context</h3><div className='form-grid two'><Field label='High-level cause'><select defaultValue='Well integrity'><option>Well integrity</option><option>Downhole</option><option>Reservoir</option><option>Surface equipment</option><option>Transport facilities</option><option>Plant</option></select></Field><Field label='Linked mitigation'><select><option>F-120 · Active mitigation</option><option>Not linked</option></select></Field></div><div className='calculation-preview'><header><strong>Estimated impact for this interval</strong><span>Auto-calculated</span></header><div className='preview-grid'>{streams.includes('oil') && <><div><span>Oil loss rate</span><strong>{format(impact.oilRate)} bbl/day</strong></div><div><span>Oil volume loss</span><strong>{format(impact.oilRate * days)} bbl</strong></div></>}{streams.includes('gas') && <><div><span>Gas loss rate</span><strong>{format(impact.gasRate)} Mscf/day</strong></div><div><span>Gas volume loss</span><strong>{format(impact.gasRate * days)} Mscf</strong></div></>}</div></div><label className='check-line'><input type='checkbox' defaultChecked /> Keep this loss event open for the next production update</label></>}
        {days === 0 && <p className='field-error'>Through date must be on or after the start date.</p>}
        <footer className='modal-actions'><Button type='button' variant='secondary' onClick={onClose}>Cancel</Button><Button type='submit'>{mode === 'baseline' ? 'Save baseline' : 'Save update'}</Button></footer>
      </form>
    </Modal>
  );
}

function RateRow({ name, unit, potential, actual, onPotential, onActual }: { name: string; unit: string; potential: number; actual: number; onPotential: (value: string) => void; onActual: (value: string) => void }) {
  return <div className='rate-row'><strong>{name}</strong><UnitInput value={potential} unit={unit} onChange={onPotential} /><UnitInput value={actual} unit={unit} onChange={onActual} /></div>;
}
function UnitInput({ value, unit, onChange }: { value: number; unit: string; onChange: (value: string) => void }) {
  return <div className='unit-input'><input type='number' value={value} onChange={event => onChange(event.target.value)} /><span>{unit}</span></div>;
}
