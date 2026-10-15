import { Check, Info, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '../components/AppShell';
import { Badge, Button, Field } from '../components/ui';

export function ReportPage({ onToast }: { onToast: (message: string) => void }) {
  const navigate = useNavigate();
  const [affected, setAffected] = useState(true);
  const steps = ['Incident details','Production impact','Failure analysis','Solutions','Planning','Costs & contingency'];
  return <AppShell><div className='report-shell'><nav className='report-steps'><p>Report sections</p>{steps.map((step,index) => <button key={step} className={index===1?'active':index===0?'complete':''} onClick={() => index === 5 && navigate('/reports/new/costs')}><span>{index===0?<Check size={14}/>:index+1}</span>{step}</button>)}</nav><section className='report-content'>
    <header className='report-heading'><div><button className='back-button' onClick={() => navigate('/wells/f-120')}>← Back to F-120</button><h1>Production Impact</h1><p>Link this mitigation plan to the well’s production-loss record and define recovery targets.</p></div><span className='plan-badge'>F-120 · Draft</span></header>
    <fieldset className='choices'><legend>Does this issue affect production?</legend><label className={affected ? 'selected' : ''}><input type='radio' name='impact' checked={affected} onChange={() => setAffected(true)} /> Yes, production is affected</label><label className={!affected ? 'selected' : ''}><input type='radio' name='impact' checked={!affected} onChange={() => setAffected(false)} /> No production impact</label></fieldset>
    {affected ? <>
      <section className='linked-event'><header className='card-header compact'><div><h2>Linked production-loss event</h2><p>Current well record · latest reading 13 Oct 2026, 16:00</p></div><Badge tone='green'>Linked</Badge></header><div className='event-stats report-event-stats'><Impact label='Loss period' value='1–13 Oct 2026'/><Impact label='Production status' value='Reduced Rates'/><Impact label='Loss context' value='Well integrity'/><Impact label='Gross revenue loss' value='$1,119,700'/></div><div className='inline-note'><RefreshCw size={13}/> Production readings update this linked well record without changing the mitigation report history.</div></section>
      <h2>Actual rates and recovery targets</h2><p className='section-help'>Compare the latest actual rates with the production expected after mitigation.</p>
      <div className='recovery-target-table'><div className='recovery-target-head'><span>Stream</span><span>Latest actual</span><span>Potential before loss</span><span>Recovery target</span></div><RecoveryRow stream='Oil' actual='1,650' potential='2,400' target='2,400' unit='bbl/day'/><RecoveryRow stream='Condensate' actual='180' potential='300' target='300' unit='bbl/day'/><RecoveryRow stream='Natural gas' actual='6,900,000' potential='8,200,000' target='8,200,000' unit='Scf/day'/></div>
      <div className='form-grid two report-assessment-date'><Field label='Expected assessment date'><input type='date' defaultValue='2026-10-30'/></Field><Field label='Linked event or mitigation' hint='Optional if production impact is later changed to None'><select><option>F-120 · Active mitigation</option><option>Loss event only · 1 Oct 2026</option><option>Not linked</option></select></Field></div>
      <h2>Intervention production impact</h2><div className='impact-accounting-grid'><ImpactCard label='Reduced-rate daily revenue loss' value='$55,825 / day' note='Current actual versus potential'/><ImpactCard label='Intervention shut-in loss' value='$187,150 / day' note='All enabled streams at zero'/><ImpactCard label='Recovery daily revenue loss' value='$21,825 / day' note='Recovery-phase averages versus target'/></div>
      <div className='info-callout'><Info size={15}/> Completing this mitigation will not close the loss event. Recovery tracking continues until production reaches its targets and the event is closed.</div>
    </> : <section className='no-impact-panel'><h2>No production impact</h2><p>No loss volumes or revenue impact will be calculated. You may still link this report to the well’s event for operational context.</p><Field label='Optional event link'><select><option>F-120 · Active loss event</option><option>Not linked</option></select></Field></section>}
    <footer className='report-footer'><Button variant='secondary' onClick={() => navigate('/wells/f-120')}>Back</Button><Button onClick={() => onToast('Production impact linked to the mitigation report.')}>Save & continue</Button></footer>
  </section></div></AppShell>;
}
function Impact({label,value}:{label:string;value:string}){return <div><span>{label}</span><strong>{value}</strong></div>}
function RecoveryRow({stream,actual,potential,target,unit}:{stream:string;actual:string;potential:string;target:string;unit:string}){return <div className='recovery-target-row'><strong>{stream}</strong><span>{actual} <small>{unit}</small></span><span>{potential} <small>{unit}</small></span><div className='unit-input'><input defaultValue={target}/><span>{unit}</span></div></div>}
function ImpactCard({label,value,note}:{label:string;value:string;note:string}){return <div className='impact-accounting-card'><span>{label}</span><strong>{value}</strong><small>{note}</small></div>}
