'use strict';
const prisma = require('../database/prisma');

const getProgressOverview = async (userId) => {
  const [subjects, streak, achievements, tasks] = await Promise.all([
    prisma.subject.findMany({
      where: { userId, isArchived: false },
      select: {
        id: true, name: true, color: true, progress: true,
        _count: { select: { modules: true } },
        modules: { where: { isCompleted: true }, select: { id: true } },
      },
    }),

    prisma.studyStreak.findUnique({ where: { userId } }),

    prisma.userAchievement.findMany({
      where: { userId },
      include: { achievement: true },
    }),

    prisma.task.findMany({
      where: { userId },
      select: { id: true, text: true, status: true, isPriority: true, dueDate: true, subject: { select: { name: true } } },
      orderBy: { dueDate: 'asc' },
      take: 20,
    }),
  ]);

  // Build streak chart (last 7 days)
  const streakChart = buildStreakChart(JSON.parse(streak?.dailyData ?? '[]'));

  return { subjects, streak, achievements, tasks, streakChart };
};

/**
 * Build a 7-element array of study minutes for the last 7 days.
 */
const buildStreakChart = (dailyData) => {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const entry = dailyData.find(x => x.date === key);
    days.push({ date: key, minutes: entry?.minutesStudied ?? 0 });
  }
  return days;
};

/**
 * Record a study session end — updates streak + daily data.
 */
const recordStudySession = async (userId, { subjectId, durationMin }) => {
  const today = new Date().toISOString().slice(0, 10);

  const streak = await prisma.studyStreak.findUnique({ where: { userId } });
  const dailyData = JSON.parse(streak?.dailyData ?? '[]');

  const todayEntry = dailyData.find(d => d.date === today);
  if (todayEntry) {
    todayEntry.minutesStudied = (todayEntry.minutesStudied || 0) + durationMin;
  } else {
    dailyData.push({ date: today, minutesStudied: durationMin });
  }

  // Keep only last 90 days
  const trimmed = dailyData.slice(-90);

  // Recalculate streak
  const lastDate = streak?.lastStudyDate ? new Date(streak.lastStudyDate).toISOString().slice(0, 10) : null;
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  let currentStreak = streak?.currentStreak ?? 0;

  if (lastDate === today) {
    // Already studied today — no change
  } else if (lastDate === yesterday) {
    currentStreak += 1;
  } else {
    currentStreak = 1; // streak broken
  }

  const longestStreak = Math.max(streak?.longestStreak ?? 0, currentStreak);

  await prisma.studyStreak.update({
    where: { userId },
    data: { currentStreak, longestStreak, lastStudyDate: new Date(), dailyData: JSON.stringify(trimmed) },
  });

  // Create session record
  return prisma.studySession.create({
    data: { userId, subjectId, durationMin, endedAt: new Date() },
  });
};

module.exports = { getProgressOverview, recordStudySession };
