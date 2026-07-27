// Escapes regex special characters in user-supplied search input
const escapeRegex = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Builds a MongoDB filter object from whitelisted query-string fields.
 * Only fields explicitly listed in `allowedFields` are ever applied,
 * so clients can't filter on arbitrary/sensitive schema paths.
 */
export const buildFilter = (queryString, allowedFields = []) => {
  const filters = {};
  allowedFields.forEach((field) => {
    const value = queryString[field];
    if (value !== undefined && value !== '') {
      if (value === 'true') filters[field] = true;
      else if (value === 'false') filters[field] = false;
      else filters[field] = value;
    }
  });
  return filters;
};

/**
 * Builds a case-insensitive $or regex search across the given fields,
 * driven by a single `?search=` query param.
 */
export const buildSearch = (queryString, searchFields = []) => {
  if (!queryString.search || searchFields.length === 0) return {};
  const regex = new RegExp(escapeRegex(queryString.search.trim()), 'i');
  return { $or: searchFields.map((field) => ({ [field]: regex })) };
};

/**
 * Builds a Mongoose sort object from `?sortBy=` and `?order=asc|desc`,
 * falling back to a sensible default.
 */
export const buildSort = (queryString, defaultSort = { createdAt: -1 }) => {
  if (!queryString.sortBy) return defaultSort;
  const order = queryString.order === 'asc' ? 1 : -1;
  return { [queryString.sortBy]: order };
};

/**
 * Computes page/limit/skip from `?page=` and `?limit=`, capped to a
 * sane maximum to prevent someone requesting the entire collection.
 */
export const getPagination = (queryString, { defaultLimit = 20, maxLimit = 100 } = {}) => {
  const page = Math.max(parseInt(queryString.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(queryString.limit, 10) || defaultLimit, 1), maxLimit);
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

/** Builds the standard pagination meta block returned alongside list responses. */
export const buildMeta = ({ page, limit, total }) => ({
  page,
  limit,
  total,
  pages: Math.max(Math.ceil(total / limit), 1),
});
