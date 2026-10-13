import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '../components/AppShell';
import { Button } from '../components/estimates/ui/button';
import { WellsPortfolio } from '../components/wells/WellsPortfolio';
import { portfolioWells } from '../components/wells/well-data';

export function PortfolioPage() {
  const navigate = useNavigate();
  return <AppShell><div className='mx-auto max-w-[1180px] space-y-6'>
    <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'><div className='relative'><h1 className='text-2xl font-bold tracking-tight'>Wells Portfolio</h1><p className='text-gray-500'>Barrier integrity status across all monitored wells. Wells: 5 of 25 used</p><div className='absolute -bottom-2 h-1 w-24 rounded-full bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500'/></div><Button onClick={() => navigate('/wells/new')}><Plus className='mr-2 h-4 w-4'/>Add Well</Button></div>
    <WellsPortfolio wells={portfolioWells}/>
  </div></AppShell>;
}
