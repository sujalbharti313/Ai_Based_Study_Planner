'use strict';

/**
 * Consistent API response envelope.
 * All endpoints use these helpers — never send raw res.json().
 */

const success = (res, data = null, message = 'Success', statusCode = 200) =>
  res.status(statusCode).json({ success: true, message, data });

const created = (res, data = null, message = 'Created') =>
  success(res, data, message, 201);

const noContent = (res) => res.status(204).send();

const error = (res, message = 'Internal Server Error', statusCode = 500, errors = null) =>
  res.status(statusCode).json({ success: false, message, ...(errors && { errors }) });

const badRequest  = (res, message = 'Bad Request', errors = null) => error(res, message, 400, errors);
const unauthorized = (res, message = 'Unauthorized')               => error(res, message, 401);
const forbidden    = (res, message = 'Forbidden')                  => error(res, message, 403);
const notFound     = (res, message = 'Not Found')                  => error(res, message, 404);
const conflict     = (res, message = 'Conflict')                   => error(res, message, 409);

module.exports = { success, created, noContent, error, badRequest, unauthorized, forbidden, notFound, conflict };
