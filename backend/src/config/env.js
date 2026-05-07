'use strict';
require('dotenv').config();

/**
 * Centralised, validated environment config.
 * Throws at startup if required vars are missing.
 */
function required(key) {
  const val = process.env[key];
  if (!val) throw new Error(`Missing required env var: ${key}`);
  return val;
}

module.exports = {
  NODE_ENV:   process.env.NODE_ENV || 'development',
  PORT:       parseInt(process.env.PORT || '5000', 10),
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5174',

  DATABASE_URL: process.env.DATABASE_URL || '',

  JWT_ACCESS_SECRET:  required('JWT_ACCESS_SECRET'),
  JWT_REFRESH_SECRET: required('JWT_REFRESH_SECRET'),
  JWT_ACCESS_EXPIRES:  process.env.JWT_ACCESS_EXPIRES  || '15m',
  JWT_REFRESH_EXPIRES: process.env.JWT_REFRESH_EXPIRES || '7d',

  SMTP_HOST: process.env.SMTP_HOST || 'smtp.gmail.com',
  SMTP_PORT: parseInt(process.env.SMTP_PORT || '587', 10),
  SMTP_USER: process.env.SMTP_USER || '',
  SMTP_PASS: process.env.SMTP_PASS || '',
  EMAIL_FROM: process.env.EMAIL_FROM || 'Midnight AI <no-reply@midnight-ai.app>',

  UPLOAD_DIR:       process.env.UPLOAD_DIR || 'uploads',
  MAX_FILE_SIZE_MB: parseInt(process.env.MAX_FILE_SIZE_MB || '10', 10),

  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
  RATE_LIMIT_MAX:       parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
  AUTH_RATE_LIMIT_MAX:  parseInt(process.env.AUTH_RATE_LIMIT_MAX || '10', 10),

  isProd: process.env.NODE_ENV === 'production',
  isDev:  process.env.NODE_ENV === 'development',
};
