'use strict';
const { body } = require('express-validator');

const PRIORITIES = ['low', 'planning', 'active', 'high', 'done'];

const createSubjectRules = [
  body('name').trim().notEmpty().withMessage('Subject name is required').isLength({ max: 200 }),
  body('topic').optional().trim().isLength({ max: 500 }),
  body('complexity').optional().isInt({ min: 1, max: 5 }).withMessage('Complexity must be 1–5'),
  body('priority').optional().isIn(PRIORITIES).withMessage(`Priority must be one of: ${PRIORITIES.join(', ')}`),
  body('deadline').optional().isISO8601().withMessage('Deadline must be a valid date'),
  body('context').optional().trim().isLength({ max: 2000 }),
  body('color').optional().matches(/^#[0-9A-Fa-f]{6}$/).withMessage('Color must be a valid hex'),
];

const updateSubjectRules = [
  body('name').optional().trim().notEmpty().isLength({ max: 200 }),
  body('topic').optional().trim().isLength({ max: 500 }),
  body('complexity').optional().isInt({ min: 1, max: 5 }),
  body('priority').optional().isIn(PRIORITIES),
  body('progress').optional().isInt({ min: 0, max: 100 }).withMessage('Progress must be 0–100'),
  body('deadline').optional().isISO8601(),
  body('context').optional().trim().isLength({ max: 2000 }),
];

module.exports = { createSubjectRules, updateSubjectRules };
