import { Check } from 'lucide-react';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '../components/AppShell';
import { EstimatesFormSection } from '../components/estimates/EstimatesFormSection';
import { estimatesDefaultValues, type EstimatesFormValues } from '../components/estimates/estimate-data';
import { Button } from '../components/estimates/ui/button';

export function CostsPage() {
  const navigate=useNavigate();
  const methods=useForm<EstimatesFormValues>({defaultValues:structuredClone(estimatesDefaultValues)});
  const steps=['Incident details','Production impact','Failure analysis','Solutions','Planning','Costs & contingency'];
  return <AppShell><div className='report-shell costs-shell'><nav className='report-steps'><p>Report sections</p>{steps.map((step,index)=><button key={step} className={index===5?'active':'complete'} onClick={()=>index===1&&navigate('/reports/new/production-impact')}><span>{index<5?<Check size={14}/>:index+1}</span>{step}</button>)}</nav><section className='report-content costs-content'><header className='report-heading'><div><button className='back-button' onClick={()=>navigate('/reports/new/production-impact')}>← Back to Production impact</button><h1>Estimated Costs</h1><p>Calculate direct intervention costs, projected production loss, and overall economic impact.</p></div><span className='plan-badge'>F-120 · Draft</span></header><FormProvider {...methods}><form onSubmit={methods.handleSubmit(()=>navigate('/wells/f-120'))}><EstimatesFormSection/><footer className='report-footer'><Button type='button' variant='outline' onClick={()=>navigate('/reports/new/production-impact')}>Back</Button><Button type='submit'>Complete</Button></footer></form></FormProvider></section></div></AppShell>;
}
