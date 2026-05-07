'use strict';
const prisma = require('../database/prisma');
const { parsePagination, paginationMeta } = require('../utils/pagination');
const activityService = require('./activity.service');

const TASK_SELECT = {
  id: true, text: true, status: true, isPriority: true,
  dueDate: true, completedAt: true, createdAt: true, updatedAt: true,
  subject: { select: { id: true, name: true, color: true } },
};

const listTasks = async (userId, query) => {
  const { page, limit, skip } = parsePagination(query);
  const { status, subjectId, priority, search, sortBy = 'createdAt', order = 'desc' } = query;

  const where = {
    userId,
    ...(status    && { status }),
    ...(subjectId && { subjectId }),
    ...(priority === 'true' && { isPriority: true }),
    ...(search && { text: { contains: search, mode: 'insensitive' } }),
  };

  const [tasks, total] = await Promise.all([
    prisma.task.findMany({ where, select: TASK_SELECT, orderBy: { [sortBy]: order }, skip, take: limit }),
    prisma.task.count({ where }),
  ]);

  return { tasks, meta: paginationMeta(total, page, limit) };
};

const getTask = async (userId, taskId) => {
  const task = await prisma.task.findFirst({ where: { id: taskId, userId }, select: TASK_SELECT });
  if (!task) { const e = new Error('Task not found'); e.statusCode = 404; throw e; }
  return task;
};

const createTask = async (userId, data) => {
  return prisma.task.create({ data: { ...data, userId }, select: TASK_SELECT });
};

const updateTask = async (userId, taskId, data) => {
  await assertOwnership(userId, taskId);

  // Auto-set completedAt when marking done
  if (data.status === 'done') data.completedAt = new Date();
  if (data.status && data.status !== 'done') data.completedAt = null;

  const task = await prisma.task.update({ where: { id: taskId }, data, select: TASK_SELECT });

  // Log activity when task is completed
  if (data.status === 'done') {
    await activityService.log(userId, {
      type: 'task_completed',
      title: `Completed task: ${task.text}`,
      detail: task.subject?.name,
    });
  }

  return task;
};

const deleteTask = async (userId, taskId) => {
  await assertOwnership(userId, taskId);
  await prisma.task.delete({ where: { id: taskId } });
};

const assertOwnership = async (userId, taskId) => {
  const task = await prisma.task.findFirst({ where: { id: taskId, userId }, select: { id: true } });
  if (!task) { const e = new Error('Task not found'); e.statusCode = 404; throw e; }
};

module.exports = { listTasks, getTask, createTask, updateTask, deleteTask };
