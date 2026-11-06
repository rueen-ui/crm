import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="border-b border-gray-200 h-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-full">
        <div className="flex items-center gap-4">
          <div className="font-bold text-xl text-gray-800">CRM: Стройка</div>
        </div>

        {!user ? (
          <button
            onClick={() => navigate('/login')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-sm"
          >
            Войти
          </button>
        ) : (
          <nav className="flex items-center gap-6">
            <Link
              to="/objects"
              className="text-sm font-medium text-gray-600 hover:text-blue-600 transition"
            >
              Объекты
            </Link>
            <Link
              to="/tasks"
              className="text-sm font-medium text-gray-600 hover:text-blue-600 transition"
            >
              Мои задачи
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 font-medium">
                {user.name} ({user.role})
              </span>
              <button
                onClick={logout}
                className="text-sm font-medium text-red-600 hover:text-red-700 transition"
              >
                Выйти
              </button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}


