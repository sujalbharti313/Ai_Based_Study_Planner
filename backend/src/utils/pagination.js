'use strict';

/**
 * Parse page/limit from query params with safe defaults.
 */
const parsePagination = (query) => {
  const page  = Math.max(1, parseInt(query.page  || '1',  10));
  const limit = Math.min(100, Math.max(1, parseInt(query.limit || '20', 10)));
  const skip  = (page - 1) * limit;
  return { page, limit, skip };
};

/**
 * Build the standard pagination meta object.
 */
const paginationMeta = (total, page, limit) => ({
  total,
  page,
  limit,
  totalPages: Math.ceil(total / limit),
  hasNext: page * limit < total,
  hasPrev: page > 1,
});

module.exports = { parsePagination, paginationMeta };
