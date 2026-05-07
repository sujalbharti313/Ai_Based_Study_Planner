import { BookOpen, CheckSquare, Zap, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import StatCard from '../components/dashboard/StatCard';
import AISuggestionBanner from '../components/dashboard/AISuggestionBanner';
import SubjectCard from '../components/dashboard/SubjectCard';
import ActivityFeed from '../components/dashboard/ActivityFeed';
import StudyInsights from '../components/dashboard/StudyInsights';
import { CardSkeleton, PageError } from '../components/ui/Skeleton';
import { useDashboard } from '../hooks/useDashboard';
import { useAuth } from '../contexts/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const { data, loading, error, refetch } = useDashboard();

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  if (error) return <PageError message={error} onRetry={refetch} />;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--t-text)' }}>Dashboard</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--t-text-muted)' }}>
          {greeting}{user?.name ? `, ${user.name.split(' ')[0]}` : ''} — here's your study overview.
        </p>
      </div>

      {/* Stat cards */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1,2,3].map(i => <CardSkeleton key={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            label="Total Subjects"
            value={data?.stats?.totalSubjects ?? 0}
            sub={data?.stats?.newSubjectsThisWeek > 0 ? `+${data.stats.newSubjectsThisWeek} New` : null}
            icon={BookOpen}
            progress={Math.min(100, (data?.stats?.totalSubjects ?? 0) * 12)}
          />
          <StatCard
            label="Active Tasks"
            value={data?.stats?.activeTasks ?? 0}
            sub={data?.stats?.priorityTasks > 0 ? `${data.stats.priorityTasks} Priority` : null}
            subColor="var(--t-tertiary)"
            icon={CheckSquare}
            progress={50}
          />
          <StatCard
            label="AI Priority Score"
            value={`${data?.stats?.aiPriorityScore ?? 0}%`}
            sub="Peak Focus"
            icon={Zap}
            progress={data?.stats?.aiPriorityScore ?? 0}
            glow
          />
        </div>
      )}

      <AISuggestionBanner upcomingDeadlines={data?.upcomingDeadlines} />

      {/* Subjects */}
      <section aria-label="Active Subjects">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold" style={{ color: 'var(--t-text)' }}>Active Subjects</h2>
          <Link to="/subjects" className="flex items-center gap-1 text-sm font-bold hover:underline" style={{ color: 'var(--t-primary)' }}>
            View All <ArrowRight size={14} />
          </Link>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1,2,3].map(i => <CardSkeleton key={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {(data?.upcomingDeadlines ?? []).slice(0, 3).map((s, i) => (
              <SubjectCard key={s.id} subject={s} index={i} />
            ))}
          </div>
        )}
      </section>

      {/* Bottom grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ActivityFeed activities={data?.recentActivity} loading={loading} />
        </div>
        <StudyInsights insights={data?.studyInsights} score={data?.stats?.aiPriorityScore} />
      </div>
    </div>
  );
}
