import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout        from './components/layout/AppLayout';
import ProtectedRoute   from './components/layout/ProtectedRoute';
import Login            from './pages/Login';
import Register         from './pages/Register';
import ForgotPassword   from './pages/ForgotPassword';
import Dashboard        from './pages/Dashboard';
import Subjects         from './pages/Subjects';
import AddSubject       from './pages/AddSubject';
import SubjectDetail    from './pages/SubjectDetail';
import Timetable        from './pages/Timetable';
import Progress         from './pages/Progress';
import AILab            from './pages/AILab';
import Settings         from './pages/Settings';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ── Public ── */}
        <Route path="/login"           element={<Login />} />
        <Route path="/register"        element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* ── Protected ── */}
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index                    element={<Dashboard />} />
          <Route path="subjects"          element={<Subjects />} />
          <Route path="subjects/new"      element={<AddSubject />} />
          <Route path="subjects/:id"      element={<SubjectDetail />} />
          <Route path="timetable"         element={<Timetable />} />
          <Route path="progress"          element={<Progress />} />
          <Route path="ai-lab"            element={<AILab />} />
          <Route path="settings"          element={<Settings />} />
        </Route>

        {/* ── Fallback ── */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
