import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { loadObjects, saveObjects } from '../data/objects';

export function CreateObjectPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [formData, setFormData] = useState({ name: '', address: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!user || user.role !== 'manager') {
    return (
      <div className="p-8 text-center text-gray-500">
        <h2 className="text-xl font-bold text-gray-700 mb-2">Доступ запрещён</h2>
        <p>Создание объектов доступно только для менеджеров.</p>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Название обязательно';
    if (!formData.address.trim()) newErrors.address = 'Адрес обязателен';
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const objects = loadObjects();
    const newObject = {
      id: objects.reduce((max, o) => Math.max(max, o.id), 0) + 1,
      name: formData.name.trim(),
      address: formData.address.trim(),
    };

    saveObjects([...objects, newObject]);

    navigate(`/objects/${newObject.id}`);
  };

  return (
    <div className="pt-6 pb-12 max-w-lg mx-auto px-4">
      <button
        onClick={() => navigate('/objects')}
        className="text-sm text-gray-600 hover:text-blue-600 flex items-center gap-2 mb-6"
      >
        ← Назад к объектам
      </button>

      <h1 className="text-3xl font-bold text-gray-900 mb-8">Создать объект</h1>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white border rounded-xl p-8 shadow-sm">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Название объекта
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Например: Корпус А, ЖК Солнечный"
          />
          {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
            Адрес
          </label>
          <input
            id="address"
            name="address"
            type="text"
            value={formData.address}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.address ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="ул. Строителей, д. 5"
          />
          {errors.address && <p className="mt-1 text-xs text-red-600">{errors.address}</p>}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={() => navigate('/objects')}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition"
          >
            Отмена
          </button>
          <button
            type="submit"
            className="px-6 py-2 text-sm font-bold text-white bg-blue-600 rounded hover:bg-blue-700 shadow-md transition"
          >
            Создать объект
          </button>
        </div>
      </form>
    </div>
  );
}
