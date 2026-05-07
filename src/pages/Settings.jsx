import { useState, useEffect } from 'react';
import { User, Bell, Moon, Link2, Save, X, CalendarDays, Cloud, Terminal, Lock, Eye, EyeOff } from 'lucide-react';
import { Card } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Toggle from '../components/ui/Toggle';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import ThemeToggle from '../components/ui/ThemeToggle';
import { userApi } from '../lib/api';

const INTEGRATIONS = [
  { id: 'google_calendar', icon: CalendarDays, iconColor: 'var(--t-primary)',   name: 'Google Calendar', status: 'Sync your study schedule' },
  { id: 'notion',          icon: Cloud,        iconColor: 'var(--t-secondary)', name: 'Notion Database', status: 'Sync your lecture notes' },
  { id: 'github',          icon: Terminal,     iconColor: 'var(--t-tertiary)',  name: 'GitHub Repository', status: 'Track coding progress' },
];

export default function Settings() {
  const { isDark } = useTheme();
  const { user, updateUser } = useAuth();

  // Profile state
  const [profile, setProfile] = useState({
    name:        user?.name        ?? '',
    designation: user?.designation ?? '',
    email:       user?.email       ?? '',
  });
  const [originalProfile, setOriginalProfile] = useState(profile);

  // Notification state
  const [notifications, setNotifications] = useState({
    deadlines: true, aiInsights: true, peerActivity: false, weeklyReport: true,
  });
  const [originalNotifications, setOriginalNotifications] = useState(notifications);

  // Password state
  const [pwForm,   setPwForm]   = useState({ current: '', next: '', confirm: '' });
  const [showPw,   setShowPw]   = useState(false);
  const [pwError,  setPwError]  = useState('');
  const [pwSaved,  setPwSaved]  = useState(false);
  const [pwSaving, setPwSaving] = useState(false);

  // Save state
  const [saving, setSaving] = useState(false);
  const [saved,  setSaved]  = useState(false);
  const [error,  setError]  = useState('');

  // Load settings
  useEffect(() => {
    userApi.getSettings().then(({ data }) => {
      const s = data.data;
      if (!s) return;
      const n = {
        deadlines:    s.notifyDeadlines,
        aiInsights:   s.notifyAiInsights,
        peerActivity: s.notifyPeerActivity,
        weeklyReport: s.notifyWeeklyReport,
      };
      setNotifications(n);
      setOriginalNotifications(n);
    }).catch(() => {});
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      const { data: pd } = await userApi.updateProfile({
        name:        profile.name,
        designation: profile.designation,
        email:       profile.email,
      });
      updateUser(pd.data);
      setOriginalProfile(profile);

      await userApi.updateSettings({
        notifyDeadlines:    notifications.deadlines,
        notifyAiInsights:   notifications.aiInsights,
        notifyPeerActivity: notifications.peerActivity,
        notifyWeeklyReport: notifications.weeklyReport,
      });
      setOriginalNotifications(notifications);

      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save preferences');
    } finally {
      setSaving(false);
    }
  };

  const handleDiscard = () => {
    setProfile(originalProfile);
    setNotifications(originalNotifications);
    setError('');
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPwError('');
    if (pwForm.next !== pwForm.confirm) { setPwError('New passwords do not match'); return; }
    if (pwForm.next.length < 8)         { setPwError('Password must be at least 8 characters'); return; }
    setPwSaving(true);
    try {
      await userApi.changePassword({ currentPassword: pwForm.current, newPassword: pwForm.next });
      setPwSaved(true);
      setPwForm({ current: '', next: '', confirm: '' });
      setTimeout(() => setPwSaved(false), 2500);
    } catch (err) {
      setPwError(err.response?.data?.message || 'Failed to change password');
    } finally {
      setPwSaving(false);
    }
  };

  const initials = profile.name.split(' ').map(n => n[0]).join('').slice(0, 2) || 'U';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--t-text)' }}>Settings</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--t-text-muted)' }}>Configure your AI cognitive environment.</p>
      </div>

      {error && (
        <div className="p-3 rounded-xl text-sm flex items-center gap-2"
          style={{ background: 'var(--t-error-soft)', color: 'var(--t-error)' }}>
          <X size={14} /> {error}
        </div>
      )}

      <div className="grid grid-cols-12 gap-5">
        {/* ── Profile ── */}
        <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          className="col-span-12 lg:col-span-8 glass-card rounded-2xl p-6" aria-label="Profile settings">
          <div className="flex items-center gap-3 mb-6">
            <User size={18} style={{ color: 'var(--t-primary)' }} />
            <h2 className="text-base font-bold" style={{ color: 'var(--t-text)' }}>Profile</h2>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative shrink-0">
              <div className="w-24 h-24 rounded-full p-0.5"
                style={{ background: 'linear-gradient(135deg, var(--t-primary), var(--t-secondary))' }}>
                <div className="w-full h-full rounded-full flex items-center justify-center text-2xl font-bold theme-transition"
                  style={{ background: 'var(--t-surface-mid)', color: 'var(--t-primary)' }}>
                  {initials}
                </div>
              </div>
            </div>
            <div className="flex-1 w-full space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <Input label="Full Name"    value={profile.name}        onChange={e => setProfile(p => ({ ...p, name: e.target.value }))} />
                <Input label="Designation" value={profile.designation} onChange={e => setProfile(p => ({ ...p, designation: e.target.value }))} />
              </div>
              <Input label="Email" type="email" value={profile.email} onChange={e => setProfile(p => ({ ...p, email: e.target.value }))} />
            </div>
          </div>
        </motion.section>

        {/* ── Atmosphere ── */}
        <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className="col-span-12 lg:col-span-4 glass-card rounded-2xl p-6 flex flex-col justify-between" aria-label="Theme settings">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Moon size={18} style={{ color: 'var(--t-primary)' }} />
              <h2 className="text-base font-bold" style={{ color: 'var(--t-text)' }}>Atmosphere</h2>
            </div>
            <p className="text-xs mb-6" style={{ color: 'var(--t-text-muted)' }}>Toggle between Deep Void and High Clarity.</p>
          </div>
          <div className="flex items-center justify-between p-4 rounded-xl theme-transition"
            style={{ background: 'var(--t-surface-low)', border: '1px solid var(--t-border)' }}>
            <div>
              <p className="text-sm font-semibold" style={{ color: 'var(--t-text)' }}>{isDark ? 'Dark Mode' : 'Light Mode'}</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--t-text-muted)' }}>
                {isDark ? 'Deep Void — optimized for focus' : 'High Clarity — clean and bright'}
              </p>
            </div>
            <ThemeToggle />
          </div>
        </motion.section>

        {/* ── Notifications ── */}
        <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="col-span-12 lg:col-span-6 glass-card rounded-2xl p-6" aria-label="Notification settings">
          <div className="flex items-center gap-3 mb-5">
            <Bell size={18} style={{ color: 'var(--t-secondary)' }} />
            <h2 className="text-base font-bold" style={{ color: 'var(--t-text)' }}>Neural Alerts</h2>
          </div>
          <div className="space-y-1">
            <Toggle checked={notifications.deadlines}    onChange={v => setNotifications(n => ({ ...n, deadlines: v }))}    label="Critical Deadlines"  description="Immediate pings for expiring study windows" />
            <Toggle checked={notifications.aiInsights}   onChange={v => setNotifications(n => ({ ...n, aiInsights: v }))}   label="AI Insights"         description="New generated study paths and summaries" />
            <Toggle checked={notifications.peerActivity} onChange={v => setNotifications(n => ({ ...n, peerActivity: v }))} label="Peer Activity"       description="Collaboration and focus-session invites" />
            <Toggle checked={notifications.weeklyReport} onChange={v => setNotifications(n => ({ ...n, weeklyReport: v }))} label="Weekly Report"       description="AI-generated performance digest every Sunday" />
          </div>
        </motion.section>

        {/* ── Integrations ── */}
        <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="col-span-12 lg:col-span-6 ai-glow-card rounded-2xl p-6" aria-label="Integration settings">
          <div className="flex items-center gap-3 mb-5">
            <Link2 size={18} style={{ color: 'var(--t-primary)' }} />
            <h2 className="text-base font-bold" style={{ color: 'var(--t-text)' }}>Sync Integrations</h2>
          </div>
          <div className="space-y-3">
            {INTEGRATIONS.map(item => (
              <div key={item.id} className="flex items-center gap-4 p-4 rounded-xl theme-transition"
                style={{ background: 'var(--t-surface-high)', border: '1px solid var(--t-border)' }}>
                <div className="w-9 h-9 flex items-center justify-center rounded-lg shrink-0" style={{ background: 'var(--t-border-strong)' }}>
                  <item.icon size={16} style={{ color: item.iconColor }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold" style={{ color: 'var(--t-text)' }}>{item.name}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--t-text-muted)' }}>{item.status}</p>
                </div>
                <button className="text-xs font-bold px-3 py-1 rounded-full theme-transition shrink-0"
                  style={{ color: 'var(--t-primary)', background: 'var(--t-primary-soft)', border: '1px solid var(--t-primary-border)' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--t-primary-border)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'var(--t-primary-soft)'}>
                  Connect
                </button>
              </div>
            ))}
          </div>
        </motion.section>

        {/* ── Change Password ── */}
        <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="col-span-12 lg:col-span-6 glass-card rounded-2xl p-6" aria-label="Password settings">
          <div className="flex items-center gap-3 mb-5">
            <Lock size={18} style={{ color: 'var(--t-primary)' }} />
            <h2 className="text-base font-bold" style={{ color: 'var(--t-text)' }}>Change Password</h2>
          </div>

          {pwError && (
            <div className="p-3 rounded-xl text-xs mb-4" style={{ background: 'var(--t-error-soft)', color: 'var(--t-error)' }}>{pwError}</div>
          )}
          {pwSaved && (
            <div className="p-3 rounded-xl text-xs mb-4" style={{ background: 'var(--t-success-soft)', color: 'var(--t-success)' }}>Password changed successfully!</div>
          )}

          <form onSubmit={handlePasswordChange} className="space-y-4">
            {[
              { key: 'current', label: 'Current Password',  placeholder: '••••••••' },
              { key: 'next',    label: 'New Password',       placeholder: 'Min 8 chars' },
              { key: 'confirm', label: 'Confirm New Password', placeholder: 'Repeat new password' },
            ].map(({ key, label, placeholder }) => (
              <div key={key} className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-widest" style={{ color: 'var(--t-primary)' }}>{label}</label>
                <div className="relative">
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={pwForm[key]}
                    onChange={e => setPwForm(p => ({ ...p, [key]: e.target.value }))}
                    placeholder={placeholder}
                    required
                    className="w-full recessed rounded-xl px-4 py-3 pr-10 text-sm border focus:outline-none theme-transition"
                    style={{ color: 'var(--t-text)', borderColor: 'var(--t-border)' }}
                    onFocus={e => e.target.style.borderColor = 'var(--t-border-focus)'}
                    onBlur={e => e.target.style.borderColor = 'var(--t-border)'} />
                  {key === 'current' && (
                    <button type="button" onClick={() => setShowPw(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--t-text-muted)' }}>
                      {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  )}
                </div>
              </div>
            ))}
            <Button type="submit" variant="secondary" size="md" className="w-full justify-center" disabled={pwSaving}>
              <Lock size={14} /> {pwSaving ? 'Changing…' : 'Change Password'}
            </Button>
          </form>
        </motion.section>

        {/* ── Footer actions ── */}
        <div className="col-span-12 flex justify-end gap-3">
          <Button variant="outline" size="md" onClick={handleDiscard}>
            <X size={15} /> Discard Changes
          </Button>
          <Button size="md" onClick={handleSave} disabled={saving}>
            <Save size={15} />
            {saving ? 'Saving…' : saved ? 'Saved ✓' : 'Save Preferences'}
          </Button>
        </div>
      </div>
    </div>
  );
}
