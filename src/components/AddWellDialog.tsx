import { Check, Info, Upload } from 'lucide-react';
import { useState } from 'react';
import type { ProductionStream } from '../types';
import { Button, Field, Modal } from './ui';

export function AddWellDialog({ onClose, onBaseline, onStatus }: { onClose: () => void; onBaseline: (streams: ProductionStream[]) => void; onStatus: () => void }) {
  const [productionEnabled, setProductionEnabled] = useState(true);
  const [streams, setStreams] = useState<ProductionStream[]>(['oil', 'gas']);
  const [complete, setComplete] = useState(false);
  const toggle = (stream: ProductionStream) => setStreams(current => current.includes(stream) ? current.filter(value => value !== stream) : [...current, stream]);

  if (complete) return (
    <Modal title='Well added' description='F-121 is ready. What would you like to record next?' onClose={onClose} size='small'>
      <div className='success-mark'><Check /></div>
      <div className='stacked-actions'>
        {productionEnabled && streams.length > 0 && <Button onClick={() => onBaseline(streams)}>Record production baseline</Button>}
        <Button variant='secondary' onClick={onStatus}>Update Well Status</Button>
        <Button variant='ghost' onClick={onClose}>Not now</Button>
      </div>
    </Modal>
  );

  return (
    <Modal title='Add Well' description='Add a monitored well to your portfolio.' onClose={onClose}>
      <form onSubmit={event => { event.preventDefault(); if (!productionEnabled || streams.length > 0) setComplete(true); }}>
        <div className='read-only'><span>Engineer name</span><strong>Don Joe</strong></div>
        <div className='form-grid two'>
          <Field label='Well name'><input defaultValue='F-121' required /></Field><Field label='Field'><input defaultValue='Fish' required /></Field>
          <Field label='Country'><select defaultValue='Trinidad and Tobago'><option>Trinidad and Tobago</option></select></Field><Field label='Region/State'><input defaultValue='North Coast' /></Field>
          <Field label='Land / Offshore'><select defaultValue='Offshore Platform'><option>Offshore Platform</option><option>Land</option></select></Field>
          <Field label='Well type'><select defaultValue='Natural Flow'><option>Natural Flow</option><option>Gas Injection</option><option>Not Producing | No AL</option></select></Field>
        </div>
        <Field label='Monitoring frequency'><select defaultValue='Monthly'><option>Weekly</option><option>Monthly</option><option>Quarterly</option></select></Field>
        <div className='divider' />
        <div className='toggle-heading'><div><h3>Production tracking</h3><span>Optional</span></div><label className='switch'><input type='checkbox' checked={productionEnabled} onChange={event => setProductionEnabled(event.target.checked)} /><span /></label></div>
        {productionEnabled && <div className='production-options'>
          <p>Select the production recorded for this well.</p>
          <div className='stream-options'><button type='button' className={streams.includes('oil') ? 'stream selected' : 'stream'} onClick={() => toggle('oil')}><Check size={14} /> Oil</button><button type='button' className={streams.includes('gas') ? 'stream selected' : 'stream'} onClick={() => toggle('gas')}><Check size={14} /> Natural gas</button></div>
          <div className='info-neutral'><Info size={15} /><div><strong>Standard input units</strong><span>Oil: bbl/day · Natural gas: Mscf/day at standard conditions</span></div></div>
          {streams.length === 0 && <p className='field-error'>Select Oil, Natural gas, or turn off production tracking.</p>}
        </div>}
        <Field label='Well schematic' hint='Optional'><button type='button' className='dropzone'><Upload size={16} /> Choose a PNG, JPEG, WebP, or PDF up to 5 MB</button></Field>
        <footer className='modal-actions'><Button type='button' variant='secondary' onClick={onClose}>Cancel</Button><Button type='submit'>Continue</Button></footer>
      </form>
    </Modal>
  );
}
