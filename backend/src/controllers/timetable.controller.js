'use strict';
const timetableService = require('../services/timetable.service');
const { success, created, noContent, badRequest } = require('../utils/response');

const getWeek    = async (req, res, next) => {
  try {
    if (!req.query.weekStart) return badRequest(res, 'weekStart query param required (ISO date)');
    success(res, await timetableService.getWeekEvents(req.user.id, req.query.weekStart));
  } catch (e) { next(e); }
};

const create     = async (req, res, next) => { try { created(res, await timetableService.createEvent(req.user.id, req.body)); } catch (e) { next(e); } };
const update     = async (req, res, next) => { try { success(res, await timetableService.updateEvent(req.user.id, req.params.id, req.body)); } catch (e) { next(e); } };
const remove     = async (req, res, next) => { try { await timetableService.deleteEvent(req.user.id, req.params.id); noContent(res); } catch (e) { next(e); } };
const aiOptimize = async (req, res, next) => {
  try {
    if (!req.query.weekStart) return badRequest(res, 'weekStart query param required');
    success(res, await timetableService.aiOptimize(req.user.id, req.query.weekStart));
  } catch (e) { next(e); }
};

module.exports = { getWeek, create, update, remove, aiOptimize };
