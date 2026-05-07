import { Brain, Play, X } from 'lucide-react';
import { useState } from 'react';
import Button from '../ui/Button';
import { motion, AnimatePresence } from 'framer-motion';

const daysUntil = (dateStr) => {
  const diff = new Date(dateStr).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / 86400000));
};

export default function AISuggestionBanner({ upcomingDeadlines }) {
  const [visible, setVisible] = useState(true);

  // Pick the most urgent deadline
  const urgent = upcomingDeadlines?.length > 0 ? upcomingDeadlines[0] : null;
  const days   = urgent ? daysUntil(urgent.deadline) : null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.section
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10, height: 0 }}
          transition={{ duration: 0.3 }}
          className="ai-glow-card p-6 rounded-2xl relative overflow-hidden"
          aria-label="AI Study Suggestion"
        >
          {/* Decorative ring */}
          <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none" aria-hidden="true">
            <div className="w-28 h-28 rounded-full border-4 border-dashed animate-spin-slow"
              style={{ borderColor: 'var(--t-primary)' }} />
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 relative z-10">
            <div className="flex gap-4 items-start sm:items-center">
              <div className="p-3 rounded-xl shrink-0"
                style={{ background: 'var(--t-primary-soft)', border: '1px solid var(--t-primary-border)' }}>
                <Brain size={28} style={{ color: 'var(--t-primary)' }} />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-base font-bold" style={{ color: 'var(--t-text)' }}>AI Recommendation</h3>
                  <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--t-primary)' }} aria-hidden="true" />
                </div>
                <p className="text-sm max-w-lg leading-relaxed" style={{ color: 'var(--t-text-muted)' }}>
                  {urgent ? (
                    <>
                      Your upcoming{' '}
                      <span className="font-semibold" style={{ color: 'var(--t-primary)' }}>{urgent.name}</span>{' '}
                      deadline is in{' '}
                      <span className="font-semibold" style={{ color: days <= 3 ? 'var(--t-error)' : 'var(--t-primary)' }}>
                        {days} day{days !== 1 ? 's' : ''}
                      </span>
                      {urgent.progress < 80
                        ? `. At ${urgent.progress}% progress, I recommend a focused study session now.`
                        : `. You're at ${urgent.progress}% — great work, keep the momentum!`}
                    </>
                  ) : (
                    <>
                      No urgent deadlines right now.{' '}
                      <span className="font-semibold" style={{ color: 'var(--t-primary)' }}>
                        Great time to get ahead
                      </span>{' '}
                      — add subjects and build your study schedule.
                    </>
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Button size="md">
                <Play size={15} /> Start Session
              </Button>
              <button
                onClick={() => setVisible(false)}
                className="p-2 rounded-xl theme-transition"
                style={{ color: 'var(--t-text-muted)' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--t-nav-hover-bg)'; e.currentTarget.style.color = 'var(--t-text)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--t-text-muted)'; }}
                aria-label="Dismiss suggestion"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  );
}
