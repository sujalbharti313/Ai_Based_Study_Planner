'use strict';
const prisma = require('../database/prisma');

/**
 * Aggregated dashboard data — single DB round-trip using Promise.all.
 */
const getDashboardStats = async (userId) => {
  const [
    totalSubjects,
    newSubjectsThisWeek,
    activeTasks,
    priorityTasks,
    streak,
    recentActivity,
    upcomingDeadlines,
    settings,
  ] = await Promise.all([
    prisma.subject.count({ where: { userId, isArchived: false } }),

    prisma.subject.count({
      where: {
        userId,
        createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      },
    }),

    prisma.task.count({ where: { userId, status: { not: 'done' } } }),

    prisma.task.count({ where: { userId, status: { not: 'done' }, isPriority: true } }),

    prisma.studyStreak.findUnique({ where: { userId } }),

    prisma.activityLog.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),

    prisma.subject.findMany({
      where: {
        userId,
        isArchived: false,
        deadline: { gte: new Date() },
      },
      orderBy: { deadline: 'asc' },
      take: 3,
      select: { id: true, name: true, deadline: true, progress: true, priority: true, color: true, badgeColor: true },
    }),

    prisma.userSettings.findUnique({ where: { userId } }),
  ]);

  return {
    stats: {
      totalSubjects,
      newSubjectsThisWeek,
      activeTasks,
      priorityTasks,
      currentStreak: streak?.currentStreak ?? 0,
      aiPriorityScore: settings?.aiPriorityScore ?? 0,
    },
    recentActivity,
    upcomingDeadlines,
    studyInsights: {
      peakStudyDay:  settings?.peakStudyDay  ?? null,
      peakStudyHour: settings?.peakStudyHour ?? null,
    },
  };
};

module.exports = { getDashboardStats };
