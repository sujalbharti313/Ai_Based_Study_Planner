'use strict';
const { body } = require('express-validator');

const STATUSES = ['pending', 'in_progress', 'done'];

const createTaskRules = [
  body('text').trim().notEmpty().withMessage('Task text is required').isLength({ max: 500 }),
  body('subjectId').optional().isUUID().withMessage('Invalid subject ID'),
  body('dueDate').optional().isISO8601().withMessage('Due date must be a valid date'),
  body('isPriority').optional().isBoolean(),
];

const updateTaskRules = [
  body('text').optional().trim().notEmpty().isLength({ max: 500 }),
  body('status').optional().isIn(STATUSES).withMessage(`Status must be one of: ${STATUSES.join(', ')}`),
  body('dueDate').optional().isISO8601(),
  body('isPriority').optional().isBoolean(),
];

module.exports = { createTaskRules, updateTaskRules };
