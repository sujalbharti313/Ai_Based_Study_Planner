import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Zap, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';

export default function Login() {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const from      = location.state?.from?.pathname || '/';

  const [form,    setForm]    = useState({ email: '', password: '' });
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const [showPw,  setShowPw]  = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'var(--t-bg)' }}
    >
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center gap-3 justify-center mb-8">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, var(--t-primary), var(--t-secondary))' }}
          >
            <Zap size={20} style={{ color: 'var(--t-bg)' }} />
          </div>
          <span className="gradient-text font-bold text-xl tracking-tight">Midnight AI</span>
        </div>

        <div className="glass-card rounded-2xl p-8">
          <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--t-text)' }}>Welcome back</h1>
          <p className="text-sm mb-6" style={{ color: 'var(--t-text-muted)' }}>
            Sign in to your study planner
          </p>

          {error && (
            <div
              className="p-3 rounded-xl text-sm mb-4"
              style={{ background: 'var(--t-error-soft)', color: 'var(--t-error)' }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-widest" style={{ color: 'var(--t-primary)' }}>
                Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={e => set('email', e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full recessed rounded-xl px-4 py-3 text-sm border focus:outline-none theme-transition"
                style={{ color: 'var(--t-text)', borderColor: 'var(--t-border)' }}
                onFocus={e => e.target.style.borderColor = 'var(--t-border-focus)'}
                onBlur={e => e.target.style.borderColor = 'var(--t-border)'}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-widest" style={{ color: 'var(--t-primary)' }}>
                Password
              </label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => set('password', e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full recessed rounded-xl px-4 py-3 pr-11 text-sm border focus:outline-none theme-transition"
                  style={{ color: 'var(--t-text)', borderColor: 'var(--t-border)' }}
                  onFocus={e => e.target.style.borderColor = 'var(--t-border-focus)'}
                  onBlur={e => e.target.style.borderColor = 'var(--t-border)'}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: 'var(--t-text-muted)' }}
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <div className="flex justify-end">
                <Link to="/forgot-password" className="text-xs" style={{ color: 'var(--t-primary)' }}>
                  Forgot password?
                </Link>
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full justify-center mt-2" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign In'}
            </Button>
          </form>

          {/* Demo hint */}
          <div
            className="mt-4 p-3 rounded-xl text-xs text-center"
            style={{ background: 'var(--t-primary-soft)', color: 'var(--t-text-muted)' }}
          >
            Demo: <span style={{ color: 'var(--t-primary)' }}>demo@midnight-ai.app</span> / <span style={{ color: 'var(--t-primary)' }}>Demo1234!</span>
          </div>

          <p className="text-center text-sm mt-6" style={{ color: 'var(--t-text-muted)' }}>
            No account?{' '}
            <Link to="/register" className="font-bold" style={{ color: 'var(--t-primary)' }}>
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
