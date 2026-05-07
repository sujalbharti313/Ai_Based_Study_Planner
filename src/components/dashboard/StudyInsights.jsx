import { Card } from '../ui/Card';
import Button from '../ui/Button';

export default function StudyInsights({ insights, score }) {
  return (
    <Card className="p-6 flex flex-col gap-5">
      <h2 className="text-lg font-bold" style={{ color: 'var(--t-text)' }}>Study Insights</h2>

      {/* Peak time */}
      <div className="flex items-center gap-4">
        <div
          className="w-11 h-11 rounded-full border-[3px] border-t-transparent animate-spin-slow shrink-0"
          style={{ borderColor: 'var(--t-primary)', borderTopColor: 'transparent' }}
          aria-hidden="true"
        />
        <div>
          <p className="text-sm font-bold" style={{ color: 'var(--t-text)' }}>Deep Work Peak</p>
          <p className="text-xs" style={{ color: 'var(--t-text-muted)' }}>
            {insights?.peakStudyDay
              ? `${insights.peakStudyDay}s at ${insights.peakStudyHour}:00`
              : 'Not enough data yet'}
          </p>
        </div>
      </div>

      {/* AI score */}
      <div className="p-4 rounded-xl theme-transition" style={{ background: 'var(--t-primary-soft)', border: '1px solid var(--t-primary-border)' }}>
        <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--t-primary)' }}>
          AI Priority Score
        </p>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-glow" style={{ color: 'var(--t-text)' }}>
            {score ?? 0}%
          </span>
          <span className="text-xs font-bold" style={{ color: 'var(--t-primary)' }}>
            {(score ?? 0) >= 80 ? 'Peak Focus' : (score ?? 0) >= 50 ? 'On Track' : 'Getting Started'}
          </span>
        </div>
      </div>

      <Button variant="secondary" size="sm" className="w-full justify-center">
        Full Performance Report
      </Button>
    </Card>
  );
}
