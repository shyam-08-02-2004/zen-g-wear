import { validationResult } from 'express-validator';

// Run after an array of express-validator checks in a route.
// Collects any validation errors and returns a consistent 422 response.
const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }

  const formattedErrors = errors.array().map((err) => ({
    field: err.path,
    message: err.msg,
  }));

  return res.status(422).json({
    success: false,
    message: 'Validation failed',
    errors: formattedErrors,
  });
};

export default validate;
