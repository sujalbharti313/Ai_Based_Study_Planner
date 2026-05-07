'use strict';
const notificationService = require('../services/notification.service');
const { success, noContent } = require('../utils/response');

const list     = async (req, res, next) => { try { success(res, await notificationService.listNotifications(req.user.id, req.query)); } catch (e) { next(e); } };
const markRead = async (req, res, next) => { try { success(res, await notificationService.markRead(req.user.id, req.params.id)); } catch (e) { next(e); } };
const markAll  = async (req, res, next) => { try { await notificationService.markAllRead(req.user.id); noContent(res); } catch (e) { next(e); } };

module.exports = { list, markRead, markAll };
