import { cn } from '../../utils/cn';

/**
 * All variants use CSS var tokens so they adapt to light/dark automatically.
 * The `primary` variant uses a gradient that shifts between themes via --t-primary/--t-secondary.
 */
const variants = {
  primary:
    'text-white font-bold shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-95',
  secondary:
    'font-semibold border theme-transition',
  ghost:
    'font-medium theme-transition',
  danger:
    'font-semibold border theme-transition',
  outline:
    'font-semibold border theme-transition',
};

const sizes = {
  sm:   'px-3 py-1.5 text-xs rounded-lg',
  md:   'px-5 py-2.5 text-sm rounded-xl',
  lg:   'px-7 py-3.5 text-sm rounded-xl',
  icon: 'p-2.5 rounded-xl',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className,
  disabled,
  style,
  ...props
}) {
  const variantStyle = {
    primary: {
      background: 'linear-gradient(135deg, var(--t-primary), var(--t-secondary))',
    },
    secondary: {
      background: 'var(--t-surface-high)',
      color: 'var(--t-text)',
      borderColor: 'var(--t-border-strong)',
    },
    ghost: {
      background: 'transparent',
      color: 'var(--t-text-muted)',
    },
    danger: {
      background: 'var(--t-error-soft)',
      color: 'var(--t-error)',
      borderColor: 'var(--t-error)',
    },
    outline: {
      background: 'transparent',
      color: 'var(--t-text)',
      borderColor: 'var(--t-border-strong)',
    },
  }[variant] ?? {};

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 transition-all duration-200',
        'focus-visible:outline-none focus-visible:ring-2',
        'disabled:opacity-40 disabled:pointer-events-none',
        variants[variant],
        sizes[size],
        className
      )}
      style={{ ...variantStyle, ...style }}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
