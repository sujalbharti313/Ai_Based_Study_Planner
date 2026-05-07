'use strict';
const router  = require('express').Router();
const ctrl    = require('../controllers/user.controller');
const multer  = require('multer');
const path    = require('path');
const { UPLOAD_DIR, MAX_FILE_SIZE_MB } = require('../config/env');

const storage = multer.diskStorage({
  destination: UPLOAD_DIR,
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `avatar-${req.user.id}-${Date.now()}${ext}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE_MB * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) return cb(new Error('Only images allowed'));
    cb(null, true);
  },
});

router.get   ('/me',              ctrl.getProfile);
router.patch ('/me',              ctrl.updateProfile);
router.post  ('/me/avatar',       upload.single('avatar'), ctrl.updateAvatar);
router.patch ('/me/password',     ctrl.changePassword);
router.get   ('/me/settings',     ctrl.getSettings);
router.patch ('/me/settings',     ctrl.updateSettings);

module.exports = router;
