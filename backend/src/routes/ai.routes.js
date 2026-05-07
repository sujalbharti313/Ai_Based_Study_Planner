'use strict';
const router = require('express').Router();
const ctrl = require('../controllers/ai.controller');
router.get   ('/',                          ctrl.listConversations);
router.post  ('/',                          ctrl.createConversation);
router.get   ('/:id',                       ctrl.getConversation);
router.delete('/:id',                       ctrl.deleteConversation);
router.post  ('/:id/messages',              ctrl.sendMessage);
module.exports = router;
