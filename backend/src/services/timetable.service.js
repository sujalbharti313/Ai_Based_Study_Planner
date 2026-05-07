'use strict';
const prisma = require('../database/prisma');

const EVENT_SELECT = {
  id: true, title: true, topic: true, color: true, dayOfWeek: true,
  slotIndex: true, spanSlots: true, isHighlight: true, weekStart: true,
  createdAt: true, updatedAt: true,
  subject: { select: { id: true, name: true, color: true } },
};

/**
 * Get all events for a given week (weekStart = Monday ISO date string).
 */
const getWeekEvents = async (userId, weekStart) => {
  const start = new Date(weekStart);
  return prisma.timetableEvent.findMany({
    where: { userId, weekStart: start },
    select: EVENT_SELECT,
    orderBy: [{ dayOfWeek: 'asc' }, { slotIndex: 'asc' }],
  });
};

const createEvent = async (userId, data) => {
  return prisma.timetableEvent.create({
    data: { ...data, userId, weekStart: new Date(data.weekStart) },
    select: EVENT_SELECT,
  });
};

const updateEvent = async (userId, eventId, data) => {
  await assertOwnership(userId, eventId);
  if (data.weekStart) data.weekStart = new Date(data.weekStart);
  return prisma.timetableEvent.update({ where: { id: eventId }, data, select: EVENT_SELECT });
};

const deleteEvent = async (userId, eventId) => {
  await assertOwnership(userId, eventId);
  await prisma.timetableEvent.delete({ where: { id: eventId } });
};

/**
 * AI auto-schedule: returns a suggested arrangement of events.
 * In production this would call an AI service; here we return a
 * deterministic optimisation based on subject priority + deadline.
 */
const aiOptimize = async (userId, weekStart) => {
  const subjects = await prisma.subject.findMany({
    where: { userId, isArchived: false },
    orderBy: [{ priority: 'desc' }, { deadline: 'asc' }],
    take: 7,
  });

  const suggestions = subjects.map((s, i) => ({
    subjectId: s.id,
    title: s.name,
    topic: s.topic || 'Study session',
    color: s.badgeColor || 'primary',
    dayOfWeek: i % 7,
    slotIndex: Math.floor(i / 7),
    spanSlots: 1,
    weekStart,
  }));

  return suggestions;
};

const assertOwnership = async (userId, eventId) => {
  const ev = await prisma.timetableEvent.findFirst({ where: { id: eventId, userId }, select: { id: true } });
  if (!ev) { const e = new Error('Event not found'); e.statusCode = 404; throw e; }
};

module.exports = { getWeekEvents, createEvent, updateEvent, deleteEvent, aiOptimize };
