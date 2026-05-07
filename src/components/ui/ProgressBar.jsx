import { cn } from '../../utils/cn';

export default function ProgressBar({ value = 0, className, showLabel = false }) {
  const pct = Math.min(100, Math.max(0, value));
  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between text-xs mb-1" style={{ color: 'var(--t-text-muted)' }}>
          <span>Progress</span>
          <span className="font-bold" style={{ color: 'var(--t-primary)' }}>{pct}%</span>
        </div>
      )}
      <div
        className="w-full h-1.5 rounded-full overflow-hidden"
        style={{ background: 'var(--t-surface-high)' }}
      >
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${pct}%`,
            background: 'linear-gradient(90deg, var(--t-primary), var(--t-secondary))',
          }}
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
}
