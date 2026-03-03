import { NavLink, useLocation } from 'react-router-dom';
import { useI18n } from '../i18n/index';
import { useAuth } from '../hooks/useAuth';
import ZophielLogo from './ZophielLogo';

const NAV_ITEMS = [
  { to: '/app', key: 'nav_home' as const, icon: 'home', label: 'Inicio' },
  { to: '/app/pain/new', key: 'nav_pain' as const, icon: 'ecg_heart', label: 'Dolor' },
  { to: '/app/questions', key: 'nav_questions' as const, icon: 'help', label: 'Preguntas', badge: true },
  { to: '/app/qol', key: 'nav_quality' as const, icon: 'volunteer_activism', label: 'Calidad' },
  { to: '/app/pain/history', key: 'nav_history' as const, icon: 'history', label: 'Historial' },
];

/** Desktop sidebar — Stitch PRO dashboard-desktop.html exact classes */
export function Sidebar() {
  const location = useLocation();
  const { t } = useI18n();
  const { user } = useAuth();

  return (
    <aside className="hidden lg:flex w-[280px] h-screen flex-col justify-between bg-surface-dark border-r border-white/5 fixed left-0 top-0 z-50 transition-transform">
      <div className="p-6 flex flex-col gap-8">
        {/* Logo Area (exact Stitch) */}
        <div className="flex items-center gap-3">
          <ZophielLogo size={44} variant="icon" className="rounded-xl shadow-lg shadow-purple-900/20" />
          <div className="flex flex-col">
            <h1 className="text-white text-xl font-bold tracking-tight">Zophiel</h1>
            <p className="text-slate-400 text-xs font-medium">Pain Management</p>
          </div>
        </div>

        {/* Navigation (exact Stitch classes) */}
        <nav className="flex flex-col gap-2">
          {NAV_ITEMS.map((item) => {
            const isActive = item.to === '/app'
              ? location.pathname === '/app'
              : location.pathname.startsWith(item.to);

            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={`flex items-center ${item.badge ? 'justify-between' : 'gap-4'} px-4 py-3.5 rounded-xl transition-all no-underline ${
                  isActive
                    ? 'bg-primary shadow-lg shadow-primary/25 group'
                    : 'text-slate-400 hover:text-white hover:bg-white/5 group'
                }`}
              >
                <div className={`flex items-center gap-4 ${item.badge ? '' : ''}`}>
                  <span className={`material-symbols-outlined group-hover:scale-110 transition-transform ${isActive ? 'text-white' : ''}`}>
                    {item.icon}
                  </span>
                  <span className={`${isActive ? 'text-white font-semibold' : 'font-medium'}`}>
                    {t(item.key)}
                  </span>
                </div>
                {item.badge && (
                  <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg shadow-red-500/30">3</span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom Actions (exact Stitch) */}
      <div className="p-6">
        <NavLink
          to="/app/settings"
          className={({ isActive }) => `flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all group mb-4 no-underline ${
            isActive ? 'bg-primary/15 text-primary' : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <span className="material-symbols-outlined group-hover:rotate-45 transition-transform">settings</span>
          <span className="font-medium">{t('nav_settings')}</span>
        </NavLink>

        {/* User card (exact Stitch glass-panel) */}
        <div className="glass-card rounded-xl p-4 flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[20px]">person</span>
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-surface-dark" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-white">{user?.name || 'Usuario'}</span>
            <span className="text-xs text-slate-400">Plan Activo</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

/** Mobile bottom nav — Stitch PRO dashboard.html exact classes */
export default function Navbar() {
  const location = useLocation();
  const { t } = useI18n();

  const mobileItems = [
    { to: '/app', key: 'nav_home' as const, icon: 'home' },
    { to: '/app/pain/new', key: 'nav_pain' as const, icon: 'favorite' },
    { to: '/app/questions', key: 'nav_questions' as const, icon: 'help' },
    { to: '/app/qol', key: 'nav_quality' as const, icon: 'monitoring' },
    { to: '/app/settings', key: 'nav_settings' as const, icon: 'settings' },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 glass-card border-t border-white/5 pb-5 pt-2 px-2">
      <div className="flex justify-around items-center">
        {mobileItems.map((item) => {
          const isActive = item.to === '/app'
            ? location.pathname === '/app'
            : location.pathname.startsWith(item.to);

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={`flex flex-col items-center gap-1 p-2 min-w-[64px] group no-underline ${
                isActive ? 'text-primary' : 'text-slate-500'
              }`}
            >
              <span className={`material-symbols-outlined text-[24px] ${isActive ? 'group-hover:scale-110' : 'group-hover:text-slate-300'} transition-all`}>
                {item.icon}
              </span>
              <span className={`text-[10px] font-medium ${isActive ? 'text-primary' : 'text-slate-500 group-hover:text-slate-300'}`}>
                {t(item.key)}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
