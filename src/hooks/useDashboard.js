import { useApi } from './useApi';
import { dashboardApi } from '../lib/api';

export function useDashboard() {
  return useApi(() => dashboardApi.getStats());
}
