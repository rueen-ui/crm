import type { Task, TaskStatus } from '../types';
import type { HistoryEntry } from '../components/TaskHistory';
import { readJSON, writeJSON } from '../utils/storage';

const TASKS_KEY = 'app_tasks';

const MOCK_TASKS: Task[] = [
  {
    id: 1,
    title: 'Залить фундамент',
    description: 'Бетон М300, армирование сеткой. Важно: не начинать без акта геодезиста.',
    objectId: 1,
    executorId: '1',
    status: 'in_progress',
    authorId: '1',
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    title: 'Установить опалубку',
    description: 'Щиты 3м, крепеж саморезами. Требуется 4 человека.',
    objectId: 1,
    executorId: null,
    status: 'new',
    authorId: '1',
    createdAt: new Date().toISOString(),
  },
  {
    id: 3,
    title: 'Проложить канализацию',
    description: 'Труба 110мм, уклон 2см/м. Обязательно фотофиксация стыков.',
    objectId: 2,
    executorId: '3',
    status: 'review',
    authorId: '1',
    createdAt: new Date().toISOString(),
  },
];

export const NEXT_STATUS: Record<string, TaskStatus> = {
  TAKE: 'in_progress',
  SUBMIT: 'review',
  ACCEPT: 'accepted',
  REWORK: 'rework',
};

export function loadTasks(): Task[] {
  const stored = readJSON<Task[]>(TASKS_KEY, []);
  if (stored.length > 0) {
    return stored;
  }
  writeJSON(TASKS_KEY, MOCK_TASKS);
  return MOCK_TASKS;
}

export function saveTasks(tasks: Task[]): void {
  writeJSON(TASKS_KEY, tasks);
}

export function applyStatusChange(
  taskId: number,
  action: string,
  actorName: string
): void {
  const nextStatus = NEXT_STATUS[action];
  if (!nextStatus) return;

  const tasks = loadTasks();
  const task = tasks.find((t) => t.id === taskId);
  if (!task) return;

  const entry: HistoryEntry = {
    timestamp: new Date().toLocaleString('ru-RU'),
    actorName,
    from: task.status,
    to: nextStatus,
  };

  saveTasks(tasks.map((t) => (t.id === taskId ? { ...t, status: nextStatus } : t)));

  const historyKey = `app_history_${taskId}`;
  const history = readJSON<HistoryEntry[]>(historyKey, []);
  writeJSON(historyKey, [...history, entry]);
}


