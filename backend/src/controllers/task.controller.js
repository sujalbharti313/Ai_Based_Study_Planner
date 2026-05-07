'use strict';
const taskService = require('../services/task.service');
const { success, created, noContent } = require('../utils/response');

const list   = async (req, res, next) => { try { success(res, await taskService.listTasks(req.user.id, req.query)); } catch (e) { next(e); } };
const getOne = async (req, res, next) => { try { success(res, await taskService.getTask(req.user.id, req.params.id)); } catch (e) { next(e); } };
const create = async (req, res, next) => { try { created(res, await taskService.createTask(req.user.id, req.body)); } catch (e) { next(e); } };
const update = async (req, res, next) => { try { success(res, await taskService.updateTask(req.user.id, req.params.id, req.body)); } catch (e) { next(e); } };
const remove = async (req, res, next) => { try { await taskService.deleteTask(req.user.id, req.params.id); noContent(res); } catch (e) { next(e); } };

module.exports = { list, getOne, create, update, remove };
