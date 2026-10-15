import { useNavigate } from 'react-router-dom';
import { Button, Modal } from './ui';

export function HistoryDialog({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate();
  const items = [['update','Production update','10–13 Oct 2026 · Reduced Rates','Oil 2,400 → 1,650 bbl/day · Condensate 300 → 180 bbl/day · Gas 8,200,000 → 6,900,000 Scf/day'],['shutin','Intervention shut-in','7–9 Oct 2026','Actual production: 0 bbl/day liquids · 0 Scf/day gas'],['baseline','Loss event opened','1 Oct 2026 · Well integrity','Potential baseline recorded for oil, condensate, and natural gas.']];
  return <Modal title='Production history' description='F-120 · Oil, condensate, and natural gas remain separate' onClose={onClose}><div className='timeline'>{items.map(([tone,title,date,detail]) => <article key={title}><span className={`timeline-dot ${tone}`}/><div><strong>{title}</strong><small>{date}</small><p>{detail}</p></div></article>)}</div><footer className='modal-actions'><Button variant='secondary' onClick={onClose}>Close</Button><Button onClick={() => navigate('/wells/f-120/production/update')}>Add production update</Button></footer></Modal>;
}
