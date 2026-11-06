import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { loadTasks } from '../data/tasks';
import { TaskCard } from '../components/TaskCard';

export function TasksPage() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState(() => loadTasks());

  if (!user) return null;

  const userTasks =
    user.role === 'manager'
      ? tasks
      : tasks.filter((t) => t.executorId === user.id);

  const refresh = () => setTasks(loadTasks());

  return (
    <div className="pt-6 pb-12">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            {user.role === 'executor' ? 'Мои задачи' : 'Все задачи'}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Роль: {user.role === 'manager' ? 'Менеджер' : 'Исполнитель'}
          </p>
        </div>

        {user.role === 'manager' && (
          <Link
            to="/tasks/create"
            className="px-4 py-2 text-sm font-bold text-blue-600 bg-blue-50 rounded hover:bg-blue-100 transition"
          >
            + Создать задачу
          </Link>
        )}
      </div>

      {userTasks.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p>Пока нет задач</p>
        </div>
      ) : (
        <div className="space-y-4">
          {userTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              role={user.role}
              currentUserId={user.id}
              currentUserName={user.name}
              onStatusChange={refresh}
            />
          ))}
        </div>
      )}
    </div>
  );
}








