import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ProtectedRoute from "./components/ProtectedRoute";
import { Toaster } from "react-hot-toast";
import UserDashboard from "./pages/user/Dashboard";
import AdminDashboard from "./pages/admin/Dashboard";

const MainLayout = () => (
  <div className="min-h-screen bg-slate-50 flex">
    <Sidebar />
    <div className="flex-1 flex flex-col pl-64">
      <Navbar />
      <main className="flex-1 pt-20 p-8 overflow-y-auto">
        <div className="max-w-[1400px] mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  </div>
);

function App() {
  return (
    <Router>

      <Routes>

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

      
<Route element={<MainLayout />}>

  <Route
    path="/admin/dashboard"
    element={
      <ProtectedRoute>
        <AdminDashboard />
      </ProtectedRoute>
    }
  />

  <Route
    path="/user/dashboard"
    element={
      <ProtectedRoute>
        <UserDashboard />
      </ProtectedRoute>
    }
  />

</Route>

        <Route
          path="*"
          element={<Navigate to="/login" replace />}
        />

      </Routes>
<Toaster
  position="top-center"
  reverseOrder={false}
  toastOptions={{
    duration: 3000,

  style: {
  background: "rgba(17,24,39,0.9)",
  backdropFilter: "blur(10px)",
  color: "#fff",
  padding: "16px 24px",
  fontSize: "16px",
  borderRadius: "16px",
  minWidth: "340px",
  textAlign: "center",
  border: "1px solid rgba(255,255,255,0.1)"
},

    success: {
      iconTheme: {
        primary: "#2563eb",
        secondary: "#fff",
      },
    },

    error: {
      iconTheme: {
        primary: "#ef4444",
        secondary: "#fff",
      },
    },
  }}
/>
    </Router>
  );
}

export default App;