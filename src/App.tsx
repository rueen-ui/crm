import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Header } from './components/Header';
import { LoginPage } from './pages/LoginPage';
import { ObjectsPage } from './pages/ObjectsPage';
import { TasksPage } from './pages/TasksPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { TaskDetailPage } from './pages/TaskDetailPage';
import { CreateTaskPage } from './pages/CreateTaskPage';
import { TaskEditPage } from './pages/TaskEditPage';
import { ObjectDetailPage } from './pages/ObjectDetailPage';
import { CreateObjectPage } from './pages/CreateObjectPage';

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Header />
        <main className="min-h-[calc(100vh-64px)] bg-gray-50">
          <div className="container py-6">
            <Routes>
              <Route path="/login" element={<LoginPage />} />

              <Route
                path="/"
                element={<Navigate to="/objects" replace />}
              />

              <Route
                path="/objects"
                element={
                  <ProtectedRoute>
                    <ObjectsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/objects/create"
                element={
                  <ProtectedRoute>
                    <CreateObjectPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/objects/:id"
                element={
                  <ProtectedRoute>
                    <ObjectDetailPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/tasks"
                element={
                  <ProtectedRoute>
                    <TasksPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tasks/create"
                element={
                  <ProtectedRoute>
                    <CreateTaskPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tasks/:id"
                element={
                  <ProtectedRoute>
                    <TaskDetailPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tasks/:id/edit"
                element={
                  <ProtectedRoute>
                    <TaskEditPage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </main>
      </BrowserRouter>
    </AuthProvider>
  );
}





