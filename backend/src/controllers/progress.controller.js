'use strict';
const progressService = require('../services/progress.service');
const { success, created } = require('../utils/response');

const getOverview = async (req, res, next) => {
  try { success(res, await progressService.getProgressOverview(req.user.id)); }
  catch (e) { next(e); }
};

const recordSession = async (req, res, next) => {
  try { created(res, await progressService.recordStudySession(req.user.id, req.body)); }
  catch (e) { next(e); }
};

module.exports = { getOverview, recordSession };
