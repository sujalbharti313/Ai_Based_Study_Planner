'use strict';
const router = require('express').Router();
const ctrl = require('../controllers/timetable.controller');
router.get   ('/',          ctrl.getWeek);
router.post  ('/',          ctrl.create);
router.patch ('/:id',       ctrl.update);
router.delete('/:id',       ctrl.remove);
router.get   ('/ai-optimize', ctrl.aiOptimize);
module.exports = router;
