import { NavLink } from 'react-router-dom';

export function WellWorkspaceTabs() {
  return (
    <nav className='well-workspace-tabs' aria-label='Well workspace'>
      <NavLink end to='/wells/f-120'>Overview</NavLink>
      <NavLink to='/wells/f-120/production'>Production</NavLink>
    </nav>
  );
}
