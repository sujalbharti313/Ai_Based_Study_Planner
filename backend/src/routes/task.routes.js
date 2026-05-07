'use strict';
const router = require('express').Router();
const ctrl = require('../controllers/task.controller');
const validate = require('../middlewares/validate');
const { createTaskRules, updateTaskRules } = require('../validators/task.validators');

router.get   ('/',     ctrl.list);
router.post  ('/',     createTaskRules, validate, ctrl.create);
router.get   ('/:id',  ctrl.getOne);
router.patch ('/:id',  updateTaskRules, validate, ctrl.update);
router.delete('/:id',  ctrl.remove);

module.exports = router;
