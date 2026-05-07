import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Generic data-fetching hook.
 * Usage: const { data, loading, error, refetch } = useApi(fn, deps)
 */
export function useApi(fetchFn, deps = []) {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);
  const mountedRef = useRef(true);

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchFn();
      if (mountedRef.current) setData(res.data.data);
    } catch (err) {
      if (mountedRef.current)
        setError(err.response?.data?.message || err.message || 'Something went wrong');
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    mountedRef.current = true;
    execute();
    return () => { mountedRef.current = false; };
  }, [execute]);

  return { data, loading, error, refetch: execute };
}

/**
 * Mutation hook — for POST/PATCH/DELETE.
 * Usage: const { mutate, loading, error } = useMutation(fn)
 */
export function useMutation(mutateFn) {
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  const mutate = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const res = await mutateFn(...args);
      return res.data.data;
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Something went wrong';
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  }, [mutateFn]);

  return { mutate, loading, error };
}
