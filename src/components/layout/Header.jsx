import { useState } from 'react';
import { Search, Bell, Menu, X, LogOut } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useAuth } from '../../contexts/AuthContext';
import ThemeToggle from '../ui/ThemeToggle';
import { useNavigate } from 'react-router-dom';

export default function Header({ onMenuToggle, menuOpen }) {
  const [query, setQuery] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2) ?? 'U';

  return (
    <header
      className="t-header fixed top-0 right-0 left-0 md:left-64 h-16 z-20 flex items-center justify-between px-4 md:px-8"
      role="banner"
    >
      {/* Left */}
      <div className="flex items-center gap-3">
        {/* Hamburger — mobile only */}
        <button
          className="md:hidden p-2 rounded-xl theme-transition hover:bg-[var(--t-nav-hover-bg)]"
          style={{ color: 'var(--t-text-muted)' }}
          onClick={onMenuToggle}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Search */}
        <div
          className="hidden sm:flex items-center gap-2 recessed rounded-xl px-3 py-2 w-56 lg:w-72 theme-transition"
          style={{
            border: '1px solid var(--t-border)',
          }}
          onFocus={e => e.currentTarget.style.borderColor = 'var(--t-border-focus)'}
          onBlur={e => e.currentTarget.style.borderColor = 'var(--t-border)'}
        >
          <Search size={15} style={{ color: 'var(--t-text-muted)', flexShrink: 0 }} />
          <input
            type="search"
            placeholder="Search subjects…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="bg-transparent border-none outline-none text-sm w-full"
            style={{ color: 'var(--t-text)' }}
            aria-label="Search subjects"
          />
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        {/* Theme toggle */}
        <ThemeToggle />

        {/* Notifications */}
        <button
          className="relative p-2.5 rounded-xl theme-transition"
          style={{ color: 'var(--t-text-muted)' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--t-nav-hover-bg)'; e.currentTarget.style.color = 'var(--t-text)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--t-text-muted)'; }}
          aria-label="Notifications"
        >
          <Bell size={18} />
          <span
            className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full"
            style={{ background: 'var(--t-primary)' }}
            aria-hidden="true"
          />
        </button>

        {/* Avatar + dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(v => !v)}
            className="w-8 h-8 rounded-full p-0.5 focus-visible:ring-2 focus-visible:outline-none"
            style={{ background: 'linear-gradient(135deg, var(--t-primary), var(--t-secondary))' }}
            aria-label="User menu"
          >
            <div className="w-full h-full rounded-full flex items-center justify-center text-[11px] font-bold theme-transition"
              style={{ background: 'var(--t-surface-mid)', color: 'var(--t-primary)' }}>
              {initials}
            </div>
          </button>

          {showMenu && (
            <div className="absolute right-0 top-10 w-48 rounded-xl shadow-xl z-50 overflow-hidden"
              style={{ background: 'var(--t-surface-mid)', border: '1px solid var(--t-border)' }}>
              <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--t-border)' }}>
                <p className="text-sm font-bold truncate" style={{ color: 'var(--t-text)' }}>{user?.name}</p>
                <p className="text-xs truncate" style={{ color: 'var(--t-text-muted)' }}>{user?.email}</p>
              </div>
              <button onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-3 text-sm theme-transition"
                style={{ color: 'var(--t-error)' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--t-error-soft)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <LogOut size={15} /> Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
