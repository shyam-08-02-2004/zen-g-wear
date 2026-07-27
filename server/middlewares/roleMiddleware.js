import { protect, authorize } from './authMiddleware.js';

/**
 * User middleware — the standard gate for any endpoint that just requires
 * someone to be logged in (any role). This is `protect` under an explicit
 * name for routes where "must be an authenticated user" is the intent.
 */
export const isUser = protect;

/**
 * Admin middleware — requires the request to already have passed through
 * `protect` (or be chained directly, since it includes `protect` itself)
 * AND for the authenticated user's role to be 'admin'.
 *
 * Usage:
 *   router.get('/admin-only', isAdmin, controllerFn);
 */
export const isAdmin = [protect, authorize('admin')];
