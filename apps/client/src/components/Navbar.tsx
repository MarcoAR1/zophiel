import { NavLink, useLocation } from 'react-router-dom';
import { useI18n } from '../i18n/index';
import ZophielLogo from './ZophielLogo';

const NAV_ITEMS = [
  { to: '/app', key: 'nav_home' as const, icon: 'home' },
  { to: '/app/pain/new', key: 'nav_pain' as const, icon: 'favorite' },
  { to: '/app/questions', key: 'nav_questions' as const, icon: 'help' },
  { to: '/app/qol', key: 'nav_quality' as const, icon: 'monitoring' },
  { to: '/app/settings', key: 'nav_settings' as const, icon: 'settings' },
];

/** Desktop sidebar — Stitch Tailwind */
export function Sidebar() {
  const location = useLocation();
  const { t } = useI18n();

  return (
    <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-56 flex-col glass-card border-r border-white/10 rounded-none z-40">
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=swap" rel="stylesheet" />

      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-white/5">
        <ZophielLogo size={22} />
        <span className="text-white font-bold text-lg tracking-tight">Zophiel</span>
      </div>

      <nav className="flex-1 flex flex-col gap-1 p-3 mt-1">
        {NAV_ITEMS.map((item) => {
          const isActive = item.to === '/app'
            ? location.pathname === '/app'
            : location.pathname.startsWith(item.to);

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 no-underline ${
                isActive
                  ? 'bg-primary/15 text-primary font-semibold'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <span className={`material-symbols-outlined text-[20px] ${isActive ? 'text-primary' : ''}`}>
                {item.icon}
              </span>
              <span className="text-sm">{t(item.key)}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}

/** Mobile bottom nav — Stitch Tailwind */
export default function Navbar() {
  const location = useLocation();
  const { t } = useI18n();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass-card border-t border-white/10 rounded-none safe-bottom">
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=swap" rel="stylesheet" />

      <div className="grid grid-cols-5 px-2 py-1.5">
        {NAV_ITEMS.map((item) => {
          const isActive = item.to === '/app'
            ? location.pathname === '/app'
            : location.pathname.startsWith(item.to);

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={`flex flex-col items-center gap-0.5 py-1.5 rounded-lg transition-colors no-underline ${
                isActive ? 'text-primary' : 'text-slate-500'
              }`}
            >
              <span className="material-symbols-outlined text-[22px]">{item.icon}</span>
              <span className="text-[10px] font-medium leading-none">{t(item.key)}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
