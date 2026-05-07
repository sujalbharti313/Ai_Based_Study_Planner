'use strict';
const router = require('express').Router();
const authenticate = require('../middlewares/authenticate');

// Public
router.use('/auth', require('./auth.routes'));

// Protected — all routes below require a valid JWT
router.use(authenticate);

router.use('/dashboard',     require('./dashboard.routes'));
router.use('/subjects',      require('./subject.routes'));
router.use('/tasks',         require('./task.routes'));
router.use('/timetable',     require('./timetable.routes'));
router.use('/progress',      require('./progress.routes'));
router.use('/ai',            require('./ai.routes'));
router.use('/notifications', require('./notification.routes'));
router.use('/users',         require('./user.routes'));

module.exports = router;
