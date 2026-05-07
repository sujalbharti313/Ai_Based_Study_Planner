'use strict';
const { verifyAccess } = require('../utils/jwt');
const { unauthorized } = require('../utils/response');
const prisma = require('../database/prisma');

/**
 * Verifies the Bearer JWT in Authorization header.
 * Attaches req.user = { id, email, role } on success.
 */
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) return unauthorized(res);

    const token = authHeader.slice(7);
    const payload = verifyAccess(token);

    // Lightweight DB check — only fetch id/email/role
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, email: true, role: true, name: true },
    });

    if (!user) return unauthorized(res, 'User no longer exists');

    req.user = user;
    next();
  } catch (err) {
    return unauthorized(res, 'Invalid or expired token');
  }
};

module.exports = authenticate;
