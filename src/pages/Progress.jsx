import { useState } from 'react';
import { Trophy, Flame, Brain, BookOpen, Users, Zap, Plus, Trash2, Check, X } from 'lucide-react';
import { Card } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { CardSkeleton, PageError } from '../components/ui/Skeleton';
import { useProgress } from '../hooks/useProgress';
import { useTasks } from '../hooks/useTasks';
import { tasksApi, subjectsApi } from '../lib/api';
import { cn } from '../utils/cn';
import { motion, AnimatePresence } from 'framer-motion';
import { useApi } from '../hooks/useApi';

const ICON_MAP = { Trophy, Flame, Brain, BookOpen, Users, Zap };
const DAYS = ['M','T','W','T','F','S','S'];

export default function Progress() {
  const { data: progressData, loading: progressLoading, error: progressError, refetch } = useProgress();
  const { tasks, loading: tasksLoading, refetch: refetchTasks } = useTasks();
  const { data: subjectsData } = useApi(() => subjectsApi.list({ limit: 50 }));

  const [showAddTask, setShowAddTask] = useState(false);
  const [newTask,     setNewTask]     = useState({ text: '', subjectId: '', dueDate: '' });
  const [addingTask,  setAddingTask]  = useState(false);

  const toggleTask = async (task) => {
    await tasksApi.update(task.id, { status: task.status === 'done' ? 'pending' : 'done' });
    refetchTasks();
  };

  const removeTask = async (id) => {
    await tasksApi.delete(id);
    refetchTasks();
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.text.trim()) return;
    setAddingTask(true);
    try {
      await tasksApi.create({
        text:      newTask.text.trim(),
        subjectId: newTask.subjectId || undefined,
        dueDate:   newTask.dueDate   || undefined,
      });
      refetchTasks();
      setShowAddTask(false);
      setNewTask({ text: '', subjectId: '', dueDate: '' });
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add task');
    } finally {
      setAddingTask(false);
    }
  };

  if (progressError) return <PageError message={progressError} onRetry={refetch} />;

  const subjects     = progressData?.subjects     ?? [];
  const streak       = progressData?.streak;
  const achievements = progressData?.achievements ?? [];
  const streakChart  = progressData?.streakChart  ?? [];
  const allSubjects  = subjectsData?.subjects     ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--t-text)' }}>Progress Tracker</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--t-text-muted)' }}>
          Real-time optimization of your cognitive development.
        </p>
      </div>

      {/* Circular progress + streak */}
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {progressLoading
            ? [1,2,3].map(i => <CardSkeleton key={i} />)
            : subjects.slice(0, 3).map((s, i) => {
                const pct = s.progress ?? 0;
                return (
                  <motion.div key={s.id}
                    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}
                    className={cn('glass-card p-5 rounded-2xl flex flex-col items-center text-center theme-transition', i === 0 && 'ai-glow-card')}>
                    <div className="w-28 h-28 rounded-full flex items-center justify-center mb-4"
                      style={{ background: `radial-gradient(closest-side, var(--t-surface-mid) 79%, transparent 80% 100%), conic-gradient(${s.color || '#adc6ff'} ${pct}%, var(--t-surface-low) 0)` }}
                      role="img" aria-label={`${s.name}: ${pct}% complete`}>
                      <span className="text-2xl font-bold" style={{ color: s.color || '#adc6ff' }}>{pct}%</span>
                    </div>
                    <h3 className="text-sm font-bold" style={{ color: 'var(--t-text)' }}>{s.name}</h3>
                    <p className="text-[11px] mt-1" style={{ color: 'var(--t-text-muted)' }}>
                      {s.modules?.filter(m => m.isCompleted).length ?? 0}/{s._count?.modules ?? 0} Modules
                    </p>
                  </motion.div>
                );
              })
          }
        </div>

        {/* Streak chart */}
        <Card className="col-span-12 lg:col-span-4 p-5">
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-base font-bold" style={{ color: 'var(--t-text)' }}>Study Streak</h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
              style={{ color: 'var(--t-primary)', background: 'var(--t-primary-soft)', border: '1px solid var(--t-primary-border)' }}>
              {streak?.currentStreak ?? 0} DAY STREAK
            </span>
          </div>
          <div className="flex items-end gap-1.5 h-36">
            {streakChart.map((d, i) => {
              const maxMins = Math.max(...streakChart.map(x => x.minutes), 1);
              const h = Math.round((d.minutes / maxMins) * 100);
              const isToday = i === streakChart.length - 1;
              return (
                <div key={i} className="flex-1 rounded-t-md transition-all duration-700"
                  style={{ height: `${Math.max(h, 4)}%`, background: isToday ? 'var(--t-primary)' : 'var(--t-primary-soft)', boxShadow: isToday ? '0 -4px 12px var(--t-primary)' : 'none' }} />
              );
            })}
          </div>
          <div className="flex justify-between mt-3 text-[10px]" style={{ color: 'var(--t-text-muted)' }}>
            {DAYS.map((d, i) => (
              <span key={i} style={i === DAYS.length - 1 ? { color: 'var(--t-primary)', fontWeight: 700 } : {}}>{d}</span>
            ))}
          </div>
        </Card>
      </div>

      {/* Tasks + Achievements */}
      <div className="grid grid-cols-12 gap-4">
        <Card className="col-span-12 lg:col-span-7 p-5">
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-base font-bold" style={{ color: 'var(--t-text)' }}>Active Tasks</h3>
            <Button variant="ghost" size="sm" onClick={() => setShowAddTask(true)}>
              <Plus size={14} /> New Task
            </Button>
          </div>

          {tasksLoading ? (
            <div className="space-y-2">{[1,2,3].map(i => <div key={i} className="h-14 rounded-xl animate-pulse" style={{ background: 'var(--t-surface-high)' }} />)}</div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm mb-3" style={{ color: 'var(--t-text-muted)' }}>No tasks yet</p>
              <Button size="sm" onClick={() => setShowAddTask(true)}><Plus size={14} /> Add your first task</Button>
            </div>
          ) : (
            <div className="space-y-2">
              {tasks.map(task => (
                <div key={task.id}
                  className="flex items-center gap-3 p-3.5 rounded-xl border theme-transition"
                  style={{ background: task.status === 'done' ? 'var(--t-surface-low)' : 'var(--t-surface-high)', borderColor: 'var(--t-border)', opacity: task.status === 'done' ? 0.65 : 1 }}>
                  <button onClick={() => toggleTask(task)}
                    className="w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors"
                    style={{ background: task.status === 'done' ? 'var(--t-primary)' : 'transparent', borderColor: 'var(--t-primary)' }}>
                    {task.status === 'done' && <Check size={11} style={{ color: 'var(--t-bg)' }} strokeWidth={3} />}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className={cn('text-sm', task.status === 'done' && 'line-through')} style={{ color: 'var(--t-text)' }}>
                      {task.text}
                    </p>
                    <p className="text-[11px] mt-0.5" style={{ color: 'var(--t-text-muted)' }}>
                      {task.subject?.name ?? 'No subject'} • {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
                    </p>
                  </div>
                  <button onClick={() => removeTask(task.id)}
                    className="p-1.5 rounded-lg theme-transition" style={{ color: 'var(--t-text-muted)' }}
                    onMouseEnter={e => { e.currentTarget.style.color = 'var(--t-error)'; e.currentTarget.style.background = 'var(--t-error-soft)'; }}
                    onMouseLeave={e => { e.currentTarget.style.color = 'var(--t-text-muted)'; e.currentTarget.style.background = 'transparent'; }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Achievements */}
        <Card className="col-span-12 lg:col-span-5 p-5">
          <h3 className="text-base font-bold mb-5" style={{ color: 'var(--t-text)' }}>Cognitive Milestones</h3>
          {achievements.length === 0 ? (
            <p className="text-sm text-center py-8" style={{ color: 'var(--t-text-muted)' }}>Complete tasks to unlock achievements</p>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {achievements.map((ua, i) => {
                const Icon = ICON_MAP[ua.achievement?.icon] ?? Trophy;
                return (
                  <motion.div key={ua.id} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.07 }}
                    className="flex flex-col items-center gap-2 group">
                    <div className="w-16 h-16 rounded-full p-0.5"
                      style={{ background: 'linear-gradient(135deg, var(--t-primary), var(--t-secondary))' }}>
                      <div className="w-full h-full rounded-full flex items-center justify-center transition-transform group-hover:scale-110"
                        style={{ background: 'var(--t-surface-mid)' }}>
                        <Icon size={22} style={{ color: 'var(--t-primary)' }} />
                      </div>
                    </div>
                    <span className="text-[10px] text-center leading-tight" style={{ color: 'var(--t-text)' }}>
                      {ua.achievement?.label}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          )}
        </Card>
      </div>

      {/* AI insight */}
      <Card glow className="p-5 flex flex-col sm:flex-row items-start sm:items-center gap-5">
        <div className="w-16 h-16 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: 'var(--t-primary-soft)', border: '1px solid var(--t-primary-border)' }}>
          <Brain size={28} style={{ color: 'var(--t-primary)' }} />
        </div>
        <div className="flex-1">
          <h4 className="text-base font-bold mb-1" style={{ color: 'var(--t-primary)' }}>Architectural Insight</h4>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--t-text)' }}>
            Your current streak is{' '}
            <span className="font-bold" style={{ color: 'var(--t-primary)' }}>{streak?.currentStreak ?? 0} days</span>.
            {(streak?.currentStreak ?? 0) >= 7
              ? " Outstanding consistency — you're in peak learning mode."
              : ' Keep going — consistency is the key to long-term retention.'}
          </p>
        </div>
      </Card>

      {/* Add Task Modal */}
      <AnimatePresence>
        {showAddTask && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'var(--t-overlay)' }}
            onClick={e => e.target === e.currentTarget && setShowAddTask(false)}>
            <motion.div initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
              className="glass-card rounded-2xl p-6 w-full max-w-md"
              style={{ background: 'var(--t-surface-mid)' }}>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold" style={{ color: 'var(--t-text)' }}>New Task</h2>
                <button onClick={() => setShowAddTask(false)} style={{ color: 'var(--t-text-muted)' }}><X size={18} /></button>
              </div>

              <form onSubmit={handleAddTask} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-widest" style={{ color: 'var(--t-primary)' }}>Task</label>
                  <input type="text" value={newTask.text} onChange={e => setNewTask(p => ({ ...p, text: e.target.value }))}
                    placeholder="e.g. Read Chapter 5"
                    required autoFocus
                    className="w-full recessed rounded-xl px-4 py-3 text-sm border focus:outline-none theme-transition"
                    style={{ color: 'var(--t-text)', borderColor: 'var(--t-border)' }}
                    onFocus={e => e.target.style.borderColor = 'var(--t-border-focus)'}
                    onBlur={e => e.target.style.borderColor = 'var(--t-border)'} />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-widest" style={{ color: 'var(--t-primary)' }}>Subject (optional)</label>
                  <select value={newTask.subjectId} onChange={e => setNewTask(p => ({ ...p, subjectId: e.target.value }))}
                    className="w-full recessed rounded-xl px-4 py-3 text-sm border focus:outline-none theme-transition"
                    style={{ color: 'var(--t-text)', borderColor: 'var(--t-border)' }}>
                    <option value="">— No subject —</option>
                    {allSubjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-widest" style={{ color: 'var(--t-primary)' }}>Due Date (optional)</label>
                  <input type="date" value={newTask.dueDate} onChange={e => setNewTask(p => ({ ...p, dueDate: e.target.value }))}
                    className="w-full recessed rounded-xl px-4 py-3 text-sm border focus:outline-none [color-scheme:dark] theme-transition"
                    style={{ color: 'var(--t-text)', borderColor: 'var(--t-border)' }} />
                </div>

                <div className="flex gap-3 pt-2">
                  <Button type="button" variant="outline" size="md" className="flex-1 justify-center" onClick={() => setShowAddTask(false)}>Cancel</Button>
                  <Button type="submit" size="md" className="flex-1 justify-center" disabled={addingTask || !newTask.text.trim()}>
                    <Plus size={15} /> {addingTask ? 'Adding…' : 'Add Task'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
