'use strict';
const authService = require('../services/auth.service');
const { success, created, noContent, badRequest } = require('../utils/response');
const { isProd } = require('../config/env');

const REFRESH_COOKIE_OPTS = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? 'strict' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: '/api/auth/refresh',
};

const register = async (req, res, next) => {
  try {
    const user = await authService.register(req.body);
    created(res, user, 'Account created. Please verify your email.');
  } catch (err) { next(err); }
};

const login = async (req, res, next) => {
  try {
    const { accessToken, refreshToken, user } = await authService.login(req.body);
    res.cookie('refreshToken', refreshToken, REFRESH_COOKIE_OPTS);
    success(res, { accessToken, user }, 'Login successful');
  } catch (err) { next(err); }
};

const refresh = async (req, res, next) => {
  try {
    const token = req.cookies?.refreshToken || req.body?.refreshToken;
    if (!token) return badRequest(res, 'Refresh token required');
    const tokens = await authService.refreshTokens(token);
    res.cookie('refreshToken', tokens.refreshToken, REFRESH_COOKIE_OPTS);
    success(res, { accessToken: tokens.accessToken });
  } catch (err) { next(err); }
};

const logout = async (req, res, next) => {
  try {
    await authService.logout(req.user.id);
    res.clearCookie('refreshToken', { path: '/api/auth/refresh' });
    noContent(res);
  } catch (err) { next(err); }
};

const verifyEmail = async (req, res, next) => {
  try {
    await authService.verifyEmail(req.query.token);
    success(res, null, 'Email verified successfully');
  } catch (err) { next(err); }
};

const forgotPassword = async (req, res, next) => {
  try {
    await authService.forgotPassword(req.body.email);
    success(res, null, 'If that email exists, a reset link has been sent.');
  } catch (err) { next(err); }
};

const resetPassword = async (req, res, next) => {
  try {
    await authService.resetPassword(req.body.token, req.body.password);
    success(res, null, 'Password reset successfully');
  } catch (err) { next(err); }
};

const me = (req, res) => success(res, req.user);

module.exports = { register, login, refresh, logout, verifyEmail, forgotPassword, resetPassword, me };
