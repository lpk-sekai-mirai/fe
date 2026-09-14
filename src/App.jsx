import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import Navbar from "./components/Navbar";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import StudentList from "./pages/StudentList";
import StudentInput from "./pages/StudentInput";
import StudentInterview from "./pages/StudentInterview"; // ⬅️ import

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/users"
            element={
              <PrivateRoute adminOnly>
                <Users />
              </PrivateRoute>
            }
          />

          <Route
            path="/students"
            element={
              <PrivateRoute>
                <StudentList />
              </PrivateRoute>
            }
          />
          <Route
            path="/students/new"
            element={
              <PrivateRoute>
                <StudentInput />
              </PrivateRoute>
            }
          />
          <Route
            path="/students/edit/:id"
            element={
              <PrivateRoute>
                <StudentInput />
              </PrivateRoute>
            }
          />

          {/* ⬇️ Route baru */}
          <Route
            path="/students/interview/:id"
            element={
              <PrivateRoute>
                <StudentInterview />
              </PrivateRoute>
            }
          />

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
