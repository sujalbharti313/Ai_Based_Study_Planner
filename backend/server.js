'use strict';
const app    = require('./src/app');
const prisma = require('./src/database/prisma');
const { PORT, NODE_ENV } = require('./src/config/env');
const fs = require('fs');
const path = require('path');

// Ensure uploads directory exists
const uploadDir = path.resolve(process.env.UPLOAD_DIR || 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const start = async () => {
  try {
    // Try DB connection — warn but don't exit if unavailable
    try {
      await prisma.$connect();
      console.log('✅ Database connected');
    } catch (dbErr) {
      console.warn('⚠️  Database not reachable:', dbErr.message);
      console.warn('   API server starting anyway. Set DATABASE_URL in backend/.env to connect.');
    }

    app.listen(PORT, () => {
      console.log(`🚀 Midnight AI backend running on http://localhost:${PORT} [${NODE_ENV}]`);
      console.log(`📡 API base: http://localhost:${PORT}/api`);
      console.log(`❤️  Health:   http://localhost:${PORT}/health`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
};

start();
