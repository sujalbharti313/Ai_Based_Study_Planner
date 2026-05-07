'use strict';
const userService = require('../services/user.service');
const { success, noContent } = require('../utils/response');

const getProfile    = async (req, res, next) => { try { success(res, await userService.getProfile(req.user.id)); } catch (e) { next(e); } };
const updateProfile = async (req, res, next) => { try { success(res, await userService.updateProfile(req.user.id, req.body)); } catch (e) { next(e); } };
const changePassword = async (req, res, next) => { try { await userService.changePassword(req.user.id, req.body.currentPassword, req.body.newPassword); noContent(res); } catch (e) { next(e); } };
const getSettings   = async (req, res, next) => { try { success(res, await userService.getSettings(req.user.id)); } catch (e) { next(e); } };
const updateSettings = async (req, res, next) => { try { success(res, await userService.updateSettings(req.user.id, req.body)); } catch (e) { next(e); } };

const updateAvatar = async (req, res, next) => {
  try {
    if (!req.file) { return res.status(400).json({ success: false, message: 'No file uploaded' }); }
    const avatarUrl = `/uploads/${req.file.filename}`;
    success(res, await userService.updateAvatar(req.user.id, avatarUrl));
  } catch (e) { next(e); }
};

module.exports = { getProfile, updateProfile, updateAvatar, changePassword, getSettings, updateSettings };
