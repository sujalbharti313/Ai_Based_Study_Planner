import { cn } from '../../utils/cn';

export function Skeleton({ className }) {
  return (
    <div
      className={cn('rounded-xl animate-pulse', className)}
      style={{ background: 'var(--t-surface-high)' }}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="glass-card p-5 rounded-2xl space-y-3">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-8 w-1/2" />
      <Skeleton className="h-2 w-full" />
    </div>
  );
}

export function PageError({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
        style={{ background: 'var(--t-error-soft)' }}
      >
        ⚠️
      </div>
      <p className="text-sm font-semibold" style={{ color: 'var(--t-text)' }}>
        {message || 'Something went wrong'}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-xs px-4 py-2 rounded-lg theme-transition"
          style={{ background: 'var(--t-primary-soft)', color: 'var(--t-primary)' }}
        >
          Try again
        </button>
      )}
    </div>
  );
}
