import { useApi, useMutation } from './useApi';
import { notificationsApi } from '../lib/api';

export function useNotifications() {
  const { data, loading, error, refetch } = useApi(() => notificationsApi.list());
  const { mutate: markRead }    = useMutation(notificationsApi.markRead);
  const { mutate: markAllRead } = useMutation(notificationsApi.markAllRead);

  return {
    notifications: data?.notifications ?? [],
    unreadCount:   data?.unreadCount ?? 0,
    loading, error, refetch,
    markRead, markAllRead,
  };
}
