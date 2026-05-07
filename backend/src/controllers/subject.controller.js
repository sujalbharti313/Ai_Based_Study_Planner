'use strict';
const subjectService = require('../services/subject.service');
const activityService = require('../services/activity.service');
const { success, created, noContent } = require('../utils/response');

const list    = async (req, res, next) => { try { success(res, await subjectService.listSubjects(req.user.id, req.query)); } catch (e) { next(e); } };
const getOne  = async (req, res, next) => { try { success(res, await subjectService.getSubject(req.user.id, req.params.id)); } catch (e) { next(e); } };
const archive = async (req, res, next) => { try { success(res, await subjectService.archiveSubject(req.user.id, req.params.id)); } catch (e) { next(e); } };
const remove  = async (req, res, next) => { try { await subjectService.deleteSubject(req.user.id, req.params.id); noContent(res); } catch (e) { next(e); } };

const create = async (req, res, next) => {
  try {
    const subject = await subjectService.createSubject(req.user.id, req.body);
    await activityService.log(req.user.id, { type: 'subject_created', title: `Created subject: ${subject.name}` });
    created(res, subject, 'Subject created');
  } catch (e) { next(e); }
};

const update = async (req, res, next) => {
  try { success(res, await subjectService.updateSubject(req.user.id, req.params.id, req.body)); }
  catch (e) { next(e); }
};

// Modules
const listModules  = async (req, res, next) => { try { success(res, await subjectService.listModules(req.user.id, req.params.id)); } catch (e) { next(e); } };
const createModule = async (req, res, next) => { try { created(res, await subjectService.createModule(req.user.id, req.params.id, req.body)); } catch (e) { next(e); } };
const toggleModule = async (req, res, next) => { try { success(res, await subjectService.toggleModule(req.user.id, req.params.id, req.params.moduleId)); } catch (e) { next(e); } };

module.exports = { list, getOne, create, update, remove, archive, listModules, createModule, toggleModule };
