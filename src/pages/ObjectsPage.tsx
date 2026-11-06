import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { loadObjects, type ConstructionObject } from '../data/objects';
import { loadTasks } from '../data/tasks';

export function ObjectsPage() {
  const { user } = useAuth();
  const [objects] = useState(() => loadObjects());

  return (
    <div className="pt-6 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-end gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-1 text-gray-800">Объекты стройки</h1>
          <p className="text-sm text-gray-500">
            Роль: {user?.role === 'manager' ? 'Менеджер (видит все объекты)' : 'Исполнитель'}
          </p>
        </div>

        {user?.role === 'manager' && (
          <Link
            to="/objects/create"
            className="px-4 py-2 text-sm font-bold text-blue-600 bg-blue-50 rounded hover:bg-blue-100 transition"
          >
            + Создать объект
          </Link>
        )}
      </div>

      {objects.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p>Пока нет объектов. Создайте первый, чтобы начать работу.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {objects.map((obj: ConstructionObject) => {
            const taskCount = loadTasks().filter(
              (t) => t.objectId === obj.id && (user?.role === 'manager' || t.executorId === user?.id)
            ).length;

            return (
              <Link
                key={obj.id}
                to={`/objects/${obj.id}`}
                className="block p-6 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{obj.name}</h3>
                <p className="text-gray-600 mt-2 mb-4">{obj.address}</p>

                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-500">
                    {user?.role === 'manager' ? 'Всего задач' : 'Мои задачи'}
                  </span>
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full font-bold text-sm">
                    {taskCount}
                  </span>
                </div>

                <span className="mt-4 inline-block text-sm font-medium text-blue-600 hover:text-blue-700">
                  Перейти к задачам →
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}



