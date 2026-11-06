import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import type { Task } from '../types';
import { loadTasks, saveTasks } from '../data/tasks';
import { loadObjects } from '../data/objects';

const USERS = [
  { id: '1', name: 'Алексей' },
  { id: '2', name: 'Иван' },
  { id: '3', name: 'Мария' },
] as const;

interface TaskFormData {
  title: string;
  description: string;
  objectId: number;
  executorId: string | null;
}

export function CreateTaskPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const objects = loadObjects();

  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    objectId: objects[0]?.id ?? 0,
    executorId: null,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!user || user.role !== 'manager') {
    return (
      <div className="p-8 text-center text-gray-500">
        <h2 className="text-xl font-bold text-gray-700 mb-2">Доступ запрещён</h2>
        <p>Создание задач доступно только для менеджеров.</p>
      </div>
    );
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === 'objectId' ? Number(value) : name === 'executorId' ? value || null : value,
    }));

    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  }

  function validate(): boolean {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Название обязательно';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Описание обязательно';
    }
    if (!formData.objectId) {
      newErrors.objectId = 'Выберите объект';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !validate()) return;

    const tasks = loadTasks();

    const newTask: Task = {
      id: tasks.reduce((max, t) => Math.max(max, t.id), 0) + 1,
      title: formData.title.trim(),
      description: formData.description.trim(),
      objectId: formData.objectId,
      executorId: formData.executorId,
      status: 'new',
      authorId: user.id,
      createdAt: new Date().toISOString(),
    };

    saveTasks([newTask, ...tasks]);

    navigate(`/tasks/${newTask.id}`);
  }

  return (
    <div className="pt-6 pb-12 max-w-lg mx-auto px-4">
      <button
        onClick={() => navigate('/tasks')}
        className="text-sm text-gray-600 hover:text-blue-600 flex items-center gap-2 mb-6"
      >
        ← Назад к списку задач
      </button>

      <h1 className="text-3xl font-bold text-gray-900 mb-8">Создать задачу</h1>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white border rounded-xl p-8 shadow-sm">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Название задачи
          </label>
          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.title ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Например: Залить бетон М300"
          />
          {errors.title && (
            <p className="mt-1 text-xs text-red-600">{errors.title}</p>
          )}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Описание
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            value={formData.description}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.description ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Что нужно сделать, требования, важные детали..."
          />
          {errors.description && (
            <p className="mt-1 text-xs text-red-600">{errors.description}</p>
          )}
        </div>

        <div>
          <label htmlFor="objectId" className="block text-sm font-medium text-gray-700 mb-1">
            Объект
          </label>
          <select
            id="objectId"
            name="objectId"
            value={formData.objectId}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {objects.map((obj) => (
              <option key={obj.id} value={obj.id}>
                {obj.name}
              </option>
            ))}
          </select>
          {errors.objectId && (
            <p className="mt-1 text-xs text-red-600">{errors.objectId}</p>
          )}
        </div>

        <div>
          <label htmlFor="executorId" className="block text-sm font-medium text-gray-700 mb-1">
            Исполнитель
          </label>
          <select
            id="executorId"
            name="executorId"
            value={formData.executorId ?? ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Не назначать</option>
            {USERS.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={() => navigate('/tasks')}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition"
          >
            Отмена
          </button>
          <button
            type="submit"
            className="px-6 py-2 text-sm font-bold text-white bg-blue-600 rounded hover:bg-blue-700 shadow-md transition"
          >
            Создать задачу
          </button>
        </div>
      </form>
    </div>
  );
}




