import type { ProductionInterval, ProductionRates } from '../../../types';
import { ActiveMitigationCard } from './ActiveMitigationCard';
import { BarrierClassificationHistory } from './BarrierClassificationHistory';
import { LastEntrySummary } from './LastEntrySummary';
import { ProductionPerformanceCard } from './ProductionPerformanceCard';
import { WellHeader } from './WellHeader';
import { WellProfileCard } from './WellProfileCard';
import { WellSchematicSection } from './WellSchematicSection';
import { WellTimeline } from './WellTimeline';
import { WellWorkspaceTabs } from './WellWorkspaceTabs';
import { monitoringEntries } from '../well-data';

export function IndividualWellPage({ rates, intervals, statusEntries }: { rates: ProductionRates; intervals: ProductionInterval[]; statusEntries: typeof monitoringEntries }) {
  const latestEntry=statusEntries[0];
  return <div className='space-y-4'>
    <WellHeader latestEntry={latestEntry}/>
    <WellWorkspaceTabs/>
    <WellProfileCard/>
    <ProductionPerformanceCard rates={rates} intervals={intervals}/>
    <ActiveMitigationCard/>
    <div className='grid gap-4 xl:grid-cols-2'><section><LastEntrySummary entries={statusEntries}/></section><section><BarrierClassificationHistory entries={statusEntries}/></section><section><WellTimeline entries={statusEntries}/></section><aside><WellSchematicSection/></aside></div>
  </div>;
}
