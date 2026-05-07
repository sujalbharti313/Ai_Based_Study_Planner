import { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import SubjectCard from '../components/dashboard/SubjectCard';
import Button from '../components/ui/Button';
import { CardSkeleton, PageError } from '../components/ui/Skeleton';
import { useSubjects } from '../hooks/useSubjects';

export default function Subjects() {
  const [search,   setSearch]   = useState('');
  const [priority, setPriority] = useState('');

  const { subjects, setSubjects, meta, loading, error, refetch } = useSubjectsWithMutate({
    search:   search   || undefined,
    priority: priority || undefined,
  });

  if (error) return <PageError message={error} onRetry={refetch} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--t-text)' }}>Subjects</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--t-text-muted)' }}>
            {meta?.total ?? subjects.length} cognitive modules
          </p>
        </div>
        <Link to="/subjects/new">
          <Button size="md"><Plus size={16} /> Add Subject</Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2 recessed rounded-xl px-3 py-2 flex-1 border" style={{ borderColor: 'var(--t-border)' }}>
          <Search size={15} style={{ color: 'var(--t-text-muted)' }} />
          <input type="search" placeholder="Search subjects…" value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-transparent border-none outline-none text-sm w-full"
            style={{ color: 'var(--t-text)' }} />
        </div>
        <select value={priority} onChange={e => setPriority(e.target.value)}
          className="recessed rounded-xl px-3 py-2 text-sm border focus:outline-none theme-transition"
          style={{ color: 'var(--t-text)', borderColor: 'var(--t-border)', minWidth: '140px' }}>
          <option value="">All priorities</option>
          {['high','active','planning','low','done'].map(p => (
            <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3,4,5,6].map(i => <CardSkeleton key={i} />)}
        </div>
      ) : subjects.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-lg font-bold mb-2" style={{ color: 'var(--t-text)' }}>No subjects yet</p>
          <p className="text-sm mb-6" style={{ color: 'var(--t-text-muted)' }}>Add your first subject to get started</p>
          <Link to="/subjects/new"><Button size="md"><Plus size={16} /> Add Subject</Button></Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjects.map((s, i) => (
            <SubjectCard
              key={s.id}
              subject={s}
              index={i}
              onDelete={id => setSubjects(prev => prev.filter(x => x.id !== id))}
              onArchive={id => setSubjects(prev => prev.filter(x => x.id !== id))}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Extended hook that exposes setSubjects for optimistic updates
function useSubjectsWithMutate(params) {
  const [localSubjects, setLocalSubjects] = useState(null);
  const result = useSubjects(params);

  // Sync local state when API data arrives
  if (result.subjects && localSubjects === null && result.subjects.length >= 0) {
    // handled below via derived value
  }

  const subjects = localSubjects ?? result.subjects;

  return {
    ...result,
    subjects,
    setSubjects: (updater) => {
      setLocalSubjects(prev => {
        const current = prev ?? result.subjects;
        return typeof updater === 'function' ? updater(current) : updater;
      });
    },
  };
}
