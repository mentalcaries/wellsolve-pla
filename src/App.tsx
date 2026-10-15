import { useState } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { AddWellDialog } from './components/AddWellDialog';
import { EditWellDialog } from './components/EditWellDialog';
import { ProductionDialog } from './components/ProductionDialog';
import { ImportProductionDialog } from './components/wells/production/ImportProductionDialog';
import { StatusDialog } from './components/StatusDialog';
import { monitoringEntries as initialMonitoringEntries } from './components/wells/well-data';
import { productionIntervals, productionReadings, well } from './data/mock-data';
import { PortfolioPage } from './pages/PortfolioPage';
import { CostsPage } from './pages/CostsPage';
import { ReportPage } from './pages/ReportPage';
import { WellPage } from './pages/WellPage';
import type { ProductionInterval, ProductionRates, ProductionReading, ProductionStream, ProductionUpdate } from './types';

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [rates, setRates] = useState<ProductionRates>(well.production);
  const [statusEntries, setStatusEntries] = useState(initialMonitoringEntries);
  const [readings, setReadings] = useState<ProductionReading[]>(productionReadings);
  const [intervals, setIntervals] = useState<ProductionInterval[]>(productionIntervals);
  const [baselineStreams, setBaselineStreams] = useState<ProductionStream[]>(['oil','condensate','gas']);
  const [toast, setToast] = useState('');
  const notify = (message: string) => { setToast(message); window.setTimeout(() => setToast(''), 2200); };
  const saveProduction = (update: ProductionUpdate) => {
    setRates(update.rates);
    const source = 'Manual' as const;
    setIntervals(current => [...current, {
      id: `interval-${Date.now()}`,
      startDate: update.startDate,
      endDate: update.endDate,
      status: update.status,
      oil: update.rates.oilActual,
      condensate: update.rates.condensateActual,
      gas: update.rates.gasActual,
      oilPotential: update.rates.oilPotential,
      condensatePotential: update.rates.condensatePotential,
      gasPotential: update.rates.gasPotential,
      source,
      lossContext: update.lossContext,
    }]);
    setReadings(current => [{
      id: `reading-${Date.now()}`,
      recordedAt: `${update.endDate}T16:00:00`,
      status: update.status,
      oil: update.rates.oilActual,
      condensate: update.rates.condensateActual,
      gas: update.rates.gasActual,
      source,
      author: 'Don Joe',
    }, ...current]);
  };
  const importProduction = (imported: ProductionReading[]) => {
    setReadings(current => [...imported, ...current].sort((a, b) => b.recordedAt.localeCompare(a.recordedAt)));
    const newest = [...imported].sort((a, b) => b.recordedAt.localeCompare(a.recordedAt))[0];
    if (newest) setRates(current => ({ ...current, oilActual: newest.oil, condensateActual: newest.condensate, gasActual: newest.gas }));
    setIntervals(current => {
      let next = [...current];
      for (const reading of [...imported].sort((a, b) => a.recordedAt.localeCompare(b.recordedAt))) {
        const date = reading.recordedAt.slice(0, 10);
        if (next.some(interval => interval.startDate <= date && interval.endDate >= date)) continue;
        const latest = [...next].sort((a, b) => a.endDate.localeCompare(b.endDate)).at(-1);
        if (latest && latest.endDate < date) {
          const dayBefore = new Date(`${date}T12:00:00Z`);
          dayBefore.setUTCDate(dayBefore.getUTCDate() - 1);
          const coverageEnd = dayBefore.toISOString().slice(0, 10);
          if (latest.endDate < coverageEnd) next = next.map(interval => interval.id === latest.id ? { ...interval, endDate: coverageEnd } : interval);
        }
        next.push({ id: `import-interval-${reading.id}`, startDate: date, endDate: date, status: reading.status, oil: reading.oil, condensate: reading.condensate, gas: reading.gas, oilPotential: rates.oilPotential, condensatePotential: rates.condensatePotential, gasPotential: rates.gasPotential, source: 'CSV import' });
      }
      return next;
    });
  };
  const close = () => {
    if (location.pathname === '/wells/new') navigate('/wells');
    else if (location.pathname.startsWith('/wells/f-120/production/')) navigate('/wells/f-120/production');
    else if (location.pathname === '/wells/f-120/status') navigate((location.state as { returnTo?: string } | null)?.returnTo ?? '/wells/f-120');
    else navigate('/wells/f-120');
  };
  return <>
    <Routes>
      <Route path='/' element={<Navigate to='/wells/f-120' replace />} />
      <Route path='/wells' element={<PortfolioPage />} />
      <Route path='/wells/new' element={<PortfolioPage />} />
      <Route path='/wells/*' element={<WellPage rates={rates} readings={readings} intervals={intervals} statusEntries={statusEntries} />} />
      <Route path='/reports/new/production-impact' element={<ReportPage onToast={notify} />} />
      <Route path='/reports/new/costs' element={<CostsPage />} />
      <Route path='*' element={<Navigate to='/wells/f-120' replace />} />
    </Routes>
    {location.pathname === '/wells/new' && <AddWellDialog onClose={close} onBaseline={streams => { setBaselineStreams(streams); navigate('/wells/f-120/production/baseline'); }} onStatus={() => navigate('/wells/f-120/status')} />}
    {location.pathname === '/wells/f-120/edit' && <EditWellDialog onClose={close} onSave={() => { notify('Well information updated in this prototype.'); close(); }} />}
    {location.pathname === '/wells/f-120/status' && <StatusDialog onClose={close} onSave={(entry, updateProduction) => { setStatusEntries(current => [entry, ...current].sort((a, b) => b.recordedAt.localeCompare(a.recordedAt) || b.createdAt.localeCompare(a.createdAt))); notify('Well status saved in this prototype.'); if (updateProduction) navigate('/wells/f-120/production/update', { state: { date: entry.recordedAt } }); else close(); }} />}
    {location.pathname === '/wells/f-120/production/import' && <ImportProductionDialog onClose={close} onImport={imported => { importProduction(imported); notify(`${imported.length} production readings imported.`); close(); }} />}
    {location.pathname === '/wells/f-120/production/update' && <ProductionDialog mode='update' streams={well.streams} initialRates={rates} initialDate={(location.state as { date?: string } | null)?.date} onClose={close} onSave={next => { saveProduction(next); notify('Production update saved in this prototype.'); close(); }} />}
    {location.pathname === '/wells/f-120/production/baseline' && <ProductionDialog mode='baseline' streams={baselineStreams} initialRates={rates} onClose={close} onSave={next => { saveProduction(next); notify('Production baseline saved in this prototype.'); close(); }} />}
    {toast && <div className='toast'>{toast}</div>}
  </>;
}
