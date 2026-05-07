'use strict';
const dashboardService = require('../services/dashboard.service');
const { success } = require('../utils/response');

const getStats = async (req, res, next) => {
  try { success(res, await dashboardService.getDashboardStats(req.user.id)); }
  catch (e) { next(e); }
};

module.exports = { getStats };
