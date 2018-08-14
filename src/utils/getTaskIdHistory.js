import storage from 'localforage';
import { RECENT_TASKS_STORAGE_KEY } from './constants';

export default async () => {
  const recentTasks = await storage.getItem(RECENT_TASKS_STORAGE_KEY);

  return recentTasks || [];
};
