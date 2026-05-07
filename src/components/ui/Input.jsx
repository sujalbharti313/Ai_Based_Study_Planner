import { cn } from '../../utils/cn';

export default function Input({ label, icon: Icon, className, style, ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          className="text-[11px] font-bold uppercase tracking-widest"
          style={{ color: 'var(--t-primary)' }}
        >
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <span
            className="absolute left-3.5 top-1/2 -translate-y-1/2"
            style={{ color: 'var(--t-text-muted)' }}
          >
            <Icon size={16} />
          </span>
        )}
        <input
          className={cn(
            'w-full recessed rounded-xl py-3 text-sm theme-transition',
            'border focus:outline-none',
            Icon ? 'pl-10 pr-4' : 'px-4',
            className
          )}
          style={{
            color: 'var(--t-text)',
            borderColor: 'var(--t-border)',
            ...style,
          }}
          onFocus={e => e.target.style.borderColor = 'var(--t-border-focus)'}
          onBlur={e => e.target.style.borderColor = 'var(--t-border)'}
          {...props}
        />
      </div>
    </div>
  );
}
