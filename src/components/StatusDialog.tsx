import { Save } from 'lucide-react';
import { useState } from 'react';
import type { MonitoringEntry } from './wells/well-data';
import { Button, Field, Modal } from './ui';

const normalValues = {
  visualLeaks: 'None Observed',
  annulusStatus: 'All Annuli Normal',
  missingDamagedComponents: 'None Observed',
  corrosion: 'None',
  valveIntegrityTestingStatus: 'All SCE (Safety Critical Element) Tested on Time / Okay',
  barrierClassification: 'Healthy',
  mitigationStatus: 'None Required',
};

export function StatusDialog({ onClose, onSave }: { onClose: () => void; onSave: (entry: MonitoringEntry, updateProduction: boolean) => void }) {
  const [date, setDate] = useState('2026-10-15');
  const [values, setValues] = useState(normalValues);
  const [recommendedActions, setRecommendedActions] = useState('');
  const update = (key: keyof typeof normalValues, value: string) => setValues(current => ({ ...current, [key]: value }));
  const save = (updateProduction: boolean) => onSave({
    id: `entry-${Date.now()}`,
    recordedAt: date,
    createdAt: new Date().toISOString(),
    authorName: 'Don Joe',
    ...values,
    recommendedActions: recommendedActions || null,
  }, updateProduction);

  return <Modal title='Update Well Status' description='F-120' onClose={onClose} size='large'>
    <div className='status-form'>
      <div className='form-grid two'><Field label='Date recorded'><input type='date' value={date} onChange={event => setDate(event.target.value)} /></Field><Field label='Recorded by'><input disabled value='Don Joe'/></Field></div>
      <div className='set-normal-panel'><span>No issues observed?</span><Button variant='secondary' onClick={() => setValues(normalValues)}>Set all normal</Button></div>
      <StatusSelect label='Visual leaks' value={values.visualLeaks} options={['None Observed','Tree System','Wellhead System','Other']} onChange={value => update('visualLeaks', value)}/>
      <StatusSelect label='Annulus status' value={values.annulusStatus} options={['All Annuli Normal','SCP Within MAWOP A-Annulus','A-Annulus Above MAWOP','B-Annulus Above MAWOP','Multiple Annuli Above MAWOP']} onChange={value => update('annulusStatus', value)}/>
      <StatusSelect label='Missing / damaged components' value={values.missingDamagedComponents} options={['None Observed','Flow Tee Assembly','Tree System','Wellhead System','Other']} onChange={value => update('missingDamagedComponents', value)}/>
      <StatusSelect label='Corrosion' value={values.corrosion} options={['None','Mild','Medium','Severe']} onChange={value => update('corrosion', value)}/>
      <StatusSelect label='Well Integrity Testing Status' value={values.valveIntegrityTestingStatus} options={['All SCE (Safety Critical Element) Tested on Time / Okay','Integrity Testing Overdue','Failed Tree Valves','Failed SCSSV','Failure of More Than One SCE']} onChange={value => update('valveIntegrityTestingStatus', value)}/>
      <StatusSelect label='Well barrier classification' value={values.barrierClassification} options={['Healthy','Degraded','1B Contained','Critical']} onChange={value => update('barrierClassification', value)}/>
      <StatusSelect label='Mitigation status' value={values.mitigationStatus} options={['None Required','Planning Stages','Implementation in 0 to 3 Months','Mitigation Implemented / Monitoring','Deferred']} onChange={value => update('mitigationStatus', value)}/>
      <Field label='Recommended actions'><textarea value={recommendedActions} onChange={event => setRecommendedActions(event.target.value)} placeholder='Describe any recommended follow-up actions (optional)' /></Field>
      <div className='status-production-impact'><div><span>Production impact</span><strong>Active loss · updated 13 Oct 2026</strong><small>750 bbl/day oil · 120 bbl/day condensate · 1,300,000 Scf/day gas</small></div></div>
    </div>
    {!date && <p className='field-error'>Date recorded is required.</p>}
    <footer className='modal-actions status-modal-actions'><Button variant='secondary' onClick={onClose}>Cancel</Button><Button variant='secondary' disabled={!date} onClick={() => save(false)}>Save</Button><Button disabled={!date} onClick={() => save(true)}><Save size={16}/>Save status & update production</Button></footer>
  </Modal>;
}

function StatusSelect({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return <Field label={label}><select value={value} onChange={event => onChange(event.target.value)}>{options.map(option => <option key={option}>{option}</option>)}</select></Field>;
}
