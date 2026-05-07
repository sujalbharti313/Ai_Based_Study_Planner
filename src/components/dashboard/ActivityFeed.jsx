import { CheckCircle, FileEdit, MessageSquare, BookMarked, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { Skeleton } from '../ui/Skeleton';

const TYPE_ICON = {
  quiz_completed:      { Icon: CheckCircle,   color: '#22c55e', bg: 'rgba(34,197,94,0.12)' },
  notes_annotated:     { Icon: FileEdit,      color: '#adc6ff', bg: 'rgba(173,198,255,0.12)' },
  ai_session:          { Icon: MessageSquare, color: '#d0bcff', bg: 'rgba(208,188,255,0.12)' },
  chapter_started:     { Icon: BookMarked,    color: '#ffb786', bg: 'rgba(255,183,134,0.12)' },
  subject_created:     { Icon: BookMarked,    color: '#adc6ff', bg: 'rgba(173,198,255,0.12)' },
  task_completed:      { Icon: CheckCircle,   color: '#22c55e', bg: 'rgba(34,197,94,0.12)' },
  streak_milestone:    { Icon: CheckCircle,   color: '#ffb786', bg: 'rgba(255,183,134,0.12)' },
  achievement_unlocked:{ Icon: CheckCircle,   color: '#d0bcff', bg: 'rgba(208,188,255,0.12)' },
};

const timeAgo = (dateStr) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60)  return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)   return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
};

export default function ActivityFeed({ activities, loading }) {
  return (
    <section aria-label="Recent Activity">
      <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--t-text)' }}>Recent Activity</h2>

      {loading ? (
        <div className="space-y-2">
          {[1,2,3].map(i => <Skeleton key={i} className="h-16 w-full" />)}
        </div>
      ) : !activities?.length ? (
        <p className="text-sm py-8 text-center" style={{ color: 'var(--t-text-muted)' }}>
          No activity yet — start studying!
        </p>
      ) : (
        <div className="space-y-2">
          {activities.map((item, i) => {
            const { Icon, color, bg } = TYPE_ICON[item.type] ?? { Icon: Clock, color: '#adc6ff', bg: 'rgba(173,198,255,0.12)' };
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className="flex gap-3 p-4 rounded-xl theme-transition cursor-default"
                style={{ background: 'var(--t-surface-low)' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--t-surface-mid)'}
                onMouseLeave={e => e.currentTarget.style.background = 'var(--t-surface-low)'}
              >
                <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: bg }}>
                  <Icon size={16} style={{ color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm" style={{ color: 'var(--t-text)' }}>{item.title}</p>
                  {item.detail && (
                    <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--t-text-muted)' }}>{item.detail}</p>
                  )}
                </div>
                <span className="text-xs shrink-0 mt-0.5" style={{ color: 'var(--t-text-subtle)' }}>
                  {timeAgo(item.createdAt)}
                </span>
              </motion.div>
            );
          })}
        </div>
      )}
    </section>
  );
}
