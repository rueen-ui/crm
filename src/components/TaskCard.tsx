import { Link } from 'react-router-dom';
import type { Task } from '../types';
import { applyStatusChange } from '../data/tasks';
import { StatusBadge } from './StatusBadge';
import {
  getAvailableActions,
  getActionLabel,
  getActionStyle,
} from '../utils/actionsMatrix';

interface TaskCardProps {
  task: Task;
  role: 'manager' | 'executor';
  currentUserId: string;
  currentUserName: string;
  onStatusChange: () => void;
}

export function TaskCard({
  task,
  role,
  currentUserId,
  currentUserName,
  onStatusChange,
}: TaskCardProps) {
  const actions = getAvailableActions(
    role,
    task.status,
    task.executorId,
    currentUserId
  );

  const handleAction = (action: string) => {
    applyStatusChange(task.id, action, currentUserName);
    onStatusChange();
  };

  return (
    <div className="bg-white border rounded-xl shadow-sm p-6 hover:shadow-md transition">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900">{task.title}</h3>
          <p className="text-sm text-gray-600 mt-1">{task.description}</p>
        </div>
        <StatusBadge status={task.status} />
      </div>

      <div className="flex flex-wrap gap-3 mt-4">
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
        <Link
          to={`/tasks/${task.id}`}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition"
        >
          Подробнее →
        </Link>
      </div>
    </div>
  );
}


