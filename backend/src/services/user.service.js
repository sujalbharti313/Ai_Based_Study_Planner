'use strict';
const bcrypt = require('bcryptjs');
const prisma = require('../database/prisma');

const getProfile = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true, name: true, email: true, designation: true,
      avatarUrl: true, role: true, isEmailVerified: true,
      storageUsedMb: true, storageLimitMb: true, createdAt: true,
      settings: true,
      studyStreak: { select: { currentStreak: true, longestStreak: true } },
      _count: { select: { subjects: true, tasks: true, aiConversations: true } },
    },
  });
  if (!user) { const e = new Error('User not found'); e.statusCode = 404; throw e; }
  return user;
};

const updateProfile = async (userId, { name, designation, email }) => {
  // Check email uniqueness if changing
  if (email) {
    const existing = await prisma.user.findFirst({ where: { email, NOT: { id: userId } } });
    if (existing) { const e = new Error('Email already in use'); e.statusCode = 409; throw e; }
  }

  return prisma.user.update({
    where: { id: userId },
    data: { ...(name && { name }), ...(designation && { designation }), ...(email && { email }) },
    select: { id: true, name: true, email: true, designation: true, avatarUrl: true },
  });
};

const updateAvatar = async (userId, avatarUrl) => {
  return prisma.user.update({
    where: { id: userId },
    data: { avatarUrl },
    select: { id: true, avatarUrl: true },
  });
};

const changePassword = async (userId, currentPassword, newPassword) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  const valid = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!valid) { const e = new Error('Current password is incorrect'); e.statusCode = 400; throw e; }

  const passwordHash = await bcrypt.hash(newPassword, 12);
  await prisma.user.update({ where: { id: userId }, data: { passwordHash } });
};

const getSettings = async (userId) => {
  return prisma.userSettings.findUnique({ where: { userId } });
};

const updateSettings = async (userId, data) => {
  return prisma.userSettings.upsert({
    where: { userId },
    update: data,
    create: { userId, ...data },
  });
};

module.exports = { getProfile, updateProfile, updateAvatar, changePassword, getSettings, updateSettings };
