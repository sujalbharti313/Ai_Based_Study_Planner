import { NavLink } from 'react-router-dom';
import { LayoutDashboard, CalendarDays, BookOpen, BarChart3, Brain, Settings, Zap, HardDrive } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useAuth } from '../../contexts/AuthContext';

const NAV = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/' },
  { label: 'Timetable',  icon: CalendarDays,   path: '/timetable' },
  { label: 'Subjects',   icon: BookOpen,       path: '/subjects' },
  { label: 'Progress',   icon: BarChart3,      path: '/progress' },
  { label: 'AI Lab',     icon: Brain,          path: '/ai-lab' },
  { label: 'Settings',   icon: Settings,       path: '/settings' },
];

const storagePercent = 72; // default until API data loads

export default function Sidebar({ open, onClose }) {
  const { user } = useAuth();
  const storageUsed  = user?.storageUsedMb  ?? 0;
  const storageLimit = user?.storageLimitMb ?? 10240;
  const pct = Math.round((storageUsed / storageLimit) * 100);
  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-30 md:hidden t-overlay"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          't-sidebar fixed left-0 top-0 h-screen w-64 z-40 flex flex-col',
          'transition-transform duration-300',
          open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
        aria-label="Main navigation"
      >
        {/* Brand */}
        <div
          className="flex items-center gap-3 px-6 h-16 shrink-0"
          style={{ borderBottom: '1px solid var(--t-border)' }}
        >
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, var(--t-primary), var(--t-secondary))' }}
          >
            <Zap size={14} style={{ color: 'var(--t-bg)' }} />
          </div>
          <span className="gradient-text font-bold text-base tracking-tight">Midnight AI</span>
        </div>

        {/* User card */}
        <div className="px-4 pt-5 pb-3 shrink-0">
          <div
            className="flex items-center gap-3 p-3 rounded-xl theme-transition"
            style={{
              background: 'var(--t-nav-hover-bg)',
              border: '1px solid var(--t-border)',
            }}
          >
            <div
              className="w-9 h-9 rounded-full p-0.5 shrink-0"
              style={{ background: 'linear-gradient(135deg, var(--t-primary), var(--t-secondary))' }}
            >
              <div
                className="w-full h-full rounded-full flex items-center justify-center text-xs font-bold theme-transition"
                style={{ background: 'var(--t-surface-mid)', color: 'var(--t-primary)' }}
              >
                {user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2) ?? 'U'}
              </div>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold truncate" style={{ color: 'var(--t-text)' }}>
                {user?.name ?? 'User'}
              </p>
              <p className="text-[10px] uppercase tracking-widest" style={{ color: 'var(--t-text-muted)' }}>
                {user?.role === 'ADMIN' ? 'Admin' : 'Pro Member'}
              </p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-2 overflow-y-auto space-y-0.5" aria-label="Pages">
          {NAV.map(({ label, icon: Icon, path }) => (
            <NavLink
              key={path}
              to={path}
              end={path === '/'}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
                  isActive ? 'nav-item-active pl-[calc(0.75rem-3px)]' : 'nav-item'
                )
              }
            >
              <Icon size={18} strokeWidth={1.8} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Storage widget */}
        <div className="px-4 pb-6 shrink-0">
          <div
            className="p-4 rounded-2xl theme-transition"
            style={{
              background: 'linear-gradient(135deg, var(--t-primary-soft), var(--t-secondary-soft))',
              border: '1px solid var(--t-border)',
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <HardDrive size={14} style={{ color: 'var(--t-primary)' }} />
              <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--t-text-muted)' }}>
                Storage
              </p>
            </div>
            <div
              className="w-full h-1.5 rounded-full overflow-hidden mb-2"
              style={{ background: 'var(--t-border-strong)' }}
            >
              <div
                className="h-full rounded-full"
                style={{
                  width: `${pct}%`,
                  background: 'linear-gradient(90deg, var(--t-primary), var(--t-secondary))',
                }}
              />
            </div>
            <p className="text-xs mb-3" style={{ color: 'var(--t-text-muted)' }}>
              {(storageUsed / 1024).toFixed(1)}GB of {(storageLimit / 1024).toFixed(0)}GB used
            </p>
            <button
              className="w-full py-1.5 rounded-lg text-xs font-bold theme-transition"
              style={{
                background: 'var(--t-border-strong)',
                color: 'var(--t-text)',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--t-primary-soft)'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--t-border-strong)'}
            >
              Upgrade Plan
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
