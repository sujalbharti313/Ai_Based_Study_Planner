'use strict';
const { forbidden } = require('../utils/response');

/**
 * Role-based access control.
 * Usage: authorize('ADMIN') or authorize('ADMIN', 'USER')
 */
const authorize = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return forbidden(res, 'Insufficient permissions');
  }
  next();
};

module.exports = authorize;
