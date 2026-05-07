import { cn } from '../../utils/cn';

export function Card({ children, className, glow = false, style, ...props }) {
  return (
    <div
      className={cn(glow ? 'ai-glow-card' : 'glass-card', 'rounded-2xl theme-transition', className)}
      style={style}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className }) {
  return (
    <div className={cn('flex items-center justify-between mb-4', className)}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className }) {
  return (
    <h3 className={cn('text-lg font-bold', className)} style={{ color: 'var(--t-text)' }}>
      {children}
    </h3>
  );
}

export function CardContent({ children, className }) {
  return <div className={cn('', className)}>{children}</div>;
}
