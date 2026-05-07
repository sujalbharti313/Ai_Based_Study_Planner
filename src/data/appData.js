// ─────────────────────────────────────────────
//  Static seed data — replace with API calls
// ─────────────────────────────────────────────

export const USER = {
  name: 'Alex Rivers',
  role: 'Pro Member',
  level: 42,
  title: 'Architect',
  email: 'architect@midnight-elegance.ai',
  avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=AlexRivers&backgroundColor=1d2027',
  storageUsed: 7.2,
  storageTotal: 10,
};

export const NAV_ITEMS = [
  { id: 'dashboard',  label: 'Dashboard',  icon: 'LayoutDashboard', path: '/' },
  { id: 'timetable',  label: 'Timetable',  icon: 'CalendarDays',    path: '/timetable' },
  { id: 'subjects',   label: 'Subjects',   icon: 'BookOpen',        path: '/subjects' },
  { id: 'progress',   label: 'Progress',   icon: 'BarChart3',       path: '/progress' },
  { id: 'ai-lab',     label: 'AI Lab',     icon: 'Brain',           path: '/ai-lab' },
  { id: 'settings',   label: 'Settings',   icon: 'Settings',        path: '/settings' },
];

export const SUBJECTS = [
  {
    id: 1,
    name: 'Advanced Calculus',
    topic: 'Unit 4: Multi-variable Integration & Stokes\' Theorem',
    icon: 'FunctionSquare',
    priority: 'high',
    daysLeft: 3,
    progress: 45,
    color: '#ef4444',
    badge: 'High Priority',
    badgeColor: 'red',
  },
  {
    id: 2,
    name: 'Computer Architecture',
    topic: 'MIPS Instruction Sets & Memory Hierarchy',
    icon: 'Cpu',
    priority: 'active',
    daysLeft: 12,
    progress: 64,
    color: '#adc6ff',
    badge: 'Active',
    badgeColor: 'primary',
  },
  {
    id: 3,
    name: 'Modern Sociology',
    topic: 'Urbanization & Social Dynamics in the 21st Century',
    icon: 'Globe',
    priority: 'planning',
    daysLeft: 21,
    progress: 25,
    color: '#d0bcff',
    badge: 'Planning',
    badgeColor: 'secondary',
  },
  {
    id: 4,
    name: 'Neural Networks',
    topic: 'Backpropagation & Gradient Descent',
    icon: 'Network',
    priority: 'active',
    daysLeft: 8,
    progress: 62,
    color: '#adc6ff',
    badge: 'Active',
    badgeColor: 'primary',
  },
  {
    id: 5,
    name: 'Data Ethics',
    topic: 'Surveillance, Privacy & Algorithmic Bias',
    icon: 'ShieldCheck',
    priority: 'done',
    daysLeft: 30,
    progress: 91,
    color: '#ffb786',
    badge: 'Near Done',
    badgeColor: 'tertiary',
  },
  {
    id: 6,
    name: 'Advanced Algorithms',
    topic: 'Graph Theory & Dynamic Programming',
    icon: 'GitBranch',
    priority: 'active',
    daysLeft: 15,
    progress: 84,
    color: '#adc6ff',
    badge: 'Active',
    badgeColor: 'primary',
  },
];

export const RECENT_ACTIVITY = [
  {
    id: 1,
    icon: 'CheckCircle',
    iconColor: '#22c55e',
    bgColor: 'rgba(34,197,94,0.12)',
    text: 'Completed',
    highlight: 'Unit 3 Quiz',
    suffix: 'for Neural Networks',
    meta: '2 hours ago • Score: 95%',
  },
  {
    id: 2,
    icon: 'FileEdit',
    iconColor: '#adc6ff',
    bgColor: 'rgba(173,198,255,0.12)',
    text: 'Annotated',
    highlight: 'PDF Lecture Notes',
    suffix: '',
    meta: 'Yesterday • 14 pages added',
  },
  {
    id: 3,
    icon: 'MessageSquare',
    iconColor: '#d0bcff',
    bgColor: 'rgba(208,188,255,0.12)',
    text: 'AI Tutor explained',
    highlight: 'Quantum Entanglement',
    suffix: '',
    meta: 'Yesterday • 12 min conversation',
  },
  {
    id: 4,
    icon: 'BookMarked',
    iconColor: '#ffb786',
    bgColor: 'rgba(255,183,134,0.12)',
    text: 'Started reading',
    highlight: 'Chapter 5',
    suffix: 'in Advanced Calculus',
    meta: '2 days ago',
  },
];

