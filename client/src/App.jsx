import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProjectProvider } from './context/ProjectContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import BoardPage from './pages/BoardPage';
import TicketsPage from './pages/TicketsPage';
import NotFound from './pages/NotFound';

// protected route wrapper
function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 20, height: 20, border: '2px solid #5865f2', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
      </div>
    );
  }
  return user ? children : <Navigate to="/login" replace />;
}

function AppRoutes() {
  const { user } = useAuth();
  return (
    <ProjectProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/board" element={<PrivateRoute><BoardPage /></PrivateRoute>} />
        <Route path="/tickets" element={<PrivateRoute><TicketsPage /></PrivateRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ProjectProvider>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1e2130',
              color: '#e2e8f0',
              border: '1px solid #2e3347',
              fontSize: '13px'
            }
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  );
}
