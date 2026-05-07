import { cn } from '../../utils/cn';

export default function StatCard({ label, value, sub, subColor, icon: Icon, progress, glow = false }) {
  return (
    <div className={cn('relative overflow-hidden p-6 rounded-2xl group theme-transition', glow ? 'ai-glow-card' : 'glass-card')}>
      {/* Background icon */}
      {Icon && (
        <div className="absolute -right-3 -top-3 opacity-[0.06] group-hover:opacity-[0.1] transition-opacity pointer-events-none">
          <Icon size={80} strokeWidth={1} style={{ color: 'var(--t-primary)' }} />
        </div>
      )}

      <p
        className="text-[11px] font-bold uppercase tracking-widest mb-3"
        style={{ color: 'var(--t-text-muted)' }}
      >
        {label}
      </p>

      <div className="flex items-baseline gap-2 mb-3">
        <span
          className={cn('text-4xl font-bold', glow && 'text-glow')}
          style={{ color: 'var(--t-text)' }}
        >
          {value}
        </span>
        {sub && (
          <span className="text-xs font-bold" style={{ color: subColor ?? 'var(--t-primary)' }}>
            {sub}
          </span>
        )}
      </div>

      {progress !== undefined && (
        <div
          className="w-full h-1 rounded-full overflow-hidden"
          style={{ background: 'var(--t-surface-high)' }}
        >
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${progress}%`,
              background: glow
                ? 'linear-gradient(90deg, var(--t-primary), var(--t-secondary))'
                : 'var(--t-primary)',
              boxShadow: glow ? '0 0 8px var(--t-primary)' : 'none',
            }}
          />
        </div>
      )}
    </div>
  );
}
