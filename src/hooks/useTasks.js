import { useApi, useMutation } from './useApi';
import { tasksApi } from '../lib/api';

export function useTasks(params = {}) {
  const key = JSON.stringify(params);
  const { data, loading, error, refetch } = useApi(
    () => tasksApi.list(params),
    [key]
  );

  const { mutate: createTask } = useMutation(tasksApi.create);
  const { mutate: updateTask } = useMutation((id, d) => tasksApi.update(id, d));
  const { mutate: deleteTask } = useMutation(tasksApi.delete);

  return {
    tasks: data?.tasks ?? [],
    meta:  data?.meta ?? null,
    loading, error, refetch,
    createTask, updateTask, deleteTask,
  };
}
