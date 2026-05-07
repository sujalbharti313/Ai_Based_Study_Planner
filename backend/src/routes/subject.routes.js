'use strict';
const router = require('express').Router();
const ctrl = require('../controllers/subject.controller');
const validate = require('../middlewares/validate');
const { createSubjectRules, updateSubjectRules } = require('../validators/subject.validators');

// Subjects
router.get   ('/',                                              ctrl.list);
router.post  ('/',           createSubjectRules, validate,     ctrl.create);
router.get   ('/:id',                                          ctrl.getOne);
router.patch ('/:id',        updateSubjectRules, validate,     ctrl.update);
router.delete('/:id',                                          ctrl.remove);
router.patch ('/:id/archive',                                  ctrl.archive);

// Modules
router.get   ('/:id/modules',                                  ctrl.listModules);
router.post  ('/:id/modules',                                  ctrl.createModule);
router.patch ('/:id/modules/:moduleId/toggle',                 ctrl.toggleModule);

module.exports = router;
