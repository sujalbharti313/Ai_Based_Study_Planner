import { useState } from 'react';
import { ArrowLeft, Zap, Lightbulb, Calendar, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Toggle from '../components/ui/Toggle';
import { motion } from 'framer-motion';
import { subjectsApi } from '../lib/api';

const COMPLEXITY_LABELS = ['', 'Linear', 'Basic', 'Moderate', 'Advanced', 'Quantum'];

const PRIORITY_MAP = {
  false: 'active',
  true:  'high',
};

export default function AddSubject() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', complexity: 3, highPriority: false, deadline: '', context: '',
  });
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState('');

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      await subjectsApi.create({
        name:       form.name,
        complexity: form.complexity,
        priority:   PRIORITY_MAP[form.highPriority],
        deadline:   form.deadline || undefined,
        context:    form.context  || undefined,
      });
      navigate('/subjects');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create subject. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <Link to="/subjects"
        className="inline-flex items-center gap-2 text-sm theme-transition"
        style={{ color: 'var(--t-text-muted)' }}
        onMouseEnter={e => e.currentTarget.style.color = 'var(--t-primary)'}
        onMouseLeave={e => e.currentTarget.style.color = 'var(--t-text-muted)'}>
        <ArrowLeft size={16} /> Back to Subjects
      </Link>

      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--t-text)' }}>Initialize New Subject</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--t-text-muted)' }}>
          Configure a new cognitive module for the AI engine to architect your optimal study path.
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-xl text-sm"
          style={{ background: 'var(--t-error-soft)', color: 'var(--t-error)' }}>
          <AlertCircle size={15} /> {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Form */}
        <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-7 glass-card rounded-2xl p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Class Identity"
              placeholder="e.g. Advanced Quantum Mechanics"
              value={form.name}
              onChange={e => set('name', e.target.value)}
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-widest" style={{ color: 'var(--t-primary)' }}>
                  Complexity Rating
                </label>
                <div className="recessed p-4 rounded-xl">
                  <input type="range" min={1} max={5} step={1}
                    value={form.complexity}
                    onChange={e => set('complexity', Number(e.target.value))}
                    className="w-full cursor-pointer"
                    style={{ accentColor: 'var(--t-primary)' }} />
                  <div className="flex justify-between mt-2 text-[10px] font-bold uppercase" style={{ color: 'var(--t-text-muted)' }}>
                    <span>Linear</span>
                    <span style={{ color: 'var(--t-primary)' }}>{COMPLEXITY_LABELS[form.complexity]}</span>
                    <span>Quantum</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-widest" style={{ color: 'var(--t-primary)' }}>
                  Core Priority
                </label>
                <div className="recessed rounded-xl h-[72px] flex items-center px-2">
                  <Toggle checked={form.highPriority} onChange={v => set('highPriority', v)} label="High Importance" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-widest" style={{ color: 'var(--t-primary)' }}>
                Termination Deadline
              </label>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <input type="date" value={form.deadline}
                    onChange={e => set('deadline', e.target.value)}
                    className="w-full recessed rounded-xl py-3 px-4 border focus:outline-none transition-colors text-sm [color-scheme:dark]"
                    style={{ color: 'var(--t-text)', borderColor: 'var(--t-border)' }}
                    onFocus={e => e.target.style.borderColor = 'var(--t-border-focus)'}
                    onBlur={e => e.target.style.borderColor = 'var(--t-border)'} />
                </div>
                <div className="glass-card p-3 rounded-xl">
                  <Calendar size={18} style={{ color: 'var(--t-primary)' }} />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-widest" style={{ color: 'var(--t-primary)' }}>
                Context Inference
              </label>
              <textarea rows={3} value={form.context}
                onChange={e => set('context', e.target.value)}
                placeholder="Describe specific focus areas or learning objectives…"
                className="w-full recessed rounded-xl py-3 px-4 border focus:outline-none transition-colors text-sm resize-none"
                style={{ color: 'var(--t-text)', borderColor: 'var(--t-border)' }}
                onFocus={e => e.target.style.borderColor = 'var(--t-border-focus)'}
                onBlur={e => e.target.style.borderColor = 'var(--t-border)'} />
            </div>

            <Button type="submit" size="lg" className="w-full justify-center" disabled={saving}>
              <Zap size={18} /> {saving ? 'Initializing…' : 'Initialize Subject'}
            </Button>
          </form>
        </motion.section>

        {/* Live preview */}
        <aside className="lg:col-span-5 space-y-4 sticky top-24">
          <p className="text-[10px] font-bold uppercase tracking-widest text-center" style={{ color: 'var(--t-text-muted)' }}>
            Neural Preview
          </p>
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
            className="ai-glow-card rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute -top-8 -right-8 w-32 h-32 blur-3xl rounded-full pointer-events-none"
              style={{ background: 'var(--t-primary-soft)' }} />
            <div className="relative z-10 space-y-5">
              <div className="flex justify-between items-start">
                <div className="p-3 rounded-xl" style={{ background: 'var(--t-primary-soft)' }}>
                  <Zap size={28} style={{ color: 'var(--t-primary)' }} />
                </div>
                <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase"
                  style={{ background: 'var(--t-secondary-soft)', color: 'var(--t-secondary)', border: '1px solid var(--t-secondary-soft)' }}>
                  {form.highPriority ? 'Priority Max' : 'Standard'}
                </span>
              </div>
              <div>
                <h2 className="text-xl font-bold" style={{ color: 'var(--t-text)' }}>
                  {form.name || 'Subject Name'}
                </h2>
                <p className="text-xs mt-1" style={{ color: 'var(--t-text-muted)' }}>Complexity: {COMPLEXITY_LABELS[form.complexity]}</p>
              </div>
              <div>
                <div className="flex justify-between text-[10px] mb-1.5" style={{ color: 'var(--t-text-muted)' }}>
                  <span>COGNITIVE LOAD</span>
                  <span style={{ color: 'var(--t-primary)' }}>LEVEL {form.complexity}</span>
                </div>
                <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--t-surface-high)' }}>
                  <div className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${(form.complexity / 5) * 100}%`, background: 'linear-gradient(90deg, var(--t-primary), var(--t-secondary))' }} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="recessed p-3 rounded-xl" style={{ border: '1px solid var(--t-border)' }}>
                  <p className="text-[10px] uppercase mb-1" style={{ color: 'var(--t-text-muted)' }}>Due Date</p>
                  <p className="text-sm font-bold" style={{ color: 'var(--t-text)' }}>
                    {form.deadline ? new Date(form.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                  </p>
                </div>
                <div className="recessed p-3 rounded-xl" style={{ border: '1px solid var(--t-border)' }}>
                  <p className="text-[10px] uppercase mb-1" style={{ color: 'var(--t-text-muted)' }}>Status</p>
                  <p className="text-sm font-bold" style={{ color: 'var(--t-tertiary)' }}>PENDING_INIT</p>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="glass-card p-4 rounded-xl" style={{ borderLeft: '4px solid var(--t-tertiary)' }}>
            <div className="flex gap-3">
              <Lightbulb size={16} className="shrink-0 mt-0.5" style={{ color: 'var(--t-tertiary)' }} />
              <p className="text-xs leading-relaxed" style={{ color: 'var(--t-text-muted)' }}>
                <span className="font-bold" style={{ color: 'var(--t-tertiary)' }}>System Tip: </span>
                Higher complexity subjects automatically trigger the "Deep Focus" scheduler,
                allocating 25% more revision cycles before your deadline.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
