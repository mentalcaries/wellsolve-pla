import { Pencil } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../estimates/ui/button';
import { Card, CardContent } from '../ui/card';

export function WellProfileCard() {
  const navigate = useNavigate();
  const values = [['Field','Fish'],['Well Type','Gas Injection'],['Country','Trinidad and Tobago'],['Region/State','North Coast'],['Well Location','Offshore Platform'],['Frequency','Monthly'],['Next due','5 Nov 2026'],['Responsible engineer','Devin James']];
  return <Card className='relative'><Button aria-label='Edit well information' className='absolute right-2 top-2 h-7 w-7 p-0 text-muted-foreground hover:text-foreground' size='icon' variant='ghost' onClick={() => navigate('/wells/f-120/edit')}><Pencil className='h-3.5 w-3.5'/></Button><CardContent className='grid gap-4 p-4 sm:grid-cols-2 xl:grid-cols-6'>{values.map(([label,value]) => <div key={label}><p className='text-xs font-medium uppercase tracking-wide text-muted-foreground'>{label}</p><p className='mt-1 text-sm'>{value}</p></div>)}</CardContent></Card>;
}
