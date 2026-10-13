import type { ProductionRates } from '../../../types';
import { ActiveMitigationCard } from './ActiveMitigationCard';
import { BarrierClassificationHistory } from './BarrierClassificationHistory';
import { LastEntrySummary } from './LastEntrySummary';
import { ProductionPerformanceCard } from './ProductionPerformanceCard';
import { WellHeader } from './WellHeader';
import { WellProfileCard } from './WellProfileCard';
import { WellSchematicSection } from './WellSchematicSection';
import { WellTimeline } from './WellTimeline';
import { monitoringEntries } from '../well-data';

export function IndividualWellPage({ rates }: { rates: ProductionRates }) {
  const latestEntry=monitoringEntries[0];
  return <div className='space-y-4'>
    <WellHeader latestEntry={latestEntry}/>
    <WellProfileCard/>
    <ProductionPerformanceCard rates={rates}/>
    <ActiveMitigationCard/>
    <div className='grid gap-4 xl:grid-cols-2'><section><LastEntrySummary entries={monitoringEntries}/></section><section><BarrierClassificationHistory entries={monitoringEntries}/></section><section><WellTimeline entries={monitoringEntries}/></section><aside><WellSchematicSection/></aside></div>
  </div>;
}
