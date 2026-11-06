import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { loadTasks, saveTasks } from '../data/tasks';

export function TaskEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const task = loadTasks().find((t) => String(t.id) === id);

  const [formData, setFormData] = useState<{ title: string; description: string }>(() => ({
    title: task?.title ?? '',
    description: task?.description ?? '',
  }));
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!user) return null;

  if (!task) {
    return <div className="p-6 text-gray-500">Задача не найдена</div>;
  }

  const canEdit = user.role === 'manager';

  if (!canEdit) {
    return (
      <div className="p-8 text-center text-gray-500">
        <h2 className="text-xl font-bold text-gray-700 mb-2">Доступ запрещён</h2>
        <p>Редактировать задачу может только менеджер.</p>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = 'Название обязательно';
    if (!formData.description.trim()) newErrors.description = 'Описание обязательно';
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const tasks = loadTasks();
    saveTasks(
      tasks.map((t) =>
        t.id === task.id
          ? { ...t, title: formData.title.trim(), description: formData.description.trim() }
          : t
      )
    );

    navigate(`/tasks/${task.id}`);
  };

  return (
    <div className="pt-6 pb-12 max-w-2xl mx-auto px-4">
      <button
        onClick={() => navigate(`/tasks/${task.id}`)}
        className="text-sm text-gray-600 hover:text-blue-600 flex items-center gap-2 mb-6"
      >
        ← Назад к задаче
      </button>

      <h1 className="text-3xl font-bold text-gray-900 mb-8">Редактировать задачу</h1>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white border rounded-xl p-8 shadow-sm">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Название задачи
          </label>
          <input
            id="title"
            type="text"
            value={formData.title}
            onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.title ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title}</p>}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Описание
          </label>
          <textarea
            id="description"
            rows={5}
            value={formData.description}
            onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.description ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.description && <p className="mt-1 text-xs text-red-600">{errors.description}</p>}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={() => navigate(`/tasks/${task.id}`)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition"
          >
            Отмена
          </button>
          <button
            type="submit"
            className="px-6 py-2 text-sm font-bold text-white bg-blue-600 rounded hover:bg-blue-700 shadow-md transition"
          >
            Сохранить
          </button>
        </div>
      </form>
    </div>
  );
}


