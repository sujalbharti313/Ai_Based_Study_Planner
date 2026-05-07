import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Zap, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form,    setForm]    = useState({ name: '', email: '', password: '' });
  const [error,   setError]   = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPw,  setShowPw]  = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      setSuccess('Account created! Check your email to verify, then sign in.');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
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
          <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--t-text)' }}>Create account</h1>
          <p className="text-sm mb-6" style={{ color: 'var(--t-text-muted)' }}>
            Start your AI-powered study journey
          </p>

          {error && (
            <div className="p-3 rounded-xl text-sm mb-4" style={{ background: 'var(--t-error-soft)', color: 'var(--t-error)' }}>
              {error}
            </div>
          )}
          {success && (
            <div className="p-3 rounded-xl text-sm mb-4" style={{ background: 'var(--t-success-soft)', color: 'var(--t-success)' }}>
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { key: 'name',     label: 'Full Name', type: 'text',     placeholder: 'Alex Rivers' },
              { key: 'email',    label: 'Email',     type: 'email',    placeholder: 'you@example.com' },
            ].map(({ key, label, type, placeholder }) => (
              <div key={key} className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-widest" style={{ color: 'var(--t-primary)' }}>
                  {label}
                </label>
                <input
                  type={type}
                  value={form[key]}
                  onChange={e => set(key, e.target.value)}
                  placeholder={placeholder}
                  required
                  className="w-full recessed rounded-xl px-4 py-3 text-sm border focus:outline-none theme-transition"
                  style={{ color: 'var(--t-text)', borderColor: 'var(--t-border)' }}
                  onFocus={e => e.target.style.borderColor = 'var(--t-border-focus)'}
                  onBlur={e => e.target.style.borderColor = 'var(--t-border)'}
                />
              </div>
            ))}

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-widest" style={{ color: 'var(--t-primary)' }}>
                Password
              </label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => set('password', e.target.value)}
                  placeholder="Min 8 chars, 1 uppercase, 1 number"
                  required
                  className="w-full recessed rounded-xl px-4 py-3 pr-11 text-sm border focus:outline-none theme-transition"
                  style={{ color: 'var(--t-text)', borderColor: 'var(--t-border)' }}
                  onFocus={e => e.target.style.borderColor = 'var(--t-border-focus)'}
                  onBlur={e => e.target.style.borderColor = 'var(--t-border)'}
                />
                <button type="button" onClick={() => setShowPw(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--t-text-muted)' }}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full justify-center mt-2" disabled={loading}>
              {loading ? 'Creating account…' : 'Create Account'}
            </Button>
          </form>

          <p className="text-center text-sm mt-6" style={{ color: 'var(--t-text-muted)' }}>
            Already have an account?{' '}
            <Link to="/login" className="font-bold" style={{ color: 'var(--t-primary)' }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
