/**
 * Sends a consistent { success, message, data, meta } JSON response.
 * Error responses are handled separately by middlewares/errorMiddleware.js
 * so both success and failure payloads share the same top-level shape.
 *
 * @param {import('express').Response} res
 * @param {object} options
 * @param {number} [options.statusCode=200]
 * @param {string} [options.message='Success']
 * @param {object|null} [options.data=null]
 * @param {object|null} [options.meta=null] - pagination info, etc.
 */
export const sendResponse = (
  res,
  { statusCode = 200, message = 'Success', data = null, meta = null } = {}
) => {
  const body = { success: true, message };
  if (data !== null) body.data = data;
  if (meta !== null) body.meta = meta;
  return res.status(statusCode).json(body);
};
