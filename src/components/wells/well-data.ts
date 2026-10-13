export const BARRIER_CLASSIFICATIONS = [
  { key: 'critical', label: 'Critical', color: '#dc2626', textColor: '#7f1d1d', bg: '#fee2e2' },
  { key: 'contained', label: '1B Contained', color: '#f97316', textColor: '#9a3412', bg: '#ffedd5' },
  { key: 'degraded', label: 'Degraded', color: '#eab308', textColor: '#713f12', bg: '#fef9c3' },
  { key: 'healthy', label: 'Healthy', color: '#22c55e', textColor: '#166534', bg: '#dcfce7' },
] as const;

export type ObservationField = 'visualLeaks' | 'annulusStatus' | 'corrosion' | 'missingDamagedComponents' | 'valveIntegrityTestingStatus';

export interface PortfolioWell {
  id: string;
  name: string;
  fieldName: string;
  barrierClassification: string | null;
  visualLeaks: string | null;
  annulusStatus: string | null;
  corrosion: string | null;
  missingDamagedComponents: string | null;
  valveIntegrityTestingStatus: string | null;
  mitigationStatus: string | null;
  loggedBy: string | null;
  recordedAt: string | null;
  nextUpdateDue: string | null;
}

export interface MonitoringEntry {
  id: string;
  recordedAt: string;
  createdAt: string;
  authorName: string;
  visualLeaks: string;
  annulusStatus: string;
  corrosion: string;
  missingDamagedComponents: string;
  valveIntegrityTestingStatus: string;
  barrierClassification: string;
  mitigationStatus: string;
  recommendedActions: string | null;
}

export const portfolioWells: PortfolioWell[] = [
  { id: 'f-120', name: 'F-120', fieldName: 'Fish', barrierClassification: 'Degraded', visualLeaks: 'Tree System', annulusStatus: 'A-Annulus Above MAWOP', corrosion: 'Mild', missingDamagedComponents: 'None Observed', valveIntegrityTestingStatus: 'Failed Tree Valves', mitigationStatus: 'Implementation in 0 to 3 Months', loggedBy: 'Devin James', recordedAt: '2026-10-12', nextUpdateDue: '2026-11-05' },
  { id: 'f-114', name: 'F-114', fieldName: 'Fish', barrierClassification: 'Healthy', visualLeaks: 'None Observed', annulusStatus: 'All Annuli Normal', corrosion: 'None', missingDamagedComponents: 'None Observed', valveIntegrityTestingStatus: 'All SCE (Safety Critical Element) Tested on Time / Okay', mitigationStatus: 'None Required', loggedBy: 'Devin James', recordedAt: '2026-10-08', nextUpdateDue: '2026-11-08' },
  { id: 'k-207', name: 'K-207', fieldName: 'King', barrierClassification: 'Critical', visualLeaks: 'Wellhead System', annulusStatus: 'Multiple Annuli Above MAWOP', corrosion: 'Severe', missingDamagedComponents: 'Wellhead System', valveIntegrityTestingStatus: 'Failure of More Than One SCE', mitigationStatus: 'Planning Stages', loggedBy: 'Maya Singh', recordedAt: '2026-09-01', nextUpdateDue: '2026-10-01' },
  { id: 'k-211', name: 'K-211', fieldName: 'King', barrierClassification: '1B Contained', visualLeaks: 'None Observed', annulusStatus: 'SCP Within MAWOP A-Annulus', corrosion: 'Medium', missingDamagedComponents: 'None Observed', valveIntegrityTestingStatus: 'Failed SCSSV', mitigationStatus: 'Mitigation Implemented / Monitoring', loggedBy: 'Maya Singh', recordedAt: '2026-10-02', nextUpdateDue: '2026-10-28' },
  { id: 'p-042', name: 'P-042', fieldName: 'Pigeon', barrierClassification: 'Degraded', visualLeaks: 'None Observed', annulusStatus: 'B-Annulus Above MAWOP', corrosion: 'Mild', missingDamagedComponents: 'Flow Tee Assembly', valveIntegrityTestingStatus: 'Integrity Testing Overdue', mitigationStatus: 'Deferred', loggedBy: 'Andre Lewis', recordedAt: null, nextUpdateDue: '2026-09-30' },
];

export const monitoringEntries: MonitoringEntry[] = [
  { id: 'entry-1', recordedAt: '2026-10-12', createdAt: '2026-10-12T14:20:00Z', authorName: 'Devin James', visualLeaks: 'Tree System', annulusStatus: 'A-Annulus Above MAWOP', corrosion: 'Mild', missingDamagedComponents: 'None Observed', valveIntegrityTestingStatus: 'Failed Tree Valves', barrierClassification: 'Degraded', mitigationStatus: 'Implementation in 0 to 3 Months', recommendedActions: 'Repair wellhead valve and verify barrier integrity.' },
  { id: 'entry-2', recordedAt: '2026-09-11', createdAt: '2026-09-11T13:10:00Z', authorName: 'Devin James', visualLeaks: 'None Observed', annulusStatus: 'A-Annulus Above MAWOP', corrosion: 'Mild', missingDamagedComponents: 'None Observed', valveIntegrityTestingStatus: 'Failed Tree Valves', barrierClassification: 'Degraded', mitigationStatus: 'Planning Stages', recommendedActions: null },
  { id: 'entry-3', recordedAt: '2026-08-08', createdAt: '2026-08-08T10:00:00Z', authorName: 'Devin James', visualLeaks: 'None Observed', annulusStatus: 'All Annuli Normal', corrosion: 'Mild', missingDamagedComponents: 'None Observed', valveIntegrityTestingStatus: 'All SCE (Safety Critical Element) Tested on Time / Okay', barrierClassification: 'Healthy', mitigationStatus: 'None Required', recommendedActions: null },
  { id: 'entry-4', recordedAt: '2026-07-08', createdAt: '2026-07-08T10:00:00Z', authorName: 'Devin James', visualLeaks: 'None Observed', annulusStatus: 'All Annuli Normal', corrosion: 'None', missingDamagedComponents: 'None Observed', valveIntegrityTestingStatus: 'All SCE (Safety Critical Element) Tested on Time / Okay', barrierClassification: 'Healthy', mitigationStatus: 'None Required', recommendedActions: null },
];

export const activeMitigation = {
  id: 'mitigation-1', dateOfFailure: '2026-10-01', failureIdentified: 'Wellhead valve integrity restriction affecting oil and gas production.', remedialAction: 'Implementation in 0 to 3 Months', reportId: 'report-1',
  notes: [{ id: 'note-1', content: 'Replacement valve and intervention services requested.', noteDate: '2026-10-10', mitigationStatus: 'Implementation in 0 to 3 Months', authorName: 'Devin James' }],
};

export function formatWellDate(value: string | null) {
  if (!value) return '—';
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${value.slice(0, 10)}T00:00:00Z`));
}

export function getBarrierClassification(label: string | null) {
  return BARRIER_CLASSIFICATIONS.find(item => item.label === label);
}

export function observationTone(field: ObservationField, value: string) {
  if (value === 'None Observed' || value === 'All Annuli Normal' || value === 'None' || value.startsWith('All SCE')) return '#22c55e';
  if (value.includes('Multiple') || value.includes('Failure of More') || value === 'Severe') return '#dc2626';
  return field === 'valveIntegrityTestingStatus' && value.includes('Failed') ? '#f97316' : '#eab308';
}
