'use strict';
const router = require('express').Router();
const ctrl = require('../controllers/notification.controller');
router.get  ('/',           ctrl.list);
router.patch('/read-all',   ctrl.markAll);
router.patch('/:id/read',   ctrl.markRead);
module.exports = router;
