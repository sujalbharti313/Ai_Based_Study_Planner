'use strict';
const prisma = require('../database/prisma');
const { parsePagination, paginationMeta } = require('../utils/pagination');

/**
 * Write an activity log entry.
 */
const log = async (userId, { type, title, detail, meta }) => {
  return prisma.activityLog.create({
    data: { userId, type, title, detail, meta },
  });
};

/**
 * Paginated activity feed for a user.
 */
const listActivity = async (userId, query) => {
  const { page, limit, skip } = parsePagination(query);
  const { type } = query;

  const where = { userId, ...(type && { type }) };

  const [logs, total] = await Promise.all([
    prisma.activityLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip, take: limit,
    }),
    prisma.activityLog.count({ where }),
  ]);

  return { logs, meta: paginationMeta(total, page, limit) };
};

module.exports = { log, listActivity };
