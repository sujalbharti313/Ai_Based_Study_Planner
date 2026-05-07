import { useApi } from './useApi';
import { progressApi } from '../lib/api';

export function useProgress() {
  return useApi(() => progressApi.getOverview());
}
