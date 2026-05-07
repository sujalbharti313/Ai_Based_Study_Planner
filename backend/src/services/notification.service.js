'use strict';
const prisma = require('../database/prisma');
const { parsePagination, paginationMeta } = require('../utils/pagination');

const listNotifications = async (userId, query) => {
  const { page, limit, skip } = parsePagination(query);
  const { unread } = query;

  const where = { userId, ...(unread === 'true' && { isRead: false }) };

  const [notifications, total, unreadCount] = await Promise.all([
    prisma.notification.findMany({ where, orderBy: { createdAt: 'desc' }, skip, take: limit }),
    prisma.notification.count({ where }),
    prisma.notification.count({ where: { userId, isRead: false } }),
  ]);

  return { notifications, meta: paginationMeta(total, page, limit), unreadCount };
};

const markRead = async (userId, notificationId) => {
  const n = await prisma.notification.findFirst({ where: { id: notificationId, userId } });
  if (!n) { const e = new Error('Notification not found'); e.statusCode = 404; throw e; }
  return prisma.notification.update({ where: { id: notificationId }, data: { isRead: true } });
};

const markAllRead = async (userId) => {
  await prisma.notification.updateMany({ where: { userId, isRead: false }, data: { isRead: true } });
};

const create = async (userId, { title, body, link }) => {
  return prisma.notification.create({ data: { userId, title, body, link } });
};

module.exports = { listNotifications, markRead, markAllRead, create };
