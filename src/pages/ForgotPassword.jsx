import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Zap, ArrowLeft } from 'lucide-react';
import { authApi } from '../lib/api';
import Button from '../components/ui/Button';

export default function ForgotPassword() {
  const [email,   setEmail]   = useState('');
  const [sent,    setSent]    = useState(false);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await authApi.forgotPassword(email);
      setSent(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--t-bg)' }}>
      <div className="w-full max-w-md">
        <div className="flex items-center gap-3 justify-center mb-8">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, var(--t-primary), var(--t-secondary))' }}>
            <Zap size={20} style={{ color: 'var(--t-bg)' }} />
          </div>
          <span className="gradient-text font-bold text-xl tracking-tight">Midnight AI</span>
        </div>

        <div className="glass-card rounded-2xl p-8">
          <Link to="/login" className="inline-flex items-center gap-2 text-sm mb-6 theme-transition"
            style={{ color: 'var(--t-text-muted)' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--t-primary)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--t-text-muted)'}>
            <ArrowLeft size={15} /> Back to login
          </Link>

          <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--t-text)' }}>Reset password</h1>
          <p className="text-sm mb-6" style={{ color: 'var(--t-text-muted)' }}>
            Enter your email and we'll send you a reset link.
          </p>

          {sent ? (
            <div className="p-4 rounded-xl text-sm text-center"
              style={{ background: 'var(--t-success-soft)', color: 'var(--t-success)' }}>
              ✓ If that email exists, a reset link has been sent. Check your inbox.
            </div>
          ) : (
            <>
              {error && (
                <div className="p-3 rounded-xl text-sm mb-4" style={{ background: 'var(--t-error-soft)', color: 'var(--t-error)' }}>
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-widest" style={{ color: 'var(--t-primary)' }}>Email</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com" required
                    className="w-full recessed rounded-xl px-4 py-3 text-sm border focus:outline-none theme-transition"
                    style={{ color: 'var(--t-text)', borderColor: 'var(--t-border)' }}
                    onFocus={e => e.target.style.borderColor = 'var(--t-border-focus)'}
                    onBlur={e => e.target.style.borderColor = 'var(--t-border)'} />
                </div>
                <Button type="submit" size="lg" className="w-full justify-center" disabled={loading}>
                  {loading ? 'Sending…' : 'Send Reset Link'}
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
