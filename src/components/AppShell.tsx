import { BarChart3, FileText, Gauge, Moon, Settings, Sun, Waves } from 'lucide-react';
import type { PropsWithChildren } from 'react';
import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

export function AppShell({ children }: PropsWithChildren) {
  const navigate = useNavigate();
  const [dark, setDark] = useState(false);
  return (
    <div className={dark ? 'app dark' : 'app'}>
      <div className='prototype-banner'>Interactive concept prototype <span>Sample data only</span></div>
      <header className='topbar'>
        <button className='brand' onClick={() => navigate('/wells/f-120')}><span className='brand-mark'>W</span><span>WellSolveAble</span></button>
        <div className='top-actions'><span className='plan-badge'>Basic</span><button className='icon-button' onClick={() => setDark(value => !value)} aria-label='Toggle theme'>{dark ? <Sun size={17} /> : <Moon size={17} />}</button><span className='avatar'>DJ</span></div>
      </header>
      <aside className='sidebar'>
        <NavLink to='/wells' aria-label='Wells'><Waves size={19} /></NavLink>
        <NavLink to='/wells/f-120' aria-label='Well detail'><Gauge size={19} /></NavLink>
        <NavLink to='/reports/new/production-impact' aria-label='Mitigation report'><FileText size={19} /></NavLink>
        <a href='#analytics' aria-label='Analytics'><BarChart3 size={19} /></a>
        <a href='#settings' aria-label='Settings'><Settings size={19} /></a>
      </aside>
      <main>{children}</main>
    </div>
  );
}