export const TIMETABLE_EVENTS = [
  { id: 1, day: 0, slot: 0, subject: 'Deep Learning',      topic: 'Neural Nets Architecture',  color: 'primary',   span: 1 },
  { id: 2, day: 0, slot: 3, subject: 'Architecture',       topic: 'System Design',              color: 'tertiary',  span: 1 },
  { id: 3, day: 1, slot: 1, subject: 'Data Structures',    topic: 'B-Trees & Optimization',     color: 'secondary', span: 2 },
  { id: 4, day: 2, slot: 1, subject: 'AI Engine',          topic: 'LLM Fine-tuning Workshop',   color: 'primary',   span: 2, highlight: true },
  { id: 5, day: 3, slot: 2, subject: 'Deep Learning',      topic: 'Backpropagation',            color: 'primary',   span: 1 },
  { id: 6, day: 4, slot: 4, subject: 'Project Deadline',   topic: 'Final Submission Prep',      color: 'error',     span: 1 },
];

export const PROGRESS_SUBJECTS = [
  { id: 1, name: 'Advanced Algorithms', modules: 12, total: 15, percent: 84, color: '#adc6ff' },
  { id: 2, name: 'Neural Networks',     modules: 8,  total: 13, percent: 62, color: '#d0bcff' },
  { id: 3, name: 'Data Ethics',         modules: 21, total: 23, percent: 91, color: '#ffb786' },
];

export const STREAK_DATA = [40, 60, 45, 80, 95, 100, 30];
export const STREAK_DAYS  = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export const TASKS = [
  { id: 1, text: "Implement Dijkstra's in Python",  subject: 'Advanced Algorithms', due: 'Due Today',          done: false },
  { id: 2, text: 'Review Backpropagation Notes',    subject: 'Neural Networks',     due: 'Completed',          done: true  },
  { id: 3, text: 'Quiz: Ethics in Surveillance',    subject: 'Data Ethics',         due: '2 days remaining',   done: false },
  { id: 4, text: 'Read Chapter 6 — Graph Theory',  subject: 'Advanced Algorithms', due: '3 days remaining',   done: false },
];

export const ACHIEVEMENTS = [
  { id: 1, icon: 'Trophy',      label: '100 Study Hours', unlocked: true,  gradient: 'from-primary to-secondary' },
  { id: 2, icon: 'Flame',       label: 'Perfect Week',    unlocked: true,  gradient: 'from-tertiary to-error' },
  { id: 3, icon: 'Brain',       label: 'Deep Diver',      unlocked: false, gradient: '' },
  { id: 4, icon: 'BookOpen',    label: 'Chapter 1 Done',  unlocked: true,  gradient: 'from-primary-container to-primary' },
  { id: 5, icon: 'Users',       label: 'Peer Mentor',     unlocked: false, gradient: '' },
  { id: 6, icon: 'Zap',         label: 'Blitz Finisher',  unlocked: true,  gradient: 'from-secondary to-secondary-container' },
];

export const INTEGRATIONS = [
  { id: 1, icon: 'CalendarDays', iconColor: 'text-primary',   name: 'Google Calendar', status: 'Active — Last synced 2m ago', connected: true  },
  { id: 2, icon: 'Cloud',        iconColor: 'text-secondary', name: 'Notion Database', status: 'Sync your lecture notes and tasks', connected: false },
  { id: 3, icon: 'Terminal',     iconColor: 'text-tertiary',  name: 'GitHub Repository', status: 'Track coding session progress', connected: false },
];
