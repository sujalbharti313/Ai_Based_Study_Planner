'use strict';
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const prisma = require('../database/prisma');
const { signAccess, signRefresh, verifyRefresh } = require('../utils/jwt');
const { sendVerificationEmail, sendPasswordResetEmail } = require('../utils/email');

const SALT_ROUNDS = 12;

/**
 * Register a new user.
 * Creates user + default settings + default streak record.
 */
const register = async ({ name, email, password }) => {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    const err = new Error('Email already in use'); err.statusCode = 409; throw err;
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const emailVerifyToken = crypto.randomBytes(32).toString('hex');

  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      emailVerifyToken,
      settings: { create: {} },
      studyStreak: { create: {} },
    },
    select: { id: true, name: true, email: true, role: true, isEmailVerified: true },
  });

  // Fire-and-forget — don't block registration if email fails
  sendVerificationEmail(email, emailVerifyToken).catch(console.error);

  return user;
};

/**
 * Login — returns access + refresh tokens.
 */
const login = async ({ email, password }) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    const err = new Error('Invalid credentials'); err.statusCode = 401; throw err;
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    const err = new Error('Invalid credentials'); err.statusCode = 401; throw err;
  }

  const payload = { sub: user.id, email: user.email, role: user.role };
  const accessToken  = signAccess(payload);
  const refreshToken = signRefresh(payload);

  // Persist hashed refresh token
  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken: await bcrypt.hash(refreshToken, 10) },
  });

  return {
    accessToken,
    refreshToken,
    user: { id: user.id, name: user.name, email: user.email, role: user.role, isEmailVerified: user.isEmailVerified },
  };
};

/**
 * Rotate refresh token.
 */
const refreshTokens = async (incomingRefreshToken) => {
  let payload;
  try {
    payload = verifyRefresh(incomingRefreshToken);
  } catch {
    const err = new Error('Invalid refresh token'); err.statusCode = 401; throw err;
  }

  const user = await prisma.user.findUnique({ where: { id: payload.sub } });
  if (!user?.refreshToken) {
    const err = new Error('Refresh token revoked'); err.statusCode = 401; throw err;
  }

  const valid = await bcrypt.compare(incomingRefreshToken, user.refreshToken);
  if (!valid) {
    const err = new Error('Refresh token mismatch'); err.statusCode = 401; throw err;
  }

  const newPayload = { sub: user.id, email: user.email, role: user.role };
  const accessToken  = signAccess(newPayload);
  const refreshToken = signRefresh(newPayload);

  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken: await bcrypt.hash(refreshToken, 10) },
  });

  return { accessToken, refreshToken };
};

/**
 * Logout — revoke refresh token.
 */
const logout = async (userId) => {
  await prisma.user.update({ where: { id: userId }, data: { refreshToken: null } });
};

/**
 * Verify email address.
 */
const verifyEmail = async (token) => {
  const user = await prisma.user.findFirst({ where: { emailVerifyToken: token } });
  if (!user) {
    const err = new Error('Invalid or expired verification token'); err.statusCode = 400; throw err;
  }
  await prisma.user.update({
    where: { id: user.id },
    data: { isEmailVerified: true, emailVerifyToken: null },
  });
};

/**
 * Initiate password reset.
 */
const forgotPassword = async (email) => {
  const user = await prisma.user.findUnique({ where: { email } });
  // Always return success to prevent email enumeration
  if (!user) return;

  const token = crypto.randomBytes(32).toString('hex');
  const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  await prisma.user.update({
    where: { id: user.id },
    data: { passwordResetToken: token, passwordResetExpiry: expiry },
  });

  sendPasswordResetEmail(email, token).catch(console.error);
};

/**
 * Complete password reset.
 */
const resetPassword = async (token, newPassword) => {
  const user = await prisma.user.findFirst({
    where: {
      passwordResetToken: token,
      passwordResetExpiry: { gt: new Date() },
    },
  });
  if (!user) {
    const err = new Error('Invalid or expired reset token'); err.statusCode = 400; throw err;
  }

  const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash, passwordResetToken: null, passwordResetExpiry: null, refreshToken: null },
  });
};

module.exports = { register, login, refreshTokens, logout, verifyEmail, forgotPassword, resetPassword };
