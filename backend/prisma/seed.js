'use strict';
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Seed achievements
  const achievements = [
    { key: '100_study_hours',  label: '100 Study Hours', description: 'Study for a total of 100 hours', icon: 'Trophy',   threshold: 100 },
    { key: 'perfect_week',     label: 'Perfect Week',    description: 'Study every day for 7 days',     icon: 'Flame',    threshold: 7   },
    { key: 'deep_diver',       label: 'Deep Diver',      description: 'Complete a 3-hour study session', icon: 'Brain',   threshold: 180 },
    { key: 'chapter_1_done',   label: 'Chapter 1 Done',  description: 'Complete your first module',      icon: 'BookOpen',threshold: 1   },
    { key: 'peer_mentor',      label: 'Peer Mentor',     description: 'Share 5 study sessions',          icon: 'Users',   threshold: 5   },
    { key: 'blitz_finisher',   label: 'Blitz Finisher',  description: 'Complete 10 tasks in one day',    icon: 'Zap',     threshold: 10  },
  ];

  for (const a of achievements) {
    await prisma.achievement.upsert({ where: { key: a.key }, update: {}, create: a });
  }

  // Seed demo user
  const passwordHash = await bcrypt.hash('Demo1234!', 12);
  const user = await prisma.user.upsert({
    where: { email: 'demo@midnight-ai.app' },
    update: {},
    create: {
      name: 'Alex Rivers',
      email: 'demo@midnight-ai.app',
      passwordHash,
      designation: 'Level 42 Architect',
      isEmailVerified: true,
      role: 'USER',
      settings: { create: { theme: 'dark', aiPriorityScore: 98, peakStudyDay: 'Tuesday', peakStudyHour: 21 } },
      studyStreak: { create: { currentStreak: 14, longestStreak: 21 } },
    },
  });

  // Seed subjects
  const subjectData = [
    { name: 'Advanced Calculus',     topic: "Unit 4: Multi-variable Integration & Stokes' Theorem", priority: 'high',     complexity: 5, progress: 45, color: '#ef4444', badgeColor: 'red',       deadline: new Date(Date.now() + 3 * 86400000) },
    { name: 'Computer Architecture', topic: 'MIPS Instruction Sets & Memory Hierarchy',              priority: 'active',   complexity: 4, progress: 64, color: '#adc6ff', badgeColor: 'primary',   deadline: new Date(Date.now() + 12 * 86400000) },
    { name: 'Modern Sociology',      topic: 'Urbanization & Social Dynamics in the 21st Century',   priority: 'planning', complexity: 2, progress: 25, color: '#d0bcff', badgeColor: 'secondary', deadline: new Date(Date.now() + 21 * 86400000) },
    { name: 'Neural Networks',       topic: 'Backpropagation & Gradient Descent',                   priority: 'active',   complexity: 4, progress: 62, color: '#adc6ff', badgeColor: 'primary',   deadline: new Date(Date.now() + 8 * 86400000) },
    { name: 'Data Ethics',           topic: 'Surveillance, Privacy & Algorithmic Bias',             priority: 'done',     complexity: 2, progress: 91, color: '#ffb786', badgeColor: 'tertiary',  deadline: new Date(Date.now() + 30 * 86400000) },
    { name: 'Advanced Algorithms',   topic: 'Graph Theory & Dynamic Programming',                   priority: 'active',   complexity: 5, progress: 84, color: '#adc6ff', badgeColor: 'primary',   deadline: new Date(Date.now() + 15 * 86400000) },
  ];

  for (const s of subjectData) {
    await prisma.subject.upsert({
      where: { id: `seed-${s.name.replace(/\s/g, '-').toLowerCase()}` },
      update: {},
      create: { id: `seed-${s.name.replace(/\s/g, '-').toLowerCase()}`, userId: user.id, ...s },
    });
  }

  // Seed tasks
  const subjects = await prisma.subject.findMany({ where: { userId: user.id }, select: { id: true, name: true } });
  const findSubject = (name) => subjects.find(s => s.name.includes(name))?.id;

  const tasks = [
    { text: "Implement Dijkstra's in Python", subjectId: findSubject('Algorithm'), isPriority: true,  dueDate: new Date() },
    { text: 'Review Backpropagation Notes',   subjectId: findSubject('Neural'),    isPriority: false, status: 'done', completedAt: new Date() },
    { text: 'Quiz: Ethics in Surveillance',   subjectId: findSubject('Ethics'),    isPriority: false, dueDate: new Date(Date.now() + 2 * 86400000) },
    { text: 'Read Chapter 6 — Graph Theory',  subjectId: findSubject('Algorithm'), isPriority: false, dueDate: new Date(Date.now() + 3 * 86400000) },
  ];

  for (const t of tasks) {
    await prisma.task.create({ data: { userId: user.id, ...t } }).catch(() => {});
  }

  console.log('✅ Seed complete. Demo user: demo@midnight-ai.app / Demo1234!');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
