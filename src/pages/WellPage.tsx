import { AppShell } from '../components/AppShell';
import { IndividualWellPage } from '../components/wells/individual-well/IndividualWellPage';
import { ProductionAnalyticsPage } from '../components/wells/production/ProductionAnalyticsPage';
import { useLocation } from 'react-router-dom';
import type { ProductionInterval, ProductionRates, ProductionReading } from '../types';
import type { MonitoringEntry } from '../components/wells/well-data';

export function WellPage({ rates, readings, intervals, statusEntries }: { rates: ProductionRates; readings: ProductionReading[]; intervals: ProductionInterval[]; statusEntries: MonitoringEntry[] }) {
  const location = useLocation();
  const isProduction = location.pathname.startsWith('/wells/f-120/production');
  return <AppShell><div className='mx-auto max-w-[1180px]'>{isProduction ? <ProductionAnalyticsPage rates={rates} readings={readings} intervals={intervals} latestStatus={statusEntries[0]}/> : <IndividualWellPage rates={rates} intervals={intervals} statusEntries={statusEntries}/>}</div></AppShell>;
}
