import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Check, Trash2, Edit2, Save, X, BookOpen } from 'lucide-react';
import { subjectsApi, tasksApi } from '../lib/api';
import { Card } from '../components/ui/Card';
import Button from '../components/ui/Button';
import ProgressBar from '../components/ui/ProgressBar';
import Badge from '../components/ui/Badge';
import { CardSkeleton, PageError } from '../components/ui/Skeleton';
import { motion } from 'framer-motion';

export default function SubjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [subject,  setSubject]  = useState(null);
  const [tasks,    setTasks]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState('');
  const [editing,  setEditing]  = useState(false);
  const [editForm, setEditForm] = useState({});
  const [saving,   setSaving]   = useState(false);

  // New module / task state
  const [newModule,    setNewModule]    = useState('');
  const [addingModule, setAddingModule] = useState(false);
  const [newTask,      setNewTask]      = useState('');
  const [addingTask,   setAddingTask]   = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const [subRes, taskRes] = await Promise.all([
        subjectsApi.get(id),
        tasksApi.list({ subjectId: id, limit: 50 }),
      ]);
      setSubject(subRes.data.data);
      setTasks(taskRes.data.data?.tasks ?? []);
    } catch {
      setError('Subject not found');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [id]);

  const startEdit = () => {
    setEditForm({
      name:       subject.name,
      topic:      subject.topic ?? '',
      context:    subject.context ?? '',
      complexity: subject.complexity,
      priority:   subject.priority,
      deadline:   subject.deadline ? subject.deadline.slice(0, 10) : '',
    });
    setEditing(true);
  };

  const saveEdit = async () => {
    setSaving(true);
    try {
      const { data } = await subjectsApi.update(id, {
        ...editForm,
        deadline: editForm.deadline || undefined,
      });
      setSubject(data.data);
      setEditing(false);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const toggleModule = async (moduleId) => {
    try {
      const { data } = await subjectsApi.toggleModule(id, moduleId);
      setSubject(prev => ({
        ...prev,
        modules: prev.modules.map(m => m.id === moduleId ? data.data : m),
      }));
      // Refresh progress
      const { data: fresh } = await subjectsApi.get(id);
      setSubject(fresh.data);
    } catch { /* ignore */ }
  };

  const addModule = async (e) => {
    e.preventDefault();
    if (!newModule.trim()) return;
    setAddingModule(true);
    try {
      const { data } = await subjectsApi.createModule(id, { title: newModule.trim() });
      setSubject(prev => ({ ...prev, modules: [...(prev.modules ?? []), data.data] }));
      setNewModule('');
    } catch { alert('Failed to add module'); }
    finally { setAddingModule(false); }
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    setAddingTask(true);
    try {
      const { data } = await tasksApi.create({ text: newTask.trim(), subjectId: id });
      setTasks(prev => [data.data, ...prev]);
      setNewTask('');
    } catch { alert('Failed to add task'); }
    finally { setAddingTask(false); }
  };

  const toggleTask = async (task) => {
    try {
      const { data } = await tasksApi.update(task.id, { status: task.status === 'done' ? 'pending' : 'done' });
      setTasks(prev => prev.map(t => t.id === task.id ? data.data : t));
    } catch { /* ignore */ }
  };

  const deleteTask = async (taskId) => {
    try {
      await tasksApi.delete(taskId);
      setTasks(prev => prev.filter(t => t.id !== taskId));
    } catch { /* ignore */ }
  };

  if (loading) return <div className="space-y-4">{[1,2,3].map(i => <CardSkeleton key={i} />)}</div>;
  if (error)   return <PageError message={error} onRetry={load} />;
  if (!subject) return null;

  return (
    <div className="space-y-6">
      {/* Back */}
      <Link to="/subjects" className="inline-flex items-center gap-2 text-sm theme-transition"
        style={{ color: 'var(--t-text-muted)' }}
        onMouseEnter={e => e.currentTarget.style.color = 'var(--t-primary)'}
        onMouseLeave={e => e.currentTarget.style.color = 'var(--t-text-muted)'}>
        <ArrowLeft size={16} /> Back to Subjects
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl shrink-0" style={{ background: 'var(--t-primary-soft)' }}>
            <BookOpen size={24} style={{ color: 'var(--t-primary)' }} />
          </div>
          <div>
            {editing ? (
              <input value={editForm.name} onChange={e => setEditForm(p => ({ ...p, name: e.target.value }))}
                className="text-2xl font-bold bg-transparent border-b-2 focus:outline-none w-full"
                style={{ color: 'var(--t-text)', borderColor: 'var(--t-primary)' }} />
            ) : (
              <h1 className="text-2xl font-bold" style={{ color: 'var(--t-text)' }}>{subject.name}</h1>
            )}
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={subject.badgeColor ?? 'primary'}>{subject.priority}</Badge>
              {subject.deadline && (
                <span className="text-xs" style={{ color: 'var(--t-text-muted)' }}>
                  Due {new Date(subject.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-2 shrink-0">
          {editing ? (
            <>
              <Button variant="outline" size="sm" onClick={() => setEditing(false)}><X size={14} /> Cancel</Button>
              <Button size="sm" onClick={saveEdit} disabled={saving}><Save size={14} /> {saving ? 'Saving…' : 'Save'}</Button>
            </>
          ) : (
            <Button variant="secondary" size="sm" onClick={startEdit}><Edit2 size={14} /> Edit</Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left — details + modules */}
        <div className="lg:col-span-2 space-y-5">
          {/* Details card */}
          <Card className="p-5">
            <h2 className="text-base font-bold mb-4" style={{ color: 'var(--t-text)' }}>Details</h2>
            {editing ? (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-widest" style={{ color: 'var(--t-primary)' }}>Topic</label>
                  <input value={editForm.topic} onChange={e => setEditForm(p => ({ ...p, topic: e.target.value }))}
                    className="w-full recessed rounded-xl px-4 py-2.5 text-sm border focus:outline-none theme-transition"
                    style={{ color: 'var(--t-text)', borderColor: 'var(--t-border)' }} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-widest" style={{ color: 'var(--t-primary)' }}>Priority</label>
                    <select value={editForm.priority} onChange={e => setEditForm(p => ({ ...p, priority: e.target.value }))}
                      className="w-full recessed rounded-xl px-3 py-2.5 text-sm border focus:outline-none theme-transition"
                      style={{ color: 'var(--t-text)', borderColor: 'var(--t-border)' }}>
                      {['low','planning','active','high','done'].map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-widest" style={{ color: 'var(--t-primary)' }}>Deadline</label>
                    <input type="date" value={editForm.deadline} onChange={e => setEditForm(p => ({ ...p, deadline: e.target.value }))}
                      className="w-full recessed rounded-xl px-3 py-2.5 text-sm border focus:outline-none [color-scheme:dark] theme-transition"
                      style={{ color: 'var(--t-text)', borderColor: 'var(--t-border)' }} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-widest" style={{ color: 'var(--t-primary)' }}>Context / Notes</label>
                  <textarea rows={3} value={editForm.context} onChange={e => setEditForm(p => ({ ...p, context: e.target.value }))}
                    className="w-full recessed rounded-xl px-4 py-2.5 text-sm border focus:outline-none resize-none theme-transition"
                    style={{ color: 'var(--t-text)', borderColor: 'var(--t-border)' }} />
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {subject.topic && <p className="text-sm" style={{ color: 'var(--t-text-muted)' }}>{subject.topic}</p>}
                {subject.context && (
                  <div className="p-3 rounded-xl text-sm" style={{ background: 'var(--t-surface-low)', color: 'var(--t-text-muted)' }}>
                    {subject.context}
                  </div>
                )}
                <ProgressBar value={subject.progress ?? 0} showLabel />
              </div>
            )}
          </Card>

          {/* Modules */}
          <Card className="p-5">
            <h2 className="text-base font-bold mb-4" style={{ color: 'var(--t-text)' }}>
              Modules ({subject.modules?.filter(m => m.isCompleted).length ?? 0}/{subject.modules?.length ?? 0})
            </h2>

            <div className="space-y-2 mb-4">
              {(subject.modules ?? []).length === 0 ? (
                <p className="text-sm text-center py-4" style={{ color: 'var(--t-text-muted)' }}>No modules yet — add your first chapter below</p>
              ) : (
                subject.modules.map((mod, i) => (
                  <motion.div key={mod.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                    className="flex items-center gap-3 p-3 rounded-xl theme-transition"
                    style={{ background: mod.isCompleted ? 'var(--t-surface-low)' : 'var(--t-surface-high)', opacity: mod.isCompleted ? 0.7 : 1 }}>
                    <button onClick={() => toggleModule(mod.id)}
                      className="w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors"
                      style={{ background: mod.isCompleted ? 'var(--t-primary)' : 'transparent', borderColor: 'var(--t-primary)' }}>
                      {mod.isCompleted && <Check size={11} style={{ color: 'var(--t-bg)' }} strokeWidth={3} />}
                    </button>
                    <span className={`text-sm flex-1 ${mod.isCompleted ? 'line-through' : ''}`}
                      style={{ color: 'var(--t-text)', textDecorationColor: 'var(--t-primary)' }}>
                      {mod.title}
                    </span>
                    {mod.isCompleted && mod.completedAt && (
                      <span className="text-[10px]" style={{ color: 'var(--t-text-subtle)' }}>
                        {new Date(mod.completedAt).toLocaleDateString()}
                      </span>
                    )}
                  </motion.div>
                ))
              )}
            </div>

            {/* Add module */}
            <form onSubmit={addModule} className="flex gap-2">
              <input value={newModule} onChange={e => setNewModule(e.target.value)}
                placeholder="Add a new module or chapter…"
                className="flex-1 recessed rounded-xl px-4 py-2.5 text-sm border focus:outline-none theme-transition"
                style={{ color: 'var(--t-text)', borderColor: 'var(--t-border)' }}
                onFocus={e => e.target.style.borderColor = 'var(--t-border-focus)'}
                onBlur={e => e.target.style.borderColor = 'var(--t-border)'} />
              <Button type="submit" size="sm" disabled={addingModule || !newModule.trim()}>
                <Plus size={14} /> Add
              </Button>
            </form>
          </Card>
        </div>

        {/* Right — tasks */}
        <div className="space-y-5">
          <Card className="p-5">
            <h2 className="text-base font-bold mb-4" style={{ color: 'var(--t-text)' }}>
              Tasks ({tasks.filter(t => t.status !== 'done').length} active)
            </h2>

            <div className="space-y-2 mb-4 max-h-80 overflow-y-auto">
              {tasks.length === 0 ? (
                <p className="text-sm text-center py-4" style={{ color: 'var(--t-text-muted)' }}>No tasks yet</p>
              ) : (
                tasks.map(task => (
                  <div key={task.id} className="flex items-center gap-2 p-2.5 rounded-xl theme-transition"
                    style={{ background: task.status === 'done' ? 'var(--t-surface-low)' : 'var(--t-surface-high)', opacity: task.status === 'done' ? 0.6 : 1 }}>
                    <button onClick={() => toggleTask(task)}
                      className="w-4 h-4 rounded border-2 flex items-center justify-center shrink-0"
                      style={{ background: task.status === 'done' ? 'var(--t-primary)' : 'transparent', borderColor: 'var(--t-primary)' }}>
                      {task.status === 'done' && <Check size={9} style={{ color: 'var(--t-bg)' }} strokeWidth={3} />}
                    </button>
                    <span className={`text-xs flex-1 ${task.status === 'done' ? 'line-through' : ''}`}
                      style={{ color: 'var(--t-text)' }}>{task.text}</span>
                    <button onClick={() => deleteTask(task.id)}
                      className="p-1 rounded theme-transition shrink-0" style={{ color: 'var(--t-text-muted)' }}
                      onMouseEnter={e => e.currentTarget.style.color = 'var(--t-error)'}
                      onMouseLeave={e => e.currentTarget.style.color = 'var(--t-text-muted)'}>
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))
              )}
            </div>

            <form onSubmit={addTask} className="flex gap-2">
              <input value={newTask} onChange={e => setNewTask(e.target.value)}
                placeholder="Add a task…"
                className="flex-1 recessed rounded-xl px-3 py-2 text-sm border focus:outline-none theme-transition"
                style={{ color: 'var(--t-text)', borderColor: 'var(--t-border)' }}
                onFocus={e => e.target.style.borderColor = 'var(--t-border-focus)'}
                onBlur={e => e.target.style.borderColor = 'var(--t-border)'} />
              <Button type="submit" size="sm" disabled={addingTask || !newTask.trim()}>
                <Plus size={14} />
              </Button>
            </form>
          </Card>

          {/* Stats */}
          <Card glow className="p-5">
            <h3 className="text-sm font-bold mb-4" style={{ color: 'var(--t-primary)' }}>Quick Stats</h3>
            <div className="space-y-3">
              {[
                { label: 'Progress',    value: `${subject.progress ?? 0}%` },
                { label: 'Complexity',  value: `Level ${subject.complexity ?? 1}/5` },
                { label: 'Modules',     value: `${subject.modules?.filter(m => m.isCompleted).length ?? 0}/${subject.modules?.length ?? 0}` },
                { label: 'Open Tasks',  value: tasks.filter(t => t.status !== 'done').length },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between text-sm">
                  <span style={{ color: 'var(--t-text-muted)' }}>{label}</span>
                  <span className="font-bold" style={{ color: 'var(--t-text)' }}>{value}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
