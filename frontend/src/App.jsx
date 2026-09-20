import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import AppLayout from './components/layout/AppLayout';
import RequireAuth from './components/layout/RequireAuth';
import ToastStack from './components/common/Toast';
import { useAuth } from './hooks/useAuth';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Upload from './pages/Upload';
import Diagnosis from './pages/Diagnosis';
import Enhancement from './pages/Enhancement';
import Results from './pages/Results';
import History from './pages/History';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';

// Public marketing page: shares the Navbar/Footer but skips the dashboard Sidebar.
function PublicPage({ children }) {
  return (
    <div>
      <Navbar />
      {children}
      <Footer />
      <ToastStack />
    </div>
  );
}

// Sends an already-logged-in visitor straight to their dashboard instead of
// showing them the login/signup forms again.
function RedirectIfAuthed({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <PublicPage>
            <Landing />
          </PublicPage>
        }
      />

      <Route
        path="/login"
        element={
          <RedirectIfAuthed>
            <Login />
          </RedirectIfAuthed>
        }
      />
      <Route
        path="/signup"
        element={
          <RedirectIfAuthed>
            <Signup />
          </RedirectIfAuthed>
        }
      />

      <Route element={<RequireAuth />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/diagnosis" element={<Diagnosis />} />
          <Route path="/enhancement" element={<Enhancement />} />
          <Route path="/results" element={<Results />} />
          <Route path="/history" element={<History />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Route>

      <Route
        path="*"
        element={
          <PublicPage>
            <NotFound />
          </PublicPage>
        }
      />
    </Routes>
  );
}
