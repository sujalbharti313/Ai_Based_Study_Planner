'use strict';
const jwt = require('jsonwebtoken');
const { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET, JWT_ACCESS_EXPIRES, JWT_REFRESH_EXPIRES } = require('../config/env');

const signAccess = (payload) =>
  jwt.sign(payload, JWT_ACCESS_SECRET, { expiresIn: JWT_ACCESS_EXPIRES });

const signRefresh = (payload) =>
  jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_EXPIRES });

const verifyAccess = (token) => jwt.verify(token, JWT_ACCESS_SECRET);

const verifyRefresh = (token) => jwt.verify(token, JWT_REFRESH_SECRET);

module.exports = { signAccess, signRefresh, verifyAccess, verifyRefresh };
