'use strict';
const router = require('express').Router();
const ctrl = require('../controllers/auth.controller');
const validate = require('../middlewares/validate');
const authenticate = require('../middlewares/authenticate');
const { registerRules, loginRules, forgotPasswordRules, resetPasswordRules } = require('../validators/auth.validators');

router.post('/register',        registerRules,        validate, ctrl.register);
router.post('/login',           loginRules,           validate, ctrl.login);
router.post('/refresh',                                         ctrl.refresh);
router.post('/logout',          authenticate,                   ctrl.logout);
router.get ('/verify-email',                                    ctrl.verifyEmail);
router.post('/forgot-password', forgotPasswordRules,  validate, ctrl.forgotPassword);
router.post('/reset-password',  resetPasswordRules,   validate, ctrl.resetPassword);
router.get ('/me',              authenticate,                   ctrl.me);

module.exports = router;
