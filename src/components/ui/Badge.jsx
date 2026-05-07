import { cn } from '../../utils/cn';

const VARIANT_STYLES = {
  primary:   { background: 'var(--t-primary-soft)',   color: 'var(--t-primary)',   border: '1px solid var(--t-primary-border)' },
  secondary: { background: 'var(--t-secondary-soft)', color: 'var(--t-secondary)', border: '1px solid rgba(124,58,237,0.25)' },
  tertiary:  { background: 'var(--t-tertiary-soft)',  color: 'var(--t-tertiary)',  border: '1px solid rgba(234,88,12,0.25)' },
  red:       { background: 'var(--t-error-soft)',     color: 'var(--t-error)',     border: '1px solid rgba(220,38,38,0.25)' },
  green:     { background: 'var(--t-success-soft)',   color: 'var(--t-success)',   border: '1px solid rgba(5,150,105,0.25)' },
  outline:   { background: 'transparent',             color: 'var(--t-text-muted)',border: '1px solid var(--t-border-strong)' },
};

export default function Badge({ children, variant = 'primary', className }) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest theme-transition',
        className
      )}
      style={VARIANT_STYLES[variant] ?? VARIANT_STYLES.primary}
    >
      {children}
    </span>
  );
}
