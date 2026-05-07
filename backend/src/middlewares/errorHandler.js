'use strict';
const { isDev } = require('../config/env');

/**
 * Global Express error handler.
 * Must be registered LAST in app.js.
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  console.error('[ERROR]', err);

  // Prisma known errors
  if (err.code === 'P2002') {
    return res.status(409).json({ success: false, message: 'A record with that value already exists.' });
  }
  if (err.code === 'P2025') {
    return res.status(404).json({ success: false, message: 'Record not found.' });
  }

  const statusCode = err.statusCode || err.status || 500;
  const message    = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    message,
    ...(isDev && { stack: err.stack }),
  });
};

module.exports = errorHandler;
