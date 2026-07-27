import { useCallback, useEffect, useState } from 'react';

const getErrorMessage = (err) =>
  err?.response?.data?.message || err?.message || 'Something went wrong. Please try again.';

/**
 * Wraps an async API call with consistent loading/error/data state.
 *
 *   const { data, loading, error, refetch } = useApi(() => ordersService.getMyOrders(query), [query]);
 *
 * @param {() => Promise<import('axios').AxiosResponse>} apiCall
 * @param {any[]} deps - re-runs the call whenever these change
 * @param {{ skip?: boolean }} [options] - set skip to delay fetching (e.g. until an id is known)
 */
export const useApi = (apiCall, deps = [], { skip = false } = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(!skip);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiCall();
      if (response.data.meta) {
        setData({ ...(response.data.data ?? response.data), ...response.data.meta });
      } else {
        setData(response.data.data ?? response.data);
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    if (skip) return;
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchData, skip]);

  return { data, loading, error, refetch: fetchData, setData };
};

export { getErrorMessage };
