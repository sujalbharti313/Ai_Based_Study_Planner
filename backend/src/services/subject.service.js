'use strict';
const prisma = require('../database/prisma');
const { parsePagination, paginationMeta } = require('../utils/pagination');

const SUBJECT_SELECT = {
  id: true, name: true, topic: true, icon: true, color: true,
  badgeColor: true, priority: true, complexity: true, progress: true,
  deadline: true, context: true, isArchived: true, createdAt: true, updatedAt: true,
  _count: { select: { tasks: true, modules: true } },
};

/**
 * List subjects for a user with filtering, sorting, pagination.
 */
const listSubjects = async (userId, query) => {
  const { page, limit, skip } = parsePagination(query);
  const { priority, search, archived, sortBy = 'createdAt', order = 'desc' } = query;

  const where = {
    userId,
    isArchived: archived === 'true',
    ...(priority && { priority }),
    ...(search && {
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { topic: { contains: search, mode: 'insensitive' } },
      ],
    }),
  };

  const [subjects, total] = await Promise.all([
    prisma.subject.findMany({
      where, select: SUBJECT_SELECT,
      orderBy: { [sortBy]: order },
      skip, take: limit,
    }),
    prisma.subject.count({ where }),
  ]);

  return { subjects, meta: paginationMeta(total, page, limit) };
};

const getSubject = async (userId, subjectId) => {
  const subject = await prisma.subject.findFirst({
    where: { id: subjectId, userId },
    include: {
      modules: { orderBy: { order: 'asc' } },
      tasks: { where: { status: { not: 'done' } }, orderBy: { dueDate: 'asc' }, take: 5 },
    },
  });
  if (!subject) { const e = new Error('Subject not found'); e.statusCode = 404; throw e; }
  return subject;
};

const createSubject = async (userId, data) => {
  return prisma.subject.create({
    data: { ...data, userId },
    select: SUBJECT_SELECT,
  });
};

const updateSubject = async (userId, subjectId, data) => {
  await assertOwnership(userId, subjectId);
  return prisma.subject.update({
    where: { id: subjectId },
    data,
    select: SUBJECT_SELECT,
  });
};

const deleteSubject = async (userId, subjectId) => {
  await assertOwnership(userId, subjectId);
  await prisma.subject.delete({ where: { id: subjectId } });
};

const archiveSubject = async (userId, subjectId) => {
  await assertOwnership(userId, subjectId);
  return prisma.subject.update({
    where: { id: subjectId },
    data: { isArchived: true },
    select: SUBJECT_SELECT,
  });
};

// ── Modules ──────────────────────────────────────

const listModules = async (userId, subjectId) => {
  await assertOwnership(userId, subjectId);
  return prisma.subjectModule.findMany({
    where: { subjectId },
    orderBy: { order: 'asc' },
  });
};

const createModule = async (userId, subjectId, data) => {
  await assertOwnership(userId, subjectId);
  const count = await prisma.subjectModule.count({ where: { subjectId } });
  const module = await prisma.subjectModule.create({
    data: { ...data, subjectId, order: count },
  });
  await recalcProgress(subjectId);
  return module;
};

const toggleModule = async (userId, subjectId, moduleId) => {
  await assertOwnership(userId, subjectId);
  const mod = await prisma.subjectModule.findFirst({ where: { id: moduleId, subjectId } });
  if (!mod) { const e = new Error('Module not found'); e.statusCode = 404; throw e; }

  const updated = await prisma.subjectModule.update({
    where: { id: moduleId },
    data: {
      isCompleted: !mod.isCompleted,
      completedAt: !mod.isCompleted ? new Date() : null,
    },
  });
  await recalcProgress(subjectId);
  return updated;
};

// ── Helpers ───────────────────────────────────────

const assertOwnership = async (userId, subjectId) => {
  const subject = await prisma.subject.findFirst({ where: { id: subjectId, userId }, select: { id: true } });
  if (!subject) { const e = new Error('Subject not found'); e.statusCode = 404; throw e; }
};

const recalcProgress = async (subjectId) => {
  const [total, completed] = await Promise.all([
    prisma.subjectModule.count({ where: { subjectId } }),
    prisma.subjectModule.count({ where: { subjectId, isCompleted: true } }),
  ]);
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
  await prisma.subject.update({ where: { id: subjectId }, data: { progress } });
};

module.exports = {
  listSubjects, getSubject, createSubject, updateSubject, deleteSubject, archiveSubject,
  listModules, createModule, toggleModule,
};
