'use strict';
const router = require('express').Router();
const ctrl = require('../controllers/progress.controller');
router.get ('/',        ctrl.getOverview);
router.post('/session', ctrl.recordSession);
module.exports = router;
