import { useParams, useNavigate } from 'react-router-dom';
import { loadObjects } from '../data/objects';
import { loadTasks } from '../data/tasks';
import { TaskCard } from '../components/TaskCard';
import { useAuth } from '../contexts/AuthContext';

export function ObjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const objectId = Number(id);

  const object = loadObjects().find((o) => o.id === objectId);

  if (!object) {
    return <div className="p-6 text-gray-500">Объект не найден</div>;
  }

  if (!user) return null;

  const tasks = loadTasks().filter((t) => t.objectId === objectId);
  const visibleTasks = tasks.filter(
    (t) => user.role === 'manager' || t.executorId === user.id
  );

  return (
    <div className="pt-6 pb-12">
      <button
        onClick={() => navigate('/objects')}
        className="text-sm text-gray-600 hover:text-blue-600 flex items-center gap-2 mb-6"
      >
        ← Назад к объектам
      </button>

      <h1 className="text-3xl font-bold text-gray-900 mb-1">{object.name}</h1>
      <p className="text-sm text-gray-500 mb-8">{object.address}</p>

      {/* Кнопка «Создать задачу» прямо на объекте */}
      {user.role === 'manager' && (
        <button
          onClick={() => navigate('/tasks/create')}
          className="mb-6 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium shadow-md hover:bg-blue-700 transition"
        >
          <span>+</span> Создать задачу для этого объекта
        </button>
      )}

      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Задачи объекта {user.role === 'executor' ? '(назначенные вам)' : ''}
      </h2>

      {visibleTasks.length === 0 ? (
        <div className="text-center py-16 bg-white border rounded-xl p-8 shadow-sm">
          <p className="text-xl text-gray-700 font-medium mb-2">Здесь пока нет задач</p>
          <p className="text-gray-500">Создайте первую задачу, чтобы начать работу.</p>
          {user.role === 'manager' && (
            <button
              onClick={() => navigate('/tasks/create')}
              className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium shadow-md hover:bg-blue-700 transition"
            >
              + Создать задачу
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {visibleTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              role={user.role}
              currentUserId={user.id}
              currentUserName={user.name}
              onStatusChange={() => window.location.reload()}
            />
          ))}
        </div>
      )}
    </div>
  );
}

