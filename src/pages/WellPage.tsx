import { AppShell } from '../components/AppShell';
import { IndividualWellPage } from '../components/wells/individual-well/IndividualWellPage';
import type { ProductionRates } from '../types';

export function WellPage({ rates }: { rates: ProductionRates }) {
  return <AppShell><div className='mx-auto max-w-[1180px]'><IndividualWellPage rates={rates}/></div></AppShell>;
}
