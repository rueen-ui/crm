import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import type { TaskStatus } from '../types';
import { loadTasks, applyStatusChange, NEXT_STATUS } from '../data/tasks';
import { readJSON } from '../utils/storage';
import { StatusBadge } from '../components/StatusBadge';
import { TaskHistory, type HistoryEntry } from '../components/TaskHistory';
import {
  getAvailableActions,
  getActionLabel,
  getActionStyle,
} from '../utils/actionsMatrix';

export function TaskDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const taskId = id ?? '';

  const [status, setStatus] = useState<TaskStatus | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>(() =>
    readJSON<HistoryEntry[]>(`app_history_${taskId}`, [])
  );

  if (!user) return null;

  const task = loadTasks().find((t) => String(t.id) === taskId);

  if (!task) {
    return <div className="p-6 text-gray-500">Задача не найдена</div>;
  }

  const currentStatus: TaskStatus = status ?? task.status;

  const actions = getAvailableActions(
    user.role,
    currentStatus,
    task.executorId,
    user.id
  );

  const handleAction = (action: string) => {
    const nextStatus = NEXT_STATUS[action];
    if (!nextStatus) return;

    applyStatusChange(task.id, action, user.name);

    const entry: HistoryEntry = {
      timestamp: new Date().toLocaleString('ru-RU'),
      actorName: user.name,
      from: currentStatus,
      to: nextStatus,
    };
    setHistory((prev) => [...prev, entry]);

    setStatus(nextStatus);
  };

  return (
    <div className="pt-6 pb-12 max-w-4xl mx-auto px-4">
      <div className="flex justify-between items-start mb-8">
        <button
          onClick={() => navigate('/tasks')}
          className="text-sm text-gray-600 hover:text-blue-600 flex items-center gap-2"
        >
          ← Назад к задачам
        </button>
        <StatusBadge status={currentStatus} />
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-3">{task.title}</h1>
      <p className="text-gray-600 mb-6">{task.description}</p>

      <div className="border-t border-b border-gray-100 py-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Действия</h3>
        <div className="flex flex-wrap gap-3">
          {actions.map((action) =>
            action === 'EDIT' ? (
              <Link
                key={action}
                to={`/tasks/${task.id}/edit`}
                className={`px-4 py-2 text-sm font-medium rounded transition ${getActionStyle(action)}`}
              >
                {getActionLabel(action)}
              </Link>
            ) : (
              <button
                key={action}
                type="button"
                className={`px-4 py-2 text-sm font-medium rounded transition ${getActionStyle(action)}`}
                onClick={() => handleAction(action)}
              >
                {getActionLabel(action)}
              </button>
            )
          )}
        </div>
      </div>

      <h3 className="text-lg font-semibold text-gray-800 mb-4">История изменений</h3>
      <TaskHistory entries={history} />
    </div>
  );
}






