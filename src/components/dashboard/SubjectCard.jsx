import { Calendar, Cpu, Globe, FunctionSquare, Network, ShieldCheck, GitBranch, BookOpen, Trash2, Archive } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Badge from '../ui/Badge';
import ProgressBar from '../ui/ProgressBar';
import { motion } from 'framer-motion';
import { subjectsApi } from '../../lib/api';

const ICON_MAP = { FunctionSquare, Cpu, Globe, Network, ShieldCheck, GitBranch, BookOpen };

const BORDER_COLOR = {
  primary:   'var(--t-primary)',
  secondary: 'var(--t-secondary)',
  tertiary:  'var(--t-tertiary)',
  red:       'var(--t-error)',
};

const daysLeft = (deadline) => {
  if (!deadline) return null;
  const diff = new Date(deadline).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / 86400000));
};

export default function SubjectCard({ subject, index, onDelete, onArchive }) {
  const navigate = useNavigate();
  const Icon = ICON_MAP[subject.icon] ?? BookOpen;
  const borderColor = BORDER_COLOR[subject.badgeColor] ?? 'var(--t-primary)';
  const days = daysLeft(subject.deadline);

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!confirm(`Delete "${subject.name}"? This cannot be undone.`)) return;
    try {
      await subjectsApi.delete(subject.id);
      onDelete?.(subject.id);
    } catch { alert('Failed to delete subject'); }
  };

  const handleArchive = async (e) => {
    e.stopPropagation();
    try {
      await subjectsApi.archive(subject.id);
      onArchive?.(subject.id);
    } catch { alert('Failed to archive subject'); }
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.35 }}
      onClick={() => navigate(`/subjects/${subject.id}`)}
      className="glass-card p-5 rounded-2xl hover:-translate-y-1 transition-all duration-200 cursor-pointer group theme-transition relative"
      style={{ borderTop: `2px solid ${borderColor}40` }}
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && navigate(`/subjects/${subject.id}`)}
      aria-label={`Subject: ${subject.name}`}
    >
      {/* Action buttons — appear on hover */}
      <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <button onClick={handleArchive} title="Archive"
          className="p-1.5 rounded-lg theme-transition"
          style={{ color: 'var(--t-text-muted)', background: 'var(--t-surface-high)' }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--t-tertiary)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--t-text-muted)'}>
          <Archive size={13} />
        </button>
        <button onClick={handleDelete} title="Delete"
          className="p-1.5 rounded-lg theme-transition"
          style={{ color: 'var(--t-text-muted)', background: 'var(--t-surface-high)' }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--t-error)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--t-text-muted)'}>
          <Trash2 size={13} />
        </button>
      </div>

      <div className="flex justify-between items-start mb-4">
        <div className="p-2.5 rounded-xl theme-transition"
          style={{ background: 'var(--t-surface-high)' }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--t-primary-soft)'}
          onMouseLeave={e => e.currentTarget.style.background = 'var(--t-surface-high)'}>
          <Icon size={20} strokeWidth={1.8} style={{ color: 'var(--t-primary)' }} />
        </div>
        <Badge variant={subject.badgeColor}>
          {subject.badge ?? subject.priority}
        </Badge>
      </div>

      <h4 className="text-base font-bold mb-1 pr-12" style={{ color: 'var(--t-text)' }}>
        {subject.name}
      </h4>
      <p className="text-xs mb-5 leading-relaxed line-clamp-2" style={{ color: 'var(--t-text-muted)' }}>
        {subject.topic ?? 'No topic set'}
      </p>

      <div className="space-y-2">
        <ProgressBar value={subject.progress ?? 0} showLabel />
        {days !== null && (
          <div className="flex items-center gap-1.5 text-xs" style={{ color: days <= 3 ? 'var(--t-error)' : 'var(--t-text-muted)' }}>
            <Calendar size={12} />
            <span>{days === 0 ? 'Due today' : `${days} day${days !== 1 ? 's' : ''} left`}</span>
          </div>
        )}
      </div>
    </motion.article>
  );
}
