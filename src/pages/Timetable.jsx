import { useState, useEffect } from 'react';
import { Sparkles, Filter, Plus, ChevronLeft, ChevronRight, X } from 'lucide-react';
import Button from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { timetableApi, subjectsApi } from '../lib/api';
import { cn } from '../utils/cn';
import { motion, AnimatePresence } from 'framer-motion';

const DAYS  = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
const SLOTS = ['08:00 AM', '10:00 AM', '12:00 PM', '02:00 PM', '04:00 PM', '06:00 PM'];

const EVENT_COLORS = {
  primary:   { border: 'var(--t-primary)',   label: 'var(--t-primary)',   bg: 'var(--t-primary-soft)' },
  secondary: { border: 'var(--t-secondary)', label: 'var(--t-secondary)', bg: 'var(--t-secondary-soft)' },
  tertiary:  { border: 'var(--t-tertiary)',  label: 'var(--t-tertiary)',  bg: 'var(--t-tertiary-soft)' },
  error:     { border: 'var(--t-error)',     label: 'var(--t-error)',     bg: 'var(--t-error-soft)' },
};

/** Get the Monday of the week containing `date` */
const getMondayOf = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
};

const formatDate = (monday, offset) => {
  const d = new Date(monday);
  d.setDate(d.getDate() + offset);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export default function Timetable() {
  const [weekStart,  setWeekStart]  = useState(() => getMondayOf(new Date()));
  const [events,     setEvents]     = useState([]);
  const [subjects,   setSubjects]   = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [showModal,  setShowModal]  = useState(false);
  const [optimizing, setOptimizing] = useState(false);
  const [newEvent,   setNewEvent]   = useState({ title: '', subjectId: '', dayOfWeek: 0, slotIndex: 0, spanSlots: 1, color: 'primary' });

  const todayDayOfWeek = (() => {
    const d = new Date().getDay();
    return d === 0 ? 6 : d - 1; // Mon=0 … Sun=6
  })();

  const isCurrentWeek = getMondayOf(new Date()).getTime() === weekStart.getTime();

  // Load events whenever week changes
  useEffect(() => {
    setLoading(true);
    timetableApi.getWeek(weekStart.toISOString())
      .then(({ data }) => setEvents(data.data ?? []))
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, [weekStart]);

  // Load subjects once for the dropdown
  useEffect(() => {
    subjectsApi.list({ limit: 50 })
      .then(({ data }) => setSubjects(data.data?.subjects ?? []))
      .catch(() => {});
  }, []);

  const prevWeek = () => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() - 7);
    setWeekStart(d);
  };

  const nextWeek = () => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + 7);
    setWeekStart(d);
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();
    try {
      const subject = subjects.find(s => s.id === newEvent.subjectId);
      const { data } = await timetableApi.create({
        ...newEvent,
        title:     newEvent.title || subject?.name || 'Study Block',
        weekStart: weekStart.toISOString(),
        dayOfWeek: Number(newEvent.dayOfWeek),
        slotIndex: Number(newEvent.slotIndex),
        spanSlots: Number(newEvent.spanSlots),
      });
      setEvents(prev => [...prev, data.data]);
      setShowModal(false);
      setNewEvent({ title: '', subjectId: '', dayOfWeek: 0, slotIndex: 0, spanSlots: 1, color: 'primary' });
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add event');
    }
  };

  const handleDeleteEvent = async (id) => {
    try {
      await timetableApi.delete(id);
      setEvents(prev => prev.filter(e => e.id !== id));
    } catch { /* ignore */ }
  };

  const handleAiOptimize = async () => {
    setOptimizing(true);
    try {
      const { data } = await timetableApi.aiOptimize(weekStart.toISOString());
      const suggestions = data.data ?? [];
      // Create all suggested events
      const created = await Promise.all(
        suggestions.map(s => timetableApi.create({ ...s, weekStart: weekStart.toISOString() }).then(r => r.data.data))
      );
      setEvents(prev => [...prev, ...created]);
    } catch (err) {
      alert('AI optimization failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setOptimizing(false);
    }
  };

  // Focus density from real events
  const focusByDay = Array(7).fill(0);
  events.forEach(ev => { focusByDay[ev.dayOfWeek] = (focusByDay[ev.dayOfWeek] || 0) + ev.spanSlots; });
  const maxFocus = Math.max(...focusByDay, 1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--t-text)' }}>AI Timetable</h1>
          <div className="flex items-center gap-3 mt-1">
            <button onClick={prevWeek} className="p-1 rounded-lg theme-transition" style={{ color: 'var(--t-text-muted)' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--t-primary)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--t-text-muted)'}>
              <ChevronLeft size={18} />
            </button>
            <p className="text-sm font-semibold" style={{ color: 'var(--t-text-muted)' }}>
              {formatDate(weekStart, 0)} — {formatDate(weekStart, 6)}
              {isCurrentWeek && <span className="ml-2 text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: 'var(--t-primary-soft)', color: 'var(--t-primary)' }}>THIS WEEK</span>}
            </p>
            <button onClick={nextWeek} className="p-1 rounded-lg theme-transition" style={{ color: 'var(--t-text-muted)' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--t-primary)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--t-text-muted)'}>
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" size="md" onClick={handleAiOptimize} disabled={optimizing}>
            <Sparkles size={15} /> {optimizing ? 'Optimizing…' : 'AI Optimize'}
          </Button>
          <Button size="md" onClick={() => setShowModal(true)}>
            <Plus size={15} /> Add Block
          </Button>
        </div>
      </div>

      {/* Calendar grid */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-2xl overflow-hidden">
        {/* Header row */}
        <div className="grid grid-cols-8" style={{ borderBottom: '1px solid var(--t-border)', background: 'var(--t-surface-high)' }}>
          <div className="p-3 text-center text-[10px] font-bold uppercase tracking-widest"
            style={{ borderRight: '1px solid var(--t-border)', color: 'var(--t-text-muted)' }}>Time</div>
          {DAYS.map((d, i) => (
            <div key={d} className="p-3 text-center"
              style={{ borderRight: i < 6 ? '1px solid var(--t-border)' : 'none', background: isCurrentWeek && i === todayDayOfWeek ? 'var(--t-primary-soft)' : 'transparent' }}>
              <p className="text-sm font-bold" style={{ color: isCurrentWeek && i === todayDayOfWeek ? 'var(--t-primary)' : 'var(--t-text)' }}>{d}</p>
              <p className="text-[10px]" style={{ color: 'var(--t-text-muted)' }}>{formatDate(weekStart, i)}</p>
            </div>
          ))}
        </div>

        {/* Body */}
        <div className="grid grid-cols-8" style={{ borderRight: '1px solid var(--t-border)' }}>
          {/* Time column */}
          <div style={{ background: 'var(--t-surface-low)', borderRight: '1px solid var(--t-border)' }}>
            {SLOTS.map(s => (
              <div key={s} className="h-20 p-2 text-right text-[10px]"
                style={{ borderBottom: '1px solid var(--t-border)', color: 'var(--t-text-subtle)' }}>{s}</div>
            ))}
          </div>

          {/* Day columns */}
          {DAYS.map((_, dayIdx) => {
            const dayEvents = events.filter(e => e.dayOfWeek === dayIdx);
            return (
              <div key={dayIdx} className="relative"
                style={{ borderRight: dayIdx < 6 ? '1px solid var(--t-border)' : 'none', background: isCurrentWeek && dayIdx === todayDayOfWeek ? 'var(--t-primary-soft)' : 'transparent' }}>
                {isCurrentWeek && dayIdx === todayDayOfWeek && (
                  <div className="absolute top-6 left-0 right-0 h-px z-10"
                    style={{ background: 'var(--t-primary)', boxShadow: '0 0 8px var(--t-primary)' }}>
                    <span className="absolute -right-10 -top-2 text-[9px] font-bold" style={{ color: 'var(--t-primary)' }}>NOW</span>
                  </div>
                )}
                {SLOTS.map((_, slotIdx) => (
                  <div key={slotIdx} className="h-20" style={{ borderBottom: '1px solid var(--t-border)' }} />
                ))}
                {loading
                  ? null
                  : dayEvents.map(ev => {
                      const c = EVENT_COLORS[ev.color] ?? EVENT_COLORS.primary;
                      return (
                        <div key={ev.id}
                          className="absolute left-1 right-1 rounded-lg p-2 glass-card group"
                          style={{ top: `${ev.slotIndex * 80 + 6}px`, height: `${ev.spanSlots * 80 - 10}px`, borderLeft: `4px solid ${c.border}` }}>
                          <p className="text-[10px] font-bold mb-0.5 truncate" style={{ color: c.label }}>{ev.title}</p>
                          {ev.topic && <p className="text-[10px] leading-tight line-clamp-2" style={{ color: 'var(--t-text)' }}>{ev.topic}</p>}
                          <button
                            onClick={() => handleDeleteEvent(ev.id)}
                            className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded"
                            style={{ color: 'var(--t-error)' }}>
                            <X size={10} />
                          </button>
                        </div>
                      );
                    })
                }
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Bottom stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-5">
          <h3 className="text-sm font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--t-primary)' }}>
            <Sparkles size={15} /> Focus Density
          </h3>
          <div className="flex items-end gap-1.5 h-24">
            {focusByDay.map((h, i) => (
              <div key={i} className="flex-1 rounded-t-md transition-all duration-700"
                style={{ height: `${Math.max((h / maxFocus) * 100, 4)}%`, background: isCurrentWeek && i === todayDayOfWeek ? 'var(--t-primary)' : 'var(--t-primary-soft)', boxShadow: isCurrentWeek && i === todayDayOfWeek ? '0 -4px 12px var(--t-primary)' : 'none' }} />
            ))}
          </div>
          <div className="flex justify-between mt-2 text-[10px]" style={{ color: 'var(--t-text-muted)' }}>
            {['M','T','W','T','F','S','S'].map((d, i) => (
              <span key={i} style={isCurrentWeek && i === todayDayOfWeek ? { color: 'var(--t-primary)', fontWeight: 700 } : {}}>{d}</span>
            ))}
          </div>
        </Card>

        <Card glow className="p-5 md:col-span-2 relative overflow-hidden">
          <div className="absolute inset-0 animate-shimmer pointer-events-none"
            style={{ background: 'linear-gradient(90deg, transparent, var(--t-primary-soft), transparent)' }} />
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-base font-bold" style={{ color: 'var(--t-text)' }}>Neural Optimization</h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{ color: 'var(--t-primary)', background: 'var(--t-primary-soft)', border: '1px solid var(--t-primary-border)' }}>
                {events.length} BLOCKS
              </span>
            </div>
            <p className="text-sm mb-4 leading-relaxed" style={{ color: 'var(--t-text-muted)' }}>
              {events.length === 0
                ? 'No study blocks this week. Click "AI Optimize" to auto-generate a schedule based on your subjects.'
                : `You have ${events.length} study block${events.length !== 1 ? 's' : ''} scheduled. Let AI re-align your schedule for better memory retention.`}
            </p>
            <div className="flex gap-3">
              <Button size="sm" onClick={handleAiOptimize} disabled={optimizing}>
                {optimizing ? 'Optimizing…' : 'Apply Auto-Schedule'}
              </Button>
              <Button variant="outline" size="sm" onClick={() => setShowModal(true)}>Add Manually</Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Add Event Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'var(--t-overlay)' }}
            onClick={e => e.target === e.currentTarget && setShowModal(false)}>
            <motion.div initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
              className="glass-card rounded-2xl p-6 w-full max-w-md"
              style={{ background: 'var(--t-surface-mid)' }}>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold" style={{ color: 'var(--t-text)' }}>Add Study Block</h2>
                <button onClick={() => setShowModal(false)} style={{ color: 'var(--t-text-muted)' }}><X size={18} /></button>
              </div>

              <form onSubmit={handleAddEvent} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-widest" style={{ color: 'var(--t-primary)' }}>Subject</label>
                  <select value={newEvent.subjectId} onChange={e => setNewEvent(p => ({ ...p, subjectId: e.target.value }))}
                    className="w-full recessed rounded-xl px-4 py-3 text-sm border focus:outline-none theme-transition"
                    style={{ color: 'var(--t-text)', borderColor: 'var(--t-border)' }}>
                    <option value="">— Select subject —</option>
                    {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-widest" style={{ color: 'var(--t-primary)' }}>Title (optional)</label>
                  <input type="text" value={newEvent.title} onChange={e => setNewEvent(p => ({ ...p, title: e.target.value }))}
                    placeholder="e.g. Deep Work Session"
                    className="w-full recessed rounded-xl px-4 py-3 text-sm border focus:outline-none theme-transition"
                    style={{ color: 'var(--t-text)', borderColor: 'var(--t-border)' }} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-widest" style={{ color: 'var(--t-primary)' }}>Day</label>
                    <select value={newEvent.dayOfWeek} onChange={e => setNewEvent(p => ({ ...p, dayOfWeek: e.target.value }))}
                      className="w-full recessed rounded-xl px-3 py-3 text-sm border focus:outline-none theme-transition"
                      style={{ color: 'var(--t-text)', borderColor: 'var(--t-border)' }}>
                      {DAYS.map((d, i) => <option key={i} value={i}>{d}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-widest" style={{ color: 'var(--t-primary)' }}>Time Slot</label>
                    <select value={newEvent.slotIndex} onChange={e => setNewEvent(p => ({ ...p, slotIndex: e.target.value }))}
                      className="w-full recessed rounded-xl px-3 py-3 text-sm border focus:outline-none theme-transition"
                      style={{ color: 'var(--t-text)', borderColor: 'var(--t-border)' }}>
                      {SLOTS.map((s, i) => <option key={i} value={i}>{s}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-widest" style={{ color: 'var(--t-primary)' }}>Duration (slots)</label>
                    <select value={newEvent.spanSlots} onChange={e => setNewEvent(p => ({ ...p, spanSlots: e.target.value }))}
                      className="w-full recessed rounded-xl px-3 py-3 text-sm border focus:outline-none theme-transition"
                      style={{ color: 'var(--t-text)', borderColor: 'var(--t-border)' }}>
                      {[1,2,3].map(n => <option key={n} value={n}>{n * 2}h</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-widest" style={{ color: 'var(--t-primary)' }}>Color</label>
                    <select value={newEvent.color} onChange={e => setNewEvent(p => ({ ...p, color: e.target.value }))}
                      className="w-full recessed rounded-xl px-3 py-3 text-sm border focus:outline-none theme-transition"
                      style={{ color: 'var(--t-text)', borderColor: 'var(--t-border)' }}>
                      {Object.keys(EVENT_COLORS).map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button type="button" variant="outline" size="md" className="flex-1 justify-center" onClick={() => setShowModal(false)}>Cancel</Button>
                  <Button type="submit" size="md" className="flex-1 justify-center"><Plus size={15} /> Add Block</Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB */}
      <button onClick={() => setShowModal(true)}
        className="fixed bottom-8 right-8 w-14 h-14 rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-40 shadow-lg"
        style={{ background: 'var(--t-primary)', color: 'var(--t-bg)', boxShadow: '0 8px 24px var(--t-primary)' }}
        aria-label="Add study block">
        <Plus size={22} />
      </button>
    </div>
  );
}
