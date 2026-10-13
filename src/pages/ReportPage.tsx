import { Check, Info, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '../components/AppShell';
import { Badge, Button, Field } from '../components/ui';

export function ReportPage({ onToast }: { onToast: (message: string) => void }) {
  const navigate = useNavigate();
  const steps = ['Incident details','Production impact','Failure analysis','Solutions','Planning','Costs & contingency'];
  return <AppShell><div className='report-shell'><nav className='report-steps'><p>Report sections</p>{steps.map((step,index) => <button key={step} className={index===1?'active':index===0?'complete':''} onClick={() => index === 5 && navigate('/reports/new/costs')}><span>{index===0?<Check size={14}/>:index+1}</span>{step}</button>)}</nav><section className='report-content'>
    <header className='report-heading'><div><button className='back-button' onClick={() => navigate('/wells/f-120')}>← Back to F-120</button><h1>Production impact</h1><p>Link this mitigation plan to the well’s production-loss record and define the recovery target.</p></div><span className='plan-badge'>F-120 · Draft</span></header>
    <fieldset className='choices'><legend>Does this issue affect production?</legend><label className='selected'><input type='radio' name='impact' defaultChecked /> Yes, production is affected</label><label><input type='radio' name='impact' /> No production impact</label></fieldset>
    <section className='linked-event'><header className='card-header compact'><div><h2>Linked production-loss event</h2><p>Current well record · latest update 12 Oct 2026</p></div><Badge tone='green'>Linked</Badge></header><div className='event-stats'><Impact label='Loss started' value='1 Oct 2026'/><Impact label='Operating phase' value='Reduced production'/><Impact label='Oil loss rate' value='750 bbl/day'/><Impact label='Gas loss rate' value='1,300 Mscf/day'/></div><div className='inline-note'><RefreshCw size={13}/> Production updates made elsewhere update this same record.</div></section>
    <h2>Recovery target</h2><div className='form-grid three'><Field label='Target oil production'><div className='unit-input'><input defaultValue='2,400'/><span>bbl/day</span></div></Field><Field label='Target gas production'><div className='unit-input'><input defaultValue='8,200'/><span>Mscf/day</span></div></Field><Field label='Expected assessment date'><input type='date' defaultValue='2026-10-30'/></Field></div>
    <div className='info-callout'><Info size={15}/> Completing this mitigation will not close the loss event. Recovery tracking continues until the production event is closed.</div>
    <footer className='report-footer'><Button variant='secondary' onClick={() => navigate('/wells/f-120')}>Back</Button><Button onClick={() => onToast('Production impact linked to the mitigation report.')}>Save & continue</Button></footer>
  </section></div></AppShell>;
}
function Impact({label,value}:{label:string;value:string}){return <div><span>{label}</span><strong>{value}</strong></div>}
