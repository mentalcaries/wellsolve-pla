import { useNavigate } from 'react-router-dom';
import { Button, Field, Modal } from './ui';

export function StatusDialog({ onClose, onSave }: { onClose: () => void; onSave: () => void }) {
  const navigate = useNavigate();
  return <Modal title='Update Well Status' description='F-120' onClose={onClose} size='small'>
    <Field label='Date recorded'><input type='date' defaultValue='2026-10-13' /></Field>
    <Field label='Well barrier classification'><select defaultValue='Degraded'><option>Healthy</option><option>Degraded</option><option>1B Contained</option><option>Critical</option></select></Field>
    <div className='linked-production'><div><span>Production impact</span><strong>Active loss · updated 12 Oct 2026</strong><small>750 bbl/day oil · 1,300 Mscf/day gas</small></div><Button variant='secondary' onClick={() => navigate('/wells/f-120/production/update')}>Update linked record</Button></div>
    <Field label='Recommended actions'><textarea placeholder='Describe any recommended follow-up actions' /></Field>
    <footer className='modal-actions'><Button variant='secondary' onClick={onClose}>Cancel</Button><Button onClick={onSave}>Save</Button></footer>
  </Modal>;
}
