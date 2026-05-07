import { cn } from '../../utils/cn';

export default function Toggle({ checked, onChange, label, description }) {
  return (
    <div
      className="flex items-center justify-between p-3 rounded-xl theme-transition cursor-pointer"
      onMouseEnter={e => e.currentTarget.style.background = 'var(--t-nav-hover-bg)'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
    >
      <div className="flex flex-col gap-0.5">
        {label && (
          <p className="text-sm font-semibold" style={{ color: 'var(--t-text)' }}>
            {label}
          </p>
        )}
        {description && (
          <p className="text-xs" style={{ color: 'var(--t-text-muted)' }}>
            {description}
          </p>
        )}
      </div>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange?.(!checked)}
        className="relative w-12 h-6 rounded-full transition-colors duration-300 focus-visible:ring-2 focus-visible:outline-none shrink-0 ml-4"
        style={{
          background: checked ? 'var(--t-primary)' : 'var(--t-toggle-off)',
          border: '1px solid var(--t-border-strong)',
        }}
      >
        <span
          className={cn(
            'absolute top-[3px] left-[3px] w-[18px] h-[18px] rounded-full shadow-md transition-transform duration-300',
            checked ? 'translate-x-6' : 'translate-x-0'
          )}
          style={{ background: 'var(--t-toggle-thumb)' }}
        />
      </button>
    </div>
  );
}
