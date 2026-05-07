'use strict';
const { PrismaClient } = require('@prisma/client');
const { isDev } = require('../config/env');

const prisma = new PrismaClient({
  log: isDev ? ['warn', 'error'] : ['error'],
});

process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

module.exports = prisma;
