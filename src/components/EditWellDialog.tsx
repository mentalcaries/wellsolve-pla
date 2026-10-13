import { Info } from 'lucide-react';
import { Button, Field, Modal } from './ui';

export function EditWellDialog({ onClose, onSave }: { onClose: () => void; onSave: () => void }) {
  return <Modal title='Edit well information' description='Update monitoring details and configure how production is recorded.' onClose={onClose}>
    <div className='well-summary'><span>F-120</span><small>Fish field · Gas Injection · Offshore Platform</small></div>
    <h3>Monitoring details</h3><div className='form-grid two'><Field label='Well type'><select><option>Gas Injection</option></select></Field><Field label='Monitoring frequency'><select><option>Monthly</option></select></Field></div>
    <div className='divider'/><h3>Production setup</h3><p className='section-help'>Select the production recorded for this well. Source units stay unchanged so the production history remains auditable.</p>
    <div className='stream-options'><button className='stream selected'><span>✓</span> Oil</button><button className='stream selected'><span>✓</span> Natural gas</button></div>
    <div className='form-grid two'><Field label='Oil source unit'><input disabled value='bbl/day'/></Field><Field label='Gas source unit' hint='At standard conditions'><input disabled value='Mscf/day'/></Field></div>
    <div className='info-callout'><Info size={15}/> Inputs are standardized as bbl/day for oil and Mscf/day for natural gas. Display conversions apply only to calculated results.</div>
    <footer className='modal-actions'><Button variant='secondary' onClick={onClose}>Cancel</Button><Button onClick={onSave}>Save changes</Button></footer>
  </Modal>;
}
