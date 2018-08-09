import { RECENT_TASKS_STORAGE_KEY } from './constants';

export default JSON.parse(
  localStorage.getItem(RECENT_TASKS_STORAGE_KEY) || '[]'
);
