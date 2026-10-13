import { useState } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { AddWellDialog } from './components/AddWellDialog';
import { EditWellDialog } from './components/EditWellDialog';
import { HistoryDialog } from './components/HistoryDialog';
import { ProductionDialog } from './components/ProductionDialog';
import { StatusDialog } from './components/StatusDialog';
import { well } from './data/mock-data';
import { PortfolioPage } from './pages/PortfolioPage';
import { CostsPage } from './pages/CostsPage';
import { ReportPage } from './pages/ReportPage';
import { WellPage } from './pages/WellPage';
import type { ProductionRates, ProductionStream } from './types';

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [rates, setRates] = useState<ProductionRates>(well.production);
  const [baselineStreams, setBaselineStreams] = useState<ProductionStream[]>(['oil','gas']);
  const [toast, setToast] = useState('');
  const notify = (message: string) => { setToast(message); window.setTimeout(() => setToast(''), 2200); };
  const close = () => navigate(location.pathname === '/wells/new' ? '/wells' : '/wells/f-120');
  return <>
    <Routes>
      <Route path='/' element={<Navigate to='/wells/f-120' replace />} />
      <Route path='/wells' element={<PortfolioPage />} />
      <Route path='/wells/new' element={<PortfolioPage />} />
      <Route path='/wells/*' element={<WellPage rates={rates} />} />
      <Route path='/reports/new/production-impact' element={<ReportPage onToast={notify} />} />
      <Route path='/reports/new/costs' element={<CostsPage />} />
      <Route path='*' element={<Navigate to='/wells/f-120' replace />} />
    </Routes>
    {location.pathname === '/wells/new' && <AddWellDialog onClose={close} onBaseline={streams => { setBaselineStreams(streams); navigate('/wells/f-120/production/baseline'); }} onStatus={() => navigate('/wells/f-120/status')} />}
    {location.pathname === '/wells/f-120/edit' && <EditWellDialog onClose={close} onSave={() => { notify('Well information updated in this prototype.'); close(); }} />}
    {location.pathname === '/wells/f-120/status' && <StatusDialog onClose={close} onSave={() => { notify('Well status saved in this prototype.'); close(); }} />}
    {location.pathname === '/wells/f-120/production' && <HistoryDialog onClose={close} />}
    {location.pathname === '/wells/f-120/production/update' && <ProductionDialog mode='update' streams={well.streams} initialRates={rates} onClose={close} onSave={next => { setRates(next); notify('Production update saved in this prototype.'); close(); }} />}
    {location.pathname === '/wells/f-120/production/baseline' && <ProductionDialog mode='baseline' streams={baselineStreams} initialRates={rates} onClose={close} onSave={next => { setRates(next); notify('Production baseline saved in this prototype.'); close(); }} />}
    {toast && <div className='toast'>{toast}</div>}
  </>;
}
