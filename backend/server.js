'use strict';
require('dotenv').config();
const app    = require('./src/app');
const prisma = require('./src/database/prisma');
const fs     = require('fs');
const path   = require('path');

const PORT     = process.env.PORT     || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Ensure uploads directory exists
const uploadDir = path.resolve(process.env.UPLOAD_DIR || 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const start = async () => {
  try {
    try {
      await prisma.$connect();
      console.log('✅ Database connected');
    } catch (dbErr) {
      console.warn('⚠️  Database not reachable:', dbErr.message);
      console.warn('   Server starting anyway...');
    }

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Midnight AI backend running on port ${PORT} [${NODE_ENV}]`);
      console.log(`📡 API base: /api`);
      console.log(`❤️  Health:   /health`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
};

start();
