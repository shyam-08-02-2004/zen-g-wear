/**
 * Buckets a list of records into the last `months` calendar months, summing
 * (or counting) a value per bucket. Used to build chart series from plain
 * list-endpoint data when there's no dedicated analytics endpoint.
 *
 * @param {object[]} items
 * @param {string} dateField - field holding an ISO date string
 * @param {(item: object) => number} [valueFn] - defaults to counting (1 per item)
 * @param {number} [months=6]
 */
export const bucketByMonth = (items = [], dateField, valueFn = () => 1, months = 6) => {
  const now = new Date();
  const buckets = Array.from({ length: months }).map((_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (months - 1 - i), 1);
    return { key: `${d.getFullYear()}-${d.getMonth()}`, label: d.toLocaleString('en-US', { month: 'short' }), value: 0 };
  });

  items.forEach((item) => {
    const d = new Date(item[dateField]);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    const bucket = buckets.find((b) => b.key === key);
    if (bucket) bucket.value += valueFn(item);
  });

  return buckets;
};

/** Groups items by a key and counts them, returning [{ name, value }] sorted descending. */
export const countBy = (items = [], keyFn) => {
  const counts = {};
  items.forEach((item) => {
    const key = keyFn(item);
    counts[key] = (counts[key] ?? 0) + 1;
  });
  return Object.entries(counts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
};
