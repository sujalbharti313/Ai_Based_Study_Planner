import { useState, useCallback } from 'react';
import { useApi, useMutation } from './useApi';
import { subjectsApi } from '../lib/api';

export function useSubjects(params = {}) {
  const key = JSON.stringify(params);
  const { data, loading, error, refetch } = useApi(
    () => subjectsApi.list(params),
    [key]
  );

  const { mutate: createSubject, loading: creating } = useMutation(subjectsApi.create);
  const { mutate: updateSubject, loading: updating } = useMutation(
    (id, d) => subjectsApi.update(id, d)
  );
  const { mutate: deleteSubject, loading: deleting } = useMutation(subjectsApi.delete);

  return {
    subjects: data?.subjects ?? [],
    meta:     data?.meta ?? null,
    loading, error, refetch,
    createSubject, creating,
    updateSubject, updating,
    deleteSubject, deleting,
  };
}

export function useSubject(id) {
  return useApi(() => subjectsApi.get(id), [id]);
}
